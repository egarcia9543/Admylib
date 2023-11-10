const Book = require('../models/books.model');

exports.findBook = async (filter, projection) => {
    try {
        if (!projection) return await Book.findOne(filter);
        else return await Book.findOne(filter, projection);
    } catch (error) {
        return error;
    }
};

exports.findRecommendations = async (projection) => {
    try {
        if (!projection) return await Book.aggregate([{$sample: {size: 3}}]);
        else return await Book.aggregate([{$project: projection}, {$sample: {size: 3}}]);
    } catch (error) {
        return error;
    }
};

exports.findAllBooks = async (filter, projection) => {
    try {
        if (!projection && !filter) return await Book.find().populate({path: 'author', select: 'fullname'}).populate({path: 'publisher', select: 'name'});
        else if (!filter) return await Book.find({}, projection);
        else if (!projection) return await Book.find(filter);
        else return await Book.find(filter, projection);
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
