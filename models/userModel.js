const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator')
const bcrypt = require('bcryptjs');

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
        minlength: 8,
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
});

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


const User = mongoose.model('User', userSchema);

module.exports = User;