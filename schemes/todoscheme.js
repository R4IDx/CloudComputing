const mongoose = require('mongoose');

//Mongoose-Schema für die todos-Datenbanktabelle
const TodoSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'logins'
    },
    isDone: {
        type: Boolean,
        default: false
    }
});

module.exports = TodoSchema;
