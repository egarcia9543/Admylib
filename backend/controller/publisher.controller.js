const dbPublisher = require('../data/publisher.data');
const logActivity = require('../middleware/logs');
const logRoute = './logs/catalog.log';

exports.addPublisher = async (req, res) => {
    const {name} = req.body;
    try {
        const publisherIsRegistered = await dbPublisher.findOnePublisher({name: name}, {name: 1});
        if (publisherIsRegistered) {
            return res.status(400).json({error: 'This publisher is already registered'});
        }
        const publisher = await dbPublisher.createPublisherRecord(req.body);
        logActivity.generateLog(logRoute, `Publisher ${publisher.name} created at ${new Date()}\n`);
        return res.json({success: publisher});
    } catch (error) {
        console.error(error);
        return res.json({error: 'Internal server error'});
    }
};
