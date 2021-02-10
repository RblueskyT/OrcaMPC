const express = require('express');
const session = require('express-session');
const { ensureAuthenticated } = require('../config/login_auth');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const Message = require('../models/message');
const Voting = require('../models/voting');
const VotingSession = require('../models/votingSession');
const router = express.Router();

/* Unpublished Voting */

// Manage all unpublished voting
router.get('/unpublished', ensureAuthenticated, async (req, res) => {

    try {

        var newMessages;
        var newNotifications;
        const myVoting = await Voting.find({ user: req.user.id, status: 'Unpublished' })
            .sort({ createTime: 'desc' })
            .lean();

        await Message.countDocuments({ receiver: req.user.id, messageLabel: 'Message', status: 'Unread' }, function (err, count) {
            if (err) {
                newMessages = 0;
            } else {
                newMessages = count;
            }
        });

        await Message.countDocuments({ receiver: req.user.id, messageLabel: 'Notification', status: 'Unread' }, function (err, count) {
            if (err) {
                newNotifications = 0;
            } else {
                newNotifications = count;
            }
        });

        res.render('voting/viewAll1P', {
            avatar: req.user.avatar,
            firstName: req.user.firstName,
            lastName: req.user.lastName,
            email: req.user.email,
            newMessages,
            newNotifications,
            myVoting,
            title: 'Unpublished Voting of ' + req.user.firstName + ' ' + req.user.lastName + ' - Orca MPC',
            layout: 'users'
        });

    } catch (err) {

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

// Create new voting - Voting Creator
router.get('/unpublished/create', ensureAuthenticated, async (req, res) => {

    try {

        var newMessages;
        var newNotifications;

        await Message.countDocuments({ receiver: req.user.id, messageLabel: 'Message', status: 'Unread' }, function (err, count) {
            if (err) {
                newMessages = 0;
            } else {
                newMessages = count;
            }
        });

        await Message.countDocuments({ receiver: req.user.id, messageLabel: 'Notification', status: 'Unread' }, function (err, count) {
            if (err) {
                newNotifications = 0;
            } else {
                newNotifications = count;
            }
        });

        res.render('voting/createP', {
            avatar: req.user.avatar,
            firstName: req.user.firstName,
            lastName: req.user.lastName,
            email: req.user.email,
            newMessages,
            newNotifications,
            title: req.user.firstName + ' ' + req.user.lastName + ' / Create: Voting - Orca MPC',
            layout: 'users'
        });

    } catch (err) {

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

router.post('/unpublished/create', ensureAuthenticated, async (req, res) => {

    try {

        req.body.user = req.user.id;
        req.body.participants = req.user.id;
        await Voting.create(req.body);
        req.flash('flash_success_message', 'You have successfully created the voting');
        res.redirect('/users/voting/unpublished');

    } catch (err) {

        req.flash('flash_error_message', 'Sorry, an unknown error occurred');
        res.redirect('/users/voting/unpublished');

    }

});

// View specific unpublished voting
router.get('/unpublished/view/:id', ensureAuthenticated, async (req, res) => {

    try {

        var newMessages;
        var newNotifications;

        await Message.countDocuments({ receiver: req.user.id, messageLabel: 'Message', status: 'Unread' }, function (err, count) {
            if (err) {
                newMessages = 0;
            } else {
                newMessages = count;
            }
        });

        await Message.countDocuments({ receiver: req.user.id, messageLabel: 'Notification', status: 'Unread' }, function (err, count) {
            if (err) {
                newNotifications = 0;
            } else {
                newNotifications = count;
            }
        });

        let voting = await Voting.findOne({ _id: req.params.id, user: req.user.id, status: 'Unpublished' })
            .populate('user')
            .lean();

        if (!voting) {

            res.render('errors/error_404', {
                avatar: req.user.avatar,
                firstName: req.user.firstName,
                lastName: req.user.lastName,
                email: req.user.email,
                newMessages,
                newNotifications,
                title: 'ERROR 404 - Orca MPC',
                layout: 'users'
            });

        } else {

            res.render('voting/view1P', {
                avatar: req.user.avatar,
                firstName: req.user.firstName,
                lastName: req.user.lastName,
                email: req.user.email,
                newMessages,
                newNotifications,
                voting,
                title: req.user.firstName + ' ' + req.user.lastName + ' / View: ' + voting.votingTitle + ' - Orca MPC',
                layout: 'users'
            });

        }
    } catch (err) {

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

// Edit specific unpublished voting
router.get('/unpublished/edit/:id', ensureAuthenticated, async (req, res) => {

    try {

        var newMessages;
        var newNotifications;

        await Message.countDocuments({ receiver: req.user.id, messageLabel: 'Message', status: 'Unread' }, function (err, count) {
            if (err) {
                newMessages = 0;
            } else {
                newMessages = count;
            }
        });

        await Message.countDocuments({ receiver: req.user.id, messageLabel: 'Notification', status: 'Unread' }, function (err, count) {
            if (err) {
                newNotifications = 0;
            } else {
                newNotifications = count;
            }
        });

        let voting = await Voting.findOne({ _id: req.params.id, user: req.user.id, status: 'Unpublished' })
            .lean();

        if (!voting) {

            res.render('errors/error_404', {
                avatar: req.user.avatar,
                firstName: req.user.firstName,
                lastName: req.user.lastName,
                email: req.user.email,
                newMessages,
                newNotifications,
                title: 'ERROR 404 - Orca MPC',
                layout: 'users'
            });

        } else {

            res.render('voting/edit1P', {
                avatar: req.user.avatar,
                firstName: req.user.firstName,
                lastName: req.user.lastName,
                email: req.user.email,
                newMessages,
                newNotifications,
                voting,
                title: req.user.firstName + ' ' + req.user.lastName + ' / Edit: ' + voting.votingTitle + ' - Orca MPC',
                layout: 'users'
            });

        }
    } catch (err) {

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

router.post('/unpublished/edit', ensureAuthenticated, async (req, res) => {

    try {

        let voting = await Voting.findOne({ _id: req.body.votingid, user: req.user.id, status: 'Unpublished' })
            .lean();

        if (!voting) {

            req.flash('flash_error_message', 'Sorry, this voting is not existing');
            res.redirect('/users/voting/unpublished');

        } else {

            await Voting.updateOne({ _id: req.body.votingid, user: req.user.id, status: 'Unpublished' }, req.body);
            req.flash('flash_success_message', 'You have successfully updated this voting');
            res.redirect('/users/voting/unpublished/view/' + req.body.votingid);

        }

    } catch (err) {

        req.flash('flash_error_message', 'Sorry, an unknown error occurred');
        res.redirect('/users/voting/unpublished');

    }

});

// Delete specific unpublished voting
router.post('/unpublished/delete', ensureAuthenticated, async (req, res) => {

    try {

        let voting = await Voting.findOne({ _id: req.body.votingid, user: req.user.id, status: 'Unpublished' })
            .lean();

        if (!voting) {

            req.flash('flash_error_message', 'Sorry, this voting is not existing');
            res.redirect('/users/voting/unpublished');

        } else {

            await Voting.deleteOne({ _id: req.body.votingid, user: req.user.id, status: 'Unpublished' });
            req.flash('flash_success_message', 'You have successfully deleted the voting');
            res.redirect('/users/voting/unpublished');

        }

    } catch (err) {

        req.flash('flash_error_message', 'Sorry, an unknown error occurred');
        res.redirect('/users/voting/unpublished');

    }

});

// Publish specific unpublished voting
router.post('/unpublished/publish', ensureAuthenticated, async (req, res) => {

    try {

        let voting = await Voting.findOne({ _id: req.body.votingid, user: req.user.id, status: 'Unpublished' })
            .lean();

        if (!voting) {

            req.flash('flash_error_message', 'Sorry, this voting is not existing');
            res.redirect('/users/voting/unpublished');

        } else {

            await Voting.updateOne({ _id: req.body.votingid, user: req.user.id, status: 'Unpublished' }, { status: 'Published' });
            req.flash('flash_success_message', 'You have successfully published the voting');
            res.redirect('/users/voting/published');

        }

    } catch (err) {

        req.flash('flash_error_message', 'Sorry, an unknown error occurred');
        res.redirect('/users/voting/unpublished');

    }

});

/* Published Voting */

// Manage all published voting
router.get('/published', ensureAuthenticated, async (req, res) => {

    try {

        var newMessages;
        var newNotifications;
        const myVoting1 = await Voting.find({ user: req.user.id, status: 'Published' })
            .sort({ createTime: 'desc' })
            .lean();

        const myVoting2 = await Voting.find({ user: { $ne: req.user.id }, participants: req.user.id, status: 'Published' })
            .sort({ createTime: 'desc' })
            .lean();

        await Message.countDocuments({ receiver: req.user.id, messageLabel: 'Message', status: 'Unread' }, function (err, count) {
            if (err) {
                newMessages = 0;
            } else {
                newMessages = count;
            }
        });

        await Message.countDocuments({ receiver: req.user.id, messageLabel: 'Notification', status: 'Unread' }, function (err, count) {
            if (err) {
                newNotifications = 0;
            } else {
                newNotifications = count;
            }
        });

        res.render('voting/viewAll2P', {
            avatar: req.user.avatar,
            firstName: req.user.firstName,
            lastName: req.user.lastName,
            email: req.user.email,
            newMessages,
            newNotifications,
            myVoting1,
            myVoting2,
            title: 'Published Voting of ' + req.user.firstName + ' ' + req.user.lastName + ' - Orca MPC',
            layout: 'users'
        });

    } catch (err) {

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
router.get('/published/view/:id', ensureAuthenticated, async (req, res) => {

    try {

        var newMessages;
        var newNotifications;

        await Message.countDocuments({ receiver: req.user.id, messageLabel: 'Message', status: 'Unread' }, function (err, count) {
            if (err) {
                newMessages = 0;
            } else {
                newMessages = count;
            }
        });

        await Message.countDocuments({ receiver: req.user.id, messageLabel: 'Notification', status: 'Unread' }, function (err, count) {
            if (err) {
                newNotifications = 0;
            } else {
                newNotifications = count;
            }
        });

        let voting = await Voting.findOne({ _id: req.params.id, user: req.user.id, status: 'Published' })
            .populate('user')
            .populate('participants')
            .lean();

        if (!voting) {

            let voting = await Voting.findOne({ _id: req.params.id, status: 'Published' })
                .populate('user')
                .populate('participants')
                .lean();

            res.render('voting/view22P', {
                userID: req.user.id,
                avatar: req.user.avatar,
                firstName: req.user.firstName,
                lastName: req.user.lastName,
                email: req.user.email,
                newMessages,
                newNotifications,
                voting,
                title: req.user.firstName + ' ' + req.user.lastName + ' / View: ' + voting.votingTitle + ' - Orca MPC',
                layout: 'users'
            });

        } else {

            res.render('voting/view21P', {
                avatar: req.user.avatar,
                firstName: req.user.firstName,
                lastName: req.user.lastName,
                email: req.user.email,
                newMessages,
                newNotifications,
                voting,
                title: req.user.firstName + ' ' + req.user.lastName + ' / View: ' + voting.votingTitle + ' - Orca MPC',
                layout: 'users'
            });

        }

    } catch (err) {

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

// Edit specific published voting
router.get('/published/edit/:id', ensureAuthenticated, async (req, res) => {

    try {

        var newMessages;
        var newNotifications;

        await Message.countDocuments({ receiver: req.user.id, messageLabel: 'Message', status: 'Unread' }, function (err, count) {
            if (err) {
                newMessages = 0;
            } else {
                newMessages = count;
            }
        });

        await Message.countDocuments({ receiver: req.user.id, messageLabel: 'Notification', status: 'Unread' }, function (err, count) {
            if (err) {
                newNotifications = 0;
            } else {
                newNotifications = count;
            }
        });

        let voting = await Voting.findOne({ _id: req.params.id, user: req.user.id, status: 'Published' })
            .lean();

        if (!voting) {

            res.render('errors/error_404', {
                avatar: req.user.avatar,
                firstName: req.user.firstName,
                lastName: req.user.lastName,
                email: req.user.email,
                newMessages,
                newNotifications,
                title: 'ERROR 404 - Orca MPC',
                layout: 'users'
            });

        } else {

            res.render('voting/edit2P', {
                avatar: req.user.avatar,
                firstName: req.user.firstName,
                lastName: req.user.lastName,
                email: req.user.email,
                newMessages,
                newNotifications,
                voting,
                title: req.user.firstName + ' ' + req.user.lastName + ' / Edit: ' + voting.votingTitle + ' - Orca MPC',
                layout: 'users'
            });

        }
    } catch (err) {

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

router.post('/published/edit', ensureAuthenticated, async (req, res) => {

    try {

        let voting = await Voting.findOne({ _id: req.body.votingid, user: req.user.id, status: 'Published' })
            .lean();

        if (!voting) {

            req.flash('flash_error_message', 'Sorry, this voting is not existing');
            res.redirect('/users/voting/published');

        } else {

            await Voting.updateOne({ _id: req.body.votingid, user: req.user.id, status: 'Published' }, req.body);
            req.flash('flash_success_message', 'You have successfully updated this voting');
            res.redirect('/users/voting/published/view/' + req.body.votingid);

        }

    } catch (err) {

        req.flash('flash_error_message', 'Sorry, an unknown error occurred');
        res.redirect('/users/voting/published');

    }

});

// Remove a registrant in a specific published voting
router.post('/published/remove', ensureAuthenticated, async (req, res) => {

    try {

        let voting = await Voting.findOne({ _id: req.body.votingid, user: req.user.id, status: 'Published' })
            .lean();

        if (!voting) {

            req.flash('flash_error_message', 'Sorry, this voting is not existing');
            res.redirect('/users/voting/published');

        } else {

            var creator = await User.findOne({ _id: req.user.id });
            const pwdMatch = await bcrypt.compare(req.body.password, creator.password);

            if (pwdMatch) {

                await Message.create({
                    sender: req.user.id,
                    receiver: req.body.regid,
                    content: 'You have been removed from the voting: ' + voting.votingTitle + '.',
                    relatedVoting: req.body.votingid
                });
                await Voting.updateOne({ _id: req.body.votingid, user: req.user.id, status: 'Published' }, { $pullAll: { participants: [req.body.regid] } });
                req.flash('flash_success_message', 'You have successfully removed the registrant');
                res.redirect('/users/voting/published/view/' + req.body.votingid);

            } else {

                req.flash('flash_error_message', 'Sorry, you cannot remove this registrant because of the incorrect password');
                res.redirect('/users/voting/published/view/' + req.body.votingid);

            }

        }

    } catch (err) {

        req.flash('flash_error_message', 'Sorry, an unknown error occurred');
        res.redirect('/users/voting/published');

    }

});

// Cancel a specific published Voting
router.post('/published/cancel', ensureAuthenticated, async (req, res) => {

    try {

        let voting = await Voting.findOne({ _id: req.body.votingid, user: req.user.id, status: 'Published' })
            .populate('participants')
            .lean();

        if (!voting) {

            req.flash('flash_error_message', 'Sorry, this voting is not existing');
            res.redirect('/users/voting/published');

        } else {

            var creator = await User.findOne({ _id: req.user.id });
            const pwdMatch = await bcrypt.compare(req.body.password, creator.password);

            if (pwdMatch) {

                if (voting.participants.length > 1) {
                    for (var i = 1; i < voting.participants.length; i++) {
                        await Message.create({
                            sender: req.user.id,
                            receiver: voting.participants[i]._id,
                            content: 'Sorry, the published voting "' + voting.votingTitle + '" that you registered has been cancelled.',
                            relatedVoting: req.body.votingid
                        });
                    }
                }
                await Voting.updateOne({ _id: req.body.votingid, user: req.user.id, status: 'Published' }, { participants: req.user.id, status: 'Unpublished' });
                req.flash('flash_success_message', 'You have successfully canceled the voting');
                res.redirect('/users/voting/unpublished');

            } else {

                req.flash('flash_error_message', 'Sorry, you cannot cancel this voting because of the incorrect password');
                res.redirect('/users/voting/published/view/' + req.body.votingid);

            }

        }

    } catch (err) {

        req.flash('flash_error_message', 'Sorry, an unknown error occurred');
        res.redirect('/users/voting/published');

    }

});

// Consent a specific published voting
router.post('/published/consent', ensureAuthenticated, async (req, res) => {

    try {

        let voting = await Voting.findOne({ _id: req.body.votingid, user: req.user.id, status: 'Published' })
            .populate('participants')
            .lean();

        if (!voting) {

            req.flash('flash_error_message', 'Sorry, this voting is not existing');
            res.redirect('/users/voting/published');

        } else {

            var creator = await User.findOne({ _id: req.user.id });
            const pwdMatch = await bcrypt.compare(req.body.password, creator.password);

            if (pwdMatch) {

                if (voting.participants.length > 1) {
                    for (var i = 1; i < voting.participants.length; i++) {
                        await Message.create({
                            sender: req.user.id,
                            receiver: voting.participants[i]._id,
                            content: 'Your registration for the voting "' + voting.votingTitle + '" has been consented and now the voting is in preparation.',
                            relatedVoting: req.body.votingid
                        });
                    }
                }
                await Voting.updateOne({ _id: req.body.votingid, user: req.user.id, status: 'Published' }, { status: 'Preparing' });
                req.flash('flash_success_message', 'You have successfully consented the voting, now you can prepare the voting for all registrants');
                res.redirect('/users/voting/preparing');

            } else {

                req.flash('flash_error_message', 'Sorry, you cannot consent this voting because of the incorrect password');
                res.redirect('/users/voting/published/view/' + req.body.votingid);

            }

        }

    } catch (err) {

        req.flash('flash_error_message', 'Sorry, an unknown error occurred');
        res.redirect('/users/voting/published');

    }

});

// Unregister a specifc published voting
router.post('/published/unregister', ensureAuthenticated, async (req, res) => {

    try {

        let voting = await Voting.findOne({ _id: req.body.votingid, participants: req.user.id, status: 'Published' })
            .populate('user')
            .lean();

        if (!voting) {

            req.flash('flash_error_message', 'Sorry, this voting is not existing');
            res.redirect('/users/voting/published');

        } else {

            const registrant = await User.findOne({ _id: req.user.id });
            const pwdMatch = await bcrypt.compare(req.body.password, registrant.password);

            if (pwdMatch) {

                await Message.create({
                    sender: req.user.id,
                    receiver: voting.user._id,
                    content: req.user.firstName + ' ' + req.user.lastName + ' has unregistered for the voting: ' + voting.votingTitle + '.',
                    relatedVoting: req.body.votingid
                });
                await Voting.updateOne({ _id: req.body.votingid, participants: req.user.id, status: 'Published' }, { $pullAll: { participants: [req.user.id] } });
                req.flash('flash_success_message', 'You have successfully unregistered for this voting');
                res.redirect('/users/voting/published/view/' + req.body.votingid);

            } else {

                req.flash('flash_error_message', 'Sorry, you cannot unregister this voting because of the incorrect password');
                res.redirect('/users/voting/published/view/' + req.body.votingid);

            }

        }

    } catch (err) {

        req.flash('flash_error_message', 'Sorry, an unknown error occurred');
        res.redirect('/users/voting/published');

    }

});

// Register a specific published voting
router.post('/published/register', ensureAuthenticated, async (req, res) => {

    try {

        let voting = await Voting.findOne({ _id: req.body.votingid, participants: req.user.id, status: 'Published' })
            .lean();

        if (!voting) {

            let voting = await Voting.findOne({ _id: req.body.votingid, status: 'Published' })
                .populate('user')
                .lean();
            const registrant = await User.findOne({ _id: req.user.id });
            const pwdMatch = await bcrypt.compare(req.body.password, registrant.password);

            if (pwdMatch) {

                await Message.create({
                    sender: req.user.id,
                    receiver: voting.user._id,
                    content: req.user.firstName + ' ' + req.user.lastName + ' has registered for the voting: ' + voting.votingTitle + '.',
                    relatedVoting: req.body.votingid
                });
                await Voting.updateOne({ _id: req.body.votingid, status: 'Published' }, { $push: { participants: req.user.id } });
                req.flash('flash_success_message', 'You have successfully registered for this voting');
                res.redirect('/users/voting/published/view/' + req.body.votingid);

            } else {

                req.flash('flash_error_message', 'Sorry, you cannot register this voting because of the incorrect password');
                res.redirect('/users/voting/published/view/' + req.body.votingid);

            }

        } else {

            req.flash('flash_error_message', 'Sorry, you have already registered this voting');
            res.redirect('/users/voting/published/view/' + req.body.votingid);

        }

    } catch (err) {

        req.flash('flash_error_message', 'Sorry, an unknown error occurred');
        res.redirect('/users/voting/published');

    }

});

/* Preparing Voting (Voting in preparation) */

// Manage all voting in preparation
router.get('/preparing', ensureAuthenticated, async (req, res) => {

    try {

        var newMessages;
        var newNotifications;
        const myVoting1 = await Voting.find({ user: req.user.id, status: 'Preparing' })
            .sort({ createTime: 'desc' })
            .lean();

        const myVoting2 = await Voting.find({ user: { $ne: req.user.id }, participants: req.user.id, status: 'Preparing' })
            .sort({ createTime: 'desc' })
            .lean();

        await Message.countDocuments({ receiver: req.user.id, messageLabel: 'Message', status: 'Unread' }, function (err, count) {
            if (err) {
                newMessages = 0;
            } else {
                newMessages = count;
            }
        });

        await Message.countDocuments({ receiver: req.user.id, messageLabel: 'Notification', status: 'Unread' }, function (err, count) {
            if (err) {
                newNotifications = 0;
            } else {
                newNotifications = count;
            }
        });

        res.render('voting/viewAll3P', {
            avatar: req.user.avatar,
            firstName: req.user.firstName,
            lastName: req.user.lastName,
            email: req.user.email,
            newMessages,
            newNotifications,
            myVoting1,
            myVoting2,
            title: 'Voting in Preparation of ' + req.user.firstName + ' ' + req.user.lastName + ' - Orca MPC',
            layout: 'users'
        });

    } catch (err) {

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

// View specific preparing voting
router.get('/preparing/view/:id', ensureAuthenticated, async (req, res) => {

    try {

        var newMessages;
        var newNotifications;

        await Message.countDocuments({ receiver: req.user.id, messageLabel: 'Message', status: 'Unread' }, function (err, count) {
            if (err) {
                newMessages = 0;
            } else {
                newMessages = count;
            }
        });

        await Message.countDocuments({ receiver: req.user.id, messageLabel: 'Notification', status: 'Unread' }, function (err, count) {
            if (err) {
                newNotifications = 0;
            } else {
                newNotifications = count;
            }
        });

        let voting = await Voting.findOne({ _id: req.params.id, user: req.user.id, status: 'Preparing' })
            .populate('user')
            .populate('participants')
            .lean();

        if (!voting) {

            let voting = await Voting.findOne({ _id: req.params.id, participants: req.user.id, status: 'Preparing' })
                .populate('user')
                .populate('participants')
                .lean();

            if (!voting) {

                res.render('errors/error_404', {
                    avatar: req.user.avatar,
                    firstName: req.user.firstName,
                    lastName: req.user.lastName,
                    email: req.user.email,
                    newMessages,
                    newNotifications,
                    title: 'ERROR 404 - Orca MPC',
                    layout: 'users'
                });

            } else {

                let votingsession = await VotingSession.findOne({ voting: req.params.id, participants: req.user.id })
                    .lean();

                res.render('voting/view32P', {
                    userID: req.user.id,
                    avatar: req.user.avatar,
                    firstName: req.user.firstName,
                    lastName: req.user.lastName,
                    email: req.user.email,
                    newMessages,
                    newNotifications,
                    voting,
                    votingsession,
                    title: req.user.firstName + ' ' + req.user.lastName + ' / View: ' + voting.votingTitle + ' - Orca MPC',
                    layout: 'users'
                });

            }


        } else {

            let votingsession = await VotingSession.findOne({ initiator: req.user.id, voting: req.params.id })
                .lean();

            res.render('voting/view31P', {
                avatar: req.user.avatar,
                firstName: req.user.firstName,
                lastName: req.user.lastName,
                email: req.user.email,
                newMessages,
                newNotifications,
                voting,
                votingsession,
                title: req.user.firstName + ' ' + req.user.lastName + ' / View: ' + voting.votingTitle + ' - Orca MPC',
                layout: 'voting'
            });

        }

    } catch (err) {

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

// Configure a voting session for a specific voting
router.post('/preparing/configure', ensureAuthenticated, async (req, res) => {

    try {

        let votingsession = await VotingSession.findOne({ initiator: req.user.id, voting: req.body.voting })
            .lean();

        if (!votingsession) {

            const initiator = await User.findOne({ _id: req.user.id });
            const pwdMatch = await bcrypt.compare(req.body.password, initiator.password);

            if (pwdMatch) {

                await VotingSession.create({
                    initiator: req.user.id,
                    voting: req.body.voting,
                    publicKey: req.body.publicKey,
                    privateKey: req.body.privateKey,
                    token: req.body.token,
                    participants: req.body.participants,
                    confirmAttendance: req.user.id
                });

                let votingsession = await VotingSession.findOne({ initiator: req.user.id, voting: req.body.voting })
                    .populate('voting')
                    .populate('participants')
                    .lean();

                for (var i = 0; i < votingsession.participants.length; i++) {
                    await Message.create({
                        sender: req.user.id,
                        receiver: votingsession.participants[i]._id,
                        content: 'The initiator of the voting "' + votingsession.voting.votingTitle
                            + '" has already configured the voting session, please click the button bellow to go to confirm your attendence. Other Information about this voting: '
                            + req.body.notification + '. In addition, the token used for attending the voting session is "'
                            + req.body.token + '", please do not tell this token to anyone else.',
                        relatedVoting: req.body.voting,
                        messageLabel: 'Notification'
                    });
                }

                req.flash('flash_success_message', 'You have successfully configured the voting session, please wait for other users to confirm their attendance');
                res.redirect('/users/voting/preparing/view/' + req.body.voting);

            } else {

                req.flash('flash_error_message', 'Sorry, you cannot configure the voting session because of the incorrect password');
                res.redirect('/users/voting/preparing/view/' + req.body.voting);

            }

        } else {

            req.flash('flash_error_message', 'Sorry, you have already configured the voting session');
            res.redirect('/users/voting/preparing/view/' + req.body.voting);

        }

    } catch (err) {

        req.flash('flash_error_message', 'Sorry, an unknown error occurred');
        res.redirect('/users/voting/preparing');

    }

});

// Cancel a specific preparing voting
router.post('/preparing/cancel', ensureAuthenticated, async (req, res) => {

    try {

        let voting = await Voting.findOne({ _id: req.body.votingid, user: req.user.id, status: 'Preparing' })
            .populate('participants')
            .lean();

        if (!voting) {

            req.flash('flash_error_message', 'Sorry, this voting is not existing');
            res.redirect('/users/voting/preparing');

        } else {

            var creator = await User.findOne({ _id: req.user.id });
            const pwdMatch = await bcrypt.compare(req.body.password, creator.password);

            if (pwdMatch) {

                let votingsession = await VotingSession.findOne({ initiator: req.user.id, voting: req.body.votingid })
                    .lean();

                if (voting.participants.length > 1) {
                    for (var i = 1; i < voting.participants.length; i++) {
                        await Message.create({
                            sender: req.user.id,
                            receiver: voting.participants[i]._id,
                            content: 'Sorry, the voting in preparation "' + voting.votingTitle
                                + '" that you participated has been cancelled by the creator. The reasons are as follows: '
                                + req.body.cancelreason + '.',
                            relatedVoting: req.body.votingid
                        });
                    }
                }
                await Message.updateMany({relatedVoting: {$in: [req.body.votingid]}, messageLabel: {$in: ['Notification']}}, {$set: {status: 'Read'}});
                await Voting.updateOne({ _id: req.body.votingid, user: req.user.id, status: 'Preparing' }, { participants: req.user.id, status: 'Unpublished' });

                if (votingsession) {
                    await VotingSession.deleteOne({ initiator: req.user.id, voting: req.body.votingid });
                }

                req.flash('flash_success_message', 'You have successfully canceled the voting');
                res.redirect('/users/voting/unpublished');

            } else {

                req.flash('flash_error_message', 'Sorry, you cannot cancel this voting because of the incorrect password');
                res.redirect('/users/voting/preparing/view/' + req.body.votingid);

            }

        }

    } catch (err) {

        req.flash('flash_error_message', 'Sorry, an unknown error occurred');
        res.redirect('/users/voting/preparing');

    }

});

// Confirm Attendance for a specific preparing voting
router.post('/preparing/confirmattandence', ensureAuthenticated, async (req, res) => {

    try {

        let votingsession = await VotingSession.findOne({ _id: req.body.sessionid, participants: req.user.id })
            .lean();

        if (!votingsession) {

            req.flash('flash_error_message', 'Sorry, you cannot confirm the attendance for this voting');
            res.redirect('/users/voting/preparing');

        } else {

            let votingsession = await VotingSession.findOne({ _id: req.body.sessionid, participants: req.user.id, confirmAttendance: req.user.id })
                .lean();

            if (!votingsession) {

                const confirmuser = await User.findOne({ _id: req.user.id });
                const pwdMatch = await bcrypt.compare(req.body.password, confirmuser.password);

                if (pwdMatch) {

                    let voting = await Voting.findOne({ _id: req.body.votingid, participants: req.user.id, status: 'Preparing' })
                        .populate('user')
                        .lean();

                    await Message.create({
                        sender: req.user.id,
                        receiver: voting.user._id,
                        content: req.user.firstName + ' ' + req.user.lastName + ' has confirmed the attendance for the voting: ' + voting.votingTitle + '.',
                        relatedVoting: req.body.votingid
                    });
                    await VotingSession.updateOne({ _id: req.body.sessionid, participants: req.user.id, status: 'Initialized' }, { $push: { confirmAttendance: req.user.id } });

                    req.flash('flash_success_message', 'You have successfully confirmed your attendance, please wait for the creator to initiate the voting session');
                    res.redirect('/users/voting/preparing/view/' + req.body.votingid);

                } else {

                    req.flash('flash_error_message', 'Sorry, you cannot confirm your attendance because of the incorrect password');
                    res.redirect('/users/voting/preparing/view/' + req.body.votingid);

                }

            } else {

                req.flash('flash_error_message', 'Sorry, you have already confirmed the attendance for this voting');
                res.redirect('/users/voting/preparing/view/' + req.body.votingid);

            }

        }

    } catch (err) {

        req.flash('flash_error_message', 'Sorry, an unknown error occurred');
        res.redirect('/users/voting/preparing');

    }

});

/* All following parts will be modified  */

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

// Voting session creator (voting initiating)
router.post('/initiate', ensureAuthenticated, async (req, res) => {
    try {
        req.body.initiator = req.user.id;
        await VotingSession.create(req.body);
        await Voting.updateOne({ _id: req.body.voting, user: req.body.initiator, status: 'Prepared' }, { status: 'Initiated' });
        let createdVotingSession = await VotingSession.findOne({ initiator: req.body.initiator, voting: req.body.voting }).lean();
        res.redirect('/users/voting/vote/' + createdVotingSession._id);
    } catch (err) {
        console.error(err);
    }

});

// Voting session update
router.post('/others_vote', ensureAuthenticated, async (req, res) => {
    try {
        await VotingSession.updateOne({ _id: req.body.sessionid, participants: req.user.id }, { $push: { submitters: req.user.id } });
        req.flash('flash_success_message', 'You have successfully voted on the voting');
        res.redirect('/users/dashboard');

    } catch (err) {
        console.error(err);
    }

});

// Voting Finish
router.post('/initiator_finish', ensureAuthenticated, async (req, res) => {
    try {
        await VotingSession.updateOne({ _id: req.body.sessionid, voting: req.body.votingid, initiator: req.user.id }, { $push: { submitters: req.user.id }, status: 'Finished' });
        await Voting.updateOne({ _id: req.body.votingid, user: req.user.id }, { result: req.body.result, status: 'Expired' });
        req.flash('flash_success_message', 'You have successfully finished the voting and now you can view the results');
        res.redirect('/users/dashboard');

    } catch (err) {
        console.error(err);
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