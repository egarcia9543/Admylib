const dbBook = require('../data/book.data');
const logActivity = require('../middleware/logs');
const logRoute = './logs/catalog.log';
const fs = require('fs');

exports.addBook = async (req, res) => {
    const {isbn, author, copies, genres} = req.body;
    const authorArray = author.split(',').map((author) => author.trim());
    req.body.author = authorArray;
    const genreArray = genres.split(',').map((genre) => genre.trim());
    req.body.genres = genreArray;
    if (copies) {
        req.body.copies = copies;
        req.body.copiesAvailable = copies;
    }
    try {
        const bookIsRegistered = await dbBook.findBook({isbn: isbn}, {isbn: 1});
        if (bookIsRegistered) {
            return res.status(400).json({error: 'Este libro ya se encuentra registrado'});
        }
        const coverPath = `/uploads/${req.file.originalname}`;
        req.body.cover = coverPath;
        const book = await dbBook.createBookRecord(req.body);
        logActivity.generateLog(logRoute, `Book ${book.title} created at ${new Date()}\n`);
        return res.redirect('/cataloging');
    } catch (error) {
        console.error(error);
        return res.json({error: 'Internal server error'});
    }
};

exports.getBooks = async (req, res) => {
    try {
        const books = await dbBook.findAllBooks();
        return res.render('catalog', {books: books});
    } catch (error) {
        console.error(error);
        return res.json({error: 'Internal server error'});
    }
};

exports.getBookDetails = async (req, res) => {
    try {
        const book = await dbBook.findBook({_id: req.params.id});
        return res.render('bookdetails', {
            book: book,
        });
    } catch (error) {
        console.error(error);
        return res.json({error: 'Internal server error'});
    }
};

exports.updateBook = async (req, res) => {
    const {id, copies} = req.body;
    const book = await dbBook.findBook({_id: id});

    if (!book) {
        return res.render('catalogingInterface', {
            error: 'Libro no encontrado',
            books: await dbBook.findAllBooks(),
        });
    }
    if (copies) {
        req.body.copies = parseInt(copies);
        req.body.copiesAvailable = parseInt(book.copiesAvailable) + parseInt(copies - book.copies);
    }
    try {
        const book = await dbBook.updateBookRecord({_id: id}, req.body);
        logActivity.generateLog(logRoute, `Book ${book.title} updated at ${new Date()}\n`);
        return res.redirect('/cataloging');
    } catch (error) {
        console.error(error);
        return res.json({error: 'Internal server error'});
    }
};

exports.deleteBook = async (req, res) => {
    try {
        const book = await dbBook.deleteBookRecord({_id: req.params.id});
        const path = `./frontend/static${book.cover}`;
        fs.unlink(path, (err) => {
            if (err) {
                console.error(err);
                return;
            }
        });
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
        return res.render('quicksearch', {
            books: books,
        });
    } catch (error) {
        console.error(error);
        return res.json({error: 'Internal server error'});
    }
};
