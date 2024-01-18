const mongoose = require('mongoose');

//Mongoose-Schema für die Login-Datenbanktabelle
const LogInSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

module.exports = LogInSchema;
