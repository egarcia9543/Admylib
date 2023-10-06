const express = require('express');
const router = express.Router();

const librarianController = require('../controller/librarian.controller');

router.post('/newlibrarian', librarianController.registerLibrarian);

module.exports = router;
