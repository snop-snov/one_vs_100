import * as PIXI from 'pixi.js'

const APP_WIDTH = 600
const APP_HEIGHT = 600

const EMPLOYEE_R = APP_WIDTH / 70
const EMPLOYEE_D = 2 * EMPLOYEE_R

const EMPLOYEES_COUNT = 100
const EMPLOYEE_ROLES = [
	{'type': 'developer', 'color': 0xffeb3b},
	{'type': 'devops', 'color': 0x24c875},
	{'type': 'sales', 'color': 0x2196F3},
]
const random = (max) => Math.floor(Math.random() * max);
const borderMax = (x, max) => x <= max ? x : max
const borderMin = (x, min) => x >= min ? x : min
const between = (x, min, max) => borderMin(borderMax(x, max), min)

const handleOnLoad = function() {
	let app = new PIXI.Application({ width: APP_WIDTH, height: APP_HEIGHT });
	const element = document.getElementById("gameContainer");
	if (!element) return;

	element.appendChild(app.view);
	// let sprite = PIXI.Sprite.from('/assets/snake-item.png');
	// app.stage.addChild(sprite);

	// Add a variable to count up the seconds our demo has been running
	let elapsed = 0.0;

	let employees = drawEmployees(app);
	let player = drawPlayer(app);

	document.addEventListener('keydown', (k) => moveOnKeyPress(player, k));

	app.ticker.add((delta) => {
		// console.log(delta)
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
			obj.position.x = borderMax(random(APP_WIDTH), APP_WIDTH - EMPLOYEE_D)
			obj.position.y = borderMax(random(APP_HEIGHT), APP_HEIGHT - EMPLOYEE_D)
			obj.drawCircle(r, r, r);

			app.stage.addChild(obj);

			const x = between(random(100), 50, 150)
			const y = between(random(100), 50, 150)

			employees.push({'startPosition': {'x': obj.position.x, 'y': obj.position.y}, 'magicNumbers': {'x': x, 'y': y}, obj})
		})

		return employees;
	}

	function randomEmployeeRole() {
		const i = random(EMPLOYEE_ROLES.length)
		return EMPLOYEE_ROLES[i]
	}

	function moveOnKeyPress(box, key) {
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
	}
}

document.addEventListener("turbolinks:load", handleOnLoad);
