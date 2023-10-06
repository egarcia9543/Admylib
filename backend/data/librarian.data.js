const Librarian = require('../models/librarians.model');

exports.findOneLibrarian = async (filter, projection) => {
    try {
        if (!projection) return await Librarian.findOne(filter);
        else return await Librarian.findOne(filter, projection);
    } catch (error) {
        return error;
    }
};

exports.createLibrarianRecord = async (librarianInfo) => {
    try {
        return new Librarian(librarianInfo).save();
    } catch (error) {
        return error;
    }
};
