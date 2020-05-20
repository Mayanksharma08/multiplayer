function createQuestion() {
	const num1 = getRandomNumber();
	const num2 = getRandomNumber();
	const op = '*';

	const expression = `${num1} ${op} ${num2}`;

	return {
		expression: expression,
		answer: eval(expression),
	};
}

function getRandomNumber() {
	return Math.floor(Math.random() * 10);
}

module.exports = {
	createQuestion,
	getRandomNumber,
};
