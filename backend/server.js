const express = require("express");
const multer = require("multer");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;

// Ensure the uploads directory exists
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

// Configure Multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    },
});
const upload = multer({ storage });

// Allow cross-origin requests
app.use(cors());
app.use(express.json());
app.use(express.static(uploadsDir));

// Database setup
const db = new sqlite3.Database("./database.sqlite", (err) => {
    if (err) {
        console.error("Error opening database:", err.message);
    } else {
        console.log("Connected to SQLite database.");
        db.run(
            `CREATE TABLE IF NOT EXISTS fish (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT,
                place TEXT,
                date TEXT,
                qrCode TEXT,
                photo TEXT
            )`
        );
        db.run(
            `CREATE TABLE IF NOT EXISTS customers (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT,
                phone TEXT
            )`
        );
    }
});

// Admin upload endpoint
app.post(
    "/admin/upload",
    upload.fields([{ name: "qrCode" }, { name: "photo" }]),
    (req, res) => {
        const { name, place, date } = req.body;

        if (!req.files || !req.files.qrCode || !req.files.photo) {
            return res.status(400).json({ error: "QR Code and photo are required." });
        }

        const qrCode = `/uploads/${req.files.qrCode[0].filename}`;
        const photo = `/uploads/${req.files.photo[0].filename}`;

        db.run(
            `INSERT INTO fish (name, place, date, qrCode, photo) VALUES (?, ?, ?, ?, ?)`,
            [name, place, date, qrCode, photo],
            function (err) {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }
                res.json({ message: "Fish details uploaded successfully!", id: this.lastID });
            }
        );
    }
);

// Fetch all fish details
app.get("/fish", (req, res) => {
    db.all("SELECT * FROM fish", [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// Customer registration endpoint
app.post("/customer/register", (req, res) => {
    const { name, phone } = req.body;
    db.run(
        `INSERT INTO customers (name, phone) VALUES (?, ?)`,
        [name, phone],
        function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({ message: "Customer registered successfully!", id: this.lastID });
        }
    );
});

// Start server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
