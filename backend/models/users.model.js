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
            loanId: {
                type: Schema.Types.ObjectId,
                ref: 'loans',
            },
            book: {
                bookId: {
                    type: Schema.Types.ObjectId,
                    ref: 'books',
                },
                title: {
                    type: String,
                    maxlength: 255,
                },
            },
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

const user = mongoose.model('user', userSchema);
module.exports = user;

