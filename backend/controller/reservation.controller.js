const dbReservation = require('../data/reservation.data');
const dbBook = require('../data/book.data');
const dbUser = require('../data/user.data');

exports.isBookReserved = async (req, res) => {
    try {
        const book = await dbBook.findBook({isbn: req.params.isbn}, {isReserved: 1});
        const isReserved = book.isReserved;
        return res.json({success: isReserved});
    } catch (error) {
        return res.render('500', {
            error: error,
        });
    }
};

exports.addReservation = async (req, res) => {
    const {document} = req.body;
    try {
        const user = await dbUser.findOneUser({document: document});
        const book = await dbBook.findBook({isbn: req.body.book});
        if (!user) {
            return res.render('bookdetails', {
                error: 'El usuario no existe',
                book: book,
                genres: book.genres,
                authors: book.author,
                userAuthenticated: req.cookies.user,
                user: user,
            });
        }
        const reservation = await dbReservation.createReservationRecord(req.body);
        if (reservation.error) {
            return res.render('bookdetails', {
                error: reservation.error,
                message: reservation.error,
                book: book,
                genres: book.genres,
                authors: book.author,
                userAuthenticated: req.cookies.user,
                user: user,
            });
        }
        const bookReserved = await dbBook.findBook({isbn: book.isbn});
        return res.render('bookdetails', {
            success: 'El libro ha sido reservado con éxito',
            message: 'Reserva realizada',
            book: bookReserved,
            genres: book.genres,
            authors: book.author,
            userAuthenticated: req.cookies.user,
            user: user,
        });
    } catch (error) {
        return res.render('500', {
            error: error,
        });
    }
};

exports.cancelReservation = async (req, res) => {
    try {
        const reservation = await dbReservation.deleteReservationRecord({_id: req.params.id});
        if (reservation.error) {
            return res.render('profile', {
                success: false,
                message: reservation.error,
                userAuthenticated: req.cookies.user,
            });
        }
        return res.redirect('/profile');
    } catch (error) {
        return res.render('500', {
            error: error,
        });
    }
};

exports.updateReservation = async (req, res) => {
    const {id} = req.body;
    try {
        const reservation = await dbReservation.updateReservationRecord({_id: id}, req.body);
        if (reservation.error) {
            return res.json({
                error: reservation.error,
            });
        } else {
            return res.redirect('/profile');
        }
    } catch (error) {
        return res.render('500', {
            error: error,
        });
    }
};
