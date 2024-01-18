const express = require("express");
const bcrypt = require("bcrypt");
const { Todo, collection } = require("./mongodb");

// Erstelle einen neuen Express-Router
const router = express.Router();


// Route für die Startseite
router.get("/",(req,res)=>{
    res.render("login")
})

// Route für die Login-Seite
router.get("/login",(req,res)=>{
    res.render("login")
})

// Route für die Registrierungsseite
router.get("/signup", (req, res) => {
    res.render("signup");
});

// Route für die Registrierungsseite
router.post("/signup", async (req, res) => {
    const name = req.body.name;
    const password = req.body.password;
    const saltRounds = 10;

    const existingUser = await collection.findOne({ name: name });


    if (existingUser) {
        return res.render("signup", { error: "Der Name ist bereits vergeben." });
    } else {
        bcrypt.hash(password, saltRounds, async (err, hash) => {
            if (err) {
                console.log(err);
                res.status(500).send();
            } else {
                // Erstelle ein neues Datenobjekt mit dem Namen und dem verschlüsselten Passwort
                const data = {
                    name: name,
                    password: hash,
                };
                console.log("8");
                // Füge das Datenobjekt zur Datenbank hinzu
                await collection.insertMany([data]);
                res.render("login");
            }
        });
    }
});

// Route für die Login-Seite
router.post("/login", async (req, res) => {
    const name = req.body.name;
    const password = req.body.password;

    // Überprüfen, ob der Benutzer existiert
    const user = await collection.findOne({ name: name });
    if (!user) {
        return res.render("login", { error: "Benutzername oder Passwort ist falsch." });
    }

    // Wenn der Benutzer existiert, das Passwort überprüfen
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.render("login", { error: "Benutzername oder Passwort ist falsch." });
    }

    // Wenn das Passwort gültig ist, den Benutzer einloggen
    req.session.user = user; // Hier wird der User in der Session gespeichert
    res.redirect("/todo"); // Weiterleitung zur Todo-Liste
});

router.get("/todo", async (req, res) => {
    if (!req.session.user) { // Überprüft, ob der Benutzer in der Session gespeichert ist
        return res.redirect("/login"); // Wenn nicht, wird er zur Login-Seite weitergeleitet
    }

    try {
        const user = req.session.user; // Der aktuell angemeldete Benutzer aus der Session
        const todos = await Todo.find({ user: user._id }); // Findet alle Todos des aktuellen Benutzers
        res.render("todo", { todos }); // Rendert die todo.hbs Vorlage und übergibt die Todos als Variable
    } catch (err) {
        console.error(err);
        res.render("error", { message: "Server error" });
    }
});

router.post("/todo", async (req, res) => {
    if (!req.session.user) { // Überprüft, ob der Benutzer in der Session gespeichert ist
        return res.redirect("/login"); // Wenn nicht, wird er zur Login-Seite weitergeleitet
    }

    try {
        const user = req.session.user; // Der aktuell angemeldete Benutzer aus der Session
        const todo = req.body.todo; // Der Wert des Todo-Formulars
        const newTodo = new Todo({
            description: todo,
            user: user._id // Setzt die user Eigenschaft auf die ID des aktuellen Benutzers
        });
        await newTodo.save(); // Speichert das neue Todo in der Datenbank
        res.redirect("/todo"); // Umleitung zur Todo-Liste

    } catch (err) {
        console.error(err);
        res.render("error", { message: "Server error" });
    }
});



// Route für das Löschen eines Todo-Eintrags
router.delete("/todo/:id", async (req, res) => {
    // Überprüft, ob der Benutzer angemeldet ist
    if (!req.session.user) {
        return res.redirect("/login");
    }

    try {
        // Holt den angemeldeten Benutzer und die ID des zu löschenden Todo-Eintrags aus der Anfrage
        const user = req.session.user;
        const id = req.params.id;
        // Sucht nach dem Todo-Eintrag mit der angegebenen ID, der dem Benutzer zugeordnet ist, und löscht ihn
        const deletedTodo = await Todo.findOneAndDelete({ _id: id, user: user._id });

        if (!deletedTodo) {
            return res.status(404).json({ message: "Todo not found" });
        }

        const todos = await Todo.find({ user: user._id }); // Findet alle Todos des Benutzers
        res.render("todo", { todos }); // Rendert die Todo-Liste erneut
    } catch (err) {
        console.error(err);
        res.render("error", { message: "Server error" });
    }
});

// Diese Route zum Aktualisieren eines Todo-Eintrags
router.put("/todo/:id", async (req, res) => {
    if (!req.session.user) {
        return res.redirect("/login");
    }

    try {
        const user = req.session.user;
        const id = req.params.id;

        // Finde das Todo, das geändert werden soll
        const todo = await Todo.findOne({ _id: id, user: user._id });

        if (!todo) {
            return res.status(404).json({ message: "Todo not found" });
        }

        // Toggle den isDone Status
        todo.isDone = !todo.isDone;

        // Speichere das geänderte Todo
        await todo.save();

        // Finde alle Todos des Benutzers
        const todos = await Todo.find({ user: user._id });

        // Rendere die Todo-Liste erneut
        res.render("todo", { todos });
    } catch (err) {
        console.error(err);
        res.render("error", { message: "Server error" });
    }
});

//Route zum Ausloggen des Benutzers
router.post('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

module.exports = router;
