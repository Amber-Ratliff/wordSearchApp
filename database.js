//seperate db file for practice, possible scalability
import sqlite3 from 'sqlite3';

const dbPath = process.env.DB_PATH || './wordList.db';

const db = new sqlite3.Database(dbPath, 
    sqlite3.OPEN_READWRITE, (error) => {
      if (error) {
        console.error('Issue opening database:', error.message);
        } else {
        console.log('Database connected');
          initializeTables();
        }
});

function initializeTables() {
  db.run(`CREATE TABLE IF NOT EXISTS saved_games (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    word_list TEXT NOT NULL,
    grid_size INTEGER NOT NULL,
    score INTEGER NOT NULL,
    words_found INTEGER NOT NULL,
    total_words INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
}

export default db;
