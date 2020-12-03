const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    RegisterTime: {
        type: Date,
        default: Date.now
    },

    username: {
        type: String,
        required: true,
        index: {unique: true}
    },

    email: {
        type: String,
        required: true,
        index: {unique: true}
    },

    password: {
        type: String,
        required: true
    }

});

userSchema.pre('save', function(next){
    var user = this;

    if(!user.isModified('password')) return next();
    bcrypt.genSalt(10, function(err, salt){
        if(err) return next(err);

        bcrypt.hash(user.password, salt, function(err, hash){
            if(err) return next(err);
            user.password = hash;
            next();
        });

    });
});

module.exports = mongoose.model('User', userSchema, 'user');