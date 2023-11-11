const Reservation = require('../models/reservations.model');
const User = require('../models/users.model');
const Book = require('../models/books.model');

exports.findAllReservations = async () => {
    try {
        return await Reservation.find().populate({path: 'book', select: 'title'}).populate({path: 'user', select: 'fullname'});
    } catch (error) {
        return error;
    }
};
