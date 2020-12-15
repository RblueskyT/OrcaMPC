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

router.get('/voting_editor', ensureAuthenticated, (req, res) => {
    res.render('votings/voting_editor', {
        username: req.user.username,
        layout: 'voting',
    });
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