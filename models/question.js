const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    createTime: {
        type: Date,
        default: Date.now
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    questionName: {
        type: String,
        required: true,
        trim: true
    },

    description: {
        type: String,
        required: true,
        trim: true
    },

    questionType: {
        type: String,
        default: 'Radio',
        enum: ['Radio', 'Checkbox', 'Input']
    },

    options: {
        type: Array
    },

    optionLimit: {
        type: Number
    },

    inputLimit: {
        type: Array
    }

});

module.exports = mongoose.model('Question', questionSchema, 'question');