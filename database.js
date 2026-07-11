const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./skillforge.db", (err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log("✅ SkillForge Database Connected");
    }
});

db.serialize(() => {

    db.run(`
        CREATE TABLE IF NOT EXISTS students (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE,
            course TEXT,
            reference TEXT,
            payment_status TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

});

module.exports = db;