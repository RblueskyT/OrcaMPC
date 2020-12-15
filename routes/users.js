const express = require('express');
const session = require('express-session');
const { ensureAuthenticated } = require('../config/login_auth');
const Voting = require('../models/voting');
const router = express.Router();

router.get('/', (req, res) => {
    res.redirect('../login');
});

router.get('/dashboard', ensureAuthenticated, async (req, res) => {
    try{
        const votings = await Voting.find({user: req.user.id}).lean();
        res.render('users/dashboardP', {
            username: req.user.username,
            votings
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

router.get('/logout', (req, res) =>{    
    req.logout();
    req.flash('flash_success_message', 'You logged out sucessfully');
    res.redirect('../login');
});

module.exports = router;