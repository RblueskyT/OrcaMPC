const express = require('express');
const session = require('express-session');
const multer = require('multer');
const path = require('path');
const { ensureAuthenticated } = require('../config/login_auth');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const Message = require('../models/message');
const Group = require('../models/group');
const Topic = require('../models/topic');
const Voting = require('../models/voting');
const Survey = require('../models/survey');
const voting = require('../models/voting');
const router = express.Router();

/* User Custom Logo Upload */

// Set Storage Engine
const storage1 = multer.diskStorage({
    destination: './assets/images/users/groups/',
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
})

const storage2 = multer.diskStorage({
    destination: './assets/images/users/topics/',
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

const upload2 = multer({
    storage: storage2,
    limits: { fileSize: 1000000 },
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
}).single('myLogo2');

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

        let group = await Group.findOne({ creator: req.user.id, groupName: req.body.groupName })
            .lean();

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

        let voting = await Voting.find({ user: req.user.id, status: 'Unpublished' })
            .lean();
        let survey = await Survey.find({ user: req.user.id, status: 'Unpublished' })
            .lean();

        let group = await Group.findOne({ _id: req.params.id, creator: req.user.id })
            .populate('creator')
            .populate('members')
            .populate('posts.sender')
            .populate('posts.relatedVoting')
            .populate('posts.relatedSurvey')
            .lean();

        if (!group) {

            let group = await Group.findOne({ _id: req.params.id, members: req.user.id })
                .populate('creator')
                .populate('members')
                .populate('posts.sender')
                .populate('posts.relatedVoting')
                .populate('posts.relatedSurvey')
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

// Post voting to a group
router.post('/groups/post/voting', ensureAuthenticated, async (req, res) => {

    try {

        let group = await Group.findOne({ _id: req.body.groupid, members: req.user.id })
            .populate('members')
            .lean();

        if (!group) {

            req.flash('flash_error_message', 'Sorry, this group is not existing');
            res.redirect('/users/groups');

        } else {

            let voting = await Voting.findOne({ _id: req.body.votingid, user: req.user.id, status: 'Unpublished' })
                .lean();

            if (!voting) {

                req.flash('flash_error_message', 'Sorry, this voting is not existing');
                res.redirect('/users/groups/view/' + req.body.groupid);

            } else {
                if (group.members.length > 1) {
                    for (var i = 0; i < group.members.length; i++) {
                        await Message.create({
                            sender: req.user.id,
                            receiver: group.members[i]._id,
                            content: 'New voting "' + voting.votingTitle + '" has been posted in the group "' + group.groupName + '".',
                            relatedVoting: req.body.votingid
                        });
                    }
                }
                await Voting.updateOne({ _id: req.body.votingid, user: req.user.id, status: 'Unpublished' }, { status: 'Published' });
                await Group.updateOne({ _id: req.body.groupid, members: req.user.id }, { $push: { voting: req.body.votingid, posts: { sender: req.user.id, content: req.body.postcontentv, relatedVoting: req.body.votingid } } });
                req.flash('flash_success_message', 'You have successfully posted the voting');
                res.redirect('/community/groups/view/' + req.body.groupid);
            }

        }

    } catch (err) {

        req.flash('flash_error_message', 'Sorry, an unknown error occurred');
        res.redirect('/community/groups');

    }

});

// Delete a post from a group - voting
router.post('/groups/post/voting/delete', ensureAuthenticated, async (req, res) => {

    try {

        let group = await Group.findOne({ _id: req.body.groupid, creator: req.user.id })
            .populate('members')
            .lean();

        if (!group) {

            req.flash('flash_error_message', 'Sorry, this group is not existing');
            res.redirect('/users/groups');

        } else {

            let voting = await Voting.findOne({ _id: req.body.votingid, status: 'Published' })
                .lean();

            if (!voting) {

                req.flash('flash_error_message', 'Sorry, this voting is not existing');
                res.redirect('/users/groups/view/' + req.body.groupid);

            } else {

                await Message.create({
                    sender: req.user.id,
                    receiver: req.body.senderid,
                    content: 'Sorry, the voting "' + voting.votingTitle + '" you posted in the group "' + group.groupName + '" has been deleted by the group creator.',
                    relatedVoting: req.body.votingid
                });
                await Voting.updateOne({ _id: req.body.votingid, status: 'Published' }, { status: 'Unpublished' });
                await Group.updateOne({ _id: req.body.groupid, creator: req.user.id }, { $pull: { voting: req.body.votingid, posts: { _id: { $in: [req.body.postid] } } } });
                req.flash('flash_success_message', 'You have successfully deleted the post');
                res.redirect('/community/groups/view/' + req.body.groupid);
            }

        }

    } catch (err) {

        req.flash('flash_error_message', 'Sorry, an unknown error occurred');
        res.redirect('/community/groups');

    }

});

// Post survey to a group
router.post('/groups/post/survey', ensureAuthenticated, async (req, res) => {

    try {

        let group = await Group.findOne({ _id: req.body.groupid, members: req.user.id })
            .populate('members')
            .lean();

        if (!group) {

            req.flash('flash_error_message', 'Sorry, this group is not existing');
            res.redirect('/users/groups');

        } else {

            let survey = await Survey.findOne({ _id: req.body.surveyid, user: req.user.id, status: 'Unpublished' })
                .lean();

            if (!survey) {

                req.flash('flash_error_message', 'Sorry, this survey is not existing');
                res.redirect('/users/groups/view/' + req.body.groupid);

            } else {
                if (group.members.length > 1) {
                    for (var i = 0; i < group.members.length; i++) {
                        await Message.create({
                            sender: req.user.id,
                            receiver: group.members[i]._id,
                            content: 'New survey "' + survey.surveyTitle + '" has been posted in the group "' + group.groupName + '".',
                            relatedSurvey: req.body.surveyid
                        });
                    }
                }
                await Survey.updateOne({ _id: req.body.surveyid, user: req.user.id, status: 'Unpublished' }, { status: 'Published' });
                await Group.updateOne({ _id: req.body.groupid, members: req.user.id }, { $push: { survey: req.body.surveyid, posts: { sender: req.user.id, content: req.body.postcontents, relatedSurvey: req.body.surveyid } } });
                req.flash('flash_success_message', 'You have successfully posted the survey');
                res.redirect('/community/groups/view/' + req.body.groupid);
            }

        }

    } catch (err) {

        req.flash('flash_error_message', 'Sorry, an unknown error occurred');
        res.redirect('/community/groups');

    }

});

// Delete a post from a group - survey
router.post('/groups/post/survey/delete', ensureAuthenticated, async (req, res) => {

    try {

        let group = await Group.findOne({ _id: req.body.groupid, creator: req.user.id })
            .populate('members')
            .lean();

        if (!group) {

            req.flash('flash_error_message', 'Sorry, this group is not existing');
            res.redirect('/users/groups');

        } else {

            let survey = await Survey.findOne({ _id: req.body.surveyid, status: 'Published' })
                .lean();

            if (!survey) {

                req.flash('flash_error_message', 'Sorry, this survey is not existing');
                res.redirect('/users/groups/view/' + req.body.groupid);

            } else {

                await Message.create({
                    sender: req.user.id,
                    receiver: req.body.senderid,
                    content: 'Sorry, the survey "' + survey.surveyTitle + '" you posted in the group "' + group.groupName + '" has been deleted by the group creator.',
                    relatedSurvey: req.body.surveyid
                });
                await Survey.updateOne({ _id: req.body.surveyid, status: 'Published' }, { status: 'Unpublished' });
                await Group.updateOne({ _id: req.body.groupid, creator: req.user.id }, { $pull: { survey: req.body.surveyid, posts: { _id: { $in: [req.body.postid] } } } });
                req.flash('flash_success_message', 'You have successfully deleted the post');
                res.redirect('/community/groups/view/' + req.body.groupid);
            }

        }

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

            let checkgroup = await Group.findOne({ _id: req.body.groupid, members: req.body.memberid, "posts.sender": req.body.memberid })
                .lean();

            if (checkgroup) {
                req.flash('flash_error_message', 'Sorry, you cannot remove this group memeber because he/she have voting or survey published in this group');
                res.redirect('/community/groups/view/' + req.body.groupid);
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

        }

    } catch (err) {

        req.flash('flash_error_message', 'Sorry, an unknown error occurred');
        res.redirect('/community/groups');

    }

});

// Leave a group
router.post('/groups/leave', ensureAuthenticated, async (req, res) => {

    try {

        let group = await Group.findOne({ _id: req.body.groupid, creator: { $ne: req.user.id }, members: req.user.id })
            .populate('creator')
            .populate('voting')
            .populate('survey')
            .lean();

        if (!group) {

            req.flash('flash_error_message', 'Sorry, this group is not existing');
            res.redirect('/users/groups');

        } else {

            let checkgroup = await Group.findOne({ _id: req.body.groupid, members: req.user.id, "posts.sender": req.user.id })
                .lean();

            if (checkgroup) {
                req.flash('flash_error_message', 'Sorry, you cannot leave because you have voting or survey published in this group');
                res.redirect('/community/groups/view/' + req.body.groupid);
            } else {

                var creator = await User.findOne({ _id: req.user.id });
                const pwdMatch = await bcrypt.compare(req.body.password, creator.password);

                if (pwdMatch) {

                    await Message.create({
                        sender: req.user.id,
                        receiver: group.creator._id,
                        content: 'This member left the group "' + group.groupName + '" that you created.'
                    });

                    await Group.updateOne({ _id: req.body.groupid }, { $pullAll: { members: [req.user.id] } });
                    req.flash('flash_success_message', 'You have successfully left the group');
                    res.redirect('/community/groups');

                } else {

                    req.flash('flash_error_message', 'Sorry, you cannot leave this group because of the incorrect password');
                    res.redirect('/community/groups/view/' + req.body.groupid);

                }
            }

        }

    } catch (err) {

        console.log(err);
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

            if (group.posts.length != 0) {
                req.flash('flash_error_message', 'Sorry, you cannot disband this group because some group members have voting or survey published here');
                res.redirect('/community/groups/view/' + req.body.groupid);
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

        }

    } catch (err) {

        req.flash('flash_error_message', 'Sorry, an unknown error occurred');
        res.redirect('/community/groups');

    }

});

/* Topic */

// Explore topics
router.get('/topics', ensureAuthenticated, async (req, res) => {

    try {

        var newMessages;
        var newNotifications;
        var topicsCount;

        const recTopics = await Topic.find()
            .sort({ createTime: 'desc' })
            .limit(9)
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

        await Topic.countDocuments(function (err, count) {
            if (err) {
                topicsCount = 0;
            } else {
                topicsCount = count;
            }
        });

        res.render('community/viewAll3P', {
            avatar: req.user.avatar,
            firstName: req.user.firstName,
            lastName: req.user.lastName,
            email: req.user.email,
            newMessages,
            newNotifications,
            topicsCount,
            recTopics,
            title: 'Explore Topics - Orca MPC',
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

// Search topics
router.get('/topics/search/:topickeyword', ensureAuthenticated, async (req, res) => {

    try {

        var newMessages;
        var newNotifications;

        const searchTopics = await Topic.find({ topicName: { $regex: req.params.topickeyword, $options: 'i' } })
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

        res.render('community/viewAll4P', {
            avatar: req.user.avatar,
            firstName: req.user.firstName,
            lastName: req.user.lastName,
            email: req.user.email,
            newMessages,
            newNotifications,
            searchTopics,
            title: 'Explore Topics / Search Results - Orca MPC',
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

router.post('/topics/search', ensureAuthenticated, async (req, res) => {

    try {

        if (req.body.topickeyword) {
            res.redirect('/community/topics/search/' + req.body.topickeyword);
        } else {
            res.redirect('/community/topics');
        }

    } catch (err) {

        req.flash('flash_error_message', 'Sorry, an unknown error occurred');
        res.redirect('/community/topics');

    }

});

// Manage All topics of a specific user
router.get('/topics/mytopics', ensureAuthenticated, async (req, res) => {

    try {

        var newMessages;
        var newNotifications;
        const myTopics1 = await Topic.find({ creator: req.user.id })
            .sort({ createTime: 'desc' })
            .lean();
        const myTopics2 = await Topic.find({ creator: { $ne: req.user.id }, followers: req.user.id })
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

        res.render('community/viewAll2P', {
            avatar: req.user.avatar,
            firstName: req.user.firstName,
            lastName: req.user.lastName,
            email: req.user.email,
            newMessages,
            newNotifications,
            myTopics1,
            myTopics2,
            title: 'Topics of ' + req.user.firstName + ' ' + req.user.lastName + ' - Orca MPC',
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

// Create a new topic - Topic Creator
router.get('/topics/create', ensureAuthenticated, async (req, res) => {

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

        res.render('community/create2P', {
            avatar: req.user.avatar,
            firstName: req.user.firstName,
            lastName: req.user.lastName,
            email: req.user.email,
            newMessages,
            newNotifications,
            title: req.user.firstName + ' ' + req.user.lastName + ' / Create: Topic - Orca MPC',
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

router.post('/topics/create', ensureAuthenticated, async (req, res) => {

    try {

        let topic = await Topic.findOne({ topicName: req.body.topicName })
            .lean();

        if (topic) {

            req.flash('flash_error_message', 'Sorry, this topic is already exist');
            res.redirect('/community/topics/create');

        } else {

            req.body.creator = req.user.id;
            req.body.followers = req.user.id;
            await Topic.create(req.body);
            req.flash('flash_success_message', 'You have successfully created a topic');
            res.redirect('/community/topics/mytopics');
        }

    } catch (err) {

        req.flash('flash_error_message', 'Sorry, an unknown error occurred');
        res.redirect('/community/topics/mytopics');

    }

});


// Follow a topic
router.post('/topics/follow', ensureAuthenticated, async (req, res) => {

    try {

        let topic = await Topic.findOne({ _id: req.body.topicid, followers: req.user.id })
            .lean();

        if (topic) {
            req.flash('flash_error_message', 'Sorry, you have already followed this topic');
            res.redirect('/community/topics/view/' + req.body.topicid);
        } else {
            await Topic.updateOne({ _id: req.body.topicid }, { $push: { followers: req.user.id } });
            res.redirect('/community/topics/view/' + req.body.topicid);
        }

    } catch (err) {

        req.flash('flash_error_message', 'Sorry, an unknown error occurred');
        res.redirect('/community/topics/mytopics');

    }

});

// Unfollow a topic
router.post('/topics/unfollow', ensureAuthenticated, async (req, res) => {

    try {

        let topic = await Topic.findOne({ _id: req.body.topicid, followers: req.user.id })
            .lean();

        if (topic) {
            await Topic.updateOne({ _id: req.body.topicid, followers: req.user.id }, { $pullAll: { followers: [req.user.id] } });
            res.redirect('/community/topics/view/' + req.body.topicid);
        } else {
            req.flash('flash_error_message', 'Sorry, you cannot unfollow this topic');
            res.redirect('/community/topics/view/' + req.body.topicid);
        }



    } catch (err) {

        req.flash('flash_error_message', 'Sorry, an unknown error occurred');
        res.redirect('/community/topics/mytopics');

    }

});

// View a specific topic
router.get('/topics/view/:id', ensureAuthenticated, async (req, res) => {

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

        let voting = await Voting.find({ user: req.user.id, status: 'Unpublished' })
            .lean();
        let survey = await Survey.find({ user: req.user.id, status: 'Unpublished' })
            .lean();

        let topic = await Topic.findOne({ _id: req.params.id, creator: req.user.id })
            .populate('posts.sender')
            .populate('posts.relatedVoting')
            .populate('posts.relatedSurvey')
            .lean();

        if (!topic) {

            let topic = await Topic.findOne({ _id: req.params.id })
                .populate('posts.sender')
                .populate('posts.relatedVoting')
                .populate('posts.relatedSurvey')
                .lean();

            let checktopic = await Topic.findOne({ _id: req.params.id, followers: req.user.id })
                .lean();

            res.render('community/view22P', {
                userID: req.user.id,
                avatar: req.user.avatar,
                firstName: req.user.firstName,
                lastName: req.user.lastName,
                email: req.user.email,
                newMessages,
                newNotifications,
                topic,
                checktopic,
                voting,
                survey,
                title: req.user.firstName + ' ' + req.user.lastName + ' / View: ' + topic.topicName + ' - Orca MPC',
                layout: 'users'
            });

        } else {

            res.render('community/view21P', {
                avatar: req.user.avatar,
                firstName: req.user.firstName,
                lastName: req.user.lastName,
                email: req.user.email,
                newMessages,
                newNotifications,
                topic,
                voting,
                survey,
                title: req.user.firstName + ' ' + req.user.lastName + ' / View: ' + topic.topicName + ' - Orca MPC',
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

// Edit specific topic
router.get('/topics/edit/:id', ensureAuthenticated, async (req, res) => {

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

        let topic = await Topic.findOne({ _id: req.params.id, creator: req.user.id })
            .lean();

        if (!topic) {

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

            res.render('community/edit2P', {
                avatar: req.user.avatar,
                firstName: req.user.firstName,
                lastName: req.user.lastName,
                email: req.user.email,
                newMessages,
                newNotifications,
                topic,
                title: req.user.firstName + ' ' + req.user.lastName + ' / Edit: ' + topic.topicName + ' - Orca MPC',
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

router.post('/topics/edit', ensureAuthenticated, async (req, res) => {

    try {

        let topic = await Topic.findOne({ _id: req.body.topicid, creator: req.user.id })
            .lean();

        if (!topic) {

            req.flash('flash_error_message', 'Sorry, this topic is not existing');
            res.redirect('/community/topics');

        } else {

            await Topic.updateOne({ _id: req.body.topicid, creator: req.user.id }, { description: req.body.description });
            req.flash('flash_success_message', 'You have successfully updated the information of this topic');
            res.redirect('/community/topics/view/' + req.body.topicid);

        }

    } catch (err) {

        req.flash('flash_error_message', 'Sorry, an unknown error occurred');
        res.redirect('/community/topics');

    }

});

// Upload user custom logo - topic
router.get('/topics/upload/:id', ensureAuthenticated, async (req, res) => {

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

    let topic = await Topic.findOne({ _id: req.params.id, creator: req.user.id })
        .lean();

    if (!topic) {

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

        res.render('community/upload2P', {
            avatar: req.user.avatar,
            firstName: req.user.firstName,
            lastName: req.user.lastName,
            email: req.user.email,
            newMessages,
            newNotifications,
            topic,
            title: req.user.firstName + ' ' + req.user.lastName + ' / Upload Logo: Topic - Orca MPC',
            layout: 'users'
        });

    }

});

router.post('/topics/upload/:id', ensureAuthenticated, async (req, res) => {

    try {

        upload2(req, res, async (err) => {
            if (err) {
                req.flash('flash_error_message', 'The logo cannot be updated, please check the file you uploaded');
                res.redirect('/community/topics/upload/' + req.params.id);
            } else {
                await Topic.updateOne({ _id: req.params.id, creator: req.user.id }, { avatar: '/assets/images/users/topics/' + req.file.filename });
                req.flash('flash_success_message', 'You have sucessfully updated your topic logo');
                res.redirect('/community/topics/upload/' + req.params.id);
            }
        });

    } catch (err) {

        req.flash('flash_error_message', 'Sorry, an unknown error occurred');
        res.redirect('/community/topics');

    }

});

// Post voting to a topic
router.post('/topics/post/voting', ensureAuthenticated, async (req, res) => {

    try {

        let topic = await Topic.findOne({ _id: req.body.topicid })
            .lean();

        if (!topic) {

            req.flash('flash_error_message', 'Sorry, this topic is not existing');
            res.redirect('/users/topics/mytopics');

        } else {

            let voting = await Voting.findOne({ _id: req.body.votingid, user: req.user.id, status: 'Unpublished' })
                .lean();

            if (!voting) {

                req.flash('flash_error_message', 'Sorry, this voting is not existing');
                res.redirect('/users/topics/view/' + req.body.topicid);

            } else {
                await Voting.updateOne({ _id: req.body.votingid, user: req.user.id, status: 'Unpublished' }, { status: 'Published' });
                await Topic.updateOne({ _id: req.body.topicid }, { $push: { voting: req.body.votingid, posts: { sender: req.user.id, content: req.body.postcontentv, relatedVoting: req.body.votingid } } });
                req.flash('flash_success_message', 'You have successfully posted the voting');
                res.redirect('/community/topics/view/' + req.body.topicid);
            }

        }

    } catch (err) {

        req.flash('flash_error_message', 'Sorry, an unknown error occurred');
        res.redirect('/community/topics/mytopics');

    }

});

// Delete a post from a topic - voting
router.post('/topics/post/voting/delete', ensureAuthenticated, async (req, res) => {

    try {

        let topic = await Topic.findOne({ _id: req.body.topicid, creator: req.user.id })
            .lean();

        if (!topic) {

            req.flash('flash_error_message', 'Sorry, this topic is not existing');
            res.redirect('/users/topics/mytopics');

        } else {

            let voting = await Voting.findOne({ _id: req.body.votingid, status: 'Published' })
                .lean();

            if (!voting) {

                req.flash('flash_error_message', 'Sorry, this voting is not existing');
                res.redirect('/users/topics/view/' + req.body.topicid);

            } else {

                await Message.create({
                    sender: req.user.id,
                    receiver: req.body.senderid,
                    content: 'Sorry, the voting "' + voting.votingTitle + '" you posted under the topic "' + topic.topicName + '" has been deleted by the topic creator.',
                    relatedVoting: req.body.votingid
                });
                await Voting.updateOne({ _id: req.body.votingid, status: 'Published' }, { status: 'Unpublished' });
                await Topic.updateOne({ _id: req.body.topicid, creator: req.user.id }, { $pull: { voting: req.body.votingid, posts: { _id: { $in: [req.body.postid] } } } });
                req.flash('flash_success_message', 'You have successfully deleted the post');
                res.redirect('/community/topics/view/' + req.body.topicid);
            }

        }

    } catch (err) {

        req.flash('flash_error_message', 'Sorry, an unknown error occurred');
        res.redirect('/community/topics/mytopics');

    }

});

// Post survey to a topic
router.post('/topics/post/survey', ensureAuthenticated, async (req, res) => {

    try {

        let topic = await Topic.findOne({ _id: req.body.topicid })
            .lean();

        if (!topic) {

            req.flash('flash_error_message', 'Sorry, this topic is not existing');
            res.redirect('/users/topics/mytopics');

        } else {

            let survey = await Survey.findOne({ _id: req.body.surveyid, user: req.user.id, status: 'Unpublished' })
                .lean();

            if (!survey) {

                req.flash('flash_error_message', 'Sorry, this survey is not existing');
                res.redirect('/users/topics/view/' + req.body.topicid);

            } else {
                await Survey.updateOne({ _id: req.body.surveyid, user: req.user.id, status: 'Unpublished' }, { status: 'Published' });
                await Topic.updateOne({ _id: req.body.topicid }, { $push: { survey: req.body.surveyid, posts: { sender: req.user.id, content: req.body.postcontents, relatedSurvey: req.body.surveyid } } });
                req.flash('flash_success_message', 'You have successfully posted the survey');
                res.redirect('/community/topics/view/' + req.body.topicid);
            }

        }

    } catch (err) {

        req.flash('flash_error_message', 'Sorry, an unknown error occurred');
        res.redirect('/community/topics/mytopics');

    }

});

// Delete a post from a topic - survey
router.post('/topics/post/survey/delete', ensureAuthenticated, async (req, res) => {

    try {

        let topic = await Topic.findOne({ _id: req.body.topicid, creator: req.user.id })
            .populate('members')
            .lean();

        if (!topic) {

            req.flash('flash_error_message', 'Sorry, this topic is not existing');
            res.redirect('/users/topics/mytopics');

        } else {

            let survey = await Survey.findOne({ _id: req.body.surveyid, status: 'Published' })
                .lean();

            if (!survey) {

                req.flash('flash_error_message', 'Sorry, this survey is not existing');
                res.redirect('/users/topics/view/' + req.body.topicid);

            } else {

                await Message.create({
                    sender: req.user.id,
                    receiver: req.body.senderid,
                    content: 'Sorry, the survey "' + survey.surveyTitle + '" you posted under the topic "' + topic.topicName + '" has been deleted by the topic creator.',
                    relatedSurvey: req.body.surveyid
                });
                await Survey.updateOne({ _id: req.body.surveyid, status: 'Published' }, { status: 'Unpublished' });
                await Topic.updateOne({ _id: req.body.topicid, creator: req.user.id }, { $pull: { survey: req.body.surveyid, posts: { _id: { $in: [req.body.postid] } } } });
                req.flash('flash_success_message', 'You have successfully deleted the post');
                res.redirect('/community/topics/view/' + req.body.topicid);
            }

        }

    } catch (err) {

        req.flash('flash_error_message', 'Sorry, an unknown error occurred');
        res.redirect('/community/topics/mytopics');

    }

});

// Close a topic
router.post('/topics/close', ensureAuthenticated, async (req, res) => {

    try {

        let topic = await Topic.findOne({ _id: req.body.topicid, creator: req.user.id })
            .populate('followers')
            .lean();

        if (!topic) {

            req.flash('flash_error_message', 'Sorry, this topic is not existing');
            res.redirect('/users/topics/mytopics');

        } else {

            if (topic.posts.length != 0) {
                req.flash('flash_error_message', 'Sorry, you cannot close this topic because some users have voting or survey published here');
                res.redirect('/community/topics/view/' + req.body.topicid);
            } else {

                var creator = await User.findOne({ _id: req.user.id });
                const pwdMatch = await bcrypt.compare(req.body.password, creator.password);

                if (pwdMatch) {

                    if (topic.followers.length > 1) {
                        for (var i = 1; i < topic.followers.length; i++) {
                            await Message.create({
                                sender: req.user.id,
                                receiver: topic.followers[i]._id,
                                content: 'Sorry, the topic "' + topic.topicName + '" you followed has been closed by the creator.'
                            });
                        }
                    }

                    await Topic.deleteOne({ _id: req.body.topicid, creator: req.user.id });
                    req.flash('flash_success_message', 'You have successfully closed the topic');
                    res.redirect('/community/topics/mytopics');

                } else {

                    req.flash('flash_error_message', 'Sorry, you cannot close the topic because of the incorrect password');
                    res.redirect('/community/topics/view/' + req.body.topicid);

                }
            }

        }

    } catch (err) {

        req.flash('flash_error_message', 'Sorry, an unknown error occurred');
        res.redirect('/community/topics/mytopics');

    }

});

module.exports = router;