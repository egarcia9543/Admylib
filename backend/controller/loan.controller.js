const dbLoan = require('../data/loan.data');

exports.addLoan = async (req, res) => {
    try {
        const loan = await dbLoan.createLoanRecord(req.body);
        return res.json({success: loan});
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
        const loan = await dbLoan.findOneLoan({_id: req.params.id});
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

