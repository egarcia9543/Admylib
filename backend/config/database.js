const mongoose = require('mongoose');
require('dotenv').config();

const URI = process.env.MONGO_URI;
mongoose.connect(URI, {
    useNewUrlParser: true,
});

module.exports = mongoose;

