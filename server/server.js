const path = require('path');
//const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage, generateLocationMessage} = require('./utils/message')
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
var app = express(),
  http = require('http'),
  server = http.createServer(app),
  io = socketIO.listen(server);
//var server = http.createServer(app);
//var io = socketIO(server);
var users = new Users();

// middleware --- set public resource directory
app.use(express.static(publicPath));

io.on('connection', (socket) => {
  console.log('New user connected');

  socket.on('join', (params, callback) => {
    var data = params.params;
    if(!isRealString(data.name) || !isRealString(data.room)) {
      return callback('Name and room name are required.');
    }

    socket.join(data.room);
    // socket.leave(data.room);

    // io.emit // send to everyone connected
    // socket.broadcast.emit // send to everyone connected but the sender
    // socket.emit // send to user connected

    // io.emit -> io.to('The Office Fans').emit
    // socket.broadcast.to('The Office Fans').emit

    users.removeUser(socket.id); // disconnect from previous rooms
    users.addUser(socket.id, data.name, data.room); // add new user to room

    io.to(data.room).emit('updateUserList', users.getUserList(data.room));

    socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));
    socket.broadcast.to(data.room).emit('newMessage', generateMessage('Admin', `${data.name} has joined`));
    callback();
  });

  socket.on('createMessage', (message, callback) => {
    console.log('createMessage', message);
    io.emit('newMessage', generateMessage(message.from, message.text));
    callback();
  });

  socket.on('createLocationMessage', (coords) => {
    io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude));
  });

  socket.on('disconnect', () => {
    var user = users.removeUser(socket.id);
    if (user) {
      io.to(user.room).emit('updateUserList', users.getUserList(user.room));
      io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left`));
    }
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
