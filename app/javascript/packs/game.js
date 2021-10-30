import * as PIXI from 'pixi.js'
import { ColorOverlayFilter } from '@pixi/filter-color-overlay';
import { InteractionManager } from '@pixi/interaction';

import FetchHelpers from './lib/FetchHelpers';
import { between } from './lib/helpers'

import VoiceListener from './voice';
import { GAME_TIME, APP_WIDTH, APP_HEIGHT, APP_BORDER, APP_BORDER_TOP, CHEERING_R, EMPLOYEE_D, EMPLOYEES_COUNT, EMPLOYEE_ROLES } from './constants'
import { renderGame, renderScore, renderTimer, renderStartButton, renderRestartButton, renderEmployees, renderPlayer, renderResultText } from './render'

PIXI.Renderer.registerPlugin('interaction', InteractionManager)

const colorFilter = new ColorOverlayFilter(0x000020, 0.6)

const handleOnLoad = function() {
	let app = new PIXI.Application({ width: APP_WIDTH, height: APP_HEIGHT });

	createGameContainer(app)

	getCheerings().then(({userCheerings}) => {
		renderGame(app, () => handleStartGame(app, userCheerings))
	})
}

const createGameContainer = function(app) {
	const element = document.getElementById("gameContainer");
	if (!element) return;
	element.appendChild(app.view);
}

function handleStartGame(app, userCheerings) {
	clearGame(app)
	startGame(app, userCheerings)
}

const clearGame = function(app) {
	const stage = app.stage
	while(stage.children[0]) { stage.removeChild(stage.children[0]); }
}

function startGame(app, userCheerings) {
	let elapsed = 0.0; // Time since start

	let lazyEmployeesCount = EMPLOYEES_COUNT
	let timeLeft = GAME_TIME

	const scoreContainer = document.getElementById("gameScoreCounter")
	const timerContainer = document.getElementById("gameTimer")

	renderScore(scoreContainer, lazyEmployeesCount)
	renderTimer(timerContainer, timeLeft)

	let gameTimer
	if (timerContainer) gameTimer = startTimer()

	const voiceListener = startVoiceListener(userCheerings)

	let employees = renderEmployees(app, (r) => cheeringTextByRole(r))
	let player = renderPlayer(app)

	document.addEventListener('keydown', (k) => moveOnKeyPress(player, employees, k));

	app.ticker.add((delta) => {
		elapsed += delta;

		if (isGameInProgress()) { employees.filter((e) => e.state === 'lazy').forEach(moveEmployee) }
		employees.filter((e) => e.state === 'cheered').forEach(moveCheeredEmployee)
	});

	function showGameResult(app) {
		lazyEmployeesCount > 0 ? renderResultText(app, "Потрачено\n😞") : renderResultText(app, "Это победа!\n🎉")
	}

	function startTimer() {
		const timer = setInterval(() => {
			timeLeft -= 1;

			stopGameIfNeeded(app, timer)
			renderTimer(timerContainer, timeLeft)
		}, 1000);

		return timer
	}

	function startVoiceListener(userCheerings) {
		const cheeringPhrases = userCheerings.map((c) => c.text)
		const settings = {
			cheeringPhrases,
			onResult: (hits) => handleCheeringHits(player, employees, hits),
			onError: (errorText) => handleVoiceError(app, errorText),
		}

		const listener = new VoiceListener(settings)
		listener.startListen()

		return listener
	}

	function stopGameIfNeeded(app, timer) {
		if (isGameEnded()) {
			clearInterval(timer)
			showGameResult(app)
			renderRestartButton(app, () => handleStartGame(app, userCheerings))
			voiceListener.stopListen()
		}
	}

	function moveEmployee(e) {
		const maxX = APP_WIDTH / 2 - EMPLOYEE_D - 4 * APP_BORDER
		const maxY = APP_HEIGHT / 2 - EMPLOYEE_D - APP_BORDER_TOP - APP_BORDER

		e.obj.x = between(e.startPosition.x + Math.sin(elapsed/e.magicNumbers.x) * maxX, APP_BORDER, APP_WIDTH - EMPLOYEE_D - APP_BORDER);
		e.obj.y = between(e.startPosition.y + Math.cos(elapsed/e.magicNumbers.y) * maxY, APP_BORDER_TOP, APP_HEIGHT - EMPLOYEE_D - APP_BORDER);
	}

	function moveCheeredEmployee(e) {
		const x = e.endPosition.x
		const y = e.endPosition.y

		e.obj.x = moveToPoint(e.obj.x, x, 1)
		e.obj.y = moveToPoint(e.obj.y, y, 1)

		if (e.obj.x == x && e.obj.y == y) e.state = 'cheered'
	}

	function moveOnKeyPress(box, employees, key) {
		if (isGameInProgress()) {
			if (key.keyCode === 65 || key.keyCode === 37) {  // A (65) / Left (37)
				if (box.position.x != APP_BORDER) box.position.x -= box.width;
			}
			if (key.keyCode === 87 || key.keyCode === 38) {  // W (87) / Up (38)
				if (box.position.y != APP_BORDER_TOP) box.position.y -= box.height;
			}
			if (key.keyCode === 68 || key.keyCode === 39) {  // D (68) / Right (39)
				if (box.position.x != APP_WIDTH - APP_BORDER - box.width) box.position.x += box.width;
			}
			if (key.keyCode === 83 || key.keyCode === 40) {  // S (83) / Down (40)
				if (box.position.y != APP_HEIGHT - APP_BORDER - box.height) box.position.y += box.height;
			}
		}
	}

	function handleVoiceError(app, errorText) {
		clearGame(app)
		clearInterval(gameTimer)
		renderResultText(app, errorText)
		renderRestartButton(app, () => handleStartGame(app, userCheerings))
		voiceListener.stopListen()
	}

	function handleCheeringHits(player, employees, hits) {
		const cheeringTexts = Object.keys(hits)

		cheeringTexts.forEach((text) => {
			const index = userCheerings.findIndex((cheering) => cheering.text === text )
			const count = hits[text]

			for(var i = 0; i < count; i++){
				handleCheering(player, employees, index)
			}
		})
	}

	function handleCheering(player, employees, cheeringIndex) {
		const cheeredEmployees = employees.filter((e) => isCheered(player, e, cheeringIndex))
		cheeredEmployees.forEach(cheerEmployee)
	}

	function cheerEmployee(employee) {
		employee.obj.filters = [colorFilter]
		employee.state = 'cheered'
		lazyEmployeesCount -= 1

		stopGameIfNeeded(app, gameTimer)
		renderScore(scoreContainer, lazyEmployeesCount)
	}

	function isCheered(player, employee, cheeringIndex) {
		return employee.state === 'lazy' && isAroundPlayer(player, employee) && isCompatibleRole(employee, cheeringIndex)
	}

	function isCompatibleRole(employee, cheeringIndex) {
		const playerCheeringRole = EMPLOYEE_ROLES[cheeringIndex].type
		const employeeRole = employee.role.type

		return playerCheeringRole === employeeRole
	}

	function isAroundPlayer(player, employee) {
		const a = employee.obj.position.x
		const b = employee.obj.position.y
		const x = player.position.x
		const y = player.position.y
		let r = CHEERING_R

		const dist_points = (a - x) * (a - x) + (b - y) * (b - y);
		r *= r;

		return dist_points < r
	}

	function cheeringTextByRole(roleType) {
		const c = userCheerings.find((c) => c.employeeRole === roleType)
		return c ? c.text : roleType
	}

	function moveToPoint(x, end, speed) {
		if (Math.abs(x - end) < 2) return end

		const direction = (x - end) > 0 ? -1 : 1
		return x + (speed * direction)
	}

	function isGameInProgress() {
		return timeLeft > 0 && lazyEmployeesCount > 0
	}

	function isGameEnded() {
		return !isGameInProgress()
	}
}

function getCheerings() {
	const url = "api/user/cheerings"
	return FetchHelpers.get(url)
}

document.addEventListener("turbolinks:load", handleOnLoad);
