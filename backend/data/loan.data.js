const Loan = require('../models/loans.model');
const Book = require('../models/books.model');
const User = require('../models/users.model');

exports.findOneLoan = async (filter, projection) => {
    try {
        if (!projection) return await Loan.findOne(filter);
        else return await Loan.findOne(filter, projection);
    } catch (error) {
        return error;
    }
};

exports.findAllLoans = async (projection) => {
    try {
        if (!projection) return await Loan.find();
        else return await Loan.find({}, projection);
    } catch (error) {
        return error;
    }
};

exports.createLoanRecord = async (loanInfo) => {
    try {
        const book = await Book.findOne({isbn: loanInfo.book}, {state: 1});
        if (book) {
            if (book.state === 'available') {
                loanInfo.book = book._id;
                const user = await User.findOne({document: loanInfo.user});
                if (user) {
                    loanInfo.user = user._id;
                    const loanRegistered = await new Loan(loanInfo).save();
                    await Book.findOneAndUpdate({_id: book._id}, {state: 'loaned'});
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

