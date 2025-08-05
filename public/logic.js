function generateRandomLetter() {
    const asciiCode = 65; //lowercase is 97
    const randomNumber = Math.floor(Math.random() * 26);
    return String.fromCharCode(randomNumber + asciiCode);
}

function displayGrid(grid, row, col) {
    const letterSpace = document.createElement('div');
    letterSpace.classList.add('letters');
    letterSpace.textContent = grid[row][col];
    letterGrid.appendChild(letterSpace);
}

function placeWord(rows, cols, word, grid) {
    word = word.toUpperCase();
    const directionList = ['up', 'down', 'left', 'right', 'upDiagonal', 'downDiagonal'];

    let placed = false;

    //can create an infinate loop without max attempts
    let attempts;
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

    if (!placed) {
        console.warn(`Could not place word: ${word}`);
    }

    return grid;
}

function wordFits(colStart, rowStart, deltaRow, deltaCol, word, grid) {
    for (let i = 0; i < word.length; i++) {
        const row = rowStart + i * deltaRow;
        const col = colStart + i * deltaCol;

        if (row < 0 || col < 0 || row >= grid.length || col >= grid[0].length) {
            return false;
        }

        if (grid[row][col] !== '' && grid[row][col] !== word[i]) {
            return false;
        }
    }
    return true;
}

export { generateRandomLetter, displayGrid, placeWord, wordFits }
