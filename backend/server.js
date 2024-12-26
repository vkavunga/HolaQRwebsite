const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const path = require("path");

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database setup
const db = new sqlite3.Database("./database.sqlite", (err) => {
    if (err) console.error(err.message);
    console.log("Connected to SQLite database.");
});

// Initialize tables
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
            email TEXT NOT NULL,
            phone TEXT NOT NULL
        )
    `);
});

// Routes

// Admin: Upload fish details
app.post("/admin/upload", (req, res) => {
    const { name, place, date, qrCode, photo } = req.body;
    const query = `INSERT INTO fish (name, place, date, qrCode, photo) VALUES (?, ?, ?, ?, ?)`;
    db.run(query, [name, place, date, qrCode, photo], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Fish details uploaded successfully!", id: this.lastID });
    });
});

// Admin: List all fish details
app.get("/admin/list", (req, res) => {
    db.all("SELECT * FROM fish", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Admin: Delete fish details
app.delete("/admin/delete/:id", (req, res) => {
    const id = req.params.id;
    const query = `DELETE FROM fish WHERE id = ?`;
    db.run(query, [id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Fish details deleted successfully!" });
    });
});

// Customer: List all fish details
app.get("/customer/list", (req, res) => {
    db.all("SELECT * FROM fish", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Customer: Collect customer details
app.post("/customer/details", (req, res) => {
    const { email, phone } = req.body;
    const query = `INSERT INTO customers (email, phone) VALUES (?, ?)`;
    db.run(query, [email, phone], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Customer details submitted successfully!" });
    });
});

// Serve static files (optional for frontend assets)
app.use(express.static(path.join(__dirname, "public")));

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
