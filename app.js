const express = require('express');
require('dotenv').config();
const morgan = require('morgan');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
// const gamesiteRouter = require('./routes/gamesiteRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

const bodyParser = require('body-parser');
const fs = require('fs');



// GLOBAL Middleware



console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Serving static files
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  req.requestTime = new Date().toString();
  next();
})



// Static served HTML Routes
const nav = fs.readFileSync(__dirname + '/public/nav/nav.html', 'utf-8');
const maincontent = fs.readFileSync(__dirname + '/public/maincontent/maincontent.html', 'utf-8');
const footer = fs.readFileSync(__dirname + '/public/footer/footer.html', 'utf-8');
const frontpage = fs.readFileSync(__dirname + '/public/frontpage/frontpage.html', 'utf-8');
const loginpage = fs.readFileSync(__dirname + '/public/login/login.html', 'utf-8');
const signuppage = fs.readFileSync(__dirname + '/public/signup/signup.html', 'utf-8');
const indexpage = fs.readFileSync(__dirname + '/public/index/index.html', 'utf-8');
const rulespage = fs.readFileSync(__dirname + '/public/rules/rules.html', 'utf-8');
const contactpage = fs.readFileSync(__dirname + '/public/contact/contact.html', 'utf-8');
const profilepage = fs.readFileSync(__dirname + '/public/userpage/userpage.html', 'utf-8');
const leaderboard = fs.readFileSync(__dirname + '/public/leaderboard/leaderboard.html', 'utf-8');


// app.get('/', (req, res) => {
//   res.status(200).send(frontpage);
// });

// app.get('/leaderboard', (req, res) => {
//     res.status(200).send(leaderboard);
// });

// app.get('/rules', (req, res) => {
//   res.status(200).send(rulespage);
// });

// app.get('/contact', (req, res) => {
//   res.status(200).send(contactpage);
// });

// app.get('/login', (req, res) => {
//   res.status(200).send(loginpage);
// });

// // app.get('/signup', (req, res) => {
// //   res.status(200).send(signuppage);
// // });

// // app.post('/gamesite/signup', (req, res) => {
// // });

// app.get('/index', (req, res) => {
//   res.status(200).send(indexpage);
// });

// Mounting Routers
// app.use('/gamesite', gamesiteRouter);


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

module.exports = app;
