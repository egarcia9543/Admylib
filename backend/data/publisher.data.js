const Publisher = require('../models/publishers.model');

exports.findOnePublisher = async (filter, projection) => {
    try {
        if (!projection) return await Publisher.findOne(filter);
        else return await Publisher.findOne(filter, projection);
    } catch (error) {
        return error;
    }
};

exports.createPublisherRecord = async (publisherInfo) => {
    try {
        return new Publisher(publisherInfo).save();
    } catch (error) {
        return error;
    }
};

