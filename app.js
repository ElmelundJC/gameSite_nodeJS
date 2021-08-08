const express = require('express');
const app = express();


const fs = require('fs');
const { get } = require('http');

// GLOBAL Middleware

// Serving static files
app.use(express.static(`${__dirname}/public`));


const frontpage = fs.readFileSync(__dirname + '/public/frontpage/frontpage.html', 'utf-8');
const loginpage = fs.readFileSync(__dirname + '/public/login/login.html', 'utf-8');
const signuppage = fs.readFileSync(__dirname + '/public/signup/signup.html', 'utf-8');
const indexpage = fs.readFileSync(__dirname + '/public/index/index.html', 'utf-8');
const rulespage = fs.readFileSync(__dirname + '/public/rules/rules.html', 'utf-8');
const contactpage = fs.readFileSync(__dirname + '/public/contact/contact.html', 'utf-8');
const profilepage = fs.readFileSync(__dirname + '/public/userpage/userpage.html', 'utf-8');

// // test middleware
// app.use((req, res, next) => {
//   req.requestTime = new Date().toString();
//   //   console.log(req.headers);

//   next();
// });

// ROUTES

app.get('/', (req, res) => {
  res.send(frontpage);
});

app.get('/login', (req, res) => {
  res.send(loginpage);
});

app.get('/signup', (req, res) => {
  res.send(signuppage);
});

app.post('signup', (req, res) => {
});

app.get('/index/:id', (req, res) => {
  res.send(indexpage);
});

app.get('/rules', (req, res) => {
  res.send(rulespage);
});

app.get('/contact', (req, res) => {
  res.send(contactpage);
});

app.get('/profile', (req, res) => {
  res.send()
});

app.use('/users', userRouter);

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
