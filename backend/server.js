import express from 'express';
//import 'dotenv/config';
import db from './database.js';
const app = express();

const PORT = 3000;

//recreates __filename and __dirname
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//create corredt path
const __parentDirname = path.dirname(__dirname)

//express.static() takes a file path
app.use(express.static(path.join(__parentDirname, 'public' )))

//gets words filtered by grid size
app.get('/api/words', (request, response) => {

    //parseInt because req.query returns a string
    const count = parseInt(request.query.count);

    const sql = `SELECT word 
                FROM wordList 
                ORDER BY RANDOM()
                LIMIT ?`

    db.all(sql, count, (error, rows) => {
        if (error) {
            console.error('Database Error', error.message)
            return response.sendStatus(500);}

        //removes id numbers
        const words = rows.map(row => row.word);
        response.json(words)
    })
    
})

app.listen(PORT, () => {
    console.log(`listening on port: ${PORT}`)
});

export default PORT;