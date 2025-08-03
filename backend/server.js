import express from 'express';
import 'dotenv/config';
import db from './database.js';
const app = express();

//did this just for practice
const PORT = process.env.port || 5000;

//recreates __filename and __dirname
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//express.static() takes a file path
app.use(express.static(path.join(__dirname, 'public' )))

//gets all words filtered by grid size
app.get('/api/words', (request, response) => {

    //parseInt because req.query returns a string
    const count = parseInt(request.query.count);

    const sql = `SELECT word 
                FROM wordList 
                ORDER BY RANDOM()
                LIMIT ?`

    db.all(sql, count, (err, rows) => {
        if (err) {
            console.error('Database Error', err.message)
            return response.sendStatus(500);}

        //turns words into an array only containing the words and sends as json
        const words = rows.map(row => row.word);
        response.json(words)
    })
    
})

app.listen(PORT, () => {
    console.log(`listening on port: ${PORT}`)
});