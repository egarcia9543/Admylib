const Loan = require('../models/loans.model');
const Book = require('../models/books.model');
const User = require('../models/users.model');
const Reservation = require('../models/reservations.model');

exports.findLoan = async (filter, projection) => {
    try {
        if (!projection) return await Loan.find(filter).populate('book').populate('user');
        else return await Loan.find(filter, projection).populate('book').populate('user');
    } catch (error) {
        return error;
    }
};

exports.findAllLoans = async (projection) => {
    try {
        if (!projection) return await Loan.find().populate({path: 'book', select: 'title isbn isReserved'}).populate({path: 'user', select: 'document'}).populate({path: 'librarian', select: 'fullname document'});
        else return await Loan.find({}, projection);
    } catch (error) {
        return error;
    }
};

exports.createLoanRecord = async (loanInfo) => {
    try {
        const librarian = await User.findOne({document: loanInfo.librarian}, {document: 1});
        if (librarian) {
            loanInfo.librarian = librarian._id;
        } else {
            return {error: 'El bibliotecario no existe'};
        }
        const book = await Book.findOne({isbn: loanInfo.book}, {copiesAvailable: 1, isReserved: 1});
        if (book == null) {
            return {error: 'Este libro no existe'};
        }
        const reservation = await Reservation.findOne({book: book._id, isActive: true});
        if (book) {
            if (book.copiesAvailable > 0 && book.isReserved === false) {
                loanInfo.book = book._id;
                const user = await User.findOne({document: loanInfo.user}).populate({path: 'loans', select: 'book'});
                if (user == null) {
                    return {error: 'Este usuario no está registrado'};
                }
                if (user.loans.length > 3) {
                    return {error: 'El usuario ya tiene 3 préstamos activos'};
                }
                const userLoans = user.loans;
                for (let i = 0; i < userLoans.length; i++) {
                    if (userLoans[i].book.toString() == book._id.toString()) {
                        return {error: 'Ya tienes una copia de este libro prestada'};
                    }
                }
                if (user.isPenalized == true) {
                    return {error: 'El usuario está penalizado'};
                } else if (user) {
                    loanInfo.user = user._id;
                    const loanRegistered = await new Loan(loanInfo).save();
                    await Book.findOneAndUpdate({_id: book._id}, {$inc: {copiesAvailable: -1, copiesLoaned: 1}});
                    await User.findOneAndUpdate({_id: user._id}, {$push: {loans: loanRegistered._id}});
                    return loanRegistered;
                } else {
                    return {error: 'El usuario no existe'};
                }
            } else if (book.isReserved === true && reservation.isActive === true) {
                const user = await User.findOne({document: loanInfo.user});
                if (reservation.user.toString() === user._id.toString() && user.isPenalized === false ) {
                    loanInfo.book = book._id;
                    loanInfo.user = user._id;
                    const loanRegistered = await new Loan(loanInfo).save();
                    const bookCopies = await Book.findOne({_id: book._id}, {copiesAvailable: 1, copiesLoaned: 1});
                    if (bookCopies.copiesAvailable == 0) {
                        await Book.findOneAndUpdate({_id: book._id}, {$inc: {copiesLoaned: 1}});
                    } else {
                        await Book.findOneAndUpdate({_id: book._id}, {$inc: {copiesAvailable: -1, copiesLoaned: 1}});
                    }
                    await Book.findOneAndUpdate({_id: book._id}, {$set: {isReserved: false}});
                    await User.findOneAndUpdate({_id: user._id}, {$push: {loans: loanRegistered._id}});
                    reservation.isActive = false;
                    await reservation.save();
                    return loanRegistered;
                } else if (reservation.user.toString() !== user._id.toString() && book.copiesAvailable > 1) {
                    loanInfo.book = book._id;
                    loanInfo.user = user._id;
                    const loanRegistered = await new Loan(loanInfo).save();
                    const bookCopies = await Book.findOne({_id: book._id}, {copiesAvailable: 1, copiesLoaned: 1});
                    if (bookCopies.copiesAvailable == 0) {
                        await Book.findOneAndUpdate({_id: book._id}, {$inc: {copiesLoaned: 1}});
                    } else {
                        await Book.findOneAndUpdate({_id: book._id}, {$inc: {copiesAvailable: -1, copiesLoaned: 1}});
                    }
                    await User.findOneAndUpdate({_id: user._id}, {$push: {loans: loanRegistered._id}});
                    return loanRegistered;
                } else if (user.isPenalized === true) {
                    return {error: 'El usuario está penalizado'};
                } else {
                    return {error: 'El libro está reservado por otro usuario'};
                }
            } else {
                return {error: 'No hay copias disponibles del libro'};
            }
        } else {
            return {error: 'El libro no existe'};
        }
    } catch (error) {
        return error;
    }
};

exports.extendLoan = async (loanInfo) => {
    try {
        const loan = await Loan.findOne({_id: loanInfo.id});
        const book = await Book.findOne({isbn: loanInfo.book}, {copiesAvailable: 1, isReserved: 1});
        if (loan) {
            if (book) {
                if (book.isReserved === false) {
                    const updatedLoan = await Loan.findOneAndUpdate({_id: loan._id}, {$set: {returnDate: loanInfo.returnDate}}, {new: true});
                    return updatedLoan;
                } else {
                    return {error: 'El libro no está disponible para renovación'};
                }
            } else {
                return {error: 'El libro no existe'};
            }
        } else {
            return {error: 'El préstamo no existe'};
        }
    } catch (error) {
        return error;
    }
};

exports.returnLoan = async (loanInfo) => {
    try {
        const loan = await Loan.findOne({_id: loanInfo.id});
        const book = await Book.findOne({isbn: loanInfo.book}, {copiesAvailable: 1, copiesLoaned: 1});
        const returned = await Loan.findOneAndUpdate({_id: loan._id}, {$set: {returned: true}}, {new: true});
        await Book.findOneAndUpdate({_id: book._id}, {$inc: {copiesAvailable: 1, copiesLoaned: -1}});
        await User.findOneAndUpdate({_id: loan.user}, {$pull: {loans: loan._id}});
        return returned;
    } catch (error) {
        return error;
    }
};

