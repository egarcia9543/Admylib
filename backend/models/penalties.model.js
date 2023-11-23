const mongoose = require('../config/database');
const {Schema} = mongoose;

const penaltySchema = new mongoose.Schema({
    penaltyTime: {
        type: Date,
        required: [true, 'Penalty time is required'],
    },
    reason: {
        type: String,
        maxlength: 255,
        required: [true, 'Reason is required'],
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users',
    },
    isActive: {
        type: Boolean,
        default: true,
    },
});

const penalty = mongoose.model('penalties', penaltySchema);
module.exports = penalty;
