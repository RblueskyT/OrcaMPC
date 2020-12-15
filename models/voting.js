const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const votingSchema = new mongoose.Schema({
    createTime: {
        type: Date,
        default: Date.now
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    votingTitle: {
        type: String,
        required: true,
        trim: true
    },

    description: {
        type: String,
        required: true
    },

    partyCount: {
        type: Number,
        required: true
    },

    options: {
        type: Array,
        required: true
    },

    result:{
        type: Array
    },

    status: {
        type: String,
        default: 'unpublished',
        enum: ['unpublished', 'published', 'initiated', 'expired']
    }

});

module.exports = mongoose.model('Voting', votingSchema, 'voting');