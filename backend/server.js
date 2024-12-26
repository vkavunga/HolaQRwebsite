const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const path = require("path");
const multer = require("multer");

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Multer configuration for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    },
});

const upload = multer({ storage });

// SQLite database setup
const db = new sqlite3.Database("./database.sqlite", (err) => {
    if (err) console.error(err.message);
    console.log("Connected to SQLite database.");
});

// Create tables
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS fish (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            place TEXT NOT NULL,
            date TEXT NOT NULL,
            qrCode TEXT NOT NULL,
            photo TEXT NOT NULL
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS customers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            phone TEXT NOT NULL
        )
    `);
});

// Admin: Upload fish details
app.post("/admin/upload", upload.fields([{ name: "qrCode" }, { name: "photo" }]), (req, res) => {
    const { name, place, date } = req.body;
    const qrCode = `/uploads/${req.files["qrCode"][0].filename}`;
    const photo = `/uploads/${req.files["photo"][0].filename}`;
    const query = `INSERT INTO fish (name, place, date, qrCode, photo) VALUES (?, ?, ?, ?, ?)`;

    db.run(query, [name, place, date, qrCode, photo], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Fish details uploaded successfully!", id: this.lastID });
    });
});

// Admin: Delete fish details
app.delete("/admin/delete/:id", (req, res) => {
    const { id } = req.params;
    db.run(`DELETE FROM fish WHERE id = ?`, [id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Fish details deleted successfully!" });
    });
});

// Admin: List all fish details
app.get("/admin/list", (req, res) => {
    db.all("SELECT * FROM fish", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Customer: Save customer details
app.post("/customer/save", (req, res) => {
    const { name, phone } = req.body;
    const query = `INSERT INTO customers (name, phone) VALUES (?, ?)`;

    db.run(query, [name, phone], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Customer details saved successfully!", id: this.lastID });
    });
});

// Customer: Fetch all fish details
app.get("/customer/list", (req, res) => {
    db.all("SELECT * FROM fish", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
