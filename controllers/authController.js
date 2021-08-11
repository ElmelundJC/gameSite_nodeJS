const User = require('./../models/userModel');
const catchAsync = require('../utils/catchAsync');


// exports.signup = async (req, res, next) => {
//     try{
//     const newUser = await User.create({
//         name: req.body.name,
//         email: req.body.email,
//         password: req.body.password,
//         passwordConfirm: req.body.passwordConfirm,
//     });

//     res.status(201).json({
//         status: 'success',
//         data: {
//             user: newUser,
//         }
//     })} catch (err) {
//         res.status(404).json({
//             status: 'fail',
//             message: err,
//         });
//     }
// };

exports.signup = catchAsync(async (req, res, next) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
    });

    res.status(201).json({
        status: 'success',
        data: {
            user: newUser,
        }
    });
});