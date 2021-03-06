const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

// laver et array bestående af alle de argumenter som vi puttede i.
// looper igennem objectets fields for allowed fields værdier og tilføjer det til det nye array.
const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach(el => {
        if (allowedFields.includes(el)) newObj[el] = obj[el];
    });
    return newObj;
}

exports.getAllUsers = catchAsync(async (req, res, next) => {
    const users = await User.find();

    // SEND RESPONSE
    res.status(200).json({
      status: 'success',
      results: users.length,
      data: {
          users
      }
    });
  })

// exports.getMe = (req, res, next) => {
//   req.params.id = req.user.id;
//   next();
// }
  
exports.updateMe = catchAsync (async (req, res, next) => {
    // Create error if user POSTs password data
    if (req.body.password || req.body.passwordConfirm) {
        return next(new AppError('This route is not for password update. Please use /updateMyPassword', 400));
    }
    // Tager 2 parameter -> Første er req.body, hvilket er det vi vil filtrere. De næste objekter er de objekter fra vores model vi gerne vil opdatere. Resten af de værdier fra vores model, vil blive sorteret fra således at disse ikke kan ændres.
    const filteredBody = filterObj(req.body, 'name', 'email', 'currentScore', 'maxScore');
    // console.log(req.body);

    // update user document
    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, { 
        new: true,
        runValidators: true,
    });

    res.status(200).json({
        status: 'success',
        data: {
            user: updatedUser,
        }
    });
});

exports.deleteMe = catchAsync(async(req, res, next) => {
    await User.findByIdAndUpdate(req.user.id, { active: false });

    res.status(204).json({
        status: 'success',
        data: null,
    });
});

//  exports.createUser = (req, res) => {
//     res.status(500).json({
//       status: 'error',
//       message: 'This route is not yet defined!',
//     });
//   }
  
  exports.getUser = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.user.id);

    if (!user) {
      return next(new AppError('No user found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        user,
      },
    });
  });
  
  // exports.updateUser = (req, res) => {
  //   res.status(500).json({
  //     status: 'error',
  //     message: 'This route is not yet defined!',
  //   });
  // }
  
  // exports.deleteUser = (req, res) => {
  //   res.status(500).json({
  //     status: 'error',
  //     message: 'This route is not yet defined!',
  //   });
  // }