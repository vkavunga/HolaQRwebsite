const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Connect to SQLite Database
const db = new sqlite3.Database("./database.sqlite", (err) => {
  if (err) {
    console.error("Error connecting to database", err.message);
  } else {
    console.log("Connected to SQLite database.");
  }
});

// Create Fish Details Table (if not exists)
db.run(
  `CREATE TABLE IF NOT EXISTS fish (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    place TEXT,
    date TEXT,
    qrCode TEXT
  )`
);

// API to Add Fish Details
app.post("/admin/upload", (req, res) => {
  const { name, place, date, qrCode } = req.body;

  if (!name || !place || !date || !qrCode) {
    return res.status(400).json({ message: "All fields are required." });
  }

  db.run(
    `INSERT INTO fish (name, place, date, qrCode) VALUES (?, ?, ?, ?)`,
    [name, place, date, qrCode],
    function (err) {
      if (err) {
        console.error("Error inserting data", err.message);
        return res.status(500).json({ message: "Failed to upload fish details." });
      }
      res.status(201).json({ message: "Fish details uploaded successfully." });
    }
  );
});

// API to Fetch Fish Details
app.get("/admin/list", (req, res) => {
  db.all(`SELECT * FROM fish`, [], (err, rows) => {
    if (err) {
      console.error("Error fetching data", err.message);
      return res.status(500).json({ message: "Failed to fetch fish details." });
    }
    res.status(200).json(rows);
  });
});

// API to Delete a Fish Entry
app.delete("/admin/delete/:id", (req, res) => {
  const { id } = req.params;

  db.run(`DELETE FROM fish WHERE id = ?`, [id], function (err) {
    if (err) {
      console.error("Error deleting data", err.message);
      return res.status(500).json({ message: "Failed to delete fish details." });
    }
    res.status(200).json({ message: "Fish details deleted successfully." });
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
