const express = require('express');
const session = require('express-session');
const multer = require('multer');
const path = require('path');
const { ensureAuthenticated } = require('../config/login_auth');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const Message = require('../models/message');
const Group = require('../models/group');
const Voting = require('../models/voting');
const Survey = require('../models/survey');
const router = express.Router();

/* User Custom Logo Upload */

// Set Storage Engine
const storage1 = multer.diskStorage({
    destination: './assets/images/users/groups/',
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
})

// Init Upload
const upload1 = multer({
    storage: storage1,
    limits: { fileSize: 1000000 },
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
}).single('myLogo1');

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

/* Group */

// Manage All groups of a specific user
router.get('/groups', ensureAuthenticated, async (req, res) => {

    try {

        var newMessages;
        var newNotifications;
        const myGroups1 = await Group.find({ creator: req.user.id })
            .sort({ createTime: 'desc' })
            .lean();
        const myGroups2 = await Group.find({ creator: { $ne: req.user.id }, members: req.user.id })
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

        res.render('community/viewAll1P', {
            avatar: req.user.avatar,
            firstName: req.user.firstName,
            lastName: req.user.lastName,
            email: req.user.email,
            newMessages,
            newNotifications,
            myGroups1,
            myGroups2,
            title: 'Groups of ' + req.user.firstName + ' ' + req.user.lastName + ' - Orca MPC',
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

// Create a new group - Group Creator
router.get('/groups/create', ensureAuthenticated, async (req, res) => {

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

        res.render('community/create1P', {
            avatar: req.user.avatar,
            firstName: req.user.firstName,
            lastName: req.user.lastName,
            email: req.user.email,
            newMessages,
            newNotifications,
            title: req.user.firstName + ' ' + req.user.lastName + ' / Create: Group - Orca MPC',
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

router.post('/groups/create', ensureAuthenticated, async (req, res) => {

    try {

        let group = await Group.findOne({ creator: req.user.id, groupName: req.body.groupName });

        if (group) {

            req.flash('flash_error_message', 'Sorry, each group you created must have different name');
            res.redirect('/community/groups/create');

        } else {

            req.body.creator = req.user.id;
            req.body.members = req.user.id;
            await Message.create({
                sender: req.user.id,
                receiver: req.user.id,
                content: 'Please be inform that the token for the group "' + req.body.groupName + '" is "' + req.body.token
                    + '" and you can tell this token to other users to let them join the group.'
            });
            await Group.create(req.body);
            req.flash('flash_success_message', 'You have successfully created a group');
            res.redirect('/community/groups');
        }

    } catch (err) {

        req.flash('flash_error_message', 'Sorry, an unknown error occurred');
        res.redirect('/community/groups');

    }

});

// Join a group
router.get('/groups/join', ensureAuthenticated, async (req, res) => {

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

        res.render('community/joinP', {
            avatar: req.user.avatar,
            firstName: req.user.firstName,
            lastName: req.user.lastName,
            email: req.user.email,
            newMessages,
            newNotifications,
            title: req.user.firstName + ' ' + req.user.lastName + ' / Join: Group - Orca MPC',
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

router.post('/groups/join', ensureAuthenticated, async (req, res) => {

    try {

        let cuser = await User.findOne({ email: req.body.creatorEmail })
            .lean();

        if (cuser) {

            let group = await Group.findOne({ creator: cuser._id, groupName: req.body.groupName, members: { $ne: req.user.id } })
                .lean();

            if (group) {
                const pwdMatch = await bcrypt.compare(req.body.grouptoken, group.token);

                if (pwdMatch) {

                    await Message.create({
                        sender: req.user.id,
                        receiver: cuser._id,
                        content: req.user.firstName + ' ' + req.user.lastName
                            + ' has joined the group "' + group.groupName + '".'
                    });
                    await Group.updateOne({ creator: cuser._id, groupName: req.body.groupName }, { $push: { members: req.user.id } });
                    res.redirect('/community/groups/view/' + group._id);

                } else {
                    req.flash('flash_error_message', 'Sorry, no such group or incorrect token');
                    res.redirect('/community/groups/join');
                }
            } else {
                req.flash('flash_error_message', 'Sorry, no such group or incorrect token');
                res.redirect('/community/groups/join');
            }

        } else {
            req.flash('flash_error_message', 'Sorry, no such group or incorrect token');
            res.redirect('/community/groups/join');
        }

    } catch (err) {

        req.flash('flash_error_message', 'Sorry, an unknown error occurred');
        res.redirect('/community/groups');

    }

});

// View a specific group
router.get('/groups/view/:id', ensureAuthenticated, async (req, res) => {

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

        let voting = await Voting.find({ user: req.user.id, status: 'Unpublished'});
        let survey = await Survey.find({ user: req.user.id, status: 'Unpublished' });

        let group = await Group.findOne({ _id: req.params.id, creator: req.user.id })
            .populate('creator')
            .populate('members')
            .lean();

        if (!group) {

            let group = await Group.findOne({ _id: req.params.id, members: req.user.id })
                .populate('creator')
                .populate('members')
                .lean();

            res.render('community/view12P', {
                userID: req.user.id,
                avatar: req.user.avatar,
                firstName: req.user.firstName,
                lastName: req.user.lastName,
                email: req.user.email,
                newMessages,
                newNotifications,
                group,
                voting,
                survey,
                title: req.user.firstName + ' ' + req.user.lastName + ' / View: ' + group.groupName + ' - Orca MPC',
                layout: 'users'
            });

        } else {

            res.render('community/view11P', {
                avatar: req.user.avatar,
                firstName: req.user.firstName,
                lastName: req.user.lastName,
                email: req.user.email,
                newMessages,
                newNotifications,
                group,
                voting,
                survey,
                title: req.user.firstName + ' ' + req.user.lastName + ' / View: ' + group.groupName + ' - Orca MPC',
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

// Edit specific group
router.get('/groups/edit/:id', ensureAuthenticated, async (req, res) => {

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

        let group = await Group.findOne({ _id: req.params.id, creator: req.user.id })
            .lean();

        if (!group) {

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

            res.render('community/edit1P', {
                avatar: req.user.avatar,
                firstName: req.user.firstName,
                lastName: req.user.lastName,
                email: req.user.email,
                newMessages,
                newNotifications,
                group,
                title: req.user.firstName + ' ' + req.user.lastName + ' / Edit: ' + group.groupName + ' - Orca MPC',
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

router.post('/groups/edit', ensureAuthenticated, async (req, res) => {

    try {

        var flag = true;

        let checkgroup = await Group.findOne({ _id: req.body.groupid, creator: req.user.id })
            .lean();

        if (checkgroup.groupName != req.body.groupName) {

            let checkgroup = await Group.findOne({ creator: req.user.id, groupName: req.body.groupName })
                .lean();

            if (checkgroup) {
                flag = false;
            }

        }

        let group = await Group.findOne({ _id: req.body.groupid, creator: req.user.id })
            .lean();

        if (!group) {

            req.flash('flash_error_message', 'Sorry, this group is not existing');
            res.redirect('/community/groups');

        } else {

            if (flag == false) {

                req.flash('flash_error_message', 'Sorry, each group you created must have different name');
                res.redirect('/community/groups/edit/' + req.body.groupid);

            } else {

                if (req.body.token) {
                    await Message.create({
                        sender: req.user.id,
                        receiver: req.user.id,
                        content: 'Please be inform that your new token for the group "' + req.body.groupName + '" is "' + req.body.token
                            + '" and you can tell this token to other users to let them join the group.'
                    });
                    const newSalt = bcrypt.genSaltSync(10);
                    const newToken = bcrypt.hashSync(req.body.token, newSalt);
                    await Group.updateOne({ _id: req.body.groupid, creator: req.user.id }, { groupName: req.body.groupName, description: req.body.description, token: newToken });
                } else {
                    await Group.updateOne({ _id: req.body.groupid, creator: req.user.id }, { groupName: req.body.groupName, description: req.body.description });
                }

                req.flash('flash_success_message', 'You have successfully updated the information of this group');
                res.redirect('/community/groups/view/' + req.body.groupid);

            }

        }

    } catch (err) {

        req.flash('flash_error_message', 'Sorry, an unknown error occurred');
        res.redirect('/community/groups');

    }

});

// Upload user custom logo - group
router.get('/groups/upload/:id', ensureAuthenticated, async (req, res) => {

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

    let group = await Group.findOne({ _id: req.params.id, creator: req.user.id })
        .lean();

    if (!group) {

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

        res.render('community/upload1P', {
            avatar: req.user.avatar,
            firstName: req.user.firstName,
            lastName: req.user.lastName,
            email: req.user.email,
            newMessages,
            newNotifications,
            group,
            title: req.user.firstName + ' ' + req.user.lastName + ' / Upload Logo: Group - Orca MPC',
            layout: 'users'
        });

    }

});

router.post('/groups/upload/:id', ensureAuthenticated, async (req, res) => {

    try {

        upload1(req, res, async (err) => {
            if (err) {
                req.flash('flash_error_message', 'The logo cannot be updated, please check the file you uploaded');
                res.redirect('/community/groups/upload/' + req.params.id);
            } else {
                await Group.updateOne({ _id: req.params.id, creator: req.user.id }, { avatar: '/assets/images/users/groups/' + req.file.filename });
                req.flash('flash_success_message', 'You have sucessfully updated your group logo');
                res.redirect('/community/groups/upload/' + req.params.id);
            }
        });

    } catch (err) {

        req.flash('flash_error_message', 'Sorry, an unknown error occurred');
        res.redirect('/community/groups');

    }

});

// Remove a group member
router.post('/groups/remove', ensureAuthenticated, async (req, res) => {

    try {

        let group = await Group.findOne({ _id: req.body.groupid, creator: req.user.id })
            .lean();

        if (!group) {

            req.flash('flash_error_message', 'Sorry, this group is not existing');
            res.redirect('/users/groups');

        } else {

            var creator = await User.findOne({ _id: req.user.id });
            const pwdMatch = await bcrypt.compare(req.body.password, creator.password);

            if (pwdMatch) {

                await Message.create({
                    sender: req.user.id,
                    receiver: req.body.memberid,
                    content: 'You have been removed from the group: ' + group.groupName + '.'
                });
                await Group.updateOne({ _id: req.body.groupid, creator: req.user.id }, { $pullAll: { members: [req.body.memberid] } });
                req.flash('flash_success_message', 'You have successfully removed the group member');
                res.redirect('/community/groups/view/' + req.body.groupid);

            } else {

                req.flash('flash_error_message', 'Sorry, you cannot remove this group memeber because of the incorrect password');
                res.redirect('/community/groups/view/' + req.body.groupid);

            }

        }

    } catch (err) {

        req.flash('flash_error_message', 'Sorry, an unknown error occurred');
        res.redirect('/community/groups');

    }

});

// Disband a group
router.post('/groups/disband', ensureAuthenticated, async (req, res) => {

    try {

        let group = await Group.findOne({ _id: req.body.groupid, creator: req.user.id })
            .populate('members')
            .lean();

        if (!group) {

            req.flash('flash_error_message', 'Sorry, this group is not existing');
            res.redirect('/users/groups');

        } else {

            var creator = await User.findOne({ _id: req.user.id });
            const pwdMatch = await bcrypt.compare(req.body.password, creator.password);

            if (pwdMatch) {

                if (group.members.length > 1) {
                    for (var i = 1; i < group.members.length; i++) {
                        await Message.create({
                            sender: req.user.id,
                            receiver: group.members[i]._id,
                            content: 'Sorry, the group "' + group.groupName + '" you joined has been disbanded by the creator.'
                        });
                    }
                }

                await Group.deleteOne({ _id: req.body.groupid, creator: req.user.id });
                req.flash('flash_success_message', 'You have successfully disbanded the group');
                res.redirect('/community/groups');

            } else {

                req.flash('flash_error_message', 'Sorry, you cannot disband this group because of the incorrect password');
                res.redirect('/community/groups/view/' + req.body.groupid);

            }

        }

    } catch (err) {

        req.flash('flash_error_message', 'Sorry, an unknown error occurred');
        res.redirect('/community/groups');

    }

});



module.exports = router;