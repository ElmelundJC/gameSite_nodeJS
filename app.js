const express = require('express');
const app = express();


const fs = require('fs');
const { get } = require('http');

// GLOBAL Middleware

// Serving static files
app.use(express.static('public'));


// SSR - serverside rendering
// const nav = fs.readFileSync(__dirname + '/public/nav/nav.html', 'utf-8');
// const footer = fs.readFileSync(__dirname + '/public/footer/footer.html','utf-8');

// const indexpage = fs.readFileSync(__dirname + '/public/index/index.html','utf-8');

// const frontpage = fs.readFileSync(__dirname + '/public/frontpage/frontpage.html','utf-8');

// // test middleware
// app.use((req, res, next) => {
//   req.requestTime = new Date().toString();
//   //   console.log(req.headers);

//   next();
// });

// ROUTES

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/frontpage/frontpage.html', 'utf-8');
});

app.get('/index', (req, res) => {
  res.sendFile(__dirname + '/public/index/index.html');
});

app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/public/login/login.html');
});

app.get('/signup', (req, res) => {
  res.sendFile(__dirname + '/public/signup/signup.html');
});

// SERVER

const port = process.env.PORT || 8000;
const server = app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});

process.on('unhandledRejection', (err) => {
  console.log('UNHANDLER REJECTION! #### Shutting down...');
  console.log(err.name, err.message);
  // server.close() giver severen tid til at lukke ned inden at vi "Hardcloser" applikationen.
  server.close(() => {
    // process.exit(1 or 0); 0 = success, 1 = uncaught exception
    process.exit(1);
  });
});
