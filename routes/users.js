const express = require('express');
const session = require('express-session');
const multer = require('multer');
const path = require('path');
const { ensureAuthenticated } = require('../config/login_auth');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const Message = require('../models/message');
const Voting = require('../models/voting');
const Survey = require('../models/survey');
const router = express.Router();

/* User Custom Avatar Upload */

// Set Storage Engine
const storage = multer.diskStorage({
    destination: './assets/images/users/avatars/',
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
})

// Init Upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 },
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
}).single('myAvatar');

// Check File Type
function checkFileType(file, cb) {
    const ftypes = /jpeg|jpg|png/;
    const extname = ftypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = ftypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb('Error: Only Allow Images');
    }
}

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
        const myVoting31 = await Voting.find({ user: req.user.id, status: 'Preparing' })
            .sort({ createTime: 'desc' })
            .lean();
        const myVoting32 = await Voting.find({ user: { $ne: req.user.id }, participants: req.user.id, status: 'Preparing' })
            .sort({ createTime: 'desc' })
            .lean();
        const myVoting41 = await Voting.find({ user: req.user.id, status: 'Initiating' })
            .sort({ createTime: 'desc' })
            .lean();
        const myVoting42 = await Voting.find({ user: { $ne: req.user.id }, participants: req.user.id, status: 'Initiating' })
            .sort({ createTime: 'desc' })
            .lean();
        const myVoting51 = await Voting.find({ user: req.user.id, status: 'Expired' })
            .sort({ createTime: 'desc' })
            .lean();
        const myVoting52 = await Voting.find({ user: { $ne: req.user.id }, participants: req.user.id, status: 'Expired' })
            .sort({ createTime: 'desc' })
            .lean();
        const mySurveys1 = await Survey.find({ user: req.user.id, status: 'Unpublished' })
            .sort({ createTime: 'desc' })
            .lean();
        const mySurveys21 = await Survey.find({ user: req.user.id, status: 'Published' })
            .sort({ createTime: 'desc' })
            .lean();
        const mySurveys22 = await Survey.find({ user: { $ne: req.user.id }, participants: req.user.id, status: 'Published' })
            .sort({ createTime: 'desc' })
            .lean();
        const mySurveys31 = await Survey.find({ user: req.user.id, status: 'Preparing' })
            .sort({ createTime: 'desc' })
            .lean();
        const mySurveys32 = await Survey.find({ user: { $ne: req.user.id }, participants: req.user.id, status: 'Preparing' })
            .sort({ createTime: 'desc' })
            .lean();
        const mySurveys41 = await Survey.find({ user: req.user.id, status: 'Initiating' })
            .sort({ createTime: 'desc' })
            .lean();
        const mySurveys42 = await Survey.find({ user: { $ne: req.user.id }, participants: req.user.id, status: 'Initiating' })
            .sort({ createTime: 'desc' })
            .lean();
        const mySurveys51 = await Survey.find({ user: req.user.id, status: 'Expired' })
            .sort({ createTime: 'desc' })
            .lean();
        const mySurveys52 = await Survey.find({ user: { $ne: req.user.id }, participants: req.user.id, status: 'Expired' })
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
            myVoting31,
            myVoting32,
            myVoting41,
            myVoting42,
            myVoting51,
            myVoting52,
            mySurveys1,
            mySurveys21,
            mySurveys22,
            mySurveys31,
            mySurveys32,
            mySurveys41,
            mySurveys42,
            mySurveys51,
            mySurveys52,
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

// View personal profile
router.get('/myprofile', ensureAuthenticated, async (req, res) => {

    var newMessages;
    var newNotifications;
    var votingCount;
    var surveyCount;

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

    await Voting.countDocuments({ user: req.user.id }, function (err, count) {
        if (err) {
            votingCount = 0;
        } else {
            votingCount = count;
        }
    });

    await Survey.countDocuments({ user: req.user.id }, function (err, count) {
        if (err) {
            surveyCount = 0;
        } else {
            surveyCount = count;
        }
    });

    res.render('users/myProfileP', {
        registerTime: req.user.registerTime,
        avatar: req.user.avatar,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        gender: req.user.gender,
        birthday: req.user.birthday,
        career: req.user.career,
        description: req.user.description,
        email: req.user.email,
        newMessages,
        newNotifications,
        votingCount,
        surveyCount,
        title: 'Profile of ' + req.user.firstName + ' ' + req.user.lastName + ' - Orca MPC',
        layout: 'users'
    });

});

// Edit personal profile
router.get('/myprofile/edit', ensureAuthenticated, async (req, res) => {

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

    res.render('users/editP', {
        avatar: req.user.avatar,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        gender: req.user.gender,
        birthday: req.user.birthday,
        career: req.user.career,
        description: req.user.description,
        email: req.user.email,
        newMessages,
        newNotifications,
        title: req.user.firstName + ' ' + req.user.lastName + ' / Edit: Profile - Orca MPC',
        layout: 'users'
    });

});

router.post('/myprofile/edit', ensureAuthenticated, async (req, res) => {

    try {

        await User.updateOne({ _id: req.user.id }, req.body);
        req.flash('flash_success_message', 'You have successfully updated your personal profile');
        res.redirect('/users/myprofile');

    } catch (err) {

        req.flash('flash_error_message', 'Sorry, an unknown error occurred');
        res.redirect('/users/myprofile');

    }

});

// Upload user custom avatar
router.get('/myprofile/upload', ensureAuthenticated, async (req, res) => {

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

    res.render('users/uploadP', {
        avatar: req.user.avatar,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        email: req.user.email,
        newMessages,
        newNotifications,
        title: req.user.firstName + ' ' + req.user.lastName + ' / Upload: Avatar - Orca MPC',
        layout: 'users'
    });

});

router.post('/myprofile/upload', ensureAuthenticated, async (req, res) => {

    try {

        upload(req, res, async (err) => {
            if (err) {
                req.flash('flash_error_message', 'The avatar cannot be updated, please check the file you uploaded');
                res.redirect('/users/myprofile/upload');
            } else {
                await User.updateOne({ _id: req.user.id }, { avatar: '/assets/images/users/avatars/' + req.file.filename });
                req.flash('flash_success_message', 'You have sucessfully updated your avatar');
                res.redirect('/users/myprofile/upload');
            }
        });

    } catch (err) {

        req.flash('flash_error_message', 'Sorry, an unknown error occurred');
        res.redirect('/users/myprofile');

    }

});

// Change password
router.get('/changepassword', ensureAuthenticated, async (req, res) => {

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

        res.render('users/changePwdP', {
            avatar: req.user.avatar,
            firstName: req.user.firstName,
            lastName: req.user.lastName,
            email: req.user.email,
            newMessages,
            newNotifications,
            title: req.user.firstName + ' ' + req.user.lastName + ' / Change Password - Orca MPC',
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

router.post('/changepassword', ensureAuthenticated, async (req, res) => {

    try {

        var account = await User.findOne({ _id: req.user.id });
        const pwdMatch = await bcrypt.compare(req.body.oldpassword, account.password);

        if (pwdMatch) {

            const newSalt = bcrypt.genSaltSync(10);
            const newPwd = bcrypt.hashSync(req.body.newpassword, newSalt);

            await User.updateOne({ _id: req.user.id }, { password: newPwd });

            req.logout();
            req.session.destroy(function (err) {
                res.redirect('../login');
            });


        } else {

            req.flash('flash_error_message', 'Sorry, you cannot change your password');
            res.redirect('/users/changepassword');

        }

    } catch (err) {

        req.flash('flash_error_message', 'Sorry, an unknown error occurred');
        res.redirect('/users/dashboard');

    }

});

/* Access other user profiles */
router.get('/profile/:id', ensureAuthenticated, async (req, res) => {

    var newMessages;
    var newNotifications;
    var votingCount;
    var surveyCount;

    const profile = await User.findOne({ _id: req.params.id })
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

    await Voting.countDocuments({ user: req.params.id }, function (err, count) {
        if (err) {
            votingCount = 0;
        } else {
            votingCount = count;
        }
    });

    await Survey.countDocuments({ user: req.params.id }, function (err, count) {
        if (err) {
            surveyCount = 0;
        } else {
            surveyCount = count;
        }
    });

    res.render('users/profileP', {
        avatar: req.user.avatar,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        email: req.user.email,
        newMessages,
        newNotifications,
        votingCount,
        surveyCount,
        profile,
        title: 'Profile of ' + req.user.firstName + ' ' + req.user.lastName + ' - Orca MPC',
        layout: 'users'
    });

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

module.exports = router;