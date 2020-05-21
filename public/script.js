//const userEl = document.getElementById('user');
const userEl = document.getElementById('sub');
const submissionEl = document.getElementById('submission');
const introEl = document.getElementById('intro');
const gameEl = document.getElementById('game');
const questionEl = document.getElementById('question');
const leaderboardEl = document.getElementById('leaderboard');

let socket = undefined;

userEl.addEventListener("click", (e) => {
	e.preventDefault();

	//const name = e.target['name'].value;
	//const room = e.target['room'].value;

	const name = String(document.getElementById("name").value);
	const room = String(document.getElementById("room").value);

	if (name && room) {
		// we are connecting the socket
		socket = window.io();

		socket.emit('user_joined', {name,room});

		startGame(room);
	}
});

function startGame() {
	introEl.classList.add('hidden');
	gameEl.classList.remove('hidden');

	socket.on('question', (question) => {
		questionEl.innerText = `${question} = ?`;
	});


	socket.on('leaderboard', (leaderboard) => {
		leaderboardEl.innerHTML = `
      ${leaderboard
				.map(
					(player) =>
						`<li class="flex justify-between"><strong>${player.name}</strong> ${player.points}</li>`
				)
				.join('')}
    `;
	});
	
}

submissionEl.addEventListener('submit', (e) => {
	e.preventDefault();

	const response = e.target['response'].value;

	if (response) {
		socket.emit('response', response);
		questionEl.innerText = ``;
		e.target['response'].value = '';
	}
});
