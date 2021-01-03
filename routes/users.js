const express = require('express');
const session = require('express-session');
const { ensureAuthenticated } = require('../config/login_auth');
const Voting = require('../models/voting');
const router = express.Router();

// No this URL, redirect to login page
router.get('/', (req, res) => {
    req.flash('flash_error_message', 'Please log in to access your service');
    res.redirect('../login');
});

// User dashboard
router.get('/dashboard', ensureAuthenticated, async (req, res) => {
    try {
        const myVoting1 = await Voting.find({ user: req.user.id, status: 'Unpublished' })
        .sort({createTime: 'desc'})
        .lean();
        res.render('users/dashboardP', {
            avatar: req.user.avatar,
            firstName: req.user.firstName,
            lastName: req.user.lastName,
            email: req.user.email,
            myVoting1,
            title: req.user.firstName + ', welcome to your dashboard! - Orca MPC',
            layout: 'users'
        });
    } catch (err) {
        console.error(err);
    }

});

// User personal profile
router.get('/my_profile', ensureAuthenticated, (req, res) => {

        res.render('users/my_profileP', {
            registerTime: req.user.registerTime,
            avatar: req.user.avatar,
            firstName: req.user.firstName,
            lastName: req.user.lastName,
            gender: req.user.gender,
            birthday: req.user.birthday,
            career: req.user.career,
            description: req.user.description,
            email: req.user.email,
            title: 'Profile of ' + req.user.firstName + ' ' + req.user.lastName + ' - Orca MPC',
            layout: 'users'
        });

});


// Test part, it will be deleted
router.get('/voting', ensureAuthenticated, (req, res) => {
    res.render('users/votingP', {
        username: req.user.username,
        layout: 'voting',
    });
});

// User logout
router.get('/logout', ensureAuthenticated, (req, res) => {
    req.logout();
    req.flash('flash_success_message', 'You have logged out sucessfully');
    res.redirect('../login');
});

module.exports = router;