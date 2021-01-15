const express = require('express');
const session = require('express-session');
const { ensureAuthenticated } = require('../config/login_auth');
const Voting = require('../models/voting');
const VotingSession = require('../models/votingSession');
const router = express.Router();

// This part will be splited into groups and topics in the future
router.get('/', ensureAuthenticated, async (req, res) => {
    try {
        const voting = await Voting.find({ status: 'Published' })
            .populate('user')
            .sort({ createTime: 'desc' })
            .lean();
        res.render('voting/viewAllP', {
            avatar: req.user.avatar,
            firstName: req.user.firstName,
            lastName: req.user.lastName,
            email: req.user.email,
            voting,
            title: 'All Published Voting - Orca MPC',
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

// This part will be splited to groups and topics in the future
router.get('/public/:id', ensureAuthenticated, async (req, res) => {
    try {
        let voting = await Voting.findOne({ _id: req.params.id, status: 'Published' })
            .populate('user')
            .populate('participants')
            .lean();

        if (!voting) {
            res.render('errors/error_404', {
                avatar: req.user.avatar,
                firstName: req.user.firstName,
                lastName: req.user.lastName,
                email: req.user.email,
                title: 'ERROR 404 - Orca MPC',
                layout: 'users'
            });
        } else {
            res.render('voting/view0P', {
                avatar: req.user.avatar,
                firstName: req.user.firstName,
                lastName: req.user.lastName,
                email: req.user.email,
                voting,
                title: 'Details of Published Voting - Orca MPC',
                layout: 'users'
            });
        }
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

// Publish the voting
router.get('/publish/:id', ensureAuthenticated, async (req, res) => {

    try {
        let voting = await Voting.findOne({ _id: req.params.id, user: req.user.id, status: 'Unpublished' });

        if (!voting) {
            res.render('errors/error_404', {
                avatar: req.user.avatar,
                firstName: req.user.firstName,
                lastName: req.user.lastName,
                email: req.user.email,
                title: 'ERROR 404 - Orca MPC',
                layout: 'users'
            });
        } else {
            await Voting.updateOne({ _id: req.params.id, status: 'Unpublished' }, { status: 'Published' });
            req.flash('flash_success_message', 'You have successfully published the voting');
            res.redirect('/users/dashboard');
        }
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

// Prepare the voting
router.get('/prepare/:id', ensureAuthenticated, async (req, res) => {

    try {
        let voting = await Voting.findOne({ _id: req.params.id, user: req.user.id, status: 'Published' });

        if (!voting) {
            res.render('errors/error_404', {
                avatar: req.user.avatar,
                firstName: req.user.firstName,
                lastName: req.user.lastName,
                email: req.user.email,
                title: 'ERROR 404 - Orca MPC',
                layout: 'users'
            });
        } else {
            await Voting.updateOne({ _id: req.params.id, status: 'Published' }, { status: 'Prepared' });
            req.flash('flash_success_message', 'You have already consented the voting');
            res.redirect('/users/dashboard');
        }
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

// Register for one specific voting
router.get('/register/:id', ensureAuthenticated, async (req, res) => {

    try {
        let voting = await Voting.findOne({ _id: req.params.id, participants: req.user.id, status: 'Published' });

        if (voting) {
            req.flash('flash_error_message', 'Sorry, you have already registered on the voting');
            res.redirect('/users/dashboard');
        } else {
            await Voting.updateOne({ _id: req.params.id, status: 'Published' }, { $push: { participants: req.user.id } });
            req.flash('flash_success_message', 'You have successfully registered on the voting');
            res.redirect('/users/dashboard');
        }


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

// Attend one specific voting
router.get('/vote/:id', ensureAuthenticated, async (req, res) => {

    try {
        let votingSession = await VotingSession.findOne({ _id: req.params.id, initiator: req.user.id, status: 'Normal' })
            .populate('voting')
            .populate('initiator')
            .populate('submitters')
            .lean();

        if (votingSession) {
            res.render('voting/vote1P', {
                userID: req.user.id,
                avatar: req.user.avatar,
                firstName: req.user.firstName,
                lastName: req.user.lastName,
                email: req.user.email,
                votingSession,
                title: 'Voting Initiator - Orca MPC',
                layout: 'voting'
            });
        } else {
            let votingSession = await VotingSession.findOne({ _id: req.params.id, participants: req.user.id, status: 'Normal' })
                .populate('voting')
                .populate('initiator')
                .lean();

            if (votingSession) {
                res.render('voting/vote2P', {
                    userID: req.user.id,
                    avatar: req.user.avatar,
                    firstName: req.user.firstName,
                    lastName: req.user.lastName,
                    email: req.user.email,
                    votingSession,
                    title: 'Voting participants - Orca MPC',
                    layout: 'voting'
                });
            } else {
                res.render('errors/error_404', {
                    avatar: req.user.avatar,
                    firstName: req.user.firstName,
                    lastName: req.user.lastName,
                    email: req.user.email,
                    title: 'ERROR 404 - Orca MPC',
                    layout: 'users'
                });
            }
        }

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

// Voting Creator
router.get('/create', ensureAuthenticated, (req, res) => {

    res.render('voting/createP', {
        avatar: req.user.avatar,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        email: req.user.email,
        title: 'Voting Creator - Orca MPC',
        layout: 'users'
    });
});

router.post('/create', ensureAuthenticated, async (req, res) => {
    try {
        req.body.user = req.user.id;
        req.body.participants = req.user.id;
        await Voting.create(req.body);
        req.flash('flash_success_message', 'You have successfully create the voting');
        res.redirect('/users/dashboard');
    } catch (err) {
        console.error(err);
    }

});

// Voting session creator (voting initiating)
router.post('/initiate', ensureAuthenticated, async (req, res) => {
    try {
        req.body.initiator = req.user.id;
        await VotingSession.create(req.body);
        await Voting.updateOne({ _id: req.body.voting, user: req.body.initiator, status: 'Prepared' }, { status: 'Initiated' });
        let createdVotingSession = await VotingSession.findOne({initiator: req.body.initiator, voting: req.body.voting}).lean();
        res.redirect('/users/voting/vote/' + createdVotingSession._id);
    } catch (err) {
        console.error(err);
    }

});

// Voting session update
router.post('/others_vote', ensureAuthenticated, async (req, res) => {
    try {
        await VotingSession.updateOne({ _id: req.body.sessionid, participants: req.user.id}, { $push: { submitters: req.user.id } });
        req.flash('flash_success_message', 'You have successfully voted on the voting');
        res.redirect('/users/dashboard');

    } catch (err) {
        console.error(err);
    }

});

// Voting Finish
router.post('/initiator_finish', ensureAuthenticated, async (req, res) => {
    try {
        await VotingSession.updateOne({ _id: req.body.sessionid, voting: req.body.votingid, initiator: req.user.id}, { $push: { submitters: req.user.id }, status: 'Finished' });
        await Voting.updateOne({ _id: req.body.votingid, user: req.user.id}, { result: req.body.result, status: 'Expired' });
        req.flash('flash_success_message', 'You have successfully finished the voting and now you can view the results');
        res.redirect('/users/dashboard');

    } catch (err) {
        console.error(err);
    }

});


// View specific unpublished voting
router.get('/view/unpublished/:id', ensureAuthenticated, async (req, res) => {
    try {
        let voting = await Voting.findOne({ _id: req.params.id, user: req.user.id, status: 'Unpublished' })
            .populate('user')
            .lean();

        if (!voting) {
            res.render('errors/error_404', {
                avatar: req.user.avatar,
                firstName: req.user.firstName,
                lastName: req.user.lastName,
                email: req.user.email,
                title: 'ERROR 404 - Orca MPC',
                layout: 'users'
            });
        } else {
            res.render('voting/view1P', {
                avatar: req.user.avatar,
                firstName: req.user.firstName,
                lastName: req.user.lastName,
                email: req.user.email,
                voting,
                title: 'Details of Unpublished Voting - Orca MPC',
                layout: 'users'
            });
        }
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

// View specific published voting
router.get('/view/published/:id', ensureAuthenticated, async (req, res) => {
    try {
        let voting = await Voting.findOne({ _id: req.params.id, user: req.user.id, status: 'Published' })
            .populate('user')
            .populate('participants')
            .lean();

        if (!voting) {
            res.render('errors/error_404', {
                avatar: req.user.avatar,
                firstName: req.user.firstName,
                lastName: req.user.lastName,
                email: req.user.email,
                title: 'ERROR 404 - Orca MPC',
                layout: 'users'
            });
        } else {
            res.render('voting/view2P', {
                avatar: req.user.avatar,
                firstName: req.user.firstName,
                lastName: req.user.lastName,
                email: req.user.email,
                voting,
                title: 'Details of Published Voting - Orca MPC',
                layout: 'users'
            });
        }
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

// View specific prepared voting
router.get('/view/prepared/:id', ensureAuthenticated, async (req, res) => {
    try {
        let voting = await Voting.findOne({ _id: req.params.id, user: req.user.id, status: 'Prepared' })
            .populate('user')
            .populate('participants')
            .lean();

        if (voting) {
            res.render('voting/view31P', {
                avatar: req.user.avatar,
                firstName: req.user.firstName,
                lastName: req.user.lastName,
                email: req.user.email,
                voting,
                title: 'Managing Prepared Voting - Orca MPC',
                layout: 'voting'
            });
        } else {
            let voting = await Voting.findOne({ _id: req.params.id, participants: req.user.id, status: 'Prepared' })
                .populate('user')
                .populate('participants')
                .lean();

            if (voting) {
                res.render('voting/view32P', {
                    avatar: req.user.avatar,
                    firstName: req.user.firstName,
                    lastName: req.user.lastName,
                    email: req.user.email,
                    voting,
                    title: 'View Prepared Voting - Orca MPC',
                    layout: 'users'
                });
            } else {
                res.render('errors/error_404', {
                    avatar: req.user.avatar,
                    firstName: req.user.firstName,
                    lastName: req.user.lastName,
                    email: req.user.email,
                    title: 'ERROR 404 - Orca MPC',
                    layout: 'users'
                });
            }
        }

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

module.exports = router;