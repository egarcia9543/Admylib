const Reservation = require('../models/reservations.model');
const Book = require('../models/books.model');
const User = require('../models/users.model');
const cron = require('node-cron');
const emailService = require('../middleware/emailservice');

exports.findAllReservations = async () => {
    try {
        return await Reservation.find().populate({path: 'book', select: 'title isbn'}).populate({path: 'user', select: 'fullname document'});
    } catch (error) {
        return error;
    }
};

exports.findReservation = async (filter, projection) => {
    try {
        if (!projection) return await Reservation.find(filter).populate({path: 'book', select: 'isbn title author publisher pages genres'}).populate({path: 'user', select: 'fullname document'});
        else return await Reservation.find(filter, projection).populate({path: 'book', select: 'isbn title author publisher pages genres'}).populate({path: 'user', select: 'fullname document'});
    } catch (error) {
        return error;
    }
};

exports.createReservationRecord = async (reservationInfo) => {
    try {
        const book = await Book.findOne({isbn: reservationInfo.book}, {isReserved: 1});
        if (book) {
            if (!book.isReserved) {
                reservationInfo.book = book._id;
                const user = await User.findOne({document: reservationInfo.document}).populate('loans');
                if (user.reservations.length > 3) {
                    return {error: 'No puedes tener más de 3 reservas'};
                }
                const loansArray = user.loans;
                for (let i = 0; i < loansArray.length; i++) {
                    if (loansArray[i].book.toString() == book._id.toString()) {
                        return {error: 'Ya tienes un préstamo activo de este libro'};
                    }
                }
                if (user.isPenalized == true) {
                    return {error: 'Tienes una sanción activa'};
                } else if (user) {
                    reservationInfo.user = user._id;
                    const reservationRegistered = await new Reservation(reservationInfo).save();
                    await Book.findOneAndUpdate({_id: book._id}, {$set: {isReserved: true}});
                    await User.findOneAndUpdate({_id: user._id}, {$push: {reservations: reservationRegistered._id}});
                    return reservationRegistered;
                } else {
                    return {error: 'Debes estar registrado para reservar un libro'};
                }
            } else {
                return {error: 'El libro ya ha sido reservado'};
            }
        } else {
            return {error: 'El libro no existe'};
        }
    } catch (error) {
        return error;
    }
};

exports.deleteReservationRecord = async (filter) => {
    const reservation = await Reservation.findOne(filter);
    const book = await Book.findOne({_id: reservation.book});
    const user = await User.findOne({_id: reservation.user});
    try {
        if ((book.copiesAvailable + book.copiesLoaned) != book.copies) {
            await Book.findOneAndUpdate({_id: book._id}, {$inc: {copiesAvailable: 1}});
        }
        await Book.findOneAndUpdate({_id: book._id}, {$set: {isReserved: false}});
        await User.findOneAndUpdate({_id: user._id}, {$pull: {reservations: reservation._id}});
        reservation.isActive = false;
        await reservation.save();
        return {success: 'Reserva cancelada correctamente'};
    } catch (error) {
        return error;
    }
};

exports.updateReservationRecord = async (filter, update) => {
    try {
        if (!filter) return {error: 'No se ha especificado un filtro'};
        if (!update) return {error: 'No se dieron datos para actualizar'};
        return await Reservation.findOneAndUpdate(filter, update, {new: true});
    } catch (error) {
        return error;
    }
};

cron.schedule('0 0 0 * * *', async () => {
    const reservations = await Reservation.find({isActive: true});
    const today = new Date();
    reservations.forEach(async (reservation) => {
        if (reservation.expirationDate <= today) {
            const book = await Book.findOne({_id: reservation.book});
            const user = await User.findOne({_id: reservation.user});
            if ((book.copiesAvailable + book.copiesLoaned) != book.copies) {
                await Book.findOneAndUpdate({_id: book._id}, {$inc: {copiesAvailable: 1}});
            }
            await Book.findOneAndUpdate({_id: book._id}, {$set: {isReserved: false}});
            await User.findOneAndUpdate({_id: user._id}, {$pull: {reservations: reservation._id}});
            reservation.isActive = false;
            await reservation.save();
        }
    });
});

cron.schedule('0 0 0 * * *', async () => {
    const reservations = await Reservation.find({isActive: true}).populate({path: 'user', select: 'email'}).populate({path: 'book', select: 'title'});
    const today = new Date().toISOString().slice(0, 10);
    reservations.forEach(async (reservation) => {
        if (reservation.expirationDate.toISOString().slice(0, 10) == today) {
            const emailBody = `
                ¡Atención!
            Su reserva del libro ${reservation.book.title} vence el día de hoy.
            Recuerde pasar por ella y registrar el préstamo.
            `;
            await emailService.sendEmail(reservation.user.email, 'Reserva a punto de expirar', emailBody);
            console.log(`Mensaje enviado a ${reservation.user.email}`);
        }
    });
});
