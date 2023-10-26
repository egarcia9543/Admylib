const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();

const pagesController = require('../controller/pages.controller');
const userController = require('../controller/user.controller');
const publisherController = require('../controller/publisher.controller');
const authorController = require('../controller/author.controller');
const bookController = require('../controller/book.controller');
const loanController = require('../controller/loan.controller');

router.get('/', pagesController.renderLandingPage);
router.get('/signup', pagesController.renderSignUpPage);

router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.get('/logout', userController.logout);
router.post('/recover', userController.recoverPassword);
router.get('/users', userController.listAllUsers);
router.put('/update', userController.updateUser);
router.delete('/delete/:id', userController.deleteUser);

// Catalog
router.post('/newpublisher', publisherController.addPublisher);
router.post('/newauthor', authorController.addAuthor);
router.post('/newbook', bookController.addBook);
router.get('/books', bookController.getBooks);

router.post('/newloan', loanController.addLoan);

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
