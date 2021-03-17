const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const groupSchema = new mongoose.Schema({
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

    groupName: {
        type: String,
        required: true,
        trim: true
    },

    description: {
        type: String,
        required: true,
        trim: true
    },

    token: {
        type: String,
        required: true
    },

    members: [
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

groupSchema.pre('save', function (next) {

    var group = this;
    if (!group.isModified('token')) return next();

    bcrypt.genSalt(10, function (err, salt) {
        if (err) return next(err);
        bcrypt.hash(group.token, salt, function (err, hash) {
            if (err) return next(err);
            group.token = hash;
            next();
        });
    });

});

module.exports = mongoose.model('Group', groupSchema, 'group');