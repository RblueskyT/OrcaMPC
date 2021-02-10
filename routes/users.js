const express = require('express');
const session = require('express-session');
const { ensureAuthenticated } = require('../config/login_auth');
const Message = require('../models/message');
const Voting = require('../models/voting');
const VotingSession = require('../models/votingSession');
const router = express.Router();

/* User Personal Space */

// Redirect to user dashboard
router.get('/', ensureAuthenticated, (req, res) => {
    res.redirect('/users/dashboard');
});

// User dashboard
router.get('/dashboard', ensureAuthenticated, async (req, res) => {

    try {

        var newMessages;
        var newNotifications;
        const notifications1 = await Message.find({ receiver: req.user.id, messageLabel: 'Notification', status: 'Unread' })
            .sort({ emitTime: 'desc' })
            .populate('sender')
            .populate('relatedVoting')
            .populate('relatedSurvey')
            .lean();
        const myVoting1 = await Voting.find({ user: req.user.id, status: 'Unpublished' })
            .sort({ createTime: 'desc' })
            .lean();
        const myVoting21 = await Voting.find({ user: req.user.id, status: 'Published' })
            .sort({ createTime: 'desc' })
            .lean();
        const myVoting22 = await Voting.find({ user: { $ne: req.user.id }, participants: req.user.id, status: 'Published' })
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

        res.render('users/dashboardP', {
            avatar: req.user.avatar,
            firstName: req.user.firstName,
            lastName: req.user.lastName,
            email: req.user.email,
            newMessages,
            newNotifications,
            notifications1,
            myVoting1,
            myVoting21,
            myVoting22,
            title: req.user.firstName + ', welcome to your dashboard! - Orca MPC',
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

// Notifications
router.get('/notifications', ensureAuthenticated, async (req, res) => {

    try {

        var newMessages;
        var newNotifications;
        const notifications1 = await Message.find({ receiver: req.user.id, messageLabel: 'Notification', status: 'Unread' })
            .sort({ emitTime: 'desc' })
            .populate('sender')
            .populate('relatedVoting')
            .populate('relatedSurvey')
            .lean();
        const notifications2 = await Message.find({ receiver: req.user.id, messageLabel: 'Notification', status: 'Read' })
            .sort({ emitTime: 'desc' })
            .populate('sender')
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

        res.render('users/notificationsP', {
            avatar: req.user.avatar,
            firstName: req.user.firstName,
            lastName: req.user.lastName,
            email: req.user.email,
            newMessages,
            newNotifications,
            notifications1,
            notifications2,
            title: 'Notifications of ' + req.user.firstName + ' ' + req.user.lastName + ' - Orca MPC',
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

// Delete a notification
router.post('/notifications/delete', ensureAuthenticated, async (req, res) => {

    try {

        let notification = await Message.findOne({ _id: req.body.noticeid, receiver: req.user.id, status: 'Read' })
            .lean();

        if (!notification) {

            req.flash('flash_error_message', 'Sorry, this notification is not existing');
            res.redirect('/users/notifications');

        } else {

            await Message.deleteOne({ _id: req.body.noticeid, receiver: req.user.id, status: 'Read' });
            res.redirect('/users/notifications');

        }

    } catch (err) {

        req.flash('flash_error_message', 'Sorry, an unknown error occurred');
        res.redirect('/users/messages');

    }

});

// Message Box
router.get('/messages', ensureAuthenticated, async (req, res) => {

    try {

        var newMessages;
        var newNotifications;
        const messages1 = await Message.find({ receiver: req.user.id, messageLabel: 'Message', status: 'Unread' })
            .sort({ emitTime: 'desc' })
            .populate('sender')
            .lean();
        const messages2 = await Message.find({ receiver: req.user.id, messageLabel: 'Message', status: 'Read' })
            .sort({ emitTime: 'desc' })
            .populate('sender')
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

        res.render('users/messageBoxP', {
            avatar: req.user.avatar,
            firstName: req.user.firstName,
            lastName: req.user.lastName,
            email: req.user.email,
            newMessages,
            newNotifications,
            messages1,
            messages2,
            title: 'Message Box of ' + req.user.firstName + ' ' + req.user.lastName + ' - Orca MPC',
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

// Mark a message as read
router.post('/messages/mark', ensureAuthenticated, async (req, res) => {

    try {

        let message = await Message.findOne({ _id: req.body.messageid, receiver: req.user.id, status: 'Unread' })
            .lean();

        if (!message) {

            req.flash('flash_error_message', 'Sorry, this message is not existing');
            res.redirect('/users/messages');

        } else {

            await Message.updateOne({ _id: req.body.messageid, receiver: req.user.id, status: 'Unread' }, { status: 'Read' });
            res.redirect('/users/messages');

        }

    } catch (err) {

        req.flash('flash_error_message', 'Sorry, an unknown error occurred');
        res.redirect('/users/messages');

    }

});

// Delete a message
router.post('/messages/delete', ensureAuthenticated, async (req, res) => {

    try {

        let message = await Message.findOne({ _id: req.body.messageid, receiver: req.user.id, status: 'Read' })
            .lean();

        if (!message) {

            req.flash('flash_error_message', 'Sorry, this message is not existing');
            res.redirect('/users/messages');

        } else {

            await Message.deleteOne({ _id: req.body.messageid, receiver: req.user.id, status: 'Read' });
            res.redirect('/users/messages');

        }

    } catch (err) {

        req.flash('flash_error_message', 'Sorry, an unknown error occurred');
        res.redirect('/users/messages');

    }

});

// User logout
router.get('/logout', ensureAuthenticated, (req, res) => {

    req.logout();

    req.session.destroy(function (err) {
        res.redirect('../login');
    });

});

/* All following parts will be modified  */

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

module.exports = router;