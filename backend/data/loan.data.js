const Loan = require('../models/loans.model');
const Book = require('../models/books.model');
const User = require('../models/users.model');
const loan = require('../models/loans.model');

exports.findOneLoan = async (filter, projection) => {
    try {
        if (!projection) return await Loan.findOne(filter).populate('book').populate('user');
        else return await Loan.findOne(filter, projection).populate('book').populate('user');
    } catch (error) {
        return error;
    }
};

exports.findAllLoans = async (projection) => {
    try {
        if (!projection) return await Loan.find().populate({path: 'book', select: 'title isbn'}).populate({path: 'user', select: 'fullname email'}).populate({path: 'librarian', select: 'fullname email'});
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
        const book = await Book.findOne({isbn: loanInfo.book}, {copiesAvailable: 1});
        if (book) {
            if (book.copiesAvailable > 0) {
                loanInfo.book = book._id;
                const user = await User.findOne({document: loanInfo.user});
                if (user) {
                    loanInfo.user = user._id;
                    const loanRegistered = await new Loan(loanInfo).save();
                    await Book.findOneAndUpdate({_id: book._id}, {$inc: {copiesAvailable: -1}});
                    await User.findOneAndUpdate({_id: user._id}, {$push: {loans: loanRegistered._id}});
                    return loanRegistered;
                } else {
                    return {error: 'El usuario no existe'};
                }
            } else {
                return {error: 'El libro no está disponible para préstamo'};
            }
        } else {
            return {error: 'El libro no existe'};
        }
    } catch (error) {
        return error;
    }
};

exports.updateLoanRecord = async (filter, update) => {
    try {
        if (!filter) return {error: 'No se ha especificado un filtro'};
        if (!update) return {error: 'No se dieron datos para actualizar'};
        return await Loan.findOneAndUpdate(filter, update, {new: true});
    } catch (error) {
        return error;
    }
};

exports.pruebaConsultaAnidada = (id) => {
    try {
        const loan = Loan.findOne({_id: id}).populate({path: 'book', select: 'title isbn'}).populate({path: 'user', select: 'fullname email'});
        return loan;
    } catch (error) {
        return error;
    }
};
