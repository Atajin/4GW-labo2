/*
    Importation des modules requis
*/
import express from "express";
import session from "express-session";
import path from "path";
import { fileURLToPath } from "url";
import mysql from "mysql";
import { body, validationResult } from "express-validator";
import dateFormat from "dateformat";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/*
    Connect to server
*/
const server = app.listen(4000, function () {
    console.log("serveur fonctionne sur 4000... ! ");
});

/*
    Configuration de EJS
*/
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

/*
    Importation de Bootstrap
*/
app.use("/js", express.static(__dirname + "/node_modules/bootstrap/dist/js"));
app.use("/css", express.static(__dirname + "/node_modules/bootstrap/dist/css"));

/*
    Permettre l'utilisation de body lors des POST request
*/
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


/*
    Connection au server MySQL
*/
const con = mysql.createConnection({
    host: "localhost",
    user: "scott",
    password: "oracle",
    database: "mybd"
});

con.connect(function (err) {
    if (err) throw err;
    console.log("connected!");
});

/*
    Description des routes
*/
app.get("/", function (req, res) {
    con.query("SELECT * FROM e_events ORDER BY e_start_date DESC", function (err, result) {
        if (err) throw err;
        res.render("pages/index", {
            siteTitle: "Application simple",
            pageTitle: "Liste d'événements",
            items: result
        });
    });
});

app.get("/event/add", function (req, res) {
    con.query("SELECT * FROM e_events ORDER BY e_start_date DESC", function (err, result) {
        if (err) throw err;
        res.render("pages/add-event", {
            siteTitle: "Application simple",
            pageTitle: "Ajouter un nouvel événement",
            items: result
        });
    });
});

app.post("/event/add", function (req, res) {
    const requete = "INSERT INTO e_events (E_NAME, E_START_DATE, E_START_END, E_DESC, E_LOCATION) VALUES (?, ?, ?, ?, ?)";
    const parametres = [
        req.body.E_NAME,
        dateFormat(req.body.E_START_DATE, "yyyy-mm-dd"),
        dateFormat(req.body.E_START_END, "yyyy-mm-dd"),
        req.body.E_DESC,
        req.body.E_LOCATION
    ];
    con.query(requete, parametres, function (err, result) {
        if (err) throw err;
        res.redirect("/");
    });
});
