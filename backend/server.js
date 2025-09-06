import express from 'express';
import 'dotenv/config';
import db from './database.js';
const app = express();

// Add CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.use(express.json());

const PORT = process.env.PORT || 3000;

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

app.post('/api/games', (request, response) => {
    const { wordList, gridSize, score, wordsFound, totalWords } = request.body;
    
    if (!wordList || !gridSize || score === undefined || !wordsFound || !totalWords) {
        return response.status(400).json({ error: 'Missing required fields' });
    }

    const sql = `INSERT INTO saved_games (word_list, grid_size, score, words_found, total_words)
                VALUES (?, ?, ?, ?, ?)`;

    db.run(sql, [JSON.stringify(wordList), gridSize, score, wordsFound, totalWords], function(error) {
        if (error) {
            console.error('Database Error:', error.message);
            return response.status(500).json({ error: 'Failed to save game' });
        }
        response.json({ id: this.lastID, message: 'Game saved successfully' });
    });
});

app.get('/api/games', (request, response) => {
    const sql = `SELECT id, word_list, grid_size, score, words_found, total_words, 
                datetime(created_at, 'localtime') as created_at
                FROM saved_games 
                ORDER BY created_at DESC`;

    db.all(sql, [], (error, rows) => {
        if (error) {
            console.error('Database Error:', error.message);
            return response.status(500).json({ error: 'Failed to retrieve games' });
        }
        
        const games = rows.map(row => ({
            ...row,
            word_list: JSON.parse(row.word_list)
        }));
        
        response.json(games);
    });
});

app.get('/api/games/:id', (request, response) => {
    const gameId = parseInt(request.params.id);
    
    const sql = `SELECT id, word_list, grid_size, score, words_found, total_words,
                datetime(created_at, 'localtime') as created_at
                FROM saved_games 
                WHERE id = ?`;

    db.get(sql, [gameId], (error, row) => {
        if (error) {
            console.error('Database Error:', error.message);
            return response.status(500).json({ error: 'Failed to retrieve game' });
        }
        
        if (!row) {
            return response.status(404).json({ error: 'Game not found' });
        }
        
        const game = {
            ...row,
            word_list: JSON.parse(row.word_list)
        };
        
        response.json(game);
    });
});

app.delete('/api/games/:id', (request, response) => {
    const gameId = parseInt(request.params.id);
    
    const sql = 'DELETE FROM saved_games WHERE id = ?';
    
    db.run(sql, [gameId], function(error) {
        if (error) {
            console.error('Database Error:', error.message);
            return response.status(500).json({ error: 'Failed to delete game' });
        }
        
        if (this.changes === 0) {
            return response.status(404).json({ error: 'Game not found' });
        }
        
        response.json({ message: 'Game deleted successfully' });
    });
});

app.listen(PORT, () => {
    console.log(`listening on port: ${PORT}`)
});

export default PORT;