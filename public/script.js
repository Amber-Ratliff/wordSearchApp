import { generateRandomLetter, displayGrid, wordFits } from "./logic.js";

const wordBox = document.getElementById('word-box');
const letterGrid = document.getElementById('search-grid');
const resetButton = document.getElementById('reset');
//const newPuzzle = document.getElementById('new');
let score = 0;
const scoreText = document.getElementById('point-total')

let mousedown = false;
let selectedLetters = [];
let startRow = null;
let startCol = null;
let placedWords = [];
let userFoundWords = [];
let currentWords = [];

async function saveGame() {
    const gameData = {
        wordList: currentWords,
        gridSize: 10,
        score: score,
        wordsFound: userFoundWords.length,
        totalWords: placedWords.length
    };

    try {
        const response = await fetch('/api/games', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(gameData)
        });

        const result = await response.json();
        
        if (response.ok) {
            alert(`Game saved successfully! ID: ${result.id}`);
        } else {
            alert(`Error saving game: ${result.error}`);
        }
    } catch (error) {
        console.error('Error saving game:', error);
        alert('Error saving game. Please try again.');
    }
}

async function loadSavedGames() {
    try {
        const response = await fetch('/api/games');
        const games = await response.json();
        
        if (!response.ok) {
            throw new Error(games.error || 'Failed to load games');
        }
        
        return games;
    } catch (error) {
        console.error('Error loading games:', error);
        alert('Error loading saved games. Please try again.');
        return [];
    }
}

async function loadGame(gameId) {
    try {
        const response = await fetch(`/api/games/${gameId}`);
        const game = await response.json();
        
        if (!response.ok) {
            throw new Error(game.error || 'Failed to load game');
        }
        
        resetGame();
        
        // Set the loaded game data
        currentWords = game.word_list;
        score = game.score;
        userFoundWords = [];
        
        await createGridFromWords(currentWords);
        
        scoreText.textContent = score;
        
        alert(`Game loaded! Original score: ${game.score}, Found ${game.words_found}/${game.total_words} words`);
        
    } catch (error) {
        console.error('Error loading game:', error);
        alert('Error loading game. Please try again.');
    }
}

function placeWord(rows, cols, word, grid) {
    word = word.toUpperCase();
    const directionList = [
        'up', 'down', 'left', 'right', 
        'upDiagonal', 'downDiagonal', 'upLeftDiagonal', 'downLeftDiagonal',
        'upDiagonal', 'downDiagonal', 'upLeftDiagonal', 'downLeftDiagonal'  // Add more diagonal chances
    ];

    let placed = false;

    
    let attempts = 0;
    const maxAttempts = 100;

    while (!placed && attempts < maxAttempts) {
        const rowStart = Math.floor(Math.random() * rows);
        const colStart = Math.floor(Math.random() * cols);
        const direction = directionList[Math.floor(Math.random() * directionList.length)];

        let deltaRow;
        let deltaCol;

        switch (direction) {
            case 'up':
                deltaRow = -1; deltaCol = 0;
                break;
            case 'down': 
                deltaRow = 1; deltaCol = 0;
                break;
            case 'left':
                deltaRow = 0; deltaCol = -1;
                break;
            case 'right':
                deltaRow = 0; deltaCol = 1;
                break;
            case 'upDiagonal':
                deltaRow = -1; deltaCol = 1;
                break;
            case 'downDiagonal':
                deltaRow = 1; deltaCol = 1;
                break;
            case 'upLeftDiagonal':
                deltaRow = -1; deltaCol = -1;
                break;
            case 'downLeftDiagonal':
                deltaRow = 1; deltaCol = -1;
                break;
        }

        if (wordFits(colStart, rowStart, deltaRow, deltaCol, word, grid)) {
            for (let i = 0; i < word.length; i++) {
                const row = rowStart + i * deltaRow;
                const col = colStart + i * deltaCol;
                grid[row][col] = word[i];
            }
            placed = true;
        }

        attempts++;
    }

    if (placed) {
        const wordList = document.createElement('p');
        wordList.classList.add('words')
        wordBox.appendChild(wordList)
        wordList.textContent = word;

        placedWords.push(word.toUpperCase())

    } else if (!placed) {
        console.log(`Could not place word: ${word}`);
    }

    return grid;
}

async function createGrid(rows, cols) {
    const defaultWords = ['stupid', 'thing', 'broken', 'should', 'debug', 'test'];
    const grid = new Array(rows).fill('').map(() => new Array(cols).fill(''));
    const count = cols ** 2;

    letterGrid.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
    letterGrid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;

    let words = [];

    try {
        const response = await fetch(`/api/words?count=${count}`);

        if (!response.ok) {
            throw new Error(`HTTP error; status: ${response.status}`);
        }

        words = await response.json();
    } catch (error) {
        console.error(`There was an error fetching the word list. Default word list will be used.`, error.message);
        words = defaultWords;
    }

    words = words.filter(word => word.length <= cols - 1);
    words.length = cols - 3;
    
    // Store current words for saving
    currentWords = [...words];
    
    words.forEach(word => {
        placeWord(rows, cols, word, grid);
    });

    for (let row = 0; row < grid.length; row++) {
        for (let col = 0; col < grid[row].length; col++) {
            if (grid[row][col] === '') {
                grid[row][col] = generateRandomLetter();
            }
            displayGrid(grid, row, col);
        }
    }

    return grid;
};

async function createGridFromWords(words) {
    const rows = 10;
    const cols = 11;
    
    letterGrid.innerHTML = '';
    wordBox.innerHTML = '';
    placedWords = [];
    
    const grid = new Array(rows).fill('').map(() => new Array(cols).fill(''));
    
    letterGrid.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
    letterGrid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    
    words.forEach(word => {
        placeWord(rows, cols, word, grid);
    });

    for (let row = 0; row < grid.length; row++) {
        for (let col = 0; col < grid[row].length; col++) {
            if (grid[row][col] === '') {
                grid[row][col] = generateRandomLetter();
            }
            displayGrid(grid, row, col);
        }
    }

    return grid;
}

letterGrid.addEventListener('mousedown', (event) => {
    if (!event.target.classList.contains('letters')) return;
    mousedown = true;
    selectedLetters = [event.target];
    startRow = parseInt(event.target.dataset.row);
    startCol = parseInt(event.target.dataset.col);
    event.target.classList.add('selected');
});

letterGrid.addEventListener('mouseover', (event) => {
    if (!mousedown || !event.target.classList.contains('letters')) return;

    const cell = event.target;
    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);

    const dRow = row - startRow;
    const dCol = col - startCol;
    const absRow = Math.abs(dRow);
    const absCol = Math.abs(dCol);

    const isValidDirection =
        (dRow === 0 && dCol !== 0) || // horizontal
        (dCol === 0 && dRow !== 0) || // vertical
        (absRow === absCol);          // diagonal

    if (!isValidDirection) return;

    selectedLetters.forEach(cell => cell.classList.remove('selected'));
    selectedLetters = [];

    const steps = Math.max(absRow, absCol);
    const stepRow = dRow === 0 ? 0 : dRow / absRow;
    const stepCol = dCol === 0 ? 0 : dCol / absCol;

    for (let i = 0; i <= steps; i++) {
        const r = startRow + stepRow * i;
        const c = startCol + stepCol * i;
        const cell = document.querySelector(`.letters[data-row="${r}"][data-col="${c}"]`);
        if (!cell) break;
        selectedLetters.push(cell);
        cell.classList.add('selected');
    }
});

letterGrid.addEventListener('mouseup', () => {
    mousedown = false;

    const foundWords = document.querySelectorAll('p')

    const joinWord = selectedLetters.map(cell => cell.textContent).join('').toUpperCase();
    const reversed = joinWord.split('').reverse().join('');

    


if (placedWords.includes(joinWord) || placedWords.includes(reversed)) {
  const foundWord = placedWords.includes(joinWord) ? joinWord : reversed;
  
  if (!userFoundWords.includes(foundWord)) {
    userFoundWords.push(foundWord);
    
    
    if (foundWord.length <= 4) {
      score += 5;
      scoreText.textContent = score;
      console.log(`+5 points for "${foundWord}". Total score: ${score}`);
    } else if (foundWord.length >= 5) {
        score += 10;
        scoreText.textContent = score;
        
    }
  }
  
  selectedLetters.forEach(cell => {
    cell.classList.add('found');
  });
} else {
  selectedLetters.forEach(cell => {
    cell.classList.remove('selected');
  });
}

    foundWords.forEach(p => {
            const text = p.textContent.toUpperCase();
            if (text === joinWord || text === reversed) {
                p.classList.add('found-word');
            }
        });

    if (foundWords.length === userFoundWords.length) {
        score += 15
        scoreText.textContent = score
    }

    })

function resetGame() {
    const letters = document.querySelectorAll('.letters').forEach(letter => {
        letter.classList.remove('selected', 'found');
    });
    selectedLetters = [];

    const foundWords = document.querySelectorAll('p').forEach(word => {
        word.classList.remove('found-word');
    });

    scoreText.textContent = '0';
    score = 0;
    userFoundWords = [];
}

const saveGameButton = document.getElementById('save-game');
const loadGamesButton = document.getElementById('load-games');
const savedGamesModal = document.getElementById('saved-games-modal');
const closeModal = document.querySelector('.close-modal');
const savedGamesList = document.getElementById('saved-games-list');

resetButton.addEventListener('click', resetGame);

saveGameButton.addEventListener('click', () => {
    if (currentWords.length === 0) {
        alert('No game to save. Start a new game first!');
        return;
    }
    saveGame();
});

loadGamesButton.addEventListener('click', showSavedGamesModal);

closeModal.addEventListener('click', closeSavedGamesModal);

savedGamesModal.addEventListener('click', (e) => {
    if (e.target === savedGamesModal) {
        closeSavedGamesModal();
    }
});

async function showSavedGamesModal() {
    const games = await loadSavedGames();
    displaySavedGames(games);
    savedGamesModal.style.display = 'flex';
}

function closeSavedGamesModal() {
    savedGamesModal.style.display = 'none';
}

function displaySavedGames(games) {
    savedGamesList.innerHTML = '';
    
    if (games.length === 0) {
        savedGamesList.innerHTML = '<p>No saved games found.</p>';
        return;
    }
    
    games.forEach(game => {
        const gameItem = document.createElement('div');
        gameItem.className = 'saved-game-item';
        
        gameItem.innerHTML = `
            <button class="delete-game">Delete</button>
            <h4>Game #${game.id}</h4>
            <p><strong>Score:</strong> ${game.score}</p>
            <p><strong>Words Found:</strong> ${game.words_found}/${game.total_words}</p>
            <p><strong>Grid Size:</strong> ${game.grid_size}x11</p>
            <p><strong>Saved:</strong> ${game.created_at}</p>
            <p><strong>Words:</strong> ${game.word_list.join(', ')}</p>
        `;
        
        gameItem.addEventListener('click', (e) => {
            if (e.target.classList.contains('delete-game')) {
                deleteGame(game.id);
            } else {
                loadGame(game.id);
                closeSavedGamesModal();
            }
        });
        
        savedGamesList.appendChild(gameItem);
    });
}

async function deleteGame(gameId) {
    if (!confirm('Are you sure you want to delete this saved game?')) {
        return;
    }
    
    try {
        const response = await fetch(`/api/games/${gameId}`, {
            method: 'DELETE'
        });
        
        const result = await response.json();
        
        if (response.ok) {
            alert('Game deleted successfully!');
            showSavedGamesModal();
        } else {
            alert(`Error deleting game: ${result.error}`);
        }
    } catch (error) {
        console.error('Error deleting game:', error);
        alert('Error deleting game. Please try again.');
    }
}

createGrid(10, 11);
