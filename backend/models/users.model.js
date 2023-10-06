const mongoose = require('../config/database');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        maxlength: 255,
        required: [true, 'Email is required'],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
    },
    role: {
        type: String,
        enum: ['admin', 'user', 'worker'],
        default: 'user',
    },
});

const user = mongoose.model('user', userSchema);
module.exports = user;

