const express = require('express');
const morgan = require('morgan');
const app = express();

const gamesiteRouter = require('./routes/gamesiteRoutes');
const userRouter = require('./routes/userRoutes');


// GLOBAL Middleware

app.use(morgan('dev'));

app.use(express.json());

// Serving static files
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  req.requestTime = new Date().toString();
  next();
})

// const frontpage = fs.readFileSync(__dirname + '/public/frontpage/frontpage.html', 'utf-8');
// const loginpage = fs.readFileSync(__dirname + '/public/login/login.html', 'utf-8');
// const signuppage = fs.readFileSync(__dirname + '/public/signup/signup.html', 'utf-8');
// const indexpage = fs.readFileSync(__dirname + '/public/index/index.html', 'utf-8');
// const rulespage = fs.readFileSync(__dirname + '/public/rules/rules.html', 'utf-8');
// const contactpage = fs.readFileSync(__dirname + '/public/contact/contact.html', 'utf-8');
// const profilepage = fs.readFileSync(__dirname + '/public/userpage/userpage.html', 'utf-8');

// test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toString();
  //   console.log(req.headers);

  next();
});


// const getAllUsers = (req, res) => {
//   res.status(500).json({
//     status: 'error',
//     message: 'This route is not yet defined!',
//   });
// }

// const createUser = (req, res) => {
//   res.status(500).json({
//     status: 'error',
//     message: 'This route is not yet defined!',
//   });
// }

// const getUser = (req, res) => {
//   res.status(500).json({
//     status: 'error',
//     message: 'This route is not yet defined!',
//   });
// }

// const updateUser = (req, res) => {
//   res.status(500).json({
//     status: 'error',
//     message: 'This route is not yet defined!',
//   });
// }

// const deleteUser = (req, res) => {
//   res.status(500).json({
//     status: 'error',
//     message: 'This route is not yet defined!',
//   });
// }


// ROUTES

// const gamesiteRouter = express.Router();


// gamesiteRouter.get('/gamesite', (req, res) => {
//   res.status(200).send(frontpage);
// });

// gamesiteRouter.get('/gamesite/rules', (req, res) => {
//   res.status(200).send(rulespage);
// });

// gamesiteRouter.get('/gamesite/contact', (req, res) => {
//   res.status(200).send(contactpage);
// });

// gamesiteRouter.get('/gamesite/login', (req, res) => {
//   res.status(200).send(loginpage);
// });

// gamesiteRouter.get('/gamesite/signup', (req, res) => {
//   res.status(200).send(signuppage);
// });

// gamesiteRouter.post('/gamesite/signup', (req, res) => {
// });

// for later implementation
// app.get('/gamesite/user/index/:id', (req, res) => {
//   res.send(indexpage);
// });

// app.get('/gamesite/user/profile/:id', (req, res) => {
//   res.send()
// });


// Mounting Routers
app.use('/gamesite', gamesiteRouter);
app.use('/gamesite/users', userRouter);

// SERVER

const port = process.env.PORT || 8080;
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
