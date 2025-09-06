# New Game Button Implementation Guide

## 1. "New Game" Button (Full Reset)

This creates a completely fresh game with score reset to 0.

```javascript
function newGame() {
    // Reset score to 0
    document.getElementById('point-total').textContent = '0';
    
    // Clear existing grid and word list
    document.getElementById('search-grid').innerHTML = '';
    document.getElementById('word-box').innerHTML = '';
    
    // Reset game state variables
    placedWords = [];
    foundWords = [];
    
    // Generate new puzzle
    generateGrid();
}
```

## 2. "Next Puzzle" on Completion (Keep Score)

This generates a new puzzle while preserving the current score for continuous play.

```javascript
function nextPuzzle() {
    // Keep current score - don't reset point-total
    
    // Clear grid and words but preserve score
    document.getElementById('search-grid').innerHTML = '';
    document.getElementById('word-box').innerHTML = '';
    
    // Reset only word tracking arrays
    placedWords = [];
    foundWords = [];
    
    // Generate new puzzle with fresh words
    generateGrid();
}
```

## 3. Auto-trigger on Puzzle Completion

Add this logic to your word-finding function to automatically offer next puzzle:

```javascript
// After finding a word, check if puzzle is complete
if (foundWords.length === placedWords.length) {
    setTimeout(() => {
        if (confirm('Puzzle complete! Start next puzzle?')) {
            nextPuzzle(); // Keeps score
        }
    }, 500);
}
```

## 4. HTML Button Addition

Add this to your button container in index.html:

```html
<button class="button" id="new-game">New Game</button>
```

## 5. Event Listener Setup

Add this to your script.js initialization:

```javascript
document.getElementById('new-game').addEventListener('click', newGame);
```

## Implementation Notes

- **Key Difference**: `newGame()` resets everything including score, while `nextPuzzle()` preserves score for continuous play
- **User Experience**: Auto-trigger gives immediate feedback on completion
- **State Management**: Make sure to reset all relevant arrays and DOM elements
- **Timing**: Use setTimeout for auto-trigger to let user see the completed puzzle briefly

## Integration Points

Look for these existing functions in your script.js to integrate:
- `generateGrid()` - Your main puzzle generation function
- Word finding logic - Where you'll add the completion check
- Button event listeners - Where you'll add the new game button handler