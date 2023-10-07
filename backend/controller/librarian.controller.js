const dbLibrarian = require('../data/librarian.data');

exports.registerLibrarian = async (req, res) => {
    const {document, email} = req.body;
    try {
        const documentIsRegistered = await dbLibrarian.findOneLibrarian({document: document}, {document: 1});
        const emailIsRegistered = await dbLibrarian.findOneLibrarian({email: email}, {email: 1});
        console.log(documentIsRegistered);
        if (documentIsRegistered && emailIsRegistered) {
            return res.json({error: 'El documento y correo ya están registrados'});
        } else if (emailIsRegistered) {
            return res.json({error: 'Este correo ya está registrado'});
        } else if (documentIsRegistered) {
            return res.json({error: 'Este documento ya está registrado'});
        } else {
            const newRecord = await dbLibrarian.createLibrarianRecord(req.body);
            return res.json({success: newRecord});
        }
    } catch (error) {
        console.error(error);
        return res.json({error: 'Internal server error'});
    }
};
