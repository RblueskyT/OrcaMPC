const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    registerTime: {
        type: Date,
        default: Date.now
    },

    avatar: {
        type: String,
        default: '/assets/images/users/default.jpeg'
    },

    firstName: {
        type: String,
        required: true
    },

    lastName: {
        type: String,
        required: true
    },

    gender: {
        type: String,
        default: 'Secret',
        enum: ['Secret', 'Male', 'Female'],
        required: true
    },

    birthday: {
        type: String
    },

    career: {
        type: String
    },

    description: {
        type: String,
        default: 'I have not decided what to write here ...'
    },

    email: {
        type: String,
        required: true,
        index: { unique: true }
    },

    password: {
        type: String,
        required: true
    }

});

userSchema.pre('save', function (next) {
    var user = this;

    if (!user.isModified('password')) return next();
    bcrypt.genSalt(10, function (err, salt) {
        if (err) return next(err);

        bcrypt.hash(user.password, salt, function (err, hash) {
            if (err) return next(err);
            user.password = hash;
            next();
        });

    });
});

module.exports = mongoose.model('User', userSchema, 'user');