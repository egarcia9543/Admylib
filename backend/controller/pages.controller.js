const dbBook = require('../data/book.data');

exports.renderLandingPage = async (req, res) => {
    const recommendations = await dbBook.findRecommendations({title: 1});
    return res.render('index', {
        recommendations: recommendations,
    });
};

exports.renderSignUpPage = (req, res) => {
    return res.render('signup');
};

exports.renderSignInPage = (req, res) => {
    return res.render('signin');
};
