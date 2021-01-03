const mongoose = require('mongoose');

const votingSchema = new mongoose.Schema({
    createTime: {
        type: Date,
        default: Date.now
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    estimatedDate: {
        type: String,
        required: true
    },

    estimatedTime: {
        type: String,
        required: true
    },

    estimatedDuration: {
        type: Number,
        required: true
    },

    votingTitle: {
        type: String,
        required: true,
        trim: true
    },

    description: {
        type: String,
        required: true,
        trim: true
    },

    partyCount: {
        type: Number,
        required: true
    },

    options: {
        type: Array,
        required: true
    },

    participants: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],

    result: {
        type: String
    },

    status: {
        type: String,
        default: 'Unpublished',
        enum: ['Unpublished', 'Published', 'Prepared', 'Initiated', 'Expired']
    }

});

module.exports = mongoose.model('Voting', votingSchema, 'voting');