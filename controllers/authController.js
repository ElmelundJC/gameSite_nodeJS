const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const sendEmail = require('./../utils/email');


const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
}

exports.signup = catchAsync(async (req, res, next) => {
    const newUser = await User.create({
        // Grunden til at udvælge hver af de værdierne i stedet for at req.body, er for at undgå at fylde vores user object med for meget data og derfor kun indsætter de værdier vi skal bruge. 
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
        passwordChangedAt: req.body.passwordChangedAt,
        role: req.body.role,
    });

    // _id -> mongoDB
    //jwt.sign(payload, secret, optional)
    const token = signToken(newUser._id);

    res.status(201).json({
        status: 'success',
        token,
        data: {
            user: newUser,
        }
    });
});

exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    // 1) check om email and password eksistere
    if (!email || !password) {
        return next(new AppError('Please provide email and password!', 400));        
    }

    // 2) check om brugeren eksistere
    // filter objectet { email: email }, i ES6 kan man omskrive til nedenstående
    const user = await User.findOne({ email }).select('+password');
    // password bliver hentet med fra db da man selecter +password det på linje 61


    // da user er et dokument fra vores DB og vi i userModel har defineret en instance method til at sammenligne passwords kan vi her bruge: 
    if (!user || !(await user.correctPassword(password, user.password)))  {
        return next(new AppError('Incorrect email or password', 401));

    }

    // 3) hvis alt ok, send token til client
    const token = signToken(user._id);
    res.status(200).json({
        status: 'success',
        token,
    });

});

// protects the routes/endpoints for at klienten ikke kan tilgå før de er logget ind
exports.protect = catchAsync(async (req, res, next) => {
    // 1) Get token and check if its there
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];   
    }

    if (!token) {
        return next(new AppError('You are not logged in! Please log in to get access.', 401));
    }
    // 2) Verification token
    // promisify via nodes util module -> kalder funktionen jwt.verify med parametrene jwt & secret
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    // console.log(decoded);

    // 3) Check if user still exists
    const currentUser = await User.findById(decoded.id);

    if (!currentUser) {
        return next(new AppError('The user belonging to this token does no longer exist', 401));
    }
    // 4) Check if user changed password after the token was issued
    if(currentUser.changedPasswordAfter(decoded.iat)) {
        return next(new AppError('User recently changed password! Please log in again.', 401));
    }

    req.user = currentUser;
    next();
});

// restricTo - fkt til at kunne uddele rettigheder til admin rollen - evt. nulstille alle scores for en bruger.

exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        // roles ['admin']
        if(!roles.includes(req.user.role)) {
            return next(new AppError('You do not have permission to perform this action', 403));
        }

        next();
    };
};


exports.forgotPassword = catchAsync(async (req, res, next) => {
    // 1) Get User based on POSTed email
    const user = await User.findOne({ email: req.body.email })
    if (!user) {
        return next(new AppError('There is no user with that email address.', 404));
    }

    // 2) Generate the random reset token
    const resetToken = user.createPasswordResetToken();
    // validate before save -> deaktivere alle validators på dokumentet i skemaet
    await user.save({ validateBeforeSave: false });
    // 3) Send it to user's email
    const resetURL = `${req.protocol}://${req.get('host')}/api/users/resetPassword/${resetToken}`;

    const message = `Forgot your password? Submit a Patch request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

    try{
        await sendEmail({
            email: user.email,
            subject: 'Your password reset token (valid for 10 min)',
            message,
        });
    
        res.status(200).json({
            status: 'success',
            message: 'Token sent to email!',
        });
    } catch(err) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({ validateBeforeSave: false });

        return next(new AppError('There was an error sending the email. Try again later!', 500));
    }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
    // Reset Token der sendes via URL er den non-encrypterede token og den vi har i databasen er encyrpteret. Derfor skal det nye password selvfølgelig encrypte den nye token.
    // Get user based on the token
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({ passwordResetToken: hashedToken, passwordResetExpires: { $gt : Date.now() } });
    // if token has not expired, and there is a user, set the new password
    if (!user) {
        return next(new AppError('Token is invalid or has expired', 400));
      }
      user.password = req.body.password;
      user.passwordConfirm = req.body.passwordConfirm;
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save(); // her vil vi ikke slå validators fra!

    // Update changedPasswordAt property for the user

    // Log the user in, send JWT
    const token = signToken(user._id);

    res.status(200).json({
        status: 'success',
        token
    });
});