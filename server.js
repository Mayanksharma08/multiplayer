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
			turn: false
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
		for (key in playerChance){
			playerChance[key] = false;
		}
        let roomid = Object.keys(socket.rooms).filter(function(item) {
            return item !== socket.id;
        });

        console.log(roomid);

		// check if the response is the answer
		if (+response === question.answer) {
			question = createQuestion();

			increasePoints(socket.id,roomid);

			updateGame(roomid[0]);
		}
	});

	socket.on('disconnect', function () {
		// remove the player from the local array
		// players = [...players.filter((player) => player.id !== socket.id)];

		console.log(socket.id, ' disconnected');
	});
});

function increasePoints(id,roomid) {

	players[roomid[0]] = players[roomid[0]].map((player) => {
		if (player.id === id) {
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
   const leaderboard = players[room].sort((a, b) => b.points - a.points).slice(0, 10);

   if(players[room].length == 4){
	   	if(chance%4 == 0){
			var id = players[room][0].id;
			playerChance.playerA = true;
			io.to(id).emit('question', {question,playerChance});	
		}
		if(chance%4 == 1){
			var id = players[room][1].id;
			playerChance.playerB = true;
			io.to(id).emit('question', {question,playerChance});	
		}
		if(chance%4 == 2){
			var id = players[room][2].id;
			playerChance.playerC = true;
			io.to(id).emit('question', {question,playerChance});	
		}
		if(chance%4 == 3){
			var id = players[room][3].id;
			playerChance.playerD = true;
			io.to(id).emit('question', {question,playerChance});	
		}
   }
		io.to(room).emit('leaderboard', leaderboard);
}

// USE THIS ON GLITCH
 http.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + process.env.PORT);
 });
/*
http.listen(3000, () => {
	console.log('Your app is listening on port ' + 3000);
});
*/