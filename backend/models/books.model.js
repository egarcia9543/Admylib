const mongoose = require('../config/database');
const {Schema} = mongoose;

const bookSchema = new mongoose.Schema({
    isbn: {
        type: String,
        required: [true, 'The ISBN is required'],
        unique: true,
    },
    title: {
        type: String,
        maxlength: 255,
        required: [true, 'The title is required'],
    },
    author: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'authors',
        }],
        required: [true, 'The author is required'],
    },
    publisher: {
        type: Schema.Types.ObjectId,
        ref: 'publishers',
        required: [true, 'The publisher is required'],
    },
    publicationYear: {
        type: Date,
        required: [true, 'The publication year is required'],
    },
    pages: {
        type: Number,
        required: [true, 'The number of pages is required'],
    },
    subjects: {
        type: Array,
        required: [true, 'The subjects are required'],
    },
    language: {
        type: String,
        required: [true, 'The language is required'],
    },
    copies: {
        type: Number,
        required: [true, 'The number of copies is required'],
        default: 1,
    },
    state: {
        type: String,
        enum: ['available', 'reserved', 'loaned'],
        default: 'available',
    },
});

const book = mongoose.model('books', bookSchema);
module.exports = book;
