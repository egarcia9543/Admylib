const mongoose = require('../config/database');

const publisherSchema = new mongoose.Schema({
    name: {
        type: String,
        maxlength: 255,
        required: [true, 'Name is required'],
    },
    address: {
        type: String,
        maxlength: 255,
        required: [true, 'Address is required'],
    },
    phone: {
        type: String,
        maxlength: 255,
        required: [true, 'Phone is required'],
    },
});

const publisher = mongoose.model('publishers', publisherSchema);
module.exports = publisher;
