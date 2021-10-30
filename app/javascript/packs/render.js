import * as PIXI from 'pixi.js'
import { ColorOverlayFilter } from '@pixi/filter-color-overlay'
import { InteractionManager } from '@pixi/interaction'

import Button from './lib/button'
import { random } from './lib/helpers'
import { APP_WIDTH, APP_HEIGHT, APP_BORDER, APP_BORDER_TOP, CHEERING_R, CHEERING_INNER_R, EMPLOYEE_R, EMPLOYEE_D, EMPLOYEES_COUNT, EMPLOYEE_ROLES } from './constants'

PIXI.Renderer.registerPlugin('interaction', InteractionManager)

const colorFilter = new ColorOverlayFilter(0x000020, 0.3)

function renderGame(app, handleStartClick) {
	renderStartButton(app, handleStartClick)
}

function renderScore(container, score) {
	container.innerHTML = '1 vs ' + score
}

function renderTimer(container, time) {
	container.innerHTML = Math.round(time)
}

function renderStartButton(app, onClick) {
	const button = new Button({
		label: "Начать игру",
		width: 270,
    height: 80,
		onTap: onClick,
	})

	button.x = APP_WIDTH / 2
	button.y = APP_HEIGHT / 2

	app.stage.addChild(button)
}

function renderRestartButton(app, onClick) {
	const button = new Button({
		label: "Ещё раз!",
		width: 270,
    height: 80,
		onTap: onClick,
	})

	button.x = APP_WIDTH / 2
	button.y = APP_HEIGHT / 2 + 70

	app.stage.addChild(button)
}

function renderPlayer(app) {
	const w = APP_WIDTH / 40
	const h = APP_HEIGHT / 40
	const x = 0
	const y = 0

	let obj = new PIXI.Graphics()
	obj.beginFill(0xF44336)
	obj.drawRect(x, y, w, h)
	obj.endFill()
	obj.position.x = APP_BORDER
	obj.position.y = APP_BORDER_TOP

	app.stage.addChild(obj)

	return obj
}

function renderEmployees(app, cheeringText) {
	const r = EMPLOYEE_R

	let roles = []
	let employees = []

	for(var i = 0; i < EMPLOYEES_COUNT; i++){
		const e = randomEmployeeRole()
		roles.push(e)
	}

	roles.map((role, i) => {
		const employee = renderEmployee(role, cheeringText, app, i)
		employees.push(employee)
	})

	return employees
}

function renderEmployee(role, cheeringText, app, i) {
	const r = EMPLOYEE_R

	let obj = new PIXI.Graphics()
	obj.beginFill(role.color)
	obj.position.x = random(APP_BORDER, APP_WIDTH - EMPLOYEE_D - APP_BORDER)
	obj.position.y = random(APP_BORDER_TOP, APP_HEIGHT - EMPLOYEE_D - APP_BORDER)
	obj.drawCircle(r, r, r)
	obj.endFill()

	app.stage.addChild(obj)

	const cheering = cheeringText(role.type)
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

	return employee
}

function renderResultText(app, text) {
	const obj = new PIXI.Text(text, {
		fill: "white",
		fontSize: 40,
		fontWeight: 'bold',
		align: "center",
		width: app.screen.width,
		wordWrapWidth: 560,
		wordWrap: true,
		breakWords: true,
	})

	obj.x = APP_WIDTH / 2
	obj.y = APP_HEIGHT / 3
	obj.anchor.x = 0.5

	app.stage.addChild(obj)

	return obj
}

function renderCheeringCircle(app, player, r, color) {
	let container = new PIXI.Container()

	let obj = new PIXI.Graphics()
	obj.beginFill(color, 0.5)
	obj.drawCircle(r, r, r)
	obj.endFill()
	obj.filters = [colorFilter]

	container.addChild(obj)
	setPlayerPosition(player, obj, r)

	container.scale.set(0.1)
	app.stage.addChild(container)

	return obj
}

function scaleCircle(circle, step) {
	const container = circle.parent
	container.scale.set(container.scale.x + step)
}

function setPlayerPosition(player, circle, r) {
	const container = circle.parent
	circle.x = -1*r
	circle.y = -1*r

	container.x = player.x + player.width / 2
	container.y = player.y + player.width / 2
}

function randomEmployeeRole() {
	const i = random(0, EMPLOYEE_ROLES.length)
	return EMPLOYEE_ROLES[i]
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

export { renderGame, renderScore, renderTimer, renderStartButton, renderRestartButton, renderPlayer, renderEmployees, renderResultText, renderCheeringCircle, setPlayerPosition, scaleCircle }
