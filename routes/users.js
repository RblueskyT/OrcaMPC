const express = require('express');
const session = require('express-session');
const { ensureAuthenticated } = require('../config/login_auth');
const Voting = require('../models/voting');
const router = express.Router();

router.get('/', (req, res) => {
    req.flash('flash_error_message', 'Please log in to access your service');
    res.redirect('../login');
});

router.get('/dashboard', ensureAuthenticated, async (req, res) => {
    try{
        const myVotings = await Voting.find({user: req.user.id}).lean();
    res.render('users/dashboardP', {
        avatar: req.user.avatar,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        email: req.user.email,
        myVotings,
        title: req.user.firstName + ', welcome to your dashboard! - Orca MPC',
        layout: 'users'
    });
   }catch(err){
       console.error(err);
   }  

});

router.get('/voting', ensureAuthenticated, (req, res) => {
    res.render('users/votingP', {
        username: req.user.username,
        layout: 'voting',
    });
});

router.get('/logout', ensureAuthenticated, (req, res) =>{    
    req.logout();
    req.flash('flash_success_message', 'You have logged out sucessfully');
    res.redirect('../login');
});

module.exports = router;