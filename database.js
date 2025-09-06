//seperate db file for practice, possible scalability
import sqlite3 from 'sqlite3';
import fs from 'fs';

const dbPath = process.env.DB_PATH || './wordList.db';

// Debug database file
console.log('Database path:', dbPath);
console.log('Database exists:', fs.existsSync(dbPath));
console.log('Current working directory:', process.cwd());
console.log('Files in current directory:', fs.readdirSync('.').filter(f => f.includes('db')));

const db = new sqlite3.Database(dbPath, 
    sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (error) => {
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
  
  // Check if wordList table exists and has data
  db.get("SELECT COUNT(*) as count FROM sqlite_master WHERE type='table' AND name='wordList'", (err, row) => {
    if (err) {
      console.error('Error checking wordList table:', err);
    } else {
      console.log('wordList table exists:', row.count > 0);
      if (row.count > 0) {
        db.get("SELECT COUNT(*) as wordCount FROM wordList", (err, wordRow) => {
          if (err) {
            console.error('Error counting words:', err);
          } else {
            console.log('Word count in database:', wordRow.wordCount);
          }
        });
      }
    }
  });
}

export default db;
