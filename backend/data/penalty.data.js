const Penalty = require('../models/penalties.model');
const User = require('../models/users.model');
const cron = require('node-cron');

exports.findPenalty = async (filter, projection) => {
    try {
        if (!projection) return await Penalty.findOne(filter).populate({path: 'user', select: 'fullname document'});
        else return await Penalty.findOne(filter, projection).populate({path: 'user', select: 'fullname document'});
    } catch (error) {
        return error;
    }
};

exports.createPenaltyRecord = async (penaltyInfo) => {
    try {
        const user = await User.findOne({document: penaltyInfo.user}, {_id: 1, isPenalized: 1});
        if (user.isPenalized == true) {
            return {error: 'El usuario ya está penalizado'};
        } else if (user) {
            penaltyInfo.user = user._id.toString();
            const penaltyRegistered = await new Penalty(penaltyInfo).save();
            await User.findOneAndUpdate({_id: user._id}, {$push: {penalties: penaltyRegistered._id}, $set: {isPenalized: true}});
            return penaltyRegistered;
        } else {
            return {error: 'Este usuario no está registrado'};
        }
    } catch (error) {
        return error;
    }
};

exports.findAllPenalties = async () => {
    try {
        return await Penalty.find().populate({path: 'user', select: 'fullname document'});
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
        const penalty = await Penalty.findOne(filter);
        const user = await User.findOne({_id: penalty.user});
        await User.findOneAndUpdate({_id: user._id}, {$pull: {penalties: penalty._id}, $set: {isPenalized: false}});
        return await Penalty.findOneAndDelete(filter);
    } catch (error) {
        return error;
    }
};

cron.schedule('0 0 0 * * *', async () => {
    const penalties = await Penalty.find({isActive: true});
    const today = new Date();
    penalties.forEach(async (penalty) => {
        if (penalty.penaltyTime <= today) {
            await Penalty.findOneAndUpdate({_id: penalty._id}, {$set: {isActive: false}});
            await User.findOneAndUpdate({_id: penalty.user}, {$set: {isPenalized: false}, $pull: {penalties: penalty._id}});
        }
    });
});
