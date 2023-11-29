const dbBook = require('../data/book.data');
const dbUser = require('../data/user.data');
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
    } else {
        req.body.copies = 1;
        req.body.copiesAvailable = 1;
    }
    try {
        const bookIsRegistered = await dbBook.findBook({isbn: isbn}, {isbn: 1});
        if (bookIsRegistered) {
            return res.status(400).json({error: 'Este libro ya se encuentra registrado'});
        }
        const coverPath = `/uploads/${req.file.originalname}`;
        req.body.cover = coverPath;
        const book = await dbBook.createBookRecord(req.body);
        const librarian = await dbUser.findOneUser({_id: req.cookies.user}, {document: 1});
        logActivity.generateLog(logRoute, `Book ${book.title} created at ${new Date()} by ${librarian.document}\n`);
        return res.redirect('/cataloging');
    } catch (error) {
        console.error(error);
        return res.render('500', {
            error: error,
        });
    }
};

exports.getBooks = async (req, res) => {
    const userAuthenticated = req.cookies.user;
    const user = await dbUser.findOneUser({_id: req.cookies.user}, {role: 1});

    const booksPerPage = 8;
    const actualPage = parseInt(req.query.page) || 1;
    const start = (actualPage - 1) * booksPerPage;
    const end = start + booksPerPage;
    try {
        const books = await dbBook.findAllBooks();
        const booksInPage = books.slice(start, end);
        const totalPages = Math.ceil(books.length / booksPerPage);
        return res.render('catalog', {
            books: booksInPage,
            userAuthenticated: userAuthenticated,
            user: user,
            totalPages,
            actualPage,
        });
    } catch (error) {
        console.error(error);
        return res.render('500', {
            error: error,
        });
    }
};

exports.getBookDetails = async (req, res) => {
    const userAuthenticated = req.cookies.user;
    const user = await dbUser.findOneUser({_id: req.cookies.user}, {role: 1, document: 1});
    try {
        const book = await dbBook.findBook({_id: req.params.id});
        return res.render('bookdetails', {
            book: book,
            genres: book.genres,
            authors: book.author,
            userAuthenticated: userAuthenticated,
            user: user,
        });
    } catch (error) {
        console.error(error);
        return res.render('500', {
            error: error,
        });
    }
};

exports.updateBook = async (req, res) => {
    const {id, copies, genres, author} = req.body;
    const book = await dbBook.findBook({_id: id});
    if (genres) {
        const genreArray = genres.split(',').map((genre) => genre.trim());
        req.body.genres = genreArray;
    }
    if (author) {
        const authorArray = author.split(',').map((author) => author.trim());
        req.body.author = authorArray;
    }

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
    const librarian = await dbUser.findOneUser({_id: req.cookies.user}, {document: 1});
    try {
        const book = await dbBook.updateBookRecord({_id: id}, req.body);
        logActivity.generateLog(logRoute, `Book ${book.title} updated at ${new Date()} by ${librarian.document}\n`);
        return res.redirect('/cataloging');
    } catch (error) {
        console.error(error);
        return res.render('500', {
            error: error,
        });
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
        const librarian = await dbUser.findOneUser({_id: req.cookies.user}, {document: 1});
        logActivity.generateLog(logRoute, `Book ${book.title} deleted at ${new Date()} by ${librarian.document}\n`);
        return res.json({success: book});
    } catch (error) {
        console.error(error);
        return res.render('500', {
            error: error,
        });
    }
};

exports.quickSearch = async (req, res) => {
    const userAuthenticated = req.cookies.user;
    const user = await dbUser.findOneUser({_id: req.cookies.user}, {role: 1});
    try {
        const books = await dbBook.findAllBooks({title: {$regex: req.body.search, $options: 'i'}}, {title: 1, cover: 1});
        return res.render('quicksearch', {
            books: books,
            userAuthenticated: userAuthenticated,
            user: user,
        });
    } catch (error) {
        console.error(error);
        return res.render('500', {
            error: error,
        });
    }
};
