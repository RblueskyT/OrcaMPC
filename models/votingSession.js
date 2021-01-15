const mongoose = require('mongoose');

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

    participants: [
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
        default: 'Normal',
        enum: ['Normal', 'Canceled', 'Finished']
    }

});

module.exports = mongoose.model('VotingSession', votingSessionSchema, 'votingsession');