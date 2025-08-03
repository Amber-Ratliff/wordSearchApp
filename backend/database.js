//seperate db file for practice, possible scalability
import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('wordList.db', sqlite3.OPEN_READONLY, (error) => {
    console.error('issue opening database', error.message)});

export default db;