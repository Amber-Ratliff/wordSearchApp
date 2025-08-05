function generateRandomLetter() {
    const asciiCode = 65
    const randomNumber = Math.floor(Math.random() * 26);
    return String.fromCharCode((randomNumber + asciiCode));
};

function displayGrid(grid, row, col, rows, cols, words) {
    const letterGrid = document.getElementById('search-grid')
    const wordBox = document.getElementById('word-box')

    const letterSpace = document.createElement('div');
    letterSpace.classList.add('letters');
    letterSpace.textContent = grid[row][col]
    letterGrid.appendChild(letterSpace);
    console.log([rows, cols])
    letterGrid.style.gridTemplateRows = `repeat(${rows}, 1fr)`
    letterGrid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`
    wordBox.textContent = words
};

function placeWord(rows, cols, word, grid) {

    word = word.toUpperCase();

    const directionList = ['up', 'down', 'left', 'right', 'upDiagonal', 'downDiagonal'];
    
    let placed = false;

    while (!placed) {
        const rowStart = Math.floor(Math.random() * rows);
        const colStart = Math.floor(Math.random() * cols);
        const direction = directionList[Math.floor(Math.random() * directionList.length)];
        let deltaRow;
        let deltaCol;

        if (direction === 'up') {
            deltaRow = -1; deltaCol = 0;
        } else if (direction === 'down') {
            deltaRow = 1; deltaCol = 0;
        } else if (direction === 'left') {
            deltaRow = 0; deltaCol = -1;
        } else if (direction === 'right') {
            deltaRow = 0; deltaCol = 1;
        } else if (direction === 'upDiagonal') {
            deltaRow = -1; deltaCol = 1;
        } else if (direction === 'downDiagonal') {
            deltaRow = 1; deltaCol = 1;
        }

        if (wordFits(colStart, rowStart, deltaRow, deltaCol, word, grid)) {

            for (let i = 0; i < word.length; i++) {
                const row = rowStart + i * deltaRow;
                const col = colStart + i * deltaCol;
                grid[row][col] = word[i];
            }
            placed = true;
        }
    }
    return grid;
};

function wordFits(colStart, rowStart, deltaRow, deltaCol, words, grid) {
    for (let i = 0; i < words.length; i++) {
        let row = rowStart + i * deltaRow;
        let col = colStart + i * deltaCol;
        if (row < 0 || col < 0) {
            return false;
        }
        if (row >= grid.length || col >= grid[0].length) {
            return false
        }
        if (grid[row][col] !== '' && grid[row][col] !== words[i]) {
            return false;
        }
    }
    return true;
};

//export { generateRandomLetter, displayGrid, placeWord, wordFits }
