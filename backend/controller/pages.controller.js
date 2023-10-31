const dbBook = require('../data/book.data');
const dbUser = require('../data/user.data');

exports.renderLandingPage = async (req, res) => {
    const recommendations = await dbBook.findRecommendations({title: 1});
    const userAuthenticated = req.cookies.token;
    const user = await dbUser.findOneUser({_id: req.cookies.user}, {role: 1});
    return res.render('index', {
        recommendations: recommendations,
        userAuthenticated: userAuthenticated,
        user: user,
    });
};

exports.renderSignUpPage = (req, res) => {
    return res.render('signup');
};

exports.renderSignInPage = (req, res) => {
    return res.render('signin');
};
