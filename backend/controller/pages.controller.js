exports.renderLandingPage = (req, res) => {
    return res.render('index');
};

exports.renderSignUpPage = (req, res) => {
    return res.render('signup');
};

exports.renderSignInPage = (req, res) => {
    return res.render('signin');
};
