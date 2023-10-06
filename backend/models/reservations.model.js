const mongoose = require('../config/database');
const {Schema} = mongoose;

const reservationSchema = new mongoose.Schema({
    reservationDate: {
        type: Date,
        required: [true, 'Reservation date is required'],
    },
    expirationDate: {
        type: Date,
        required: [true, 'Expiration date is required'],
    },
    book: {
        type: Schema.Types.ObjectId,
        ref: 'books',
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users',
    },
});

const reservation = mongoose.model('reservations', reservationSchema);
module.exports = reservation;
