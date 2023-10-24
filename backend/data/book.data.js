const Book = require('../models/books.model');

exports.findOneBook = async (filter, projection) => {
    try {
        if (!projection) return await Book.findOne(filter);
        else return await Book.findOne(filter, projection);
    } catch (error) {
        return error;
    }
};

exports.findAllBooks = async (projection) => {
    try {
        if (!projection) return await Book.find();
        else return await Book.find({}, projection);
    } catch (error) {
        return error;
    }
};

exports.createBookRecord = async (bookInfo) => {
    try {
        return new Book(bookInfo).save();
    } catch (error) {
        return error;
    }
};

exports.updateBookRecord = async (filter, update) => {
    try {
        if (!filter) return {error: 'No se ha especificado un filtro'};
        if (!update) return {error: 'No se dieron datos para actualizar'};
        return await Book.findOneAndUpdate(filter, update, {new: true});
    } catch (error) {
        return error;
    }
};

exports.deleteBookRecord = async (filter) => {
    try {
        if (!filter) return {error: 'No se ha especificado un filtro'};
        return await Book.findOneAndDelete(filter);
    } catch (error) {
        return error;
    }
};
