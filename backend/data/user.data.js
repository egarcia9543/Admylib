const User = require('../models/users.model');
const Loan = require('../models/loans.model');
const Reservation = require('../models/reservations.model');
const Penalty = require('../models/penalties.model');

exports.findOneUser = async (filter, projection) => {
    try {
        if (!projection) return await User.findOne(filter).populate().populate('loans');
        else return await User.findOne(filter, projection).populate('reservations').populate('loans');
    } catch (error) {
        return error;
    }
};

exports.findAllUsers = async (filter, projection) => {
    try {
        if (!filter) return await User.find({}, projection);
        else if (!projection) return await User.find(filter);
        else return await User.find(filter, projection);
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
        const loans = await Loan.find({user: filter._id, returned: false});
        const reservations = await Reservation.find({user: filter._id, isActive: true});
        if (loans.length > 0 || reservations.length > 0) {
            return {error: 'No se puede eliminar el usuario porque tiene préstamos o reservas activas'};
        } else {
            await Loan.deleteMany({user: filter._id});
            await Reservation.deleteMany({user: filter._id});
            await Penalty.deleteMany({user: filter._id});
            return await User.findOneAndDelete(filter);
        }
    } catch (error) {
        return error;
    }
};
