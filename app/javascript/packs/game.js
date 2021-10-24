import * as PIXI from 'pixi.js'

const APP_WIDTH = 600
const APP_HEIGHT = 600

const CHEERING_R = 40

const EMPLOYEE_R = APP_WIDTH / 70
const EMPLOYEE_D = 2 * EMPLOYEE_R

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

const handleOnLoad = function() {
	let app = new PIXI.Application({ width: APP_WIDTH, height: APP_HEIGHT });
	const element = document.getElementById("gameContainer");
	if (!element) return;

	element.appendChild(app.view);
	// Add a variable to count up the seconds our demo has been running
	let elapsed = 0.0;

	let employees = drawEmployees(app);
	let player = drawPlayer(app);

	document.addEventListener('keydown', (k) => moveOnKeyPress(player, employees, k));

	app.ticker.add((delta) => {
		elapsed += delta;
		employees.forEach((e) => {
			moveEmployee(e)
		})
	});

	function drawPlayer(app) {
		const w = APP_WIDTH / 40;
    const h = APP_HEIGHT / 40;

		let obj = new PIXI.Graphics();
		obj.beginFill(0xF44336);
		obj.drawRect(0, 0, w, h);

		app.stage.addChild(obj);

		return obj;
	}

	function moveEmployee(e) {
		const maxX = APP_WIDTH / 2 - EMPLOYEE_D
		const maxY = APP_HEIGHT / 2 - EMPLOYEE_D

		e.obj.x = between(e.startPosition.x + Math.sin(elapsed/e.magicNumbers.x) * maxX, 0, APP_WIDTH - EMPLOYEE_D);
		e.obj.y = between(e.startPosition.y + Math.cos(elapsed/e.magicNumbers.y) * maxY, 0, APP_HEIGHT - EMPLOYEE_D);
	}

	function drawEmployees(app) {
		const r = EMPLOYEE_R;

		let roles = [];
		let employees = [];

		for(var i = 0; i < EMPLOYEES_COUNT; i++){
			const e = randomEmployeeRole()
			roles.push(e)
		}

		roles.map((role) => {
			let obj = new PIXI.Graphics();
			obj.beginFill(role.color);
			obj.position.x = random(0, APP_WIDTH - EMPLOYEE_D)
			obj.position.y = random(0, APP_HEIGHT - EMPLOYEE_D)
			obj.drawCircle(r, r, r);

			app.stage.addChild(obj);

			// SPEED
			const x = random(100, 450)
			const y = random(100, 450)

			employees.push({'startPosition': {'x': obj.position.x, 'y': obj.position.y}, 'magicNumbers': {'x': x, 'y': y}, obj, role})
		})

		return employees;
	}

	function randomEmployeeRole() {
		const i = random(0, EMPLOYEE_ROLES.length)
		return EMPLOYEE_ROLES[i]
	}

	function moveOnKeyPress(box, employees, key) {
		// A (65) / Left (37)
		if (key.keyCode === 65 || key.keyCode === 37) {
			if (box.position.x != 0) box.position.x -= box.width;
		}
		// W (87) / Up (38)
		if (key.keyCode === 87 || key.keyCode === 38) {
			if (box.position.y != 0) box.position.y -= box.height;
		}
		// D (68) / Right (39)
		if (key.keyCode === 68 || key.keyCode === 39) {
			if (box.position.x != APP_WIDTH - box.width) box.position.x += box.width;
		}
		// S (83) / Down (40)
		if (key.keyCode === 83 || key.keyCode === 40) {
			if (box.position.y != APP_HEIGHT - box.height) box.position.y += box.height;
		}

		if (key.keyCode === 49) handleCheering(box, employees, 1)
		if (key.keyCode === 50) handleCheering(box, employees, 2)
		if (key.keyCode === 51) handleCheering(box, employees, 3)
	}

	function handleCheering(player, employees, cheering) {
		const cheeredEmployees = employees.filter((e) => isCheered(player, e, cheering))
		cheeredEmployees.forEach(cheerEmployee)
	}

	function cheerEmployee(employee) {
		employee.obj.visible = false
	}

	function isCheered(player, employee, cheering) {
		return isAroundPlayer(player, employee) && isCompatibleRole(employee, cheering)
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
}

document.addEventListener("turbolinks:load", handleOnLoad);
