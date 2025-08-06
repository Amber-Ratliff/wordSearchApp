function generateRandomLetter() {
    const asciiCode = 65; //lowercase is 97
    const randomNumber = Math.floor(Math.random() * 26);
    return String.fromCharCode(randomNumber + asciiCode);
}

function displayGrid(grid, row, col) {
    const letterGrid = document.getElementById('search-grid')
    const letterSpace = document.createElement('div');
    letterSpace.classList.add('letters');
    letterSpace.dataset.row = row;
    letterSpace.dataset.col = col;
    letterSpace.textContent = grid[row][col];
    letterGrid.appendChild(letterSpace);
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

export { generateRandomLetter, displayGrid, wordFits }
