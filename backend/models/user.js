const mongoose = require('mongoose');

const roleEnum = ['student', 'instructor', 'admin'];

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: roleEnum,
        default: 'student'
    }
});

module.exports = mongoose.model('User', userSchema);
