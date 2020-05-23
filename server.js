const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const { createQuestion, getRandomNumber } = require('./helper_function');

let players = {};
let playerChance = {
	playerA : false,
	playerB : false,
	playerC : false,
	playerD : false
};
let next_turn=0;
let chance = 0;

let question = createQuestion();

console.log(question);

app.use(express.static('public'));

app.get('/', (request, response) => {
	response.sendFile(__dirname + '/views/index.html');
});

io.on('connection', function (socket) {
	
	socket.on('user_joined', (data) => {
		const player = {
			id: socket.id,
            name: data.name,
            room: data.room,
			points: 0,
			cards: [1,1,1,1]
        };
        //console.log(player);	
		socket.join(data.room);
        
        if(!players.hasOwnProperty(data.room)){
            players[data.room] = new Array();
        }
		
		if(players[data.room].length > 3){
			socket.emit('RoomFull');
		} else {
			players[data.room].push(player);
		}
		
		//console.log(data.name, 'is now connected');

		//console.log(players[data.room]);

		updateGame(data.room);
	});

	socket.on('response', (response) => {
        // do something with the response
		chance++;
		let card=(response%4);
		
        let roomid = Object.keys(socket.rooms).filter(function(item) {
            return item !== socket.id;
        });

		current_turn = (chance-1)%4
		next_turn = chance%4;
		players[roomid[0]][next_turn].cards[card] = players[roomid[0]][next_turn].cards[card]+1;
		let playerObject = Object.keys(players)


		// check if the response is the answer
		if (+response === question.answer) {
			question = createQuestion();

			increasePoints(socket.id,roomid,card);
			currentplayer = players[roomid[0]][current_turn]
			socket.emit('UIupdate',{playerChance,currentplayer});
		} else {
			question = createQuestion();
		}
		for (key in playerChance){
			playerChance[key] = false;
		}
		updateGame(roomid[0]);
	});

	socket.on('disconnect', function () {
		let roomid = Object.keys(socket.rooms).filter(function(item) {
            return item !== socket.id;
		});
		console.log(players);
		// remove the player from the local array
		//players = [...players[roomid[0]].filter((player) => player.id !== socket.id)];

		console.log(players[roomid[0]]);
		console.log(socket.id, ' disconnected, Room closed');
	});
});

function increasePoints(id,roomid,card) {
	
	players[roomid[0]] = players[roomid[0]].map((player) => {
		console.log(player);
		if (player.id === id) {
			player.cards[card] = player.cards[card]-1;
			return {
				...player,
				points: player.points + 1,
			};
		} else {
			return player;
		}
	});
}

function updateGame(room) {
	console.log(players[room]);
   const leaderboard = players[room].sort((a, b) => b.points - a.points).slice(0, 10);

   if(players[room].length == 4){
	   	if(chance%4 == 0){
			var id = players[room][0].id;
			playerChance.playerA = true;
			let playerA = players[room][0];
			io.to(id).emit('question', {question,playerA,playerChance});	
		}
		if(chance%4 == 1){
			var id = players[room][1].id;
			playerChance.playerB = true;
			let playerB = players[room][1];
			io.to(id).emit('question', {question,playerB,playerChance});	
		}
		if(chance%4 == 2){
			var id = players[room][2].id;
			playerChance.playerC = true;
			let playerC = players[room][2];
			io.to(id).emit('question', {question,playerC,playerChance});	
		}
		if(chance%4 == 3){
			var id = players[room][3].id;
			playerChance.playerD = true;
			let playerD = players[room][3];
			io.to(id).emit('question', {question,playerD,playerChance});	
		}
   }
		io.to(room).emit('leaderboard', leaderboard);
}

//ss USE THIS ON GLITCH
 http.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + process.env.PORT);
 });
/*
http.listen(3000, () => {
	console.log('Your app is listening on port ' + 3000);
});
*/