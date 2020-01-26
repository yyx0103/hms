const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const deliverySchema = new Schema({
    username: {
        type: String, 
        required: true
    },
    title: {
        type: String, 
        required: true
    },
    description: {
        type: String, 
        required: true
    },
    dateIssued: {
        type: Date, 
        required: true
    }
}, {
    timestamps: true,
});

const Delivery = mongoose.model('Campus', deliverySchema);

module.exports = Delivery;