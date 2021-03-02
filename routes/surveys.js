const express = require('express');
const session = require('express-session');
const { ensureAuthenticated } = require('../config/login_auth');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const Message = require('../models/message');
const Question = require('../models/question');
const Survey = require('../models/survey');
const SurveySession = require('../models/surveySession');
const router = express.Router();

/* Question Bank Management */

// Manage all questions
router.get('/question', ensureAuthenticated, async (req, res) => {

    try {

        var newMessages;
        var newNotifications;
        const myQuestions1 = await Question.find({ user: req.user.id, questionType: 'Radio' })
            .sort({ createTime: 'desc' })
            .lean();
        const myQuestions2 = await Question.find({ user: req.user.id, questionType: 'Checkbox' })
            .sort({ createTime: 'desc' })
            .lean();
        const myQuestions3 = await Question.find({ user: req.user.id, questionType: 'Input' })
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

        res.render('surveys/viewAll6P', {
            avatar: req.user.avatar,
            firstName: req.user.firstName,
            lastName: req.user.lastName,
            email: req.user.email,
            newMessages,
            newNotifications,
            myQuestions1,
            myQuestions2,
            myQuestions3,
            title: 'Question Bank of ' + req.user.firstName + ' ' + req.user.lastName + ' - Orca MPC',
            layout: 'survey'
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

// Create new question - Question Creator
router.get('/question/create', ensureAuthenticated, async (req, res) => {

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

        res.render('surveys/create1P', {
            avatar: req.user.avatar,
            firstName: req.user.firstName,
            lastName: req.user.lastName,
            email: req.user.email,
            newMessages,
            newNotifications,
            title: req.user.firstName + ' ' + req.user.lastName + ' / Create: Question - Orca MPC',
            layout: 'survey'
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

router.post('/question/create', ensureAuthenticated, async (req, res) => {

    try {

        req.body.user = req.user.id;
        await Question.create(req.body);
        req.flash('flash_success_message', 'You have successfully created an question');
        res.redirect('/users/surveys/question');

    } catch (err) {

        req.flash('flash_error_message', 'Sorry, an unknown error occurred');
        res.redirect('/users/surveys/question');

    }

});

// View a specific question
router.get('/question/view/:id', ensureAuthenticated, async (req, res) => {

    try {

        var newMessages;
        var newNotifications;
        var relatedSurveyNum;

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

        let question = await Question.findOne({ _id: req.params.id, user: req.user.id })
            .populate('user')
            .lean();

        let mySurveys = await Survey.find({ user: req.user.id, status: { $in: ['Unpublished', 'Published'] } })
            .sort({ createTime: 'desc' })
            .lean();

        if (!question) {

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

            if (question.questionType == "Radio") {

                await Survey.countDocuments({ user: req.user.id, radioQuestions: question._id }, function (err, count) {
                    if (err) {
                        relatedSurveyNum = 0;
                    } else {
                        relatedSurveyNum = count;
                    }
                });

            } else if (question.questionType == "Checkbox") {

                await Survey.countDocuments({ user: req.user.id, checkboxQuestions: question._id }, function (err, count) {
                    if (err) {
                        relatedSurveyNum = 0;
                    } else {
                        relatedSurveyNum = count;
                    }
                });

            } else {

                await Survey.countDocuments({ user: req.user.id, inputQuestions: question._id }, function (err, count) {
                    if (err) {
                        relatedSurveyNum = 0;
                    } else {
                        relatedSurveyNum = count;
                    }
                });

            }

            res.render('surveys/view6P', {
                avatar: req.user.avatar,
                firstName: req.user.firstName,
                lastName: req.user.lastName,
                email: req.user.email,
                newMessages,
                newNotifications,
                relatedSurveyNum,
                question,
                mySurveys,
                title: req.user.firstName + ' ' + req.user.lastName + ' / View: ' + question.questionName + ' - Orca MPC',
                layout: 'survey'
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

// Edit a specific question
router.get('/question/edit/:id', ensureAuthenticated, async (req, res) => {

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

        let question = await Question.findOne({ _id: req.params.id, user: req.user.id })
            .lean();

        if (!question) {

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

            res.render('surveys/edit1P', {
                avatar: req.user.avatar,
                firstName: req.user.firstName,
                lastName: req.user.lastName,
                email: req.user.email,
                newMessages,
                newNotifications,
                question,
                title: req.user.firstName + ' ' + req.user.lastName + ' / Edit: ' + question.questionName + ' - Orca MPC',
                layout: 'survey'
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

router.post('/question/edit', ensureAuthenticated, async (req, res) => {

    try {

        let question = await Question.findOne({ _id: req.body.questionid, user: req.user.id })
            .lean();

        if (!question) {

            req.flash('flash_error_message', 'Sorry, this question is not existing');
            res.redirect('/users/surveys/question');

        } else {

            await Question.updateOne({ _id: req.body.questionid, user: req.user.id }, req.body);
            req.flash('flash_success_message', 'You have successfully updated this question');
            res.redirect('/users/surveys/question/view/' + req.body.questionid);

        }

    } catch (err) {

        req.flash('flash_error_message', 'Sorry, an unknown error occurred');
        res.redirect('/users/surveys/question');

    }

});

// Add a question to a specific survey
router.post('/question/addtosurvey', ensureAuthenticated, async (req, res) => {

    try {

        let question = await Question.findOne({ _id: req.body.questionid, user: req.user.id })
            .lean();

        if (!question) {

            req.flash('flash_error_message', 'Sorry, this question is not existing');
            res.redirect('/users/surveys/question');

        } else {

            let checksurvey = await Survey.findOne({ _id: req.body.surveyid, user: req.user.id })
                .lean();

            var questionsNum = checksurvey.radioQuestions.length + checksurvey.checkboxQuestions.length + checksurvey.inputQuestions.length;

            if (questionsNum < 10) {

                if (req.body.questiontype == "Radio") {
                    let survey = await Survey.findOne({ _id: req.body.surveyid, user: req.user.id, radioQuestions: req.body.questionid })
                        .lean();

                    if (survey) {
                        req.flash('flash_error_message', 'Sorry, the survey you chose has already contained this question');
                        res.redirect('/users/surveys/question/view/' + req.body.questionid);
                    } else {
                        await Survey.updateOne({ _id: req.body.surveyid, user: req.user.id }, { $push: { radioQuestions: req.body.questionid } });
                        req.flash('flash_success_message', 'You have successfully added this question to the survey you chose');
                        res.redirect('/users/surveys/question/view/' + req.body.questionid);
                    }
                }

                if (req.body.questiontype == "Checkbox") {
                    let survey = await Survey.findOne({ _id: req.body.surveyid, user: req.user.id, checkboxQuestions: req.body.questionid })
                        .lean();

                    if (survey) {
                        req.flash('flash_error_message', 'Sorry, the survey you chose has already contained this question');
                        res.redirect('/users/surveys/question/view/' + req.body.questionid);
                    } else {
                        await Survey.updateOne({ _id: req.body.surveyid, user: req.user.id }, { $push: { checkboxQuestions: req.body.questionid } });
                        req.flash('flash_success_message', 'You have successfully added this question to the survey you chose');
                        res.redirect('/users/surveys/question/view/' + req.body.questionid);
                    }
                }

                if (req.body.questiontype == "Input") {
                    let survey = await Survey.findOne({ _id: req.body.surveyid, user: req.user.id, inputQuestions: req.body.questionid })
                        .lean();

                    if (survey) {
                        req.flash('flash_error_message', 'Sorry, the survey you chose has already contained this question');
                        res.redirect('/users/surveys/question/view/' + req.body.questionid);
                    } else {
                        await Survey.updateOne({ _id: req.body.surveyid, user: req.user.id }, { $push: { inputQuestions: req.body.questionid } });
                        req.flash('flash_success_message', 'You have successfully added this question to the survey you chose');
                        res.redirect('/users/surveys/question/view/' + req.body.questionid);
                    }
                }

            } else {
                req.flash('flash_error_message', 'Sorry, each survey can only contain at most 10 questions');
                res.redirect('/users/surveys/question/view/' + req.body.questionid);
            }

        }

    } catch (err) {

        req.flash('flash_error_message', 'Sorry, an unknown error occurred');
        res.redirect('/users/surveys/question');

    }

});

// Delete a specific question
router.post('/question/delete', ensureAuthenticated, async (req, res) => {

    try {

        let question = await Question.findOne({ _id: req.body.questionid, user: req.user.id })
            .lean();

        if (!question) {

            req.flash('flash_error_message', 'Sorry, this question is not existing');
            res.redirect('/users/surveys/question');

        } else {

            var relatedSurveyNum;

            if (question.questionType == "Radio") {

                await Survey.countDocuments({ user: req.user.id, radioQuestions: question._id }, function (err, count) {
                    if (err) {
                        relatedSurveyNum = 0;
                    } else {
                        relatedSurveyNum = count;
                    }
                });

            } else if (question.questionType == "Checkbox") {

                await Survey.countDocuments({ user: req.user.id, checkboxQuestions: question._id }, function (err, count) {
                    if (err) {
                        relatedSurveyNum = 0;
                    } else {
                        relatedSurveyNum = count;
                    }
                });

            } else {

                await Survey.countDocuments({ user: req.user.id, inputQuestions: question._id }, function (err, count) {
                    if (err) {
                        relatedSurveyNum = 0;
                    } else {
                        relatedSurveyNum = count;
                    }
                });

            }

            if (relatedSurveyNum == 0) {

                await Question.deleteOne({ _id: req.body.questionid, user: req.user.id });
                req.flash('flash_success_message', 'You have successfully deleted this question');
                res.redirect('/users/surveys/question');

            } else {

                req.flash('flash_error_message', 'Sorry, you cannot delete this question');
                res.redirect('/users/surveys/question/view/' + req.body.questionid);

            }

        }

    } catch (err) {

        req.flash('flash_error_message', 'Sorry, an unknown error occurred');
        res.redirect('/users/surveys/question');

    }

});

/* Unpublished Surveys */

// Manage all unpublished surveys
router.get('/unpublished', ensureAuthenticated, async (req, res) => {

    try {

        var newMessages;
        var newNotifications;
        const mySurveys = await Survey.find({ user: req.user.id, status: 'Unpublished' })
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

        res.render('surveys/viewAll1P', {
            avatar: req.user.avatar,
            firstName: req.user.firstName,
            lastName: req.user.lastName,
            email: req.user.email,
            newMessages,
            newNotifications,
            mySurveys,
            title: 'Unpublished Surveys of ' + req.user.firstName + ' ' + req.user.lastName + ' - Orca MPC',
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

// Create new survey - Survey Creator
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

        res.render('surveys/create2P', {
            avatar: req.user.avatar,
            firstName: req.user.firstName,
            lastName: req.user.lastName,
            email: req.user.email,
            newMessages,
            newNotifications,
            title: req.user.firstName + ' ' + req.user.lastName + ' / Create: Survey - Orca MPC',
            layout: 'survey'
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
        await Survey.create(req.body);
        req.flash('flash_success_message', 'You have successfully created a survey');
        res.redirect('/users/surveys/unpublished');

    } catch (err) {

        req.flash('flash_error_message', 'Sorry, an unknown error occurred');
        res.redirect('/users/surveys/unpublished');

    }

});

// View specific unpublished survey
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

        let survey = await Survey.findOne({ _id: req.params.id, user: req.user.id, status: 'Unpublished' })
            .populate('user')
            .populate('radioQuestions')
            .populate('checkboxQuestions')
            .populate('inputQuestions')
            .lean();

        if (!survey) {

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

            res.render('surveys/view1P', {
                avatar: req.user.avatar,
                firstName: req.user.firstName,
                lastName: req.user.lastName,
                email: req.user.email,
                newMessages,
                newNotifications,
                survey,
                title: req.user.firstName + ' ' + req.user.lastName + ' / View: ' + survey.surveyTitle + ' - Orca MPC',
                layout: 'survey'
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

// Edit specific unpublished survey
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

        let survey = await Survey.findOne({ _id: req.params.id, user: req.user.id, status: 'Unpublished' })
            .lean();

        if (!survey) {

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

            res.render('surveys/edit2P', {
                avatar: req.user.avatar,
                firstName: req.user.firstName,
                lastName: req.user.lastName,
                email: req.user.email,
                newMessages,
                newNotifications,
                survey,
                title: req.user.firstName + ' ' + req.user.lastName + ' / Edit: ' + survey.surveyTitle + ' - Orca MPC',
                layout: 'survey'
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

        let survey = await Survey.findOne({ _id: req.body.surveyid, user: req.user.id, status: 'Unpublished' })
            .lean();

        if (!survey) {

            req.flash('flash_error_message', 'Sorry, this survey is not existing');
            res.redirect('/users/surveys/unpublished');

        } else {

            await Survey.updateOne({ _id: req.body.surveyid, user: req.user.id, status: 'Unpublished' }, req.body);
            req.flash('flash_success_message', 'You have successfully updated this survey');
            res.redirect('/users/surveys/unpublished/view/' + req.body.surveyid);

        }

    } catch (err) {

        req.flash('flash_error_message', 'Sorry, an unknown error occurred');
        res.redirect('/users/surveys/unpublished');

    }

});

// Remove a question from a specific unpublished survey
router.post('/unpublished/remove', ensureAuthenticated, async (req, res) => {

    try {

        let survey = await Survey.findOne({ _id: req.body.surveyid, user: req.user.id, status: 'Unpublished' })
            .lean();

        if (!survey) {

            req.flash('flash_error_message', 'Sorry, this survey is not existing');
            res.redirect('/users/surveys/unpublished');

        } else {

            if (req.body.questiontype == "Radio") {

                await Survey.updateOne({ _id: req.body.surveyid, user: req.user.id, status: 'Unpublished' }, { $pullAll: { radioQuestions: [req.body.questionid] } });
                req.flash('flash_success_message', 'You have successfully removed a question');
                res.redirect('/users/surveys/unpublished/view/' + req.body.surveyid);

            } else if (req.body.questiontype == "Checkbox") {

                await Survey.updateOne({ _id: req.body.surveyid, user: req.user.id, status: 'Unpublished' }, { $pullAll: { checkboxQuestions: [req.body.questionid] } });
                req.flash('flash_success_message', 'You have successfully removed a question');
                res.redirect('/users/surveys/unpublished/view/' + req.body.surveyid);

            } else {

                await Survey.updateOne({ _id: req.body.surveyid, user: req.user.id, status: 'Unpublished' }, { $pullAll: { inputQuestions: [req.body.questionid] } });
                req.flash('flash_success_message', 'You have successfully removed a question');
                res.redirect('/users/surveys/unpublished/view/' + req.body.surveyid);

            }


        }

    } catch (err) {

        req.flash('flash_error_message', 'Sorry, an unknown error occurred');
        res.redirect('/users/surveys/unpublished');

    }

});

// Delete a specific unpublished survey
router.post('/unpublished/delete', ensureAuthenticated, async (req, res) => {

    try {

        let survey = await Survey.findOne({ _id: req.body.surveyid, user: req.user.id, status: 'Unpublished' })
            .lean();

        if (!survey) {

            req.flash('flash_error_message', 'Sorry, this survey is not existing');
            res.redirect('/users/surveys/unpublished');

        } else {

            await Survey.deleteOne({ _id: req.body.surveyid, user: req.user.id, status: 'Unpublished' });
            req.flash('flash_success_message', 'You have successfully deleted a survey');
            res.redirect('/users/surveys/unpublished');

        }

    } catch (err) {

        req.flash('flash_error_message', 'Sorry, an unknown error occurred');
        res.redirect('/users/surveys/unpublished');

    }

});

// Publish a specific unpublished survey
router.post('/unpublished/publish', ensureAuthenticated, async (req, res) => {

    try {

        let survey = await Survey.findOne({ _id: req.body.surveyid, user: req.user.id, status: 'Unpublished' })
            .lean();

        if (!survey) {

            req.flash('flash_error_message', 'Sorry, this survey is not existing');
            res.redirect('/users/surveys/unpublished');

        } else {

            await Survey.updateOne({ _id: req.body.surveyid, user: req.user.id, status: 'Unpublished' }, { status: 'Published' });
            req.flash('flash_success_message', 'You have successfully published a survey');
            res.redirect('/users/surveys/published');

        }

    } catch (err) {

        req.flash('flash_error_message', 'Sorry, an unknown error occurred');
        res.redirect('/users/surveys/unpublished');

    }

});

/* Published Surveys */

// Manage all published surveys
router.get('/published', ensureAuthenticated, async (req, res) => {

    try {

        var newMessages;
        var newNotifications;
        const mySurveys1 = await Survey.find({ user: req.user.id, status: 'Published' })
            .sort({ createTime: 'desc' })
            .lean();

        const mySurveys2 = await Survey.find({ user: { $ne: req.user.id }, participants: req.user.id, status: 'Published' })
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

        res.render('surveys/viewAll2P', {
            avatar: req.user.avatar,
            firstName: req.user.firstName,
            lastName: req.user.lastName,
            email: req.user.email,
            newMessages,
            newNotifications,
            mySurveys1,
            mySurveys2,
            title: 'Published Surveys of ' + req.user.firstName + ' ' + req.user.lastName + ' - Orca MPC',
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

// View a specific published survey
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

        let survey = await Survey.findOne({ _id: req.params.id, user: req.user.id, status: 'Published' })
            .populate('user')
            .populate('participants')
            .populate('radioQuestions')
            .populate('checkboxQuestions')
            .populate('inputQuestions')
            .lean();

        if (!survey) {

            let survey = await Survey.findOne({ _id: req.params.id, status: 'Published' })
                .populate('user')
                .populate('participants')
                .lean();

            res.render('surveys/view22P', {
                userID: req.user.id,
                avatar: req.user.avatar,
                firstName: req.user.firstName,
                lastName: req.user.lastName,
                email: req.user.email,
                newMessages,
                newNotifications,
                survey,
                title: req.user.firstName + ' ' + req.user.lastName + ' / View: ' + survey.surveyTitle + ' - Orca MPC',
                layout: 'survey'
            });

        } else {

            res.render('surveys/view21P', {
                avatar: req.user.avatar,
                firstName: req.user.firstName,
                lastName: req.user.lastName,
                email: req.user.email,
                newMessages,
                newNotifications,
                survey,
                title: req.user.firstName + ' ' + req.user.lastName + ' / View: ' + survey.surveyTitle + ' - Orca MPC',
                layout: 'survey'
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

// Edit a specific published survey
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

        let survey = await Survey.findOne({ _id: req.params.id, user: req.user.id, status: 'Published' })
            .lean();

        if (!survey) {

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

            res.render('surveys/edit3P', {
                avatar: req.user.avatar,
                firstName: req.user.firstName,
                lastName: req.user.lastName,
                email: req.user.email,
                newMessages,
                newNotifications,
                survey,
                title: req.user.firstName + ' ' + req.user.lastName + ' / Edit: ' + survey.surveyTitle + ' - Orca MPC',
                layout: 'survey'
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

        let survey = await Survey.findOne({ _id: req.body.surveyid, user: req.user.id, status: 'Published' })
            .lean();

        if (!survey) {

            req.flash('flash_error_message', 'Sorry, this survey is not existing');
            res.redirect('/users/surveys/published');

        } else {

            await Survey.updateOne({ _id: req.body.surveyid, user: req.user.id, status: 'Published' }, req.body);
            req.flash('flash_success_message', 'You have successfully updated this survey');
            res.redirect('/users/surveys/published/view/' + req.body.surveyid);

        }

    } catch (err) {

        req.flash('flash_error_message', 'Sorry, an unknown error occurred');
        res.redirect('/users/surveys/published');

    }

});

// Remove a question from a specific published survey
router.post('/published/remove/question', ensureAuthenticated, async (req, res) => {

    try {

        let survey = await Survey.findOne({ _id: req.body.surveyid, user: req.user.id, status: 'Published' })
            .lean();

        if (!survey) {

            req.flash('flash_error_message', 'Sorry, this survey is not existing');
            res.redirect('/users/surveys/published');

        } else {

            var questionsNum = survey.radioQuestions.length + survey.checkboxQuestions.length + survey.inputQuestions.length;

            if (questionsNum <= 1) {

                req.flash('flash_error_message', 'Sorry, you cannot remove the only question of this survey');
                res.redirect('/users/surveys/published/view/' + req.body.surveyid);

            }else{

                if (req.body.questiontype == "Radio") {

                    await Survey.updateOne({ _id: req.body.surveyid, user: req.user.id, status: 'Published' }, { $pullAll: { radioQuestions: [req.body.questionid] } });
                    req.flash('flash_success_message', 'You have successfully removed a question');
                    res.redirect('/users/surveys/published/view/' + req.body.surveyid);
    
                } else if (req.body.questiontype == "Checkbox") {
    
                    await Survey.updateOne({ _id: req.body.surveyid, user: req.user.id, status: 'Published' }, { $pullAll: { checkboxQuestions: [req.body.questionid] } });
                    req.flash('flash_success_message', 'You have successfully removed a question');
                    res.redirect('/users/surveys/published/view/' + req.body.surveyid);
    
                } else {
    
                    await Survey.updateOne({ _id: req.body.surveyid, user: req.user.id, status: 'Published' }, { $pullAll: { inputQuestions: [req.body.questionid] } });
                    req.flash('flash_success_message', 'You have successfully removed a question');
                    res.redirect('/users/surveys/published/view/' + req.body.surveyid);
    
                }

            }

        }

    } catch (err) {

        req.flash('flash_error_message', 'Sorry, an unknown error occurred');
        res.redirect('/users/surveys/published');

    }

});

// Remove a registrant from a specific published survey
router.post('/published/remove/registrant', ensureAuthenticated, async (req, res) => {

    try {

        let survey = await Survey.findOne({ _id: req.body.surveyid, user: req.user.id, status: 'Published' })
            .lean();

        if (!survey) {

            req.flash('flash_error_message', 'Sorry, this survey is not existing');
            res.redirect('/users/survey/published');

        } else {

            var creator = await User.findOne({ _id: req.user.id });
            const pwdMatch = await bcrypt.compare(req.body.password, creator.password);

            if (pwdMatch) {

                await Message.create({
                    sender: req.user.id,
                    receiver: req.body.regid,
                    content: 'You have been removed from the survey: ' + survey.surveyTitle + '.',
                    relatedSurvey: req.body.surveyid
                });
                await Survey.updateOne({ _id: req.body.surveyid, user: req.user.id, status: 'Published' }, { $pullAll: { participants: [req.body.regid] } });
                req.flash('flash_success_message', 'You have successfully removed the registrant');
                res.redirect('/users/surveys/published/view/' + req.body.surveyid);

            } else {

                req.flash('flash_error_message', 'Sorry, you cannot remove this registrant because of the incorrect password');
                res.redirect('/users/surveys/published/view/' + req.body.surveyid);

            }

        }

    } catch (err) {

        req.flash('flash_error_message', 'Sorry, an unknown error occurred');
        res.redirect('/users/surveys/published');

    }

});

// Cancel a specific published Survey
router.post('/published/cancel', ensureAuthenticated, async (req, res) => {

    try {

        let survey = await Survey.findOne({ _id: req.body.surveyid, user: req.user.id, status: 'Published' })
            .populate('participants')
            .lean();

        if (!survey) {

            req.flash('flash_error_message', 'Sorry, this survey is not existing');
            res.redirect('/users/surveys/published');

        } else {

            var creator = await User.findOne({ _id: req.user.id });
            const pwdMatch = await bcrypt.compare(req.body.password, creator.password);

            if (pwdMatch) {

                if (survey.participants.length > 1) {
                    for (var i = 1; i < survey.participants.length; i++) {
                        await Message.create({
                            sender: req.user.id,
                            receiver: survey.participants[i]._id,
                            content: 'Sorry, the published survey "' + survey.surveyTitle + '" that you registered has been cancelled.',
                            relatedSurvey: req.body.surveyid
                        });
                    }
                }
                await Survey.updateOne({ _id: req.body.surveyid, user: req.user.id, status: 'Published' }, { participants: req.user.id, status: 'Unpublished' });
                req.flash('flash_success_message', 'You have successfully canceled the survey');
                res.redirect('/users/surveys/unpublished');

            } else {

                req.flash('flash_error_message', 'Sorry, you cannot cancel this survey because of the incorrect password');
                res.redirect('/users/surveys/published/view/' + req.body.surveyid);

            }

        }

    } catch (err) {

        req.flash('flash_error_message', 'Sorry, an unknown error occurred');
        res.redirect('/users/surveys/published');

    }

});

// Consent a specific published survey
router.post('/published/consent', ensureAuthenticated, async (req, res) => {

    try {

        let survey = await Survey.findOne({ _id: req.body.surveyid, user: req.user.id, status: 'Published' })
            .populate('participants')
            .lean();

        if (!survey) {

            req.flash('flash_error_message', 'Sorry, this survey is not existing');
            res.redirect('/users/surveys/published');

        } else {

            var creator = await User.findOne({ _id: req.user.id });
            const pwdMatch = await bcrypt.compare(req.body.password, creator.password);

            if (pwdMatch) {

                if (survey.participants.length > 1) {
                    for (var i = 1; i < survey.participants.length; i++) {
                        await Message.create({
                            sender: req.user.id,
                            receiver: survey.participants[i]._id,
                            content: 'Your registration for the survey "' + survey.surveyTitle + '" has been consented and now the survey is in preparation.',
                            relatedSurvey: req.body.surveyid
                        });
                    }
                }
                await Survey.updateOne({ _id: req.body.surveyid, user: req.user.id, status: 'Published' }, { status: 'Preparing' });
                req.flash('flash_success_message', 'You have successfully consented the survey, now you can prepare the survey for all registrants');
                res.redirect('/users/surveys/preparing');

            } else {

                req.flash('flash_error_message', 'Sorry, you cannot consent this survey because of the incorrect password');
                res.redirect('/users/surveys/published/view/' + req.body.surveyid);

            }

        }

    } catch (err) {

        req.flash('flash_error_message', 'Sorry, an unknown error occurred');
        res.redirect('/users/surveys/published');

    }

});

// Unregister a specifc published survey
router.post('/published/unregister', ensureAuthenticated, async (req, res) => {

    try {

        let survey = await Survey.findOne({ _id: req.body.surveyid, participants: req.user.id, status: 'Published' })
            .populate('user')
            .lean();

        if (!survey) {

            req.flash('flash_error_message', 'Sorry, this survey is not existing');
            res.redirect('/users/surveys/published');

        } else {

            const registrant = await User.findOne({ _id: req.user.id });
            const pwdMatch = await bcrypt.compare(req.body.password, registrant.password);

            if (pwdMatch) {

                await Message.create({
                    sender: req.user.id,
                    receiver: survey.user._id,
                    content: req.user.firstName + ' ' + req.user.lastName + ' has unregistered for the survey: ' + survey.surveyTitle + '.',
                    relatedSurvey: req.body.surveyid
                });
                await Survey.updateOne({ _id: req.body.surveyid, participants: req.user.id, status: 'Published' }, { $pullAll: { participants: [req.user.id] } });
                req.flash('flash_success_message', 'You have successfully unregistered for this survey');
                res.redirect('/users/surveys/published/view/' + req.body.surveyid);

            } else {

                req.flash('flash_error_message', 'Sorry, you cannot unregister this survey because of the incorrect password');
                res.redirect('/users/surveys/published/view/' + req.body.surveyid);

            }

        }

    } catch (err) {

        req.flash('flash_error_message', 'Sorry, an unknown error occurred');
        res.redirect('/users/surveys/published');

    }

});

// Register a specific published survey
router.post('/published/register', ensureAuthenticated, async (req, res) => {

    try {

        let survey = await Survey.findOne({ _id: req.body.surveyid, participants: req.user.id, status: 'Published' })
            .lean();

        if (!survey) {

            let survey = await Survey.findOne({ _id: req.body.surveyid, status: 'Published' })
                .populate('user')
                .lean();
            const registrant = await User.findOne({ _id: req.user.id });
            const pwdMatch = await bcrypt.compare(req.body.password, registrant.password);

            if (pwdMatch) {

                await Message.create({
                    sender: req.user.id,
                    receiver: survey.user._id,
                    content: req.user.firstName + ' ' + req.user.lastName + ' has registered for the survey: ' + survey.surveyTitle + '.',
                    relatedSurvey: req.body.surveyid
                });
                await Survey.updateOne({ _id: req.body.surveyid, status: 'Published' }, { $push: { participants: req.user.id } });
                req.flash('flash_success_message', 'You have successfully registered for this survey');
                res.redirect('/users/surveys/published/view/' + req.body.surveyid);

            } else {

                req.flash('flash_error_message', 'Sorry, you cannot register this survey because of the incorrect password');
                res.redirect('/users/surveys/published/view/' + req.body.surveyid);

            }

        } else {

            req.flash('flash_error_message', 'Sorry, you have already registered this survey');
            res.redirect('/users/surveys/published/view/' + req.body.surveyid);

        }

    } catch (err) {

        req.flash('flash_error_message', 'Sorry, an unknown error occurred');
        res.redirect('/users/surveys/published');

    }

});

/* Preparing Surveys (Survey in preparation) */

// Manage all surveys in preparation
router.get('/preparing', ensureAuthenticated, async (req, res) => {

    try {

        var newMessages;
        var newNotifications;
        const mySurveys1 = await Survey.find({ user: req.user.id, status: 'Preparing' })
            .sort({ createTime: 'desc' })
            .lean();

        const mySurveys2 = await Survey.find({ user: { $ne: req.user.id }, participants: req.user.id, status: 'Preparing' })
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

        res.render('surveys/viewAll3P', {
            avatar: req.user.avatar,
            firstName: req.user.firstName,
            lastName: req.user.lastName,
            email: req.user.email,
            newMessages,
            newNotifications,
            mySurveys1,
            mySurveys2,
            title: 'Survey in Preparation of ' + req.user.firstName + ' ' + req.user.lastName + ' - Orca MPC',
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

// View a specific preparing survey
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

        let survey = await Survey.findOne({ _id: req.params.id, user: req.user.id, status: 'Preparing' })
            .populate('user')
            .populate('participants')
            .populate('radioQuestions')
            .populate('checkboxQuestions')
            .populate('inputQuestions')
            .lean();

        if (!survey) {

            let survey = await Survey.findOne({ _id: req.params.id, participants: req.user.id, status: 'Preparing' })
                .populate('user')
                .populate('participants')
                .lean();

            if (!survey) {

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

                let surveysession = await SurveySession.findOne({ survey: req.params.id, participants: req.user.id })
                    .lean();

                res.render('surveys/view32P', {
                    userID: req.user.id,
                    avatar: req.user.avatar,
                    firstName: req.user.firstName,
                    lastName: req.user.lastName,
                    email: req.user.email,
                    newMessages,
                    newNotifications,
                    survey,
                    surveysession,
                    title: req.user.firstName + ' ' + req.user.lastName + ' / View: ' + survey.surveyTitle + ' - Orca MPC',
                    layout: 'survey'
                });

            }


        } else {

            let surveysession = await SurveySession.findOne({ initiator: req.user.id, survey: req.params.id })
                .lean();

            res.render('surveys/view31P', {
                avatar: req.user.avatar,
                firstName: req.user.firstName,
                lastName: req.user.lastName,
                email: req.user.email,
                newMessages,
                newNotifications,
                survey,
                surveysession,
                title: req.user.firstName + ' ' + req.user.lastName + ' / View: ' + survey.surveyTitle + ' - Orca MPC',
                layout: 'survey2'
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

// Configure a survey session for a specific survey
router.post('/preparing/configure', ensureAuthenticated, async (req, res) => {

    try {

        let surveysession = await SurveySession.findOne({ initiator: req.user.id, survey: req.body.survey })
            .lean();

        if (!surveysession) {

            const initiator = await User.findOne({ _id: req.user.id });
            const pwdMatch = await bcrypt.compare(req.body.password, initiator.password);

            if (pwdMatch) {

                await SurveySession.create({
                    initiator: req.user.id,
                    survey: req.body.survey,
                    publicKey: req.body.publicKey,
                    privateKey: req.body.privateKey,
                    token: req.body.token,
                    participants: req.body.participants,
                    confirmAttendance: req.user.id
                });

                let surveysession = await SurveySession.findOne({ initiator: req.user.id, survey: req.body.survey })
                    .populate('survey')
                    .populate('participants')
                    .lean();

                for (var i = 0; i < surveysession.participants.length; i++) {
                    await Message.create({
                        sender: req.user.id,
                        receiver: surveysession.participants[i]._id,
                        content: 'The initiator of the survey "' + surveysession.survey.surveyTitle
                            + '" has already configured the survey session, please click the button bellow to go to confirm your attendence. Other Information about this survey: '
                            + req.body.notification + '. In addition, the token used for attending the survey session is "'
                            + req.body.token + '", please do not tell this token to anyone else.',
                        relatedSurvey: req.body.survey,
                        messageLabel: 'Notification'
                    });
                }

                req.flash('flash_success_message', 'You have successfully configured the survey session, please wait for other users to confirm their attendance');
                res.redirect('/users/surveys/preparing/view/' + req.body.survey);

            } else {

                req.flash('flash_error_message', 'Sorry, you cannot configure the survey session because of the incorrect password');
                res.redirect('/users/surveys/preparing/view/' + req.body.survey);

            }

        } else {

            req.flash('flash_error_message', 'Sorry, you have already configured the survey session');
            res.redirect('/users/surveys/preparing/view/' + req.body.survey);

        }

    } catch (err) {

        req.flash('flash_error_message', 'Sorry, an unknown error occurred');
        res.redirect('/users/surveys/preparing');

    }

});

// Cancel a specific preparing survey
router.post('/preparing/cancel', ensureAuthenticated, async (req, res) => {

    try {

        let survey = await Survey.findOne({ _id: req.body.surveyid, user: req.user.id, status: 'Preparing' })
            .populate('participants')
            .lean();

        if (!survey) {

            req.flash('flash_error_message', 'Sorry, this survey is not existing');
            res.redirect('/users/surveys/preparing');

        } else {

            var creator = await User.findOne({ _id: req.user.id });
            const pwdMatch = await bcrypt.compare(req.body.password, creator.password);

            if (pwdMatch) {

                let surveysession = await SurveySession.findOne({ initiator: req.user.id, survey: req.body.surveyid })
                    .lean();

                if (survey.participants.length > 1) {
                    for (var i = 1; i < survey.participants.length; i++) {
                        await Message.create({
                            sender: req.user.id,
                            receiver: survey.participants[i]._id,
                            content: 'Sorry, the survey in preparation "' + survey.surveyTitle
                                + '" that you participated has been cancelled by the creator. The reasons are as follows: '
                                + req.body.cancelreason + '.',
                            relatedSurvey: req.body.surveyid
                        });
                    }
                }
                await Message.updateMany({ relatedSurvey: { $in: [req.body.surveyid] }, messageLabel: { $in: ['Notification'] } }, { $set: { status: 'Read' } });
                await Survey.updateOne({ _id: req.body.surveyid, user: req.user.id, status: 'Preparing' }, { participants: req.user.id, status: 'Unpublished' });

                if (surveysession) {
                    await SurveySession.deleteOne({ initiator: req.user.id, survey: req.body.surveyid });
                }

                req.flash('flash_success_message', 'You have successfully canceled the survey');
                res.redirect('/users/surveys/unpublished');

            } else {

                req.flash('flash_error_message', 'Sorry, you cannot cancel this survey because of the incorrect password');
                res.redirect('/users/surveys/preparing/view/' + req.body.surveyid);

            }

        }

    } catch (err) {

        req.flash('flash_error_message', 'Sorry, an unknown error occurred');
        res.redirect('/users/surveys/preparing');

    }

});

// Initiate a specific preparing survey
router.post('/preparing/initiate', ensureAuthenticated, async (req, res) => {

    try {

        let survey1 = await Survey.findOne({ user: req.user.id, status: 'Initiating' })
            .lean();

        if (survey1) {

            req.flash('flash_error_message', 'Sorry, you can only initiate one survey session at a time');
            res.redirect('/users/surveys/preparing/view/' + req.body.surveyid);

        } else {

            let survey2 = await Survey.findOne({ _id: req.body.surveyid, user: req.user.id, status: 'Preparing' })
                .populate('participants')
                .lean();

            if (!survey2) {

                req.flash('flash_error_message', 'Sorry, this survey is not existing');
                res.redirect('/users/surveys/preparing');

            } else {

                var creator = await User.findOne({ _id: req.user.id });
                const pwdMatch = await bcrypt.compare(req.body.password, creator.password);

                if (pwdMatch) {

                    await Message.updateMany({ relatedSurvey: { $in: [req.body.surveyid] }, messageLabel: { $in: ['Notification'] } }, { $set: { status: 'Read' } });

                    if (survey2.participants.length > 1) {
                        for (var i = 1; i < survey2.participants.length; i++) {
                            await Message.create({
                                sender: req.user.id,
                                receiver: survey2.participants[i]._id,
                                content: 'The creator of the survey "' + survey2.surveyTitle
                                    + '" has initiated the survey session, please click the button below to go to attend the survey session.',
                                relatedSurvey: req.body.surveyid,
                                messageLabel: 'Notification'
                            });
                        }
                    }
                    await Survey.updateOne({ _id: req.body.surveyid, user: req.user.id, status: 'Preparing' }, { status: 'Initiating' });
                    await SurveySession.updateOne({ _id: req.body.sessionid, initiator: req.user.id, status: 'Initialized' }, { authenticatedUser: req.user.id, status: 'Ongoing' });
                    res.redirect('/users/surveys/initiating/view/' + req.body.surveyid);

                } else {

                    req.flash('flash_error_message', 'Sorry, you cannot initiate this survey because of the incorrect password');
                    res.redirect('/users/surveys/preparing/view/' + req.body.surveyid);

                }

            }

        }

    } catch (err) {

        req.flash('flash_error_message', 'Sorry, an unknown error occurred');
        res.redirect('/users/surveys/preparing');

    }

});

// Confirm Attendance for a specific preparing survey
router.post('/preparing/confirmattandence', ensureAuthenticated, async (req, res) => {

    try {

        let surveysession = await SurveySession.findOne({ _id: req.body.sessionid, participants: req.user.id })
            .lean();

        if (!surveysession) {

            req.flash('flash_error_message', 'Sorry, you cannot confirm the attendance for this survey');
            res.redirect('/users/surveys/preparing');

        } else {

            let surveysession = await SurveySession.findOne({ _id: req.body.sessionid, participants: req.user.id, confirmAttendance: req.user.id })
                .lean();

            if (!surveysession) {

                const confirmuser = await User.findOne({ _id: req.user.id });
                const pwdMatch = await bcrypt.compare(req.body.password, confirmuser.password);

                if (pwdMatch) {

                    let survey = await Survey.findOne({ _id: req.body.surveyid, participants: req.user.id, status: 'Preparing' })
                        .populate('user')
                        .lean();

                    await Message.create({
                        sender: req.user.id,
                        receiver: survey.user._id,
                        content: req.user.firstName + ' ' + req.user.lastName + ' has confirmed the attendance for the survey: ' + survey.surveyTitle + '.',
                        relatedSurvey: req.body.surveyid
                    });
                    await SurveySession.updateOne({ _id: req.body.sessionid, participants: req.user.id, status: 'Initialized' }, { $push: { confirmAttendance: req.user.id } });

                    req.flash('flash_success_message', 'You have successfully confirmed your attendance, please wait for the creator to initiate the survey session');
                    res.redirect('/users/surveys/preparing/view/' + req.body.surveyid);

                } else {

                    req.flash('flash_error_message', 'Sorry, you cannot confirm your attendance because of the incorrect password');
                    res.redirect('/users/surveys/preparing/view/' + req.body.surveyid);

                }

            } else {

                req.flash('flash_error_message', 'Sorry, you have already confirmed the attendance for this survey');
                res.redirect('/users/surveys/preparing/view/' + req.body.surveyid);

            }

        }

    } catch (err) {

        req.flash('flash_error_message', 'Sorry, an unknown error occurred');
        res.redirect('/users/surveys/preparing');

    }

});

/* Initiating Survey */

// Manage all initiating surveys
router.get('/initiating', ensureAuthenticated, async (req, res) => {

    try {

        var newMessages;
        var newNotifications;
        const mySurveys1 = await Survey.find({ user: req.user.id, status: 'Initiating' })
            .sort({ createTime: 'desc' })
            .lean();
        const mySurveys2 = await Survey.find({ user: { $ne: req.user.id }, participants: req.user.id, status: 'Initiating' })
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

        res.render('surveys/viewAll4P', {
            avatar: req.user.avatar,
            firstName: req.user.firstName,
            lastName: req.user.lastName,
            email: req.user.email,
            newMessages,
            newNotifications,
            mySurveys1,
            mySurveys2,
            title: 'Initiating Surveys of ' + req.user.firstName + ' ' + req.user.lastName + ' - Orca MPC',
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

// View specifc initiating survey (survey fill page)
router.get('/initiating/view/:id', ensureAuthenticated, async (req, res) => {

    try {

        let surveysession = await SurveySession.findOne({ survey: req.params.id, initiator: req.user.id, status: 'Ongoing' })
            .populate('initiator')
            .populate('survey')
            .populate('submitters')
            .lean();

        if (!surveysession) {

            let surveysession = await SurveySession.findOne({ survey: req.params.id, participants: req.user.id, status: 'Ongoing' })
                .populate('initiator')
                .populate('survey')
                .lean();

            if (!surveysession) {

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

                let survey = await Survey.findOne({ _id: req.params.id, participants: req.user.id, status: 'Initiating' })
                    .populate('participants')
                    .populate('radioQuestions')
                    .populate('checkboxQuestions')
                    .populate('inputQuestions')
                    .lean();

                let surveysession = await SurveySession.findOne({ survey: req.params.id, authenticatedUser: req.user.id, status: 'Ongoing' })
                    .populate('initiator')
                    .lean();

                if (!surveysession) {

                    res.render('surveys/view41P', {
                        survey,
                        title: req.user.firstName + ' ' + req.user.lastName + ' / View: ' + survey.surveyTitle + ' - Orca MPC',
                        layout: 'surveysession'
                    });

                } else {

                    let surveysession = await SurveySession.findOne({ survey: req.params.id, submitters: req.user.id, status: 'Ongoing' })
                        .populate('initiator')
                        .lean();

                    if (surveysession) {

                        req.flash('flash_error_message', 'Sorry, you have already submitted your answers, please wait for the initiator to finish this survey session');
                        res.redirect('/users/surveys/initiating');

                    } else {

                        let surveysession = await SurveySession.findOne({ survey: req.params.id, authenticatedUser: req.user.id, status: 'Ongoing' })
                            .populate('initiator')
                            .lean();

                        res.render('surveys/view43P', {
                            userID: req.user.id,
                            survey,
                            surveysession,
                            title: req.user.firstName + ' ' + req.user.lastName + ' / View: ' + survey.surveyTitle + ' - Orca MPC',
                            layout: 'surveysession'
                        });

                    }

                }

            }


        } else {

            let survey = await Survey.findOne({ _id: req.params.id, user: req.user.id, status: 'Initiating' })
                .populate('participants')
                .populate('radioQuestions')
                .populate('checkboxQuestions')
                .populate('inputQuestions')
                .lean();

            res.render('surveys/view42P', {
                userID: req.user.id,
                survey,
                surveysession,
                title: req.user.firstName + ' ' + req.user.lastName + ' / View: ' + survey.surveyTitle + ' - Orca MPC',
                layout: 'surveysession'
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

// Survey session authentication
router.post('/initiating/authenticate', ensureAuthenticated, async (req, res) => {

    try {

        let surveysession = await SurveySession.findOne({ survey: req.body.surveyid, participants: req.user.id, authenticatedUser: { $ne: req.user.id }, status: 'Ongoing' })
            .lean();

        if (!surveysession) {

            req.flash('flash_error_message', 'Sorry, this survey session is not existing');
            res.redirect('/users/surveys/initiating');

        } else {

            const pwdMatch = await bcrypt.compare(req.body.sessiontoken, surveysession.token);

            if (pwdMatch) {

                await SurveySession.updateOne({ survey: req.body.surveyid, participants: req.user.id, status: 'Ongoing' }, { $push: { authenticatedUser: req.user.id } });
                res.redirect('/users/surveys/initiating/view/' + req.body.surveyid);

            } else {

                req.flash('flash_error_message', 'Sorry, you cannot access this survey session');
                res.redirect('/users/surveys/initiating/view/' + req.body.surveyid);

            }

        }

    } catch (err) {

        req.flash('flash_error_message', 'Sorry, an unknown error occurred');
        res.redirect('/users/surveys/initiating');

    }

});

// Initiating survey submit
router.post('/initiating/submit', ensureAuthenticated, async (req, res) => {

    try {

        let surveysession = await SurveySession.findOne({ _id: req.body.sessionid, authenticatedUser: req.user.id, submitters: { $ne: req.user.id }, status: 'Ongoing' })
            .lean();

        if (!surveysession) {

            req.flash('flash_error_message', 'Sorry, this survey session is not existing');
            res.redirect('/users/surveys/initiating');

        } else {

            await SurveySession.updateOne({ _id: req.body.sessionid, authenticatedUser: req.user.id, status: 'Ongoing' }, { $push: { submitters: req.user.id } });
            req.flash('flash_success_message', 'You have sucessfully submitted your answer, please wait for the initiator to finish this survey session');
            res.redirect('/users/surveys/initiating');

        }

    } catch (err) {

        req.flash('flash_error_message', 'Sorry, an unknown error occurred');
        res.redirect('/users/surveys/initiating');

    }

});

// Initiating survey cancel
router.post('/initiating/cancel', ensureAuthenticated, async (req, res) => {

    try {

        let surveysession = await SurveySession.findOne({ _id: req.body.sessionid, initiator: req.user.id, status: 'Ongoing' })
            .populate('participants')
            .lean();

        if (!surveysession) {

            req.flash('flash_error_message', 'Sorry, this survey session is not existing');
            res.redirect('/users/surveys/initiating');

        } else {

            let survey = await Survey.findOne({ _id: req.body.surveyid, user: req.user.id });

            if (surveysession.participants.length > 1) {
                for (var i = 1; i < surveysession.participants.length; i++) {
                    await Message.create({
                        sender: req.user.id,
                        receiver: survey.participants[i]._id,
                        content: 'Sorry, the initiating survey "' + survey.surveyTitle
                            + '" that you participated has been cancelled by the creator. The reasons are as follows: '
                            + req.body.cancelreason + '.',
                        relatedSurvey: req.body.surveyid
                    });
                }
            }

            await Message.updateMany({ relatedSurvey: { $in: [req.body.surveyid] }, messageLabel: { $in: ['Notification'] } }, { $set: { status: 'Read' } });
            await Survey.updateOne({ _id: req.body.surveyid, user: req.user.id, status: 'Initiating' }, { result: 'Survey Cancelled', status: 'Expired' });
            await SurveySession.updateOne({ _id: req.body.sessionid, initiator: req.user.id, status: 'Ongoing' }, { status: 'Cancelled' });
            req.flash('flash_success_message', 'You have sucessfully cancelled this survey');
            res.redirect('/users/surveys/expired/view/' + req.body.surveyid);

        }

    } catch (err) {

        req.flash('flash_error_message', 'Sorry, an unknown error occurred');
        res.redirect('/users/surveys/initiating');

    }

});

// Initiating survey finish
router.post('/initiating/finish', ensureAuthenticated, async (req, res) => {

    try {

        let surveysession = await SurveySession.findOne({ _id: req.body.sessionid, initiator: req.user.id, status: 'Ongoing' })
            .populate('participants')
            .lean();

        if (!surveysession) {

            req.flash('flash_error_message', 'Sorry, this survey is not existing');
            res.redirect('/users/surveys/initiating');

        } else {

            let survey = await Survey.findOne({ _id: req.body.surveyid, user: req.user.id });

            if (surveysession.participants.length > 1) {
                for (var i = 1; i < surveysession.participants.length; i++) {
                    await Message.create({
                        sender: req.user.id,
                        receiver: survey.participants[i]._id,
                        content: 'The initiating survey "' + survey.surveyTitle
                            + '" that you participated has finished. Please go to your "Expired Survey" tab to view the result.',
                        relatedSurvey: req.body.surveyid
                    });
                }
            }

            await Message.updateMany({ relatedSurvey: { $in: [req.body.surveyid] }, messageLabel: { $in: ['Notification'] } }, { $set: { status: 'Read' } });

            if (!req.body.result || !req.body.result.length) {
                await Survey.updateOne({ _id: req.body.surveyid, user: req.user.id, status: 'Initiating' }, { result: 'Survey Failed', status: 'Expired' });
                await SurveySession.updateOne({ _id: req.body.sessionid, initiator: req.user.id, status: 'Ongoing' }, { status: 'Failed' });
            } else {
                await Survey.updateOne({ _id: req.body.surveyid, user: req.user.id, status: 'Initiating' }, { result: req.body.result, status: 'Expired' });
                await SurveySession.updateOne({ _id: req.body.sessionid, initiator: req.user.id, status: 'Ongoing' }, { status: 'Finished' });
            }

            req.flash('flash_success_message', 'You have sucessfully finished this survey, you can now view the result');
            res.redirect('/users/surveys/expired/view/' + req.body.surveyid);

        }

    } catch (err) {

        req.flash('flash_error_message', 'Sorry, an unknown error occurred');
        res.redirect('/users/surveys/initiating');

    }

});

/* Expired Survey */

// Manage all expired surveys
router.get('/expired', ensureAuthenticated, async (req, res) => {

    try {

        var newMessages;
        var newNotifications;
        const mySurveys1 = await Survey.find({ user: req.user.id, status: 'Expired' })
            .sort({ createTime: 'desc' })
            .lean();
        const mySurveys2 = await Survey.find({ user: { $ne: req.user.id }, participants: req.user.id, status: 'Expired' })
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

        res.render('surveys/viewAll5P', {
            avatar: req.user.avatar,
            firstName: req.user.firstName,
            lastName: req.user.lastName,
            email: req.user.email,
            newMessages,
            newNotifications,
            mySurveys1,
            mySurveys2,
            title: 'Expired Survey of ' + req.user.firstName + ' ' + req.user.lastName + ' - Orca MPC',
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

// View specific expired survey
router.get('/expired/view/:id', ensureAuthenticated, async (req, res) => {

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

        let survey = await Survey.findOne({ _id: req.params.id, user: req.user.id, status: 'Expired' })
            .populate('user')
            .populate('participants')
            .populate('participants')
            .populate('radioQuestions')
            .populate('checkboxQuestions')
            .populate('inputQuestions')
            .lean();

        if (!survey) {

            let survey = await Survey.findOne({ _id: req.params.id, participants: req.user.id, status: 'Expired' })
                .populate('user')
                .populate('participants')
                .populate('participants')
                .populate('radioQuestions')
                .populate('checkboxQuestions')
                .populate('inputQuestions')
                .lean();

            if (!survey) {

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

                res.render('surveys/view52P', {
                    avatar: req.user.avatar,
                    firstName: req.user.firstName,
                    lastName: req.user.lastName,
                    email: req.user.email,
                    newMessages,
                    newNotifications,
                    survey,
                    title: req.user.firstName + ' ' + req.user.lastName + ' / View: ' + survey.surveyTitle + ' - Orca MPC',
                    layout: 'survey3'
                });

            }


        } else {

            res.render('surveys/view51P', {
                avatar: req.user.avatar,
                firstName: req.user.firstName,
                lastName: req.user.lastName,
                email: req.user.email,
                newMessages,
                newNotifications,
                survey,
                title: req.user.firstName + ' ' + req.user.lastName + ' / View: ' + survey.surveyTitle + ' - Orca MPC',
                layout: 'survey3'
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

// Reopen a specific expired survey
router.get('/expired/reopen/:id', ensureAuthenticated, async (req, res) => {

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

        let survey = await Survey.findOne({ _id: req.params.id, user: req.user.id, result: 'Survey Failed', status: 'Expired' })
            .lean();

        if (!survey) {

            let survey = await Survey.findOne({ _id: req.params.id, user: req.user.id, result: 'Survey Cancelled', status: 'Expired' })
                .lean();

            if (!survey) {

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

                res.render('surveys/edit4P', {
                    avatar: req.user.avatar,
                    firstName: req.user.firstName,
                    lastName: req.user.lastName,
                    email: req.user.email,
                    newMessages,
                    newNotifications,
                    survey,
                    title: req.user.firstName + ' ' + req.user.lastName + ' / Reopen: ' + survey.surveyTitle + ' - Orca MPC',
                    layout: 'survey3'
                });

            }


        } else {

            res.render('surveys/edit4P', {
                avatar: req.user.avatar,
                firstName: req.user.firstName,
                lastName: req.user.lastName,
                email: req.user.email,
                newMessages,
                newNotifications,
                survey,
                title: req.user.firstName + ' ' + req.user.lastName + ' / Reopen: ' + survey.surveyTitle + ' - Orca MPC',
                layout: 'survey3'
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

router.post('/expired/reopen', ensureAuthenticated, async (req, res) => {

    try {

        let survey = await Survey.findOne({ _id: req.body.surveyid, user: req.user.id, result: { $in: ['Survey Failed', 'Survey Cancelled'] }, status: 'Expired' })
            .populate('participants')
            .lean();

        if (!survey) {

            req.flash('flash_error_message', 'Sorry, this survey is not existing');
            res.redirect('/users/surveys/expired');

        } else {

            var creator = await User.findOne({ _id: req.user.id });
            const pwdMatch = await bcrypt.compare(req.body.password, creator.password);

            if (pwdMatch) {

                if (survey.participants.length > 1) {
                    for (var i = 1; i < survey.participants.length; i++) {
                        await Message.create({
                            sender: req.user.id,
                            receiver: survey.participants[i]._id,
                            content: 'The survey "' + survey.surveyTitle
                                + '" has been reopened, Please click the button bellow to go to check this survey. The reason of reopening are follows: '
                                + req.body.reopenreason + '.',
                            relatedSurvey: req.body.surveyid,
                            messageLabel: 'Notification'
                        });
                    }
                }

                await Survey.updateOne({ _id: req.body.surveyid, user: req.user.id, status: 'Expired' }, {
                    estimatedDate: req.body.estimatedDate, estimatedTime: req.body.estimatedTime, estimatedDuration: req.body.estimatedDuration, status: 'Preparing'
                });
                await SurveySession.deleteOne({ initiator: req.user.id, survey: req.body.surveyid });
                req.flash('flash_success_message', 'You have successfully reopened this survey, please configure the survey session for all participants first');
                res.redirect('/users/surveys/preparing/view/' + req.body.surveyid);

            } else {

                req.flash('flash_error_message', 'Sorry, you cannot reopen this survey because of the incorrect password');
                res.redirect('/users/surveys/expired/view/' + req.body.surveyid);

            }

        }

    } catch (err) {

        req.flash('flash_error_message', 'Sorry, an unknown error occurred');
        res.redirect('/users/surveys/expired');

    }

});

// Delete a specific expired survey
router.post('/expired/delete', ensureAuthenticated, async (req, res) => {

    try {

        let survey = await Survey.findOne({ _id: req.body.surveyid, user: req.user.id, result: { $in: ['Survey Failed', 'Survey Cancelled'] }, status: 'Expired' })
            .populate('participants')
            .lean();

        if (!survey) {

            req.flash('flash_error_message', 'Sorry, this survey is not existing');
            res.redirect('/users/surveys/expired');

        } else {

            var creator = await User.findOne({ _id: req.user.id });
            const pwdMatch = await bcrypt.compare(req.body.password, creator.password);

            if (pwdMatch) {

                if (survey.participants.length > 1) {
                    for (var i = 1; i < survey.participants.length; i++) {
                        await Message.create({
                            sender: req.user.id,
                            receiver: survey.participants[i]._id,
                            content: 'The expired survey "' + survey.surveyTitle
                                + '" has been deleted, the reason of reopening are follows: '
                                + req.body.deletereason + '.',
                            relatedSurvey: req.body.surveyid,
                            messageLabel: 'Message'
                        });
                    }
                }

                await Survey.deleteOne({ _id: req.body.surveyid, user: req.user.id, status: 'Expired' });
                await SurveySession.deleteOne({ initiator: req.user.id, survey: req.body.surveyid });
                req.flash('flash_success_message', 'You have successfully deleted this survey');
                res.redirect('/users/surveys/expired');

            } else {

                req.flash('flash_error_message', 'Sorry, you cannot delete this survey because of the incorrect password');
                res.redirect('/users/surveys/expired/view/' + req.body.surveyid);

            }

        }

    } catch (err) {

        req.flash('flash_error_message', 'Sorry, an unknown error occurred');
        res.redirect('/users/surveys/expired');

    }

});

/* All following parts will be modified  */

// This part will be splited into groups and topics in the future
router.get('/', ensureAuthenticated, async (req, res) => {
    try {
        const surveys = await Survey.find({ status: 'Published' })
            .populate('user')
            .sort({ createTime: 'desc' })
            .lean();
        res.render('surveys/viewAllP', {
            avatar: req.user.avatar,
            firstName: req.user.firstName,
            lastName: req.user.lastName,
            email: req.user.email,
            surveys,
            title: 'All Published Surveys - Orca MPC',
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

module.exports = router;