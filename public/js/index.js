var socket = io();

socket.on('connect', function() {
	console.log('Connected to server');

	// socket.emit('createMessage', {
	// 	from: 'dkaswan',
	// 	to: 'Yup, that works for me!'
	// });
});

socket.on('disconnect', function() {
	console.log('Disconnected from server');
});

socket.on('newMessage', function(message) {
	var formattedTime = moment(message.createdAt).format('hh:mm:ss a');
	var template = jQuery('#message-template').html();
	var html = Mustache.render(template, {
		text: message.text,
		from: message.from,
		createdAt: formattedTime
	});
	jQuery('#messages').append(html);
});

jQuery('#message-form').on('submit', function(e) {
	e.preventDefault();

	var messageTextBox = jQuery('[name=message]');

	socket.emit('createMessage', {
		from: 'User',
		text: messageTextBox.val()
	}, function() {
		messageTextBox.val('');
	});
});

socket.on('newLocationMessage', function (message) {
	var formattedTime = moment(message.createdAt).format('hh:mm:ss a');
	var template = jQuery('#location-message-template').html();
	var html = Mustache.render(template, {
		url: message.url,
		from: message.from,
		createdAt: formattedTime
	});
	jQuery('#messages').append(html);


	// var li = jQuery('<li></li>');
	// var a = jQuery('<a target="_blank">My current location</a>');
	// var formattedTime = moment(message.createdAt).format('hh:mm:ss a');
	// li.text(`${formattedTime} ${message.from}:`);
	// a.attr('href', message.url);
	// li.append(a);
	// jQuery('#messages').append(li);
});

var locationButton = jQuery('#send-location');
locationButton.on('click', function() {
	if(!navigator.geolocation) {
		return alert('Geolocation not supported by your browser.');
	}

	locationButton.attr('disabled', 'disabled').text('Sending location...');

	navigator.geolocation.getCurrentPosition(function(position){
		locationButton.removeAttr('disabled').text('Send Location');
		socket.emit('createLocationMessage', {
			latitude: position.coords.latitude,
			longitude: position.coords.longitude
		});
	}, function () {
		locationButton.removeAttr('disabled').text('Send Location');
		alert('Unable to fetch location');
	})
});
