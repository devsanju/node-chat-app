const path = require('path');
//const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

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

  socket.emit('newMessage', {
    from: 'Admin',
    text: "Welcome to the chat app",
    createdAt: new Date().getTime()
  });

  socket.broadcast.emit('newMessage', {
      from: 'Admin',
      text: 'New user joined',
      createdAt: new Date().getTime()
  });

  socket.on('createMessage', (message) => {
    console.log('createMessage', message);
    io.emit('newMessage', {
      from: message.from,
      text: message.text,
      createdAt: new Date().getTime()
    });
    // Broadcast - send message to all users except the current socket user
    // socket.broadcast.emit('newMessage', {
    //   from: message.from,
    //   text: message.text,
    //   createdAt: new Date().getTime()
    // });
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
