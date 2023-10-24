const Author = require('../models/authors.model');

exports.findOneAuthor = async (filter, projection) => {
    try {
        if (!projection) return await Author.findOne(filter);
        else return await Author.findOne(filter, projection);
    } catch (error) {
        return error;
    }
};

exports.createAuthorRecord = async (authorInfo) => {
    try {
        return new Author(authorInfo).save();
    } catch (error) {
        return error;
    }
};
