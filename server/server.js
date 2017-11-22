const path = require('path');
const express = require('express');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
var app = express();

// middleware --- set public resource directory
app.use(express.static(publicPath));


// // homepage
// app.get('/', (req, res) => {
//   res.render(publicPath + 'index.html', {
//     pageTitle: 'Home Page',
//     welcomeMessage: 'Welcome to my website',
//     //currentYear: new Date().getFullYear()
//   });
// });

app.listen(port, () => { // callback for console
  console.log(`Started up at port ${port}`);
});

module.exports = {app};
