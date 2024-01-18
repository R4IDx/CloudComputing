const mongoose = require("mongoose");

// Importieren der Schemas für die Todo- und Login-Datenbanktabellen
const TodoSchema = require('../schemes/todoscheme');
const LogInSchema = require('../schemes/loginscheme');

// Verbindung zur MongoDB
const uri = "mongodb://" + process.env.MONGO_USER + ":" + process.env.MONGO_PASS + "@mongodb-service:27017";
console.log("URI: ", uri);

mongoose.connect(uri).then(() => {
    console.log("mongodb connected");
}).catch(() => {
    console.log("failed to connect");
});

// Erstellen von Mongoose-Modellen aus den Schemas für die Todo- und Login-Datenbanktabellen
const Todo = mongoose.model('Todo', TodoSchema);
const collection = mongoose.model("logins", LogInSchema);

module.exports = { collection, Todo };
