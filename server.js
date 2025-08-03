import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';
const app = express();

//a read only connection to wordList.db
import db from './database.js';

const PORT = process.env.port || 5000;

//gets current filepath
const _file = fileURLToPath(import.meta.url);

//gets directory of _file
const _dirname = path.dirname(_file);

app.use(express.static(path.join(_dirname, 'public' )))

//gets all words filtered by grid size
app.get('/api/words', (req, res) => {
    //parseInt because req.query returns a string
    const count = parseInt(req.query.count);
    const length = parseInt(req.query.length);

    const params = [length, count];

    const sql = `SELECT word 
                FROM wordList
                WHERE LENGTH(word) = ? 
                ORDER BY RANDOM()
                LIMIT ?`

    db.all(sql, params, (err, rows) => {
        if (err) {
            console.error('Database Error', err.message)
            return res.sendStatus(500);}

        const words = rows.map(row => row.word);
        res.json(words)
    })
    
})

app.listen(PORT, () => {
    console.log(`listening on port: ${PORT}`)
});