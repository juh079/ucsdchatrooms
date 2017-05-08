const PORT = process.env.PORT || 3000;
const moment = require('moment');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const models = require('./schema/schema');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());

var clientInfo = {};
app.get('/api/getNewestFifteen', function(req,res){
	let newestFifteen = []; //the messages to be displayed to the user
	// return up to first 15 newest messages
	models.Message.find({}).sort({"_id": 1}).exec()
	.then(function(allMessages){
			if(allMessages.length < 15){
					for (let i = 0; i > allMessages.length; i++){
						newestFifteen.append(allMessages)
					}
				}
				else {
					for(let i = allMessages.length - 15; i > allMessages.length; i++){
						newestFifteen.append(allMessages[i]);
					}
				}
			res.json({
				newestFifteen: newestFifteen,
			});
	});
});


// sends current users to provided socket
function sendCurrentUsers (socket) {
	var info = clientInfo[socket.id];
	var users = [];
	if (typeof info === 'undefined') {
		return;
	}

	Object.keys(clientInfo).forEach(function (socketId) {
		var userInfo = clientInfo[socketId];
		if (info.room === userInfo.room) {
			users.push(userInfo.name);
		}
	});

	socket.emit('message', {
		name: 'System',
		text: 'Current users: ' + users.join(', '),
		timestamp: moment().valueOf()
	});
}

io.on('connection', function (socket) {
	console.log('User connection via socket.io!');

	socket.on('disconnect', function () {
		var userData = clientInfo[socket.id];
		if (typeof userData !== 'undefined') {
			socket.leave(userData.room);
			io.to(userData.room).emit('message', {
				name: 'System',
				text: userData.name + ' has left!',
				timestamp: moment().valueOf()
			});
			delete clientInfo[socket.id];
		}
	});

	socket.on('joinRoom', function (req) {
		clientInfo[socket.id] = req;
		socket.join(req.room);
		models.Message.find({}).sort({"_id": 1}).exec()
			.then(function(allMessages){
				socket.emit('allmessages', {
					messages: allMessages,
				});
		});
	
		socket.broadcast.to(req.room).emit('message', {
			name: 'System',
			text: req.name + ' has joined',
			timestamp: moment().valueOf()
		});

	});

	socket.on('message', function (message) {
		console.log('Message received: ' + message.text);
		if (message.text === '@currentUsers') {
			sendCurrentUsers(socket);	
		}
		else {
			
			// save the message to the database
			models.Message({
				Sender: message.name,
				Content: message.text,
				Time: message.time,
			}).save();

			io.to(clientInfo[socket.id].room).emit('message', message);
			//socket.broadcast.emit('message', message);
		}
	});

	socket.emit('message', {
		name: 'System',
		text: 'Welcome to the chat application!',
		timestamp: moment().valueOf()
	});
});

http.listen(PORT, function () {
	console.log('Server started');
});