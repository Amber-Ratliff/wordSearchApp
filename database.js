import sqlite3 from 'sqlite3';
import 'dotenv/config';

const db = new sqlite3.Database(process.env.word_list, sqlite3.OPEN_READONLY)

export default db;