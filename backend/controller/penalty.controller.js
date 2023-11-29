const dbPenalty = require('../data/penalty.data');
const dbUser = require('../data/user.data');

exports.addPenalty = async (req, res) => {
    try {
        const penalty = await dbPenalty.createPenaltyRecord(req.body);
        if (penalty.error) {
            return res.render('penaltiesInterface', {
                error: penalty.error,
                message: penalty.error,
                penalties: await dbPenalty.findAllPenalties(),
                user: await dbUser.findOneUser({_id: req.cookies.user}),
            });
        }
        return res.redirect('/penalties');
    } catch (error) {
        console.error(error);
        return res.render('500', {
            error: error,
        });
    }
};

exports.getPenalties = async (req, res) => {
    try {
        const penalties = await dbPenalty.findAllPenalties();
        return res.json({success: penalties});
    } catch (error) {
        console.error(error);
        return res.render('500', {
            error: error,
        });
    }
};

exports.updatePenalty = async (req, res) => {
    const {user} = req.body;
    await dbUser.findOneUser({document: user}, {_id: 1});
    req.body.user = user._id;
    try {
        const penalty = await dbPenalty.updatePenaltyRecord({_id: req.body.id}, req.body);
        if (penalty.error) {
            return res.render('penaltiesInterface', {
                error: penalty.error,
                penalties: await dbPenalty.findAllPenalties(),
                user: await dbUser.findOneUser({_id: req.cookies.user}),
            });
        }
        return res.redirect('/penalties');
    } catch (error) {
        console.error(error);
        return res.render('500', {
            error: error,
        });
    }
};

exports.deletePenalty = async (req, res) => {
    try {
        const penalty = await dbPenalty.deletePenaltyRecord({_id: req.params.id});
        return res.json({success: penalty});
    } catch (error) {
        console.error(error);
        return res.render('500', {
            error: error,
        });
    }
};
