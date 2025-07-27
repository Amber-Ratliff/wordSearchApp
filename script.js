function generateRandomLetter() {
    const asciiCode = 65
    const randomNumber = Math.floor(Math.random() * 26);
    return String.fromCharCode((randomNumber + asciiCode));
}

function createGrid(rows, cols) {
    //creates a 2d array and sets each element to an empty string
    const grid = new Array(rows).fill('').map(() => new Array(cols).fill(''));
    let word = 'three';
    word = word.toUpperCase();
    const directionList = ['up', 'down', 'left', 'right', 'upDiagonal', 'downDiagonal'];

    let placed = false;

    while (!placed) {
        const rowStart = Math.floor(Math.random() * rows);
        const colStart = Math.floor(Math.random() * cols);
        const direction = directionList[Math.floor(Math.random() * directionList.length)];

        let deltaRow, deltaCol;

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
    for (let row = 0; row < grid.length; row++) {
        for (let col = 0; col < grid[row].length; col++) {
            if (grid[row][col] === '') {
                grid[row][col] = generateRandomLetter();
            }
    }
}

    return grid;
}


function wordFits(colStart, rowStart, deltaRow, deltaCol, word, grid) {
    for (let i = 0; i < word.length; i++) {
        let row = rowStart + i * deltaRow;
        let col = colStart + i * deltaCol;
        if (row < 0 || col < 0) {
            return false;
        }
        if (row >= grid.length || col >= grid[0].length) {
            return false
        }
        if (grid[row][col] !== '' && grid[row][col] !== word[i]) {
            return false;
        }
    }
    return true;
}


console.log(createGrid(10, 10));