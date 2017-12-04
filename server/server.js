const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);

// middleware --- set public resource directory
app.use(express.static(publicPath));

io.on('connection', (socket) => {
  console.log('New user connected');

  // socket.emit('newMessage', {
  //   from: 'mike@example.com',
  //   text: 'See you than',
  //   createdAt: 123123
  // });

  socket.on('createMessage', (message) => {
    console.log('createMessage', message);
    io.emit('newMessage', {
      from: message.from,
      text: message.text,
      createdAt: new Date().getTime()
    });
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
