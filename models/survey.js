const mongoose = require('mongoose');

const surveySchema = new mongoose.Schema({
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

    surveyTitle: {
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

    radioQuestions: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Question'
        }
    ],

    checkboxQuestions: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Question'
        }
    ],

    inputQuestions: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Question'
        }
    ],

    participants: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],

    result: {
        type: String
    },

    pattern: {
        type: String,
        default: 'Participate',
        enum: ['Participate', 'Collect']
    },

    status: {
        type: String,
        default: 'Unpublished',
        enum: ['Unpublished', 'Published', 'Preparing', 'Initiating', 'Expired']
    }

});

module.exports = mongoose.model('Survey', surveySchema, 'survey');