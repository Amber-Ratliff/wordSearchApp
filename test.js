async function getWords(cols){
    const count = cols ** 2
    const response = await fetch(`http://localhost:3000/api/words?count=100`)
    try {
        if (!response.ok) {
            throw new Error (`HTTP status error: ${response.status}`);
        }
        
        const data = await response.json()
        console.log(data);

        return data;

    } catch (error) {
        console.error('failed to fetch data', error.message);
        return [];
    } 
}
//const word = 'three';
function wordList(words) {
    wordBox.textContent = words;
}
//let mousedown = false;

function displayGrid(grid, row, col, rows, cols) {
    const letterSpace = document.createElement('div');
    letterSpace.classList.add('letters');
    letterSpace.textContent = grid[row][col]
    letterGrid.appendChild(letterSpace);
    console.log([rows, cols])
    letterGrid.style.gridTemplateRows = `repeat(${rows}, 1fr)`
    letterGrid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`


};

async function createGrid(rows, cols) {
    const grid = new Array(rows).fill('').map(() => new Array(cols).fill(''));

    const data = await getWords(cols);
    const words = data.filter(word => word.length <= cols - 1);

    console.log(wordList(words));

    words.forEach((word) => {
        if (word.length <= cols - 1) {
            placeWord(rows, cols, word, grid);
        }})}