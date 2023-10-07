const express = require('express');
const router = express.Router();

const librarianController = require('../controller/librarian.controller');

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
 *          
 */
router.post('/newlibrarian', librarianController.registerLibrarian);

module.exports = router;
