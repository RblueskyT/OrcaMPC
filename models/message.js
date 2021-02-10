const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    emitTime: {
        type: Date,
        default: Date.now
    },

    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    content: {
        type: String,
        required: true,
        trim: true
    },

    relatedVoting: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Voting'
    },

    relatedSurvey: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Survey'
    },

    messageLabel: {
        type: String,
        default: 'Message',
        enum: ['Message', 'Notification']
    },

    status: {
        type: String,
        default: 'Unread',
        enum: ['Unread', 'Read']
    }

});

module.exports = mongoose.model('Message', messageSchema, 'message');