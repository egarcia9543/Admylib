const dbBook = require('../data/book.data');
const logActivity = require('../middleware/logs');
const logRoute = './logs/catalog.log';

exports.addBook = async (req, res) => {
    const {isbn} = req.body;
    try {
        const bookIsRegistered = await dbBook.findBook({isbn: isbn}, {isbn: 1});
        if (bookIsRegistered) {
            return res.status(400).json({error: 'Este libro ya se encuentra registrado'});
        }
        const coverPath = `/uploads/${req.file.originalname}`;
        req.body.cover = coverPath;
        const book = await dbBook.createBookRecord(req.body);
        logActivity.generateLog(logRoute, `Book ${book.title} created at ${new Date()}\n`);
        return res.json({success: book});
    } catch (error) {
        console.error(error);
        return res.json({error: 'Internal server error'});
    }
};

exports.getBooks = async (req, res) => {
    try {
        const books = await dbBook.findAllBooks();
        return res.json({success: books});
    } catch (error) {
        console.error(error);
        return res.json({error: 'Internal server error'});
    }
};

exports.getBookDetails = async (req, res) => {
    try {
        const book = await dbBook.findBook({_id: req.params.id});
        return res.json({success: book});
    } catch (error) {
        console.error(error);
        return res.json({error: 'Internal server error'});
    }
};

exports.updateBook = async (req, res) => {
    const {id} = req.body;
    try {
        const book = await dbBook.updateBookRecord({_id: id}, req.body);
        logActivity.generateLog(logRoute, `Book ${book.title} updated at ${new Date()}\n`);
        return res.json({success: book});
    } catch (error) {
        console.error(error);
        return res.json({error: 'Internal server error'});
    }
};

exports.deleteBook = async (req, res) => {
    try {
        const book = await dbBook.deleteBookRecord({_id: req.params.id});
        logActivity.generateLog(logRoute, `Book ${book.title} deleted at ${new Date()}\n`);
        return res.json({success: book});
    } catch (error) {
        console.error(error);
        return res.json({error: 'Internal server error'});
    }
};

exports.quickSearch = async (req, res) => {
    try {
        const books = await dbBook.findAllBooks({title: {$regex: req.body.search, $options: 'i'}}, {title: 1, cover: 1});
        return res.json({success: books});
    } catch (error) {
        console.error(error);
        return res.json({error: 'Internal server error'});
    }
};
