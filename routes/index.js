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
    try {
        await User.create(req.body);
        res.redirect('/login');

    } catch {
        console.error(err);
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