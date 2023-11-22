const User = require('../models/users.model');

exports.findOneUser = async (filter, projection) => {
    try {
        if (!projection) return await User.findOne(filter).populate().populate('loans');
        else return await User.findOne(filter, projection).populate('reservations').populate('loans');
    } catch (error) {
        return error;
    }
};

exports.findAllUsers = async (projection) => {
    try {
        if (!projection) return await User.find();
        else return await User.find({}, projection);
    } catch (error) {
        return error;
    }
};

exports.createUserRecord = async (userInfo) => {
    try {
        return new User(userInfo).save();
    } catch (error) {
        return error;
    }
};

exports.updateUserRecord = async (filter, update) => {
    try {
        if (!filter) return {error: 'No se ha especificado un filtro'};
        if (!update) return {error: 'No se dieron datos para actualizar'};
        return await User.findOneAndUpdate(filter, update, {new: true});
    } catch (error) {
        return error;
    }
};

exports.deleteUserRecord = async (filter) => {
    try {
        if (!filter) return {error: 'No se ha especificado un filtro'};
        return await User.findOneAndDelete(filter);
    } catch (error) {
        return error;
    }
};
