import * as PIXI from 'pixi.js'
import { ColorOverlayFilter } from '@pixi/filter-color-overlay';
import { InteractionManager } from '@pixi/interaction';

import FetchHelpers from './lib/FetchHelpers';
import Button from './lib/button';
import VoiceListener from './voice';

PIXI.Renderer.registerPlugin('interaction', InteractionManager)

const APP_WIDTH = 600
const APP_HEIGHT = 600
const APP_BORDER_TOP = 45
const APP_BORDER = 45

const CHEERING_R = 40
const CHEERING_TIME = 2 * 1000 // 2 seconds

const EMPLOYEE_R = APP_WIDTH / 70
const EMPLOYEE_D = 2 * EMPLOYEE_R

const GAME_TIME = 60 // seconds

const EMPLOYEES_COUNT = 100
const EMPLOYEE_ROLES = [
	{'type': 'developer', 'color': 0xffeb3b}, // yellow
	{'type': 'devops', 'color': 0x24c875}, // green
	{'type': 'sales', 'color': 0x2196F3}, // blue
]
const random = (min, max) => {
	const diff = max - min;
	let rand = Math.random();

	rand = Math.floor(rand * diff);
	rand = rand + min;

	return rand;
}
const borderMax = (x, max) => x <= max ? x : max
const borderMin = (x, min) => x >= min ? x : min
const between = (x, min, max) => borderMin(borderMax(x, max), min)

const colorFilter = new ColorOverlayFilter(0x000020, 0.6)

const handleOnLoad = function() {
	let app = new PIXI.Application({ width: APP_WIDTH, height: APP_HEIGHT });

	createGameContainer(app)

	getCheerings().then(({userCheerings}) => {
		renderGame(app, userCheerings)
	})
}

const createGameContainer = function(app) {
	const element = document.getElementById("gameContainer");
	if (!element) return;
	element.appendChild(app.view);
}

const renderGame = function(app, userCheerings) {
	renderStartButton(app, userCheerings)
}

const renderStartButton = function(app, userCheerings) {
	const button = new Button({
		label: "Начать игру",
		width: 270,
    height: 80,
		onTap: () => handleStartGame(app, userCheerings),
	})

	button.x = APP_WIDTH / 2
	button.y = APP_HEIGHT / 2

	app.stage.addChild(button)
}

const renderRestartButton = function(app, userCheerings) {
	const button = new Button({
		label: "Ещё раз!",
		width: 270,
    height: 80,
		onTap: () => handleStartGame(app, userCheerings),
	})

	button.x = APP_WIDTH / 2
	button.y = APP_HEIGHT / 2 + 70

	app.stage.addChild(button)
}

const handleStartGame = (app, userCheerings) => {
	clearGame(app)
	startGame(app, userCheerings)
	startVoiceListener()
}

const clearGame = function(app) {
	const stage = app.stage
	while(stage.children[0]) { stage.removeChild(stage.children[0]); }
}

const startVoiceListener = function() {
	const listener = new VoiceListener({})
	listener.startListen()
}

function startGame(app, userCheerings) {
	let elapsed = 0.0; // Time since start

	// TMP
	let cheeringText = drawCheeringText(app)
	let cheeringTimeout
	// TMP

	let lazyEmployeesCount = EMPLOYEES_COUNT
	let timeleft = GAME_TIME

	const timerContainer = document.getElementById("gameTimer")
	const scoreContainer = document.getElementById("gameScoreCounter")

	renderScore(lazyEmployeesCount)
	renderTimer(timeleft)

	let gameTimer
	if (timerContainer) gameTimer = startTimer()

	let employees = drawEmployees(app)
	let player = drawPlayer(app)

	document.addEventListener('keydown', (k) => moveOnKeyPress(player, employees, k));

	app.ticker.add((delta) => {
		elapsed += delta;

		if (isGameInProgress()) { employees.filter((e) => e.state === 'lazy').forEach(moveEmployee) }
		employees.filter((e) => e.state === 'cheered').forEach(moveCheeredEmployee)
	});

	function showGameResult(app) {
		lazyEmployeesCount > 0 ? drawResultText(app, "Потрачено\n😞") : drawResultText(app, "Это победа!\n🎉")
		renderRestartButton(app, userCheerings)
	}

	function renderScore(score) {
		scoreContainer.innerHTML = '1 vs ' + score
	}

	function renderTimer(time) {
		timerContainer.innerHTML = Math.round(time);
	}

	function startTimer() {
		const timer = setInterval(() => {
			timeleft -= 1;

			stopGameIfNeeded(app, timer)
			renderTimer(timeleft)
		}, 1000);

		return timer
	}

	function stopGameIfNeeded(app, timer) {
		if (isGameEnded()) {
			clearInterval(timer)
			showGameResult(app)
			renderRestartButton(app, userCheerings)
		}
	}

	function drawPlayer(app) {
		const w = APP_WIDTH / 40;
		const h = APP_HEIGHT / 40;
		const x = 0;
		const y = 0;

		let obj = new PIXI.Graphics();
		obj.beginFill(0xF44336);
		obj.drawRect(x, y, w, h);
		obj.endFill();
		obj.position.x = APP_BORDER
		obj.position.y = APP_BORDER_TOP

		app.stage.addChild(obj);

		return obj;
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

	function drawEmployees(app) {
		const r = EMPLOYEE_R;

		let roles = [];
		let employees = [];

		for(var i = 0; i < EMPLOYEES_COUNT; i++){
			const e = randomEmployeeRole()
			roles.push(e)
		}

		roles.map((role, i) => {
			const cheering = cheeringTextByRole(role.type)
			const employee = drawEmployee(role, cheering, app, i)
			employees.push(employee)
		})

		return employees
	}

	function drawEmployee(role, cheering, app, i) {
		const r = EMPLOYEE_R;

		let obj = new PIXI.Graphics();
		obj.beginFill(role.color);
		obj.position.x = random(APP_BORDER, APP_WIDTH - EMPLOYEE_D - APP_BORDER)
		obj.position.y = random(APP_BORDER_TOP, APP_HEIGHT - EMPLOYEE_D - APP_BORDER)
		obj.drawCircle(r, r, r);
		obj.endFill();

		app.stage.addChild(obj);

		const x = random(100, 450)
		const y = random(100, 450)

		const employee = {
			startPosition: {x: obj.position.x, y: obj.position.y},
			endPosition: employeePositionByIndex(i),
			state: 'lazy',
			magicNumbers: {x: x, y: y},
			obj,
			cheeringText: cheering.text,
			role,
			i,
		}

		return employee;
	}

	function drawCheeringText(app) {
		const text = new PIXI.Text('', {
			fill: "white",
			fontSize: 40,
			fontWeight: 'bold',
			// align: "right",
			width: app.screen.width,
			wordWrapWidth: 560,
			wordWrap: true,
			breakWords: true,
		});

		text.x = APP_WIDTH / 2
		text.y = APP_HEIGHT / 3
		text.anchor.x = 0.5

		// TMP hide
		// app.stage.addChild(text)

		return text
	}

	function drawResultText(app, text) {
		const textObj = new PIXI.Text(text, {
			fill: "white",
			fontSize: 40,
			fontWeight: 'bold',
			align: "center",
			width: app.screen.width,
			wordWrapWidth: 560,
			wordWrap: true,
			breakWords: true,
		});

		textObj.x = APP_WIDTH / 2
		textObj.y = APP_HEIGHT / 3
		textObj.anchor.x = 0.5

		app.stage.addChild(textObj)

		return textObj
	}

	function randomEmployeeRole() {
		const i = random(0, EMPLOYEE_ROLES.length)
		return EMPLOYEE_ROLES[i]
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

			if (key.keyCode === 49) handleCheering(box, employees, 1) // 1 (49)
			if (key.keyCode === 50) handleCheering(box, employees, 2) // 2 (50)
			if (key.keyCode === 51) handleCheering(box, employees, 3) // 3 (51)
		}
	}

	function handleCheering(player, employees, cheering) {
		showCheeringText(cheering)

		const cheeredEmployees = employees.filter((e) => isCheered(player, e, cheering))
		cheeredEmployees.forEach(cheerEmployee)
	}

	function showCheeringText(cheeringIndex) {
		const playerCheeringRole = EMPLOYEE_ROLES[cheeringIndex - 1].type
		const newText = cheeringTextByRole(playerCheeringRole)

		cheeringText.text = newText

		if (cheeringTimeout) clearTimeout(cheeringTimeout)
		cheeringTimeout = setTimeout(() => cheeringText.text = '', CHEERING_TIME)
	}

	function cheerEmployee(employee) {
		employee.obj.filters = [colorFilter]
		employee.state = 'cheered'
		lazyEmployeesCount -= 1

		stopGameIfNeeded(app, gameTimer)
		renderScore(lazyEmployeesCount)
	}

	function isCheered(player, employee, cheering) {
		return employee.state === 'lazy' && isAroundPlayer(player, employee) && isCompatibleRole(employee, cheering)
	}

	function isCompatibleRole(employee, cheering) {
		const playerCheeringRole = EMPLOYEE_ROLES[cheering - 1].type
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

	function employeePositionByIndex(i) {
		const perSide = Math.ceil(EMPLOYEES_COUNT / 4.0)
		const stepX = APP_WIDTH / perSide
		const stepY = APP_HEIGHT / perSide

		let x
		let y

		if (i < perSide) { // TOP
			x = i * stepX
			y = 0
		} else if (i < 2*perSide) { // RIGHT
			x = APP_WIDTH - EMPLOYEE_D
			y = (i - perSide) * stepY
		} else if (i < 3*perSide) { // BOTTOM
			x = (i - 2*perSide) * stepX
			y = APP_HEIGHT - EMPLOYEE_D
		} else { // LEFT
			x = 0
			y = (i - 3*perSide) * stepY
		}

		return {x, y}
	}

	function moveToPoint(x, end, speed) {
		if (Math.abs(x - end) < 2) return end

		const direction = (x - end) > 0 ? -1 : 1
		return x + (speed * direction)
	}

	function isGameInProgress() {
		return timeleft > 0 && lazyEmployeesCount > 0
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
