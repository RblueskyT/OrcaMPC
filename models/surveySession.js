const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const surveySessionSchema = new mongoose.Schema({
    createTime: {
        type: Date,
        default: Date.now
    },

    initiator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    survey: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Survey'
    },

    publicKey: {
        type: String
    },

    privateKey: {
        type: String
    },

    token: {
        type: String,
        required: true
    },

    participants: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],

    confirmAttendance: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],

    authenticatedUser: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],

    submitters: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],

    status: {
        type: String,
        default: 'Initialized',
        enum: ['Initialized', 'Ongoing', 'Failed', 'Finished', 'Cancelled']
    }

});

surveySessionSchema.pre('save', function (next) {

    var surveySession = this;
    if (!surveySession.isModified('token')) return next();

    bcrypt.genSalt(10, function (err, salt) {
        if (err) return next(err);
        bcrypt.hash(surveySession.token, salt, function (err, hash) {
            if (err) return next(err);
            surveySession.token = hash;
            next();
        });
    });

});

module.exports = mongoose.model('SurveySession', surveySessionSchema, 'surveysession');