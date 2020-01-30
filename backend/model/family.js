const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FamilySchema = new Schema({
    family: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        index: {
            unique: true,
        }
    },
    member: {
        type: Array,
        default: []
    }
});

const Family = mongoose.model('Family', FamilySchema);

module.exports = Family;