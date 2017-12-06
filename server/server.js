const path = require('path');
//const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const {generateMessage, generateLocationMessage} = require('./utils/message')

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
var app = express(),
  http = require('http'),
  server = http.createServer(app),
  io = socketIO.listen(server);
//var server = http.createServer(app);
//var io = socketIO(server);

// middleware --- set public resource directory
app.use(express.static(publicPath));

io.on('connection', (socket) => {
  console.log('New user connected');

  socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));

  socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user joined'));

  socket.on('createMessage', (message, callback) => {
    console.log('createMessage', message);
    io.emit('newMessage', generateMessage(message.from, message.text));
    callback();
  });

  socket.on('createLocationMessage', (coords) => {
    io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude));
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// // homepage
// app.get('/', (req, res) => {
//   res.render(publicPath + 'index.html', {
//     pageTitle: 'Home Page',
//     welcomeMessage: 'Welcome to my website',
//     //currentYear: new Date().getFullYear()
//   });
// });

server.listen(port, () => { // callback for console
  console.log(`Started up at port ${port}`);
});

module.exports = {app};
