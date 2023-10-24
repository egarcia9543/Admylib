const dbAuthor = require('../data/author.data');
const logActivity = require('../middleware/logs');
const logRoute = './logs/catalog.log';

exports.addAuthor = async (req, res) => {
    const {fullname} = req.body;
    try {
        const authorIsRegistered = await dbAuthor.findOneAuthor({fullname: fullname}, {fullname: 1});
        if (authorIsRegistered) {
            return res.status(400).json({error: 'This author is already registered'});
        }
        const author = await dbAuthor.createAuthorRecord(req.body);
        logActivity.generateLog(logRoute, `Author ${author.fullname} created at ${new Date()}\n`);
        return res.json({success: author});
    } catch (error) {
        console.error(error);
        return res.json({error: 'Internal server error'});
    }
};
