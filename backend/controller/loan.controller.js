const dbLoan = require('../data/loan.data');
const dbUser = require('../data/user.data');

exports.addLoan = async (req, res) => {
    try {
        const loan = await dbLoan.createLoanRecord(req.body);
        if (loan.error) {
            return res.render('loansInterface', {
            librarian: await dbUser.findOneUser({_id: req.cookies.user}, {document: 1}),
            error: loan.error,
            loans: await dbLoan.findAllLoans(),
        });
    } else {
        return res.redirect('/loans');
    }
    } catch (error) {
        console.error(error);
        return res.json({error: 'Internal server error'});
    }
};

exports.getLoans = async (req, res) => {
    try {
        const loans = await dbLoan.findAllLoans();
        return res.json({success: loans});
    } catch (error) {
        console.error(error);
        return res.json({error: 'Internal server error'});
    }
};

exports.getLoanDetails = async (req, res) => {
    try {
        const loan = await dbLoan.pruebaConsultaAnidada({_id: req.params.id});
        return res.json({success: loan});
    } catch (error) {
        console.error(error);
        return res.json({error: 'Internal server error'});
    }
};

exports.updateLoan = async (req, res) => {
    try {
        const loan = await dbLoan.updateLoanRecord({_id: req.body.id}, req.body);
        return res.json({success: loan});
    } catch (error) {
        console.error(error);
        return res.json({error: 'Internal server error'});
    }
};

exports.returnLoan = async (req, res) => {
    try {
        const loan = await dbLoan.updateLoanRecord({_id: req.body.id}, req.body);
        return res.json({success: loan});
    } catch (error) {
        console.error(error);
        return res.json({error: 'Internal server error'});
    }
};

