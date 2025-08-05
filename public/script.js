import { generateRandomLetter, displayGrid, placeWord, wordFits } from "./logic.js";

(async function createGrid(rows, cols) {
    const defaultWords = ['stupid', 'thing', 'broken', 'should', 'debug', 'test'];
    const grid = new Array(rows).fill('').map(() => new Array(cols).fill(''));
    const count = cols ** 2;

    const wordBox = document.getElementById('word-box');
    const letterGrid = document.getElementById('search-grid');
    letterGrid.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
    letterGrid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;

    let words;

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

    words.length = cols - 4

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
})(10, 11);
