const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const taskSchema = new Schema({
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
        required: false
    },
    dateDue: {
        type: Date,
        required: false
    },
    family: {
        type: String,
        required: true
    },
    executor: {
        type: String,
        required: false
    },
    isFinished: {
        type: Boolean,
        required: false
    }
}, {
    timestamps: true,
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;