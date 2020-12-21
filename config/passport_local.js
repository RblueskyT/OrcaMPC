const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Load user model
const User = require('../models/user');

module.exports = function (passport) {
    passport.use(
        new LocalStrategy({ usernameField: 'email', passReqToCallback: true }, (req, email, password, done) => {
            // Find user
            User.findOne({ email: email })
                .then(user => {
                    if (!user) {
                        return done(null, false, req.flash('flash_error_message', 'No such user exists or incorrect password'));
                    }

                    // Compare password
                    bcrypt.compare(password, user.password, (err, isMatch) => {
                        if (err) throw err;
                        if (isMatch) {
                            return done(null, user);
                        } else {
                            return done(null, false, req.flash('flash_error_message', 'No such user exists or incorrect password'));
                        }
                    });
                })
                .catch(err => console.log(err));

        })

    );

    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });

    });
}