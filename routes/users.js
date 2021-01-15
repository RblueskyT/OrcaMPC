const express = require('express');
const session = require('express-session');
const { ensureAuthenticated } = require('../config/login_auth');
const Voting = require('../models/voting');
const VotingSession = require('../models/votingSession');
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
        const myVoting2 = await Voting.find({ user: req.user.id, status: 'Published' })
        .sort({createTime: 'desc'})
        .lean();
        const myVoting3 = await Voting.find({ user: req.user.id, status: 'Prepared' })
        .sort({createTime: 'desc'})
        .lean();
        const myVoting4 = await VotingSession.find({ participants: req.user.id, status: 'Normal'})
        .populate('voting')
        .sort({createTime: 'desc'})
        .lean();
        const myVoting5 = await Voting.find({ user: req.user.id, status: 'Expired' })
        .sort({createTime: 'desc'})
        .lean();
        const myVoting6 = await Voting.find({ participants: req.user.id, status: 'Prepared' })
        .sort({createTime: 'desc'})
        .lean();
        res.render('users/dashboardP', {
            avatar: req.user.avatar,
            firstName: req.user.firstName,
            lastName: req.user.lastName,
            email: req.user.email,
            myVoting1,
            myVoting2,
            myVoting3,
            myVoting4,
            myVoting5,
            myVoting6,
            title: req.user.firstName + ', welcome to your dashboard! - Orca MPC',
            layout: 'users'
        });
    } catch (err) {
        console.error(err);
        res.render('errors/error_500', {
            avatar: req.user.avatar,
            firstName: req.user.firstName,
            lastName: req.user.lastName,
            email: req.user.email,
            title: 'ERROR 500 - Orca MPC',
            layout: 'users'
        });
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

// User logout
router.get('/logout', ensureAuthenticated, (req, res) => {
    req.logout();
    req.flash('flash_success_message', 'You have logged out sucessfully');
    res.redirect('../login');
});

module.exports = router;