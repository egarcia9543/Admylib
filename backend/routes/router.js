const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();

const pagesController = require('../controller/pages.controller');
const userController = require('../controller/user.controller');
const bookController = require('../controller/book.controller');
const loanController = require('../controller/loan.controller');
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

// Catalog
router.post('/newbook', upload.single('cover'), bookController.addBook);
router.get('/books', bookController.getBooks);
router.post('/quicksearch', bookController.quickSearch);
router.get('/book/:id', bookController.getBookDetails);
router.delete('/deletebook/:id', bookController.deleteBook);
router.post('/updatebook', bookController.updateBook);

router.post('/newloan', loanController.addLoan);
router.get('/loan/:id', loanController.getLoanDetails);

// Admin
router.get('/admin', pagesController.verifyAdminUser, pagesController.renderAdminPage);
router.get('/cataloging', pagesController.verifyAdminUser, pagesController.renderCatalogingPage);
router.get('/registerbook', pagesController.verifyAdminUser, pagesController.renderBookForm);
router.get('/loans', pagesController.verifyAdminUser, pagesController.renderLoansPage);
router.get('/users', pagesController.verifyAdminUser, pagesController.renderUsersPage);
router.get('/penalties', pagesController.verifyAdminUser, pagesController.renderPenaltiesPage);
router.get('/reservations', pagesController.verifyAdminUser, pagesController.renderReservationsPage);


router.get('/test', pagesController.test);
/**
 * @swagger
 * components:
 *  schemas:
 *      librarian:
 *          type: object
 *          properties:
 *              fullname:
 *                  type: string
 *                  description: librarian full name
 *              document:
 *                  type: integer
 *                  description: librarian document
 *              email:
 *                  type: string
 *                  description: librarian email
 *              password:
 *                  type: string
 *                  description: librarian password
 *              entryTime:
 *                  type: string
 *                  description: librarian entrytime
 *              exitTime:
 *                  type: string
 *                  description: librarian exit time
 *          required:
 *              - fullname
 *              - document
 *              - email
 *              - password
 *              - entryTime
 *              - exitTime
 *          example:
 *              fullname: pepe jonhson
 *              document: 1020304050
 *              email: pepej@gmail.com
 *              password: 123
 *              entryTime: 10:00 am
 *              exitTime: 18:00 pm
 */

/**
 * @swagger
 * /newlibrarian:
 *  post:
 *      summary: create a new librarian
 *      tags: [librarian]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      $ref: '#/components/schemas/librarian'
 *      responses:
 *          200:
 *              description: new librarian created
 */


module.exports = router;
