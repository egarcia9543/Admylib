const dbReservation = require('../data/reservation.data');
const dbBook = require('../data/book.data');
const dbUser = require('../data/user.data');

exports.isBookReserved = async (req, res) => {
    try {
        const book = await dbBook.findBook({isbn: req.params.isbn}, {isReserved: 1});
        const isReserved = book.isReserved;
        return res.json({success: isReserved});
    } catch (error) {
        res.status(500).json({error: error.message});
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
                userAuthenticated: req.cookies.user,
                user: user,
            });
        }
        const reservation = await dbReservation.createReservationRecord(req.body);
        if (reservation.error) {
            return res.render('bookdetails', {
                success: false,
                message: reservation.error,
                book: book,
                genres: book.genres,
                userAuthenticated: req.cookies.user,
                user: user,
            });
        }
        return res.render('bookdetails', {
            success: 'El libro ha sido reservado con éxito',
            message: 'Reserva realizada',
            book: book,
            genres: book.genres,
            userAuthenticated: req.cookies.user,
            user: user,
        });
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

exports.cancelReservation = async (req, res) => {
    try {
        const reservation = await dbReservation.findReservation({_id: req.params.id});
        const book = await dbBook.findBook({_id: reservation.book});
        console.log(book);
        if (reservation) {
            book.isReserved = false;
            if (book.copiesLoaned < book.copies) {
                book.copiesAvailable++;
            }
            await dbBook.updateBookRecord({_id: book._id}, book);
            await dbReservation.deleteReservationRecord({_id: req.params.id});
        } else {
            return {error: 'La reserva no existe'};
        }
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};
