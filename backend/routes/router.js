const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();

const pagesController = require('../controller/pages.controller');
const userController = require('../controller/user.controller');
const bookController = require('../controller/book.controller');
const loanController = require('../controller/loan.controller');
const reservationController = require('../controller/reservation.controller');
const penaltyController = require('../controller/penalty.controller');
const upload = require('../middleware/upload');

router.get('/', pagesController.renderLandingPage);
router.get('/signup', pagesController.renderSignUpPage);
router.get('/signin', pagesController.renderSignInPage);

router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.get('/profile', pagesController.renderProfilePage);
router.get('/logout', userController.logout);
router.post('/recover', userController.recoverPassword);
router.post('/updateprofile', userController.updateProfile);
router.post('/updateuser', userController.updateUser);
router.delete('/deleteuser/:id', userController.deleteUser);
router.get('/deleteaccount/:id', userController.deleteAccount);
router.post('/updatepicture', upload.single('profilePicture'), userController.updateProfilePicture);

// Catalog
router.post('/newbook', upload.single('cover'), bookController.addBook);
router.get('/books', bookController.getBooks);
router.post('/quicksearch', bookController.quickSearch);
router.get('/book/:id', bookController.getBookDetails);
router.delete('/deletebook/:id', bookController.deleteBook);
router.post('/updatebook', bookController.updateBook);

router.post('/newloan', loanController.addLoan);
router.get('/loan/:id', loanController.getLoanDetails);
router.post('/extendloan', loanController.updateLoan);
router.post('/returnloan', loanController.returnLoan);
router.get('/state/:isbn', loanController.getLoanByISBN);

router.get('/reservation/:isbn', reservationController.isBookReserved);
router.post('/newreservation', reservationController.addReservation);
router.get('/cancelreservation/:id', reservationController.cancelReservation);
router.post('/updatereservation', reservationController.updateReservation);

router.post('/newpenalty', penaltyController.addPenalty);
router.post('/updatepenalty', penaltyController.updatePenalty);
router.delete('/deletepenalty/:id', penaltyController.deletePenalty);

router.get('/librarians', pagesController.verifyAdminUser, pagesController.renderLibrariansPage);

// Admin
router.get('/admin', pagesController.verifyAdminUser, pagesController.renderAdminPage);
router.get('/cataloging', pagesController.verifyAdminUser, pagesController.renderCatalogingPage);
router.get('/registerbook', pagesController.verifyAdminUser, pagesController.renderBookForm);
router.get('/loans', pagesController.verifyAdminUser, pagesController.renderLoansPage);
router.get('/users', pagesController.verifyAdminUser, pagesController.renderUsersPage);
router.get('/penalties', pagesController.verifyAdminUser, pagesController.renderPenaltiesPage);
router.get('/reservations', pagesController.verifyAdminUser, pagesController.renderReservationsPage);

module.exports = router;
