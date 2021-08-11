const mongoose = require('mongoose');
require('dotenv').config;

process.on('uncaughtException', (err) => {
    console.log('UNCAUGHT EXCEPTION! #### Shutting down...');
    console.log(err.name, err.message);
    process.exit(1);
  });

const app = require('./app');


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