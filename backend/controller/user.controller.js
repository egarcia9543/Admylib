const dbUser = require('../data/user.data');
const emailService = require('../middleware/emailservice');
const logActivity = require('../middleware/logs');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const logRoute = './logs/userlogs.log';

exports.registerUser = async (req, res) => {
    const {document, email, password} = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    req.body.password = passwordHash;
    try {
        const documentIsRegistered = await dbUser.findOneUser({document: document}, {document: 1});
        const emailIsRegistered = await dbUser.findOneUser({email: email}, {email: 1});
        if (documentIsRegistered && emailIsRegistered) {
            return res.render('signup', {error: 'Este documento y correo ya están registrados'});
        } else if (emailIsRegistered) {
            return res.render('signup', {error: 'Este correo ya está registrado'});
        } else if (documentIsRegistered) {
            return res.render('signup', {error: 'Este documento ya está registrado'});
        } else {
            const newRecord = await dbUser.createUserRecord(req.body);
            logActivity.generateLog(logRoute, `User ${email} created at ${new Date()}\n`);
            const token = jwt.sign({id: newRecord._id}, process.env.SECRET_KEY, {expiresIn: '1h'});
            return res.cookie('token', token).json({success: newRecord});
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({error: 'Internal server error'});
    }
};

exports.loginUser = async (req, res) => {
    const {email, password} = req.body;
    try {
        if (!email || !password) return res.render('signin', {error: 'Ingresa todos los datos'});
        const user = await dbUser.findOneUser({email: email}, {email: 1, password: 1, role: 1});
        if (!user) {
            return res.render('signin', {error: 'Este usuario no existe'});
        } else {
            const passwordIsCorrect = await bcrypt.compare(password, user.password);
            if (!passwordIsCorrect) {
                return res.render('signin', {error: 'Contraseña incorrecta'});
            } else {
                return res.cookie('user', user._id).redirect('/');
            }
        }
    } catch (error) {
        console.error(error);
        return res.json({error: 'Internal server error'});
    }
};

exports.logout = async (req, res) => {
    try {
        return res.clearCookie('user').redirect('/');
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

exports.updateUser = async (req, res) => {
    try {
        const {id, email, password} = req.body;
        const isUserRegistered = await dbUser.findOneUser({_id: id}, {email: 1});
        if (!isUserRegistered) {
            return res.json({error: 'Este usuario no existe'});
        } else {
            if (email) {
                const isEmailRegisterd = await dbUser.findOneUser({email: email}, {email: 1});
                if (isEmailRegisterd) {
                    return res.json({error: 'Este correo ya está registrado'});
                }
            }
            if (password) {
                const passwordHash = await bcrypt.hash(password, 10);
                req.body.password = passwordHash;
            }
            const update = await dbUser.updateUserRecord({_id: id}, req.body);
            if (!update) {
                return res.json({error: 'No se pudo actualizar el usuario'});
            } else {
                logActivity.generateLog(logRoute, `User ${id} updated ${JSON.stringify(req.body)} at ${new Date()}\n`);
                return res.json({success: 'Usuario actualizado correctamente'});
            }
        }
    } catch (error) {
        return res.json({error: 'Internal server error'});
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const {id} = req.params;
        const user = await dbUser.deleteUserRecord({_id: id});
        if (!user) {
            return res.json({error: 'No se pudo eliminar el usuario'});
        } else {
            return res.json({success: 'Usuario eliminado correctamente'});
        }
    } catch (error) {
        return res.json({error: 'Internal server error'});
    }
};

exports.tokenVerification = async (req, res, next) => {
    const token = req.cookies.token;
    console.log(token);
    if (!token) {
        return res.redirect('/signin');
    } else {
        try {
            jwt.verify(token, process.env.SECRET_KEY), (err, user) => {
                if (err) {
                    return res.status(401).json({error: 'Token inválido'});
                } else {
                    req.id = user.id;
                    console.log(req.id);
                    next();
                }
            };
        } catch (error) {
            return res.status(401).json({error: 'Token inválido'});
        }
    }
};
