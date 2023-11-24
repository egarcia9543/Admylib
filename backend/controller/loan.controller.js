const dbLoan = require('../data/loan.data');
const dbUser = require('../data/user.data');
const dbBook = require('../data/book.data');

exports.addLoan = async (req, res) => {
    try {
        const loan = await dbLoan.createLoanRecord(req.body);
        if (loan.error) {
            return res.render('loansInterface', {
            librarian: await dbUser.findOneUser({_id: req.cookies.user}, {document: 1}),
            error: loan.error,
            loans: await dbLoan.findAllLoans(),
            user: await dbUser.findOneUser({_id: req.cookies.user}),
        });
    } else {
        return res.redirect('/loans');
    }
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
        const loan = await dbLoan.extendLoan(req.body);
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

exports.returnLoan = async (req, res) => {
    try {
        const loan = await dbLoan.returnLoan(req.body);
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

exports.getLoanByISBN = async (req, res) => {
    try {
        const book = await dbBook.findBook({isbn: req.params.isbn});
        const loan = await dbLoan.findLoan({book: book._id, returned: false});
        return res.json({success: loan});
    } catch (error) {
        console.error(error);
        return res.json({error: 'Internal server error'});
    }
};
