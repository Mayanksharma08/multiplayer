//const userEl = document.getElementById('user');
const userEl = document.getElementById('sub');
const submissionEl = document.getElementById('submission');
const introEl = document.getElementById('intro');
const gameEl = document.getElementById('game');
const playerA = document.getElementById('img01');
const playerB = document.getElementById('img02');
const playerC = document.getElementById('img03');
const playerD = document.getElementById('img04');
const cardsEl = document.getElementById('cards');
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

		socket.on('RoomFull', () => {
			alert('Room is Full, Reload the game');
		});
		
		startGame(room);
	}
});

function startGame() {
	introEl.classList.add('hidden');
	gameEl.classList.remove('hidden');

	socket.on('question', (data) => {
		cardsEl.classList.remove('hidden');
		questionEl.innerText = `${data.question.expression} = ?`;
		
		if(data.playerChance.playerA){
			Object.assign(playerA.style,{display:"none"});
			Object.assign(playerB.style,{    width:"250px",
				height:"200px",
				top: "30px",
				right: "-60px",
				left: "20px",
				bottom: "40px",
				float: "right",
				transform: "rotate(90deg)"
			});
			Object.assign(playerC.style,{width:"250px",
				height:"200px",
				top: "20px",
				right: "auto",
				left: "auto"
			});
			Object.assign(playerD.style,{width:"250px",
			height:"200px",
			top: "30px",
			right: "20px",
			left: "-60px",
			bottom: "40px",
			float: "left",
			transform: "rotate(270deg)"});
		}

		if(data.playerChance.playerB){
			Object.assign(playerB.style,{display:"none"});
			Object.assign(playerC.style,{    width:"250px",
				height:"200px",
				top: "30px",
				right: "-60px",
				left: "20px",
				bottom: "40px",
				float: "right",
				transform: "rotate(90deg)"
			});
			Object.assign(playerD.style,{width:"250px",
				height:"200px",
				top: "20px",
				right: "auto",
				left: "auto"
			});
			Object.assign(playerA.style,{width:"250px",
			height:"200px",
			top: "30px",
			right: "20px",
			left: "-60px",
			bottom: "40px",
			float: "left",
			transform: "rotate(270deg)"});
		}

		if(data.playerChance.playerC){
			Object.assign(playerC.style,{display:"none"});
			Object.assign(playerD.style,{    width:"250px",
				height:"200px",
				top: "30px",
				right: "-60px",
				left: "20px",
				bottom: "40px",
				float: "right",
				transform: "rotate(90deg)"
			});
			Object.assign(playerA.style,{width:"250px",
				height:"200px",
				top: "20px",
				right: "auto",
				left: "auto"
			});
			Object.assign(playerB.style,{width:"250px",
			height:"200px",
			top: "30px",
			right: "20px",
			left: "-60px",
			bottom: "40px",
			float: "left",
			transform: "rotate(270deg)"});
		}

		if(data.playerChance.playerD){
			Object.assign(playerD.style,{display:"none"});
			Object.assign(playerA.style,{    width:"250px",
				height:"200px",
				top: "30px",
				right: "-60px",
				left: "20px",
				bottom: "40px",
				float: "right",
				transform: "rotate(90deg)"
			});
			Object.assign(playerB.style,{width:"250px",
				height:"200px",
				top: "20px",
				right: "auto",
				left: "auto"
			});
			Object.assign(playerC.style,{width:"250px",
			height:"200px",
			top: "30px",
			right: "20px",
			left: "-60px",
			bottom: "40px",
			float: "left",
			transform: "rotate(270deg)"});
		}
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
