const dbUser = require('../data/user.data');
const emailService = require('../middleware/emailservice');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.registerUser = async (req, res) => {
    const {document, email, password} = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    req.body.password = passwordHash;
    try {
        const documentIsRegistered = await dbUser.findOneUser({document: document}, {document: 1});
        const emailIsRegistered = await dbUser.findOneUser({email: email}, {email: 1});
        if (documentIsRegistered && emailIsRegistered) {
            return res.json({error: 'El documento y correo ya están registrados'});
        } else if (emailIsRegistered) {
            return res.json({error: 'Este correo ya está registrado'});
        } else if (documentIsRegistered) {
            return res.json({error: 'Este documento ya está registrado'});
        } else {
            const newRecord = await dbUser.createUserRecord(req.body);
            const token = jwt.sign({id: newRecord._id}, process.env.SECRET_KEY, {expiresIn: '1h'});
            return res.cookie('token', token).json({success: newRecord});
        }
    } catch (error) {
        console.error(error);
        return res.json({error: 'Internal server error'});
    }
};

exports.loginUser = async (req, res) => {
    const {email, password} = req.body;
    try {
        if (!email || !password) return res.json({error: 'Ingresa todos los datos'});
        const user = await dbUser.findOneUser({email: email}, {email: 1, password: 1});
        if (!user) {
            return res.json({error: 'Este usuario no existe'});
        } else {
            const passwordIsCorrect = await bcrypt.compare(password, user.password);
            if (!passwordIsCorrect) {
                return res.json({error: 'Contraseña incorrecta'});
            } else {
                const token = jwt.sign({id: user._id}, process.env.SECRET_KEY, {expiresIn: '1h'});
                return res.cookie('token', token).json({success: user});
            }
        }
    } catch (error) {
        console.error(error);
        return res.json({error: 'Internal server error'});
    }
};

exports.logout = async (req, res) => {
    try {
        return res.clearCookie('token').json({success: 'Logged out successfully'});
    } catch (error) {
        console.error(error);
        return res.json({error: 'Internal server error'});
    }
};

exports.recoverPassword = async (req, res) => {
    const {email} = req.body;
    try {
        const emailIsRegistered = await dbUser.findOneUser({email: email}, {email: 1, password: 1});
        if (!emailIsRegistered) {
            return res.json({error: 'Este correo no está registrado'});
        } else {
            const newPassword = Math.random().toString(36).slice(-8);
            const passwordHash = await bcrypt.hash(newPassword, 10);
            const update = await dbUser.updateUserRecord({email: email}, {password: passwordHash});
            if (!update) {
                return res.json({error: 'No se pudo actualizar la contraseña'});
            } else {
                const emailSent = await emailService.sendEmail(email, 'Recuperación de contraseña', `Tu nueva contraseña es: ${newPassword}`);
                if (!emailSent) {
                    return res.json({error: 'No se pudo enviar el correo'});
                } else {
                    return res.json({success: 'Se ha enviado un correo con tu nueva contraseña'});
                }
            }
        }
    } catch (error) {
        console.error(error);
        return res.json({error: 'Internal server error'});
    }
};
