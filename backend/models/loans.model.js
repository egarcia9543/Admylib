const mongoose = require('../config/database');
const {Schema} = mongoose;

const loanSchema = new mongoose.Schema({
    loanDate: {
        type: Date,
        required: [true, 'Loan date is required'],
    },
    returnDate: {
        type: Date,
        required: [true, 'Return date is required'],
    },
    book: {
        type: Schema.Types.ObjectId,
        ref: 'books',
        required: [true, 'Book is required'],
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: [true, 'User is required'],
    },
    librarian: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: [true, 'Librarian is required'],
    },
    returned: {
        type: Boolean,
        default: false,
    },
});

const loan = mongoose.model('loans', loanSchema);
module.exports = loan;
