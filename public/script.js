import { generateRandomLetter, displayGrid, wordFits } from "./logic.js";

const wordBox = document.getElementById('word-box');
const letterGrid = document.getElementById('search-grid');
const resetButton = document.getElementById('reset');
//const newPuzzle = document.getElementById('new');
const scoreCounter = 0;

let mousedown = false;
let selectedLetters = [];
let startRow = null;
let startCol = null;
let placedWords = [];

function placeWord(rows, cols, word, grid) {
    word = word.toUpperCase();
    const directionList = ['up', 'down', 'left', 'right', 'upDiagonal', 'downDiagonal'];

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
        const response = await fetch(`http://localhost:3000/api/words?count=${count}`);

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
        selectedLetters.forEach(cell => {
            cell.classList.add('found');
        });
        
    
    } else if (!placedWords.includes(joinWord) || !placedWords.includes(reversed)) {
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
    })

resetButton.addEventListener('click', () => {
    const letters = document.querySelectorAll('.letters').forEach(letter => {
        letter.classList.remove('selected', 'found');
    });
    selectedLetters = [];

    const foundWords = document.querySelectorAll('p').forEach(word => {
        word.classList.remove('found-word');
    })
});

createGrid(10,11);
