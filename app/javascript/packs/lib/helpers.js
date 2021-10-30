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

export { random, between }
