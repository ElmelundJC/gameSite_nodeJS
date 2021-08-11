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
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 8,
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your password'],
        validate: {
            // Virker kun på CREATE & SAVE!!! (MongoDB)
            validator: function(el) {
                return el === this.password; 
            },
            message: 'Password are not the same!',
        },
    },
});

// Mongoose middleware - between getting the data and saving the data
userSchema.pre('save', async function(next){
    // Kører kun funktionen hvis password er blevet modificeret

    // Hvis password ikke er modificeret return next.
    if (!this.isModified('password')) return next();

    // Hash password med 12 værdier
    this.password = await bcrypt.hash(this.password, 12);

    // Da vi kun skal bruge passwordConfirm til validering sletter vi fielded herefter.
    this.passwordConfirm = undefined;
    next();
});


const User = mongoose.model('User', userSchema);

module.exports = User;