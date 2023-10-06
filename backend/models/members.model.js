const mongoose = require('../config/database');
const {Schema} = mongoose;

const memberSchema = new mongoose.Schema({
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
    address: {
        type: String,
        maxlength: 255,
        required: [true, 'Address is required'],
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
        default: [],
    },
    penalties: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'penalties',
        }],
        default: [],
    },
});

const member = mongoose.model('members', memberSchema);
module.exports = member;
