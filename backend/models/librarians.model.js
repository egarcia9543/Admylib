const mongoose = require('../config/database');

const librarianSchema = new mongoose.Schema({
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
    entryTime: {
        type: String,
        required: [true, 'Entry time is required'],
    },
    exitTime: {
        type: String,
        required: [true, 'Exit time is required'],
    },
});

const librarian = mongoose.model('librarians', librarianSchema);
module.exports = librarian;
