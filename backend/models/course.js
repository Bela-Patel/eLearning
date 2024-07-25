const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
    date: { type: Date, default: Date.now },
    filePath: { type: String, default: '' }
});

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    recordings: { type: [videoSchema], default: [] } ,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Course', courseSchema);


