//seperate db file for practice, possible scalability
import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('./backend/wordList.db', sqlite3.OPEN_READONLY, (error) => {
  if (error) {
    console.error('Issue opening database:', error.message);
  } else {
    console.log('Database connected');
  }
});

export default db;