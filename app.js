const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const userRouter = require('./routes/userRoutes');
const { isLoggedIn } = require('./controllers/authController');
// const loginRouter = require('./routes/loginRoutes');

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! #### Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

const app = express();

const bodyParser = require('body-parser');
const fs = require('fs');



// GLOBAL Middleware

// Set Security HTTP headers
// app.use(helmet());


// Development logging
console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(cors());

// Limit request from same API
// const limiter = rateLimit({
//   max: 100,
//   windowMs: 60 * 60 * 1000,
//   message: 'Too many requests from this IP, please try again in an hour', 
// });

// app.use('/api', limiter);


// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Data sanitization against NoSQL query injection -> filtrere $ tegn ud af query strengen
// app.use(mongoSanitize()); 

// Data sanitization against XSS -> fjerner html tegn tilegnet mod vores users.
// app.use(xss());

// Serving static files
app.use(express.static(`${__dirname}/public`));

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toString();
  console.log(req.cookies);
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


app.get('/', (req, res) => {
  res.status(200).send(loginpage);
});



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

// app.use(authController.isLoggedIn);

app.get('/index', isLoggedIn, (req, res) => {
  res.status(200).send(indexpage);
});


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
const server = app.listen(port, (error) => {
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
