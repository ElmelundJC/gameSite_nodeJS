const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const http = require('http');
const socketio = require('socket.io');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const userRouter = require('./routes/userRoutes');
const contactRouter = require("./routes/email");
const { protect } = require('./controllers/authController');

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! #### Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const bodyParser = require('body-parser');
const fs = require('fs');
const { profile } = require('console');



// Development logging
console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(cors());




// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());


// Serving static files
app.use(express.static(`${__dirname}/public`));

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toString();
  console.log(req.cookies);
  next();
});

// ### Mail Middleware router ##
app.use(contactRouter.router);

// ##########
// Run when client connects
io.on('connection', socket => {

  // Welcome current user
  socket.emit('message', 'Velkommen til chatten. Skriv med alle online brugere!');

  // Broadcast when a user connects
  socket.broadcast.emit('message', 'En bruger har joinet chatten.');

  // Runs when client disconnects
  socket.on('disconnect', () => {
    io.emit('message', 'En bruger har forladt chatten.');
  });

  // Listen for chatMessage
  socket.on('chatMessage', (msg) => {
    io.emit('message', msg);
  });
});



// Static served HTML Routes
// const nav = fs.readFileSync(__dirname + '/public/nav/nav.html', 'utf-8');
// const maincontent = fs.readFileSync(__dirname + '/public/maincontent/maincontent.html', 'utf-8');
// const footer = fs.readFileSync(__dirname + '/public/footer/footer.html', 'utf-8');

const frontpage = fs.readFileSync(__dirname + '/public/frontpage/frontpage.html', 'utf-8');
const loginpage = fs.readFileSync(__dirname + '/public/login/login.html', 'utf-8');
const signuppage = fs.readFileSync(__dirname + '/public/signup/signup.html', 'utf-8');
const indexpage = fs.readFileSync(__dirname + '/public/index/index.html', 'utf-8');
const gamepage = fs.readFileSync(__dirname + '/public/gamepage/gamepage.html', 'utf-8');
const rulespage = fs.readFileSync(__dirname + '/public/rules/rules.html', 'utf-8');
const contactpage = fs.readFileSync(__dirname + '/public/contact/contact.html', 'utf-8');
const leaderboard = fs.readFileSync(__dirname + '/public/leaderboard/leaderboard.html', 'utf-8');
// const profilepage = fs.readFileSync(__dirname + '/public/userpage/userpage.html', 'utf-8');


app.get('/', (req, res) => {
  res.status(200).send(frontpage);
});

app.get('/login', (req, res) => {
  res.status(200).send(loginpage);
});

app.get('/signup', (req, res) => {
  res.status(200).send(signuppage);
});

app.get('/indexpage', protect, (req, res) => {
  res.status(200).send(indexpage);
});

app.get('/gamesite', protect, (req, res) => {
  res.status(200).send(gamepage);
});

app.get('/leaderboard', protect, (req, res) => {
  res.status(200).send(leaderboard);
});

app.get('/rules', protect, (req, res) => {
  res.status(200).send(rulespage);
});

app.get('/contact', protect, (req, res) => {
  res.status(200).send(contactpage);
});

// app.get('/profile', protect, (req, res) => {
//   res.status(200).send(profilepage);
// });




// ROUTES
app.use('/api/users', userRouter);

// If the codes ends down here, basicly our other routes wasnt matched. therefor a handler for all bad requests. (routes that hasnt been defined) 

app.all('*', (req, res, next) => {

  // const err = new Error(`Can't find ${req.originalUrl} on this server!`);
  // err.status = 'fail!';
  // err.statusCode = 404;

  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404) );
})

app.use(globalErrorHandler);

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose.connect(DB, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
}).then(() => console.log('DB connection successful!'));
// man kunne også handle forkert connection ved at chaine .then til connectionen efter og console.log en besked.. men i denne app gøres det globalt.



// SERVER
const port = process.env.PORT || 8080;
server.listen(port, (error) => {
  if (error) {
    console.log(error)
  }
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