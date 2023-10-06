const mongoose = require('../config/database');
const {Schema} = mongoose;

const authorSchema = new mongoose.Schema({
    fullname: {
        type: String,
        maxlength: 255,
        required: [true, 'Fullname is required'],
    },
    birthdate: {
        type: Date,
        required: [true, 'Birthdate is required'],
    },
    decease: {
        type: Date,
    },
    books: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'books',
        }],
        default: [],
    },
});

const author = mongoose.model('authors', authorSchema);
module.exports = author;
