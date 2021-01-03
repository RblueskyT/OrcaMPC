const express = require('express');
const session = require('express-session');
const { ensureAuthenticated } = require('../config/login_auth');
const Voting = require('../models/voting');
const router = express.Router();

router.get('/', ensureAuthenticated, async (req, res) => {
    try{
        const votings = await Voting.find({status: 'published'})
        .populate('user')
        .sort({createTime: 'desc'})
        .lean();
        res.render('votings/voting_index', {
            votings
        });
    }catch(err){
        console.error(err);
    }

});

router.get('/details/:id', ensureAuthenticated, async (req, res) => {
    try{
        let voting = await Voting.findById(req.params.id)
        .populate('user')
        .lean();

        if(!voting){
            // render error page
        }

        res.render('votings/voting_show', {
            voting
        });
    }catch(err){
        console.error(err);
    }

});

router.get('/vote/:id', ensureAuthenticated, async (req, res) => {
    try{
        let voting = await Voting.findById(req.params.id)
        .populate('user')
        .lean();

        if(!voting){
            // render error page
        }

        res.render('votings/voting_vote', {
            username: req.user.username,
            voting,
            layout: 'voting'
        });
    }catch(err){
        console.error(err);
    }

});

// Voting Creator
router.get('/create', ensureAuthenticated, (req, res) => {
    
    res.render('voting/createP', {
        avatar: req.user.avatar,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        email: req.user.email,
        title: 'Voting Creator - Orca MPC',
        layout: 'users',
    });
});

router.post('/create', ensureAuthenticated, async (req, res) => {
    try{
        req.body.user=req.user.id;
        req.body.participants=req.user.id;
        req.flash('flash_success_message', 'You have successfully create the voting');
        await Voting.create(req.body);
        res.redirect('/users/dashboard');
    }catch(err){
        console.error(err);
    }

});

router.post('/voting_editor', ensureAuthenticated, async (req, res) => {
    try{
        req.body.user=req.user.id;
        await Voting.create(req.body);
        res.redirect('/users/dashboard');
    }catch(err){
        console.error(err);
    }

});


module.exports = router;