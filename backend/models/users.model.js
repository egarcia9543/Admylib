const mongoose = require('../config/database');
const {Schema} = mongoose;

const userSchema = new Schema({
    fullname: {
        type: String,
        maxlength: 255,
        required: [true, 'Fullname is required'],
    },
    document: {
        type: Number,
        required: [true, 'Document is required'],
        unique: true,
    },
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
    phone: {
        type: Number,
        required: [true, 'Phone is required'],
    },
    role: {
        type: String,
        enum: ['librarian', 'member', 'admin'],
        default: 'member',
    },
    reservations: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'reservations',
        }],
        default: [],
    },
    loans: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'loans',
        }],
    },
    penalties: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'penalties',
        }],
        default: [],
    },
    isPenalized: {
        type: Boolean,
        default: false,
    },
    profilePicture: {
        type: String,
        default: 'https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3.webp',
    },
});

const user = mongoose.model('users', userSchema);
module.exports = user;

