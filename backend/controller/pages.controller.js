const dbBook = require('../data/book.data');
const dbUser = require('../data/user.data');
const dbLoan = require('../data/loan.data');

exports.renderLandingPage = async (req, res) => {
    const recommendations = await dbBook.findRecommendations({title: 1, cover: 1});
    const userAuthenticated = req.cookies.token;
    const user = await dbUser.findOneUser({_id: req.cookies.user}, {role: 1});
    return res.render('index', {
        recommendations: recommendations,
        userAuthenticated: userAuthenticated,
        user: user,
    });
};

exports.renderSignUpPage = (req, res) => {
    const userAuthenticated = req.cookies.token;
    if (userAuthenticated) {
        return res.redirect('/profile');
    }
    return res.render('signup');
};

exports.renderSignInPage = (req, res) => {
    if (req.cookies.token) {
        return res.redirect('/profile');
    } else {
        return res.render('signin');
    }
};

exports.test = (req, res) => {
    return res.render('test');
};

exports.renderAdminPage = async (req, res) => {
    const user = await dbUser.findOneUser({_id: req.cookies.user}, {role: 1});
    if (user.role == 'member' || !user) {
        return res.send('No tienes permisos para acceder a esta página');
    }
    return res.render('adminInterface');
};

exports.renderProfilePage = async (req, res) => {
    const user = await dbUser.findOneUser({_id: req.cookies.user});
    const userAuthenticated = req.cookies.token;
    if (!user) {
        return res.redirect('/signin');
    }
    return res.render('profile', {
        user: user,
        userAuthenticated: userAuthenticated,
    });
};

exports.renderCatalogingPage = async (req, res) => {
    const user = await dbUser.findOneUser({_id: req.cookies.user}, {role: 1});
    const books = await dbBook.findAllBooks();
    if (user.role == 'member' || !user) {
        return res.send('No tienes permisos para acceder a esta página');
    }
    return res.render('catalogingInterface', {
        books: books,
    });
};

exports.renderLoansPage = async (req, res) => {
    const user = await dbUser.findOneUser({_id: req.cookies.user}, {role: 1});
    const loans = await dbLoan.findAllLoans();
    if (user.role == 'member' || !user) {
        return res.send('No tienes permisos para acceder a esta página');
    }
    return res.render('loansInterface', {
        loans: loans,
    });
};
