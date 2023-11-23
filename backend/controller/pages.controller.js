const dbBook = require('../data/book.data');
const dbUser = require('../data/user.data');
const dbLoan = require('../data/loan.data');
const dbPenalty = require('../data/penalty.data');
const dbReservation = require('../data/reservation.data');

exports.verifyAdminUser = async (req, res, next) => {
    const user = await dbUser.findOneUser({_id: req.cookies.user}, {role: 1});
    if (!user || user.role == 'member') {
        return res.send('No tienes permisos para acceder a esta página');
    } else {
        next();
    }
};

exports.renderLandingPage = async (req, res) => {
    const recommendations = await dbBook.findRecommendations({title: 1, cover: 1, author: 1});
    const userAuthenticated = req.cookies.user;
    const user = await dbUser.findOneUser({_id: req.cookies.user}, {role: 1});
    return res.render('index', {
        recommendations: recommendations,
        userAuthenticated: userAuthenticated,
        user: user,
    });
};

exports.renderSignUpPage = (req, res) => {
    const userAuthenticated = req.cookies.user;
    if (userAuthenticated) {
        return res.redirect('/profile');
    }
    return res.render('signup');
};

exports.renderSignInPage = (req, res) => {
    if (req.cookies.user) {
        return res.redirect('/profile');
    } else {
        return res.render('signin');
    }
};

exports.renderAdminPage = async (req, res) => {
    return res.render('adminInterface');
};

exports.renderProfilePage = async (req, res) => {
    const user = await dbUser.findOneUser({_id: req.cookies.user});
    const reservations = await dbReservation.findReservation({user: req.cookies.user, isActive: true}, {book: 1, reservationDate: 1, expirationDate: 1, returnDate: 1});
    const loans = await dbLoan.findLoan({user: req.cookies.user, returned: false}, {book: 1, loanDate: 1, returnDate: 1});
    const userAuthenticated = req.cookies.user;
    if (!user) {
        return res.redirect('/signin');
    }
    return res.render('profile', {
        user: user,
        userAuthenticated: userAuthenticated,
        reservations: reservations,
        loans: loans,
    });
};

exports.renderCatalogingPage = async (req, res) => {
    const books = await dbBook.findAllBooks();
    return res.render('catalogingInterface', {
        books: books,
    });
};

exports.renderLoansPage = async (req, res) => {
    const librarian = await dbUser.findOneUser({_id: req.cookies.user}, {document: 1});
    const loans = await dbLoan.findAllLoans();
    return res.render('loansInterface', {
        loans: loans,
        librarian: librarian,
    });
};

exports.renderUsersPage = async (req, res) => {
    const users = await dbUser.findAllUsers({password: 0});
    return res.render('usersInterface', {
        users: users,
    });
};

exports.renderPenaltiesPage = async (req, res) => {
    const penalties = await dbPenalty.findAllPenalties();
    return res.render('penaltiesInterface', {
        penalties: penalties,
    });
};

exports.renderReservationsPage = async (req, res) => {
    const reservations = await dbReservation.findAllReservations();
    return res.render('reservationsInterface', {
        reservations: reservations,
    });
};

exports.renderBookForm = async (req, res) => {
    return res.render('bookForm');
};
