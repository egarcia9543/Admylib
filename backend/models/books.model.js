const mongoose = require('../config/database');

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
        type: Array,
        required: [true, 'The author is required'],
    },
    publisher: {
        type: String,
        required: [true, 'The publisher is required'],
    },
    pages: {
        type: Number,
        required: [true, 'The number of pages is required'],
    },
    genres: {
        type: Array,
        required: [true, 'The genre is required'],
    },
    language: {
        type: String,
        required: [true, 'The language is required'],
    },
    copies: {
        type: Number,
        default: 1,
    },
    copiesAvailable: {
        type: Number,
        default: 1,
    },
    copiesReserved: {
        type: Number,
        default: 0,
    },
    copiesLoaned: {
        type: Number,
        default: 0,
    },
    cover: {
        type: String,
        required: [true, 'The cover is required'],
    },
    summary: {
        type: String,
        required: [true, 'The summary is required'],
    },
});

const book = mongoose.model('books', bookSchema);
module.exports = book;
