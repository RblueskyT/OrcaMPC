const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema({
    createTime: {
        type: Date,
        default: Date.now
    },

    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    avatar: {
        type: String,
        default: '/assets/images/app/OrcaMPC_Logo.jpg'
    },

    topicName: {
        type: String,
        required: true,
        trim: true
    },

    description: {
        type: String,
        required: true,
        trim: true
    },

    followers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],

    voting: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Voting'
        }
    ],

    survey: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Survey'
        }
    ],

    posts: [
        {
            emitTime: {
                type: Date,
                default: Date.now
            },
            sender: {
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
            }
        }
    ]

});

module.exports = mongoose.model('Topic', topicSchema, 'topic');