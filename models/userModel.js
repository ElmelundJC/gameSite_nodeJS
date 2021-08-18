const crypto = require('crypto');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const bcrypt = require('bcryptjs');
require('dotenv').config();


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please tell us your name!'],
    },
    email: {
        type: String,
        required: [true, 'Please provide your email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email'],
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 6,
        select: false, // fjerner password fra output
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your password'],
        validate: {
            // Virker kun på CREATE & SAVE!!! (MongoDB)
            validator: function (el) {
                return el === this.password; 
            },
            message: 'Password are not the same!',
        },
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
        type: Boolean,
        default: true,
        select: false,
    },
    currentScore: {
        type: Number,
        default: 0,
    },
    maxScore: {
        type: Number,
        default: 0,
    },
    tokens: [{
        token: {
            type: String,
            required: true,
        }
    }],
});

// Query Middleware
// Mongoose middleware - between getting the data and saving the data
userSchema.pre('save', async function (next) {
    // Kører kun funktionen hvis password er blevet modificeret

    // Hvis password ikke er modificeret return next.
    if (!this.isModified('password')) return next();

    // Hash password med 12 værdier
    this.password = await bcrypt.hash(this.password, 12);

    // Da vi kun skal bruge passwordConfirm til validering sletter vi fielded herefter.
    this.passwordConfirm = undefined;
    next();
});

userSchema.pre('save', function(next) {
    if (!this.isModified('password') || this.isNew) return next();

    this.passwordChangedAt = Date.now() - 1000;
    next();
});

// /^xxx/ reqular expression -> leder efter xxx ord hvorpå vi derved vil sortere alle værdier der ikke har en false værdi ved active.
userSchema.pre(/^find/, function(next) {
    // this point to the current query
    this.find({ active: { $ne: false } });
    next();
});


// Instance method --> tilgængelig på alle documents af en specifik collection dvs. vi nu kan kalde metoden på dokumentet i vores authController.
// returner true hvis passwords er de samme
userSchema.methods.correctPassword = async function(candidatePassword, userPassword){
    return await bcrypt.compare(candidatePassword, userPassword);
}

// Instance method
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
    // Hvis en user har den property 'passwordChangedAt' betyder det at password er blevet ændret 
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
        
        return JWTTimestamp < changedTimestamp;
    }
    // false betyder at password ikke er ændret
    return false;
};

// Instance method
userSchema.methods.createPasswordResetToken = function() {
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

        console.log({ resetToken }, this.passwordResetToken);

    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    console.log(this.passwordResetExpires);
    return resetToken;
};

// removing x from json string upon creating/ getting a user 
userSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();

    delete userObject.password;
    delete userObject.tokens;

    return userObject;
}

userSchema.methods.generateAuthToken = async function () {
    // this === user 
    const token = jwt.sign({ _id: this._id.toString() }, process.env.JWT_SECRET);

    this.tokens = this.tokens.concat({ token });
    await this.save();

    return token;
}


userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({email: email});

    if (!user) {
        throw new Error("Unable to login");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch){
        throw new Error("Unable to login - Password or username is wrong");
    }

    return user;
};

const User = mongoose.model('User', userSchema);

module.exports = User;