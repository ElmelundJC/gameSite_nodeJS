const AppError = require("../utils/appError");

const handleCastErrorDB = err => {
    const message = `Invalid ${err.path}: ${err.value}.`;
    return new AppError(message, 400);
}

const handleDuplicateFieldsDB = err => {
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
    const message = `Duplicate field value: "${value}". Please use another value!`

    return new AppError(message, 400);
}

const handleValidationErrorDB = err => {
    const errors = Object.values(err.errors).map(el = el.message);

    const message = `Invalid input data. ${errors.join('. ')}`
    return new AppError(message, 400);
}

const handleJWTError = () => new AppError('Invalid token. Please log in again!', 401);

const handleJWTExpiredError = () => new AppError('Your token has expired! Please log in again!', 401);

// Metoder for hhv. delopment eller produktion "tilstand",
// 1)  hvis vi er i development vil vi gerne vide hvad fejlen evt. kan være. 
// 2) I production mode, vil vi selvfølgelig ikke sende fejlen videre til clienten
const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack,
      });
};

const sendErrorProd = (err, res) => {
    // Operational, trusted error: send message til client
    if (err.isOperational){
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });
    // Programming eller anden ukendt error --> skal ikke 'leake daten' til clienten
    } else {
        // 1) Log error
        console.error('### Error ###', err);

        // Send generisk message
        res.status(500).json({
           status: 'error',
           message: 'Something went very wrong!', 
        })
    }
};

module.exports = (err, req, res, next) => {
    // logging af stacktrace
    // console.log(err.stack);

    // defining a default status code
    err.statusCode = err.statusCode || 500; // (500) internal server error
    err.status = err.status || 'error';
  

    // handler errors for hhv. development eller production
    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, res);
    } else if (process.env.NODE_ENV === 'production') {
        let error = { ...err };
        if (err.name === 'CastError') error = handleCastErrorDB(error);
        if (error.code === 11000) error = handleDuplicateFieldsDB(error);
        if (err.name === 'ValidationError') error = handleValidationErrorDB(error);
        if (error.name === 'JsonWebTokenError') error = handleJWTError();
        if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

        sendErrorProd(error, res);
    }
};