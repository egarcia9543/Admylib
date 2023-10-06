const express = require('express');
require('dotenv').config();
const path = require('path');
const router = require('./backend/routes/router');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/frontend/views/pages'));

app.use(express.static(path.join(__dirname, '/frontend/static')));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use('/', router);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
