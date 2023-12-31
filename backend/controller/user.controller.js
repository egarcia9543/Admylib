const dbUser = require('../data/user.data');
const dbLoan = require('../data/loan.data');
const dbReservation = require('../data/reservation.data');
const emailService = require('../middleware/emailservice');
const logActivity = require('../middleware/logs');
const bcrypt = require('bcrypt');
const fs = require('fs');
const logRoute = './logs/userlogs.log';
const dbPenalty = require('../data/penalty.data');

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
            if (newRecord.role == 'librarian' || newRecord.role == 'admin') {
                return res.redirect('/librarians');
            } else {
                return res.cookie('user', newRecord._id).redirect('/profile');
            }
        }
    } catch (error) {
        console.error(error);
        return res.render('500', {
            error: error,
        });
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
                return res.cookie('user', user._id).redirect('/profile');
            }
        }
    } catch (error) {
        console.error(error);
        return res.render('500', {
            error: error,
        });
    }
};

exports.logout = async (req, res) => {
    try {
        return res.clearCookie('user').redirect('/');
    } catch (error) {
        console.error(error);
        return res.render('500', {
            error: error,
        });
    }
};

exports.recoverPassword = async (req, res) => {
    const {email} = req.body;
    try {
        const emailIsRegistered = await dbUser.findOneUser({email: email}, {email: 1, password: 1});
        if (!emailIsRegistered) {
            return res.render('signin', {error: 'Este correo no está registrado'});
        } else {
            const newPassword = Math.random().toString(36).slice(-8);
            const passwordHash = await bcrypt.hash(newPassword, 10);
            const update = await dbUser.updateUserRecord({email: email}, {password: passwordHash});
            if (!update) {
                return res.render('signin', {error: 'No se pudo actualizar la contraseña'});
            } else {
                const emailSent = await emailService.sendEmail(email, 'Recuperación de contraseña', `Tu nueva contraseña es: ${newPassword}`);
                if (!emailSent) {
                    return res.render('signin', {error: 'No se pudo enviar el correo'});
                } else {
                    return res.render('signin', {success: 'Se ha enviado un correo con tu nueva contraseña'});
                }
            }
        }
    } catch (error) {
        console.error(error);
        return res.render('500', {
            error: error,
        });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const {id, email, password} = req.body;
        const isUserRegistered = await dbUser.findOneUser({_id: id});
        if (!isUserRegistered) {
            return res.json({error: 'Este usuario no existe'});
        } else {
            if (email !== isUserRegistered.email) {
                const isEmailRegisterd = await dbUser.findOneUser({email: email}, {email: 1});
                if (isEmailRegisterd) {
                    return res.render('profile', {
                        error: 'Este correo ya está registrado',
                        user: isUserRegistered,
                        userAuthenticated: req.cookies.user,
                    });
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
                return res.render('profile', {
                    success: 'Usuario actualizado correctamente',
                    user: update,
                    userAuthenticated: req.cookies.user,
                    loans: await dbLoan.findLoan({user: req.cookies.user}, {book: 1, loanDate: 1, returnDate: 1}),
                    reservations: await dbReservation.findReservation({user: req.cookies.user}, {book: 1, reservationDate: 1, expirationDate: 1, returnDate: 1}),
                    penalty: await dbPenalty.findPenalty({user: req.cookies.user, isActive: true}, {penaltyTime: 1}),
                });
            }
        }
    } catch (error) {
        return res.render('500', {
            error: error,
        });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const {id, email, password} = req.body;
        const isUserRegistered = await dbUser.findOneUser({_id: id});
        if (!isUserRegistered) {
            return res.json({error: 'Este usuario no existe'});
        } else {
            if (email !== isUserRegistered.email) {
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
                return res.render('usersInterface', {
                    error: 'No se pudo actualizar el usuario',
                    users: await dbUser.findAllUsers({password: 0}),
                    user: req.cookies.user,
                });
            } else {
                logActivity.generateLog(logRoute, `User ${id} updated ${JSON.stringify(req.body)} at ${new Date()}\n`);
                return res.redirect('/users');
            }
        }
    } catch (error) {
        return res.render('500', {
            error: error,
        });
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
        return res.render('500', {
            error: error,
        });
    }
};

exports.deleteAccount = async (req, res) => {
    try {
        const {id} = req.params;
        const user = await dbUser.deleteUserRecord({_id: id});
        fs.unlink(`./frontend/static${user.profilePicture}`, (err) => {
            if (err) {
                console.error(err);
                return;
            }
        });
        if (user.error) {
            return res.render('profile', {
                error: user.error,
                user: await dbUser.findOneUser({_id: req.cookies.user}),
                userAuthenticated: req.cookies.user,
                loans: await dbLoan.findLoan({user: req.cookies.user, returned: false}, {book: 1, loanDate: 1, returnDate: 1}),
                reservations: await dbReservation.findReservation({user: req.cookies.user, isActive: true}, {book: 1, reservationDate: 1, expirationDate: 1, returnDate: 1}),
                penalty: await dbPenalty.findPenalty({user: req.cookies.user, isActive: true}, {penaltyTime: 1}),
            });
        } else {
            return res.clearCookie('user').redirect('/');
        }
    } catch (error) {
        return res.render('500', {
            error: error,
        });
    }
};

exports.updateProfilePicture = async (req, res) => {
    try {
        const {userDocument} = req.body;
        const user = await dbUser.findOneUser({document: userDocument});
        if (!user) {
            return res.render('profile', {
                error: 'Este usuario no existe',
                user: await dbUser.findOneUser({_id: req.cookies.user}),
                userAuthenticated: req.cookies.user,
                loans: await dbLoan.findLoan({user: req.cookies.user, returned: false}, {book: 1, loanDate: 1, returnDate: 1}),
                reservations: await dbReservation.findReservation({user: req.cookies.user, isActive: true}, {book: 1, reservationDate: 1, expirationDate: 1, returnDate: 1}),
                penalty: await dbPenalty.findPenalty({user: req.cookies.user, isActive: true}, {penaltyTime: 1}),
            });
        } else {
            const imgPath = `/userPics/${req.body.userDocument}-${req.file.originalname}`;
            const update = await dbUser.updateUserRecord({document: userDocument}, {profilePicture: imgPath});
            fs.unlink(`./frontend/static${user.profilePicture}`, (err) => {
                if (err) {
                    console.error(err);
                    return;
                }
            });
            if (!update) {
                return res.render('profile', {
                    error: 'No se pudo actualizar la imagen',
                    user: await dbUser.findOneUser({_id: req.cookies.user}),
                    userAuthenticated: req.cookies.user,
                    loans: await dbLoan.findLoan({user: req.cookies.user, returned: false}, {book: 1, loanDate: 1, returnDate: 1}),
                    reservations: await dbReservation.findReservation({user: req.cookies.user, isActive: true}, {book: 1, reservationDate: 1, expirationDate: 1, returnDate: 1}),
                    penalty: await dbPenalty.findPenalty({user: req.cookies.user, isActive: true}, {penaltyTime: 1}),
                });
            } else {
                return res.redirect('/profile');
            }
        }
    } catch (error) {
        return res.render('500', {
            error: error,
        });
    }
};
