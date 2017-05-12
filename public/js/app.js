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
	$(document).scrollTop($(document).height());
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
});

// Handle submitting of new message
var $form = jQuery('#message-form');

$form.on('submit', function (event) {
	event.preventDefault();

	var $message = $form.find('input[name=message]');
	var momentTimestamp = moment.utc($message.val().timestamp);
	var cleanText;
	if($message.val()){
		if(!$message.val().trim()){
			return;
		}
		cleanText = $message.val().replace(/<[^>]*>/g, "");
		cleanText2 = cleanText.trim();
		socket.emit('message', {
			name: name,
			text: cleanText2,
			time: momentTimestamp.local().format('h:mm a'),
			room: room
		});

		var momentTimestamp = moment.utc($message.val().timestamp);
		var $messages = jQuery('.messages');
		var $messageToAppend = jQuery('<li class="list-group-item"></li>');
		$messageToAppend.append('<p><strong>' + name + ' ' + momentTimestamp.local().format('h:mm a') + '</strong></p>');
		$messageToAppend.append('<p>' + cleanText2 + '</p>');
		$messages.append($messageToAppend);

		$message.val('');
		$(document).scrollTop($(document).height());
	}
});
