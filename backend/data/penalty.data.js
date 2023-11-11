const Penalty = require('../models/penalties.model');
const User = require('../models/users.model');

exports.findOnePenalty = async (filter, projection) => {
    try {
        if (!projection) return await Penalty.findOne(filter);
        else return await Penalty.findOne(filter, projection);
    } catch (error) {
        return error;
    }
};

exports.createPenaltyRecord = async (penaltyInfo) => {
    try {
        const user = await User.findOne({document: penaltyInfo.user}, {_id: 1});
        if (user) {
            penaltyInfo.user = user._id;
        } else {
            return {error: 'El usuario no existe'};
        }
        return new Penalty(penaltyInfo).save();
    } catch (error) {
        return error;
    }
};

exports.findAllPenalties = async () => {
    try {
        return await Penalty.find().populate({path: 'user', select: 'fullname'});
    } catch (error) {
        return error;
    }
};

exports.updatePenaltyRecord = async (filter, update) => {
    try {
        if (!filter) return {error: 'No se ha especificado un filtro'};
        if (!update) return {error: 'No se dieron datos para actualizar'};
        return await Penalty.findOneAndUpdate(filter, update, {new: true});
    } catch (error) {
        return error;
    }
};

exports.deletePenaltyRecord = async (filter) => {
    try {
        if (!filter) return {error: 'No se ha especificado un filtro'};
        return await Penalty.findOneAndDelete(filter);
    } catch (error) {
        return error;
    }
};
