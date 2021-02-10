const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const votingSessionSchema = new mongoose.Schema({
    createTime: {
        type: Date,
        default: Date.now
    },

    initiator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    voting: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Voting'
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

votingSessionSchema.pre('save', function (next) {

    var votingSession = this;
    if (!votingSession.isModified('token')) return next();

    bcrypt.genSalt(10, function (err, salt) {
        if (err) return next(err);
        bcrypt.hash(votingSession.token, salt, function (err, hash) {
            if (err) return next(err);
            votingSession.token = hash;
            next();
        });
    });

});

module.exports = mongoose.model('VotingSession', votingSessionSchema, 'votingsession');