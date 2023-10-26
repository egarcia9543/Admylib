const dbPenalty = require('../data/penalty.data');

exports.addPenalty = async (req, res) => {
    try {
        const penalty = await dbPenalty.createPenaltyRecord(req.body);
        return res.json({success: penalty});
    } catch (error) {
        console.error(error);
        return res.json({error: 'Internal server error'});
    }
};

exports.getPenalties = async (req, res) => {
    try {
        const penalties = await dbPenalty.findAllPenalties();
        return res.json({success: penalties});
    } catch (error) {
        console.error(error);
        return res.json({error: 'Internal server error'});
    }
};

exports.getPenaltyDetails = async (req, res) => {
    try {
        const penalty = await dbPenalty.findOnePenalty({_id: req.params.id});
        return res.json({success: penalty});
    } catch (error) {
        console.error(error);
        return res.json({error: 'Internal server error'});
    }
};

exports.updatePenalty = async (req, res) => {
    try {
        const penalty = await dbPenalty.updatePenaltyRecord({_id: req.body.id}, req.body);
        return res.json({success: penalty});
    } catch (error) {
        console.error(error);
        return res.json({error: 'Internal server error'});
    }
};

exports.deletePenalty = async (req, res) => {
    try {
        const penalty = await dbPenalty.deletePenaltyRecord({_id: req.params.id});
        return res.json({success: penalty});
    } catch (error) {
        console.error(error);
        return res.json({error: 'Internal server error'});
    }
};
