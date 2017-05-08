var name = getQueryVariable('name') || 'Anonymous';
var room = getQueryVariable('room');
var socket = io();

console.log(name + ' wants to join ' + room);

jQuery('.room-title').text(room);

socket.on('connect', function () {
	console.log('Connected to socket.io server!');
	socket.emit('joinRoom', {
		name: name,
		room: room
	});
});

socket.on('allmessages', function(allmessages){
	console.log(allmessages);
	for(let i = 0; i < allmessages["messages"].length; i++){
		var $messages = jQuery('.messages');
		var $message = jQuery('<li class="list-group-item"></li>');

		$message.append('<p><strong>' + allmessages["messages"][i].Sender + ' ' + 
		allmessages["messages"][i].Time + '</strong></p>');
		$message.append('<p>' + allmessages["messages"][i].Content + '</p>');
		$messages.append($message);
	}
});

socket.on('message', function (message) {
	var momentTimestamp = moment.utc(message.timestamp);
	var $messages = jQuery('.messages');
	var $message = jQuery('<li class="list-group-item"></li>');

	console.log('New message');
	console.log(message.text);

	$message.append('<p><strong>' + message.name + ' ' + momentTimestamp.local().format('h:mm a') + '</strong></p>');
	$message.append('<p>' + message.text + '</p>');
	$messages.append($message);

	//put this outside of the loop fam. hopefully it works. 
	$messages.scrollTop($messages[0].scrollHeight);
});

// Handle submitting of new message
var $form = jQuery('#message-form');

$form.on('submit', function (event) {
	event.preventDefault();

	var $message = $form.find('input[name=message]');
	var momentTimestamp = moment.utc($message.val().timestamp);
	if($message.val()){
		socket.emit('message', {
			name: name,
			text: $message.val(),
			time: momentTimestamp.local().format('h:mm a')
		});

		$message.val('');
	}
});
