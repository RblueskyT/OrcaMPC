const express = require('express');
const passport = require('passport');
const router = express.Router();
const User = require('../models/user');

// Index Page
router.get('/', (req, res) => {
    res.render('index/indexP');
});

// Register Page
router.get('/register', (req, res) => {
    res.render('index/registerP');
});

// Login page
router.get('/login', (req, res) => {
    res.render('index/loginP');
});

// Register: handle user inputs
router.post('/register', async (req, res) => {
    const result = await User.findOne({ email: req.body.email }).select("email").lean();
    if (result) {
        req.flash('flash_error_message', 'Sorry, this email address has already been registered');
        res.redirect('/register');
    } else {
        await User.create(req.body);
        req.flash('flash_success_message', 'You have signed up successfully, please log in');
        res.redirect('/login');
    }
});

// Login: handle user inputs
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/users/dashboard',
        failureRedirect: '/login',
        failureFlash: true
    })(req, res, next)

});

module.exports = router;