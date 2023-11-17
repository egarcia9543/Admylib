const Reservation = require('../models/reservations.model');
const Book = require('../models/books.model');
const User = require('../models/users.model');

exports.findAllReservations = async () => {
    try {
        return await Reservation.find().populate({path: 'book', select: 'title isbn'}).populate({path: 'user', select: 'fullname document'});
    } catch (error) {
        return error;
    }
};

exports.findReservation = async (filter, projection) => {
    try {
        if (!projection) return await Reservation.find(filter).populate('book').populate('user');
        else return await Reservation.find(filter, projection).populate('book').populate('user');
    } catch (error) {
        return error;
    }
};

exports.createReservationRecord = async (reservationInfo) => {
    try {
        const book = await Book.findOne({isbn: reservationInfo.book}, {isReserved: 1, copiesAvailable: 1});
        if (book) {
            if (!book.isReserved) {
                reservationInfo.book = book._id;
                const user = await User.findOne({document: reservationInfo.document});
                if (user) {
                    reservationInfo.user = user._id;
                    const reservationRegistered = await new Reservation(reservationInfo).save();
                    if (book.copiesAvailable > 0) {
                        await Book.findOneAndUpdate({_id: book._id}, {$inc: {copiesAvailable: -1}, $set: {isReserved: true}});
                    }
                    await Book.findOneAndUpdate({_id: book._id}, {$set: {isReserved: true}});
                    await User.findOneAndUpdate({_id: user._id}, {$push: {reservations: reservationRegistered._id}});
                    return reservationRegistered;
                } else {
                    return {error: 'El usuario no existe'};
                }
            } else {
                return {error: 'El libro ya está reservado'};
            }
        } else {
            return {error: 'El libro no existe'};
        }
    } catch (error) {
        return error;
    }
};
