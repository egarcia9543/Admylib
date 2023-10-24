const dbBook = require('../data/book.data');
const logActivity = require('../middleware/logs');
const logRoute = './logs/catalog.log';

exports.addBook = async (req, res) => {
    const {isbn} = req.body;
    try {
        const bookIsRegistered = await dbBook.findOneBook({isbn: isbn}, {isbn: 1});
        if (bookIsRegistered) {
            return res.status(400).json({error: 'This book is already registered'});
        }
        const book = await dbBook.createBookRecord(req.body);
        logActivity.generateLog(logRoute, `Book ${book.title} created at ${new Date()}\n`);
        return res.json({success: book});
    } catch (error) {
        console.error(error);
        return res.json({error: 'Internal server error'});
    }
};

