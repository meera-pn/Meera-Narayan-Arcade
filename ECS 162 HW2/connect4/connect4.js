const cells = document.querySelectorAll('.cell'); //select all cells
const buttons = document.querySelectorAll('.board button'); //select all board buttons
const columns = 7; //set number of columns
const rows = 6; //set number of rows
let currentPlayer = 'R'; // Player R (Red) is the human, starts with human
let gameActive = true; //defines whether or not the game is currently active
let gameState = new Array(rows * columns).fill(""); //initializes board as empty

//creates/defines all of the winning conditions (I did do some googling for this because
//I didn't want to write down a million different arrays)
const winningConditions = [
    // Horizontal conditions
    ...Array.from({ length: rows }, (v, i) => i * columns).map(i => [0, 1, 2, 3].map(j => i + j)),
    ...Array.from({ length: rows }, (v, i) => i * columns).map(i => [1, 2, 3, 4].map(j => i + j)),
    ...Array.from({ length: rows }, (v, i) => i * columns).map(i => [2, 3, 4, 5].map(j => i + j)),
    ...Array.from({ length: rows }, (v, i) => i * columns).map(i => [3, 4, 5, 6].map(j => i + j)),

    // Vertical conditions
    ...Array.from({ length: columns }, (v, i) => i).map(i => [0, 1, 2, 3].map(j => i + j * columns)),
    ...Array.from({ length: columns }, (v, i) => i).map(i => [1, 2, 3, 4].map(j => i + j * columns)),
    ...Array.from({ length: columns }, (v, i) => i).map(i => [2, 3, 4, 5].map(j => i + j * columns)),

    // Diagonal conditions
    ...winningConditionsForDiagonals(0, columns + 1), // Diagonal going down to the right
    ...winningConditionsForDiagonals(columns - 1, columns - 1), // Diagonal going down to the left
];

//generates diagonal win conditions
function winningConditionsForDiagonals(startOffset, step) {
    let conditions = [];
    //loop through initial rows and columns to define starting points for diagonals
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 4; col++) {
            let base = row * columns + col + startOffset;
            conditions.push([0, 1, 2, 3].map(j => base + j * step));
        }
    }
    return conditions;
}

//finds the lowest available cell in the column corresponding to the button press
function findAvailableCellIndex(column) {
    //start from the bottom row and check if each cell is empty until one is found
    for (let row = rows - 1; row >= 0; row--) {
        if (gameState[row * columns + column] === "") {
            return row * columns + column;
        }
    }
    return -1; //no available cells
}

//handles clicks on columns
function handleColumnClick(column) {
    const index = findAvailableCellIndex(column);
    if (index !== -1) { //if a cell is available, drop the chip there
        handleCellPlayed(index, currentPlayer);
        if (checkWinner()) { //check if someone has one and if so updateGameStatus()
            updateGameStatus();
        } else {
            togglePlayer(); //switch player to computer
            setTimeout(() => computerMove(), 200); //computer's turn!
        }
    }
}

//updates the game state after each move from player or computer
function handleCellPlayed(index, player) {
    gameState[index] = player;
    cells[index].style.backgroundColor = player === 'R' ? 'red' : 'yellow';
}

//updates the game status
function updateGameStatus() {
    const result = checkWinner(); //checks if someone has won
    let resultDisplay = document.getElementById('resultDisplay');
    if (result) { //if a player has won
        gameActive = false; //end game
        resultDisplay.textContent = `Game over: Player ${result} Wins!`; //change resultDisplay to reflect
    } else if (!gameState.includes("")) { //if nobody has won but the board is full
        gameActive = false; //end game
        resultDisplay.textContent = "Game over: Draw!"; //change resultDisplay to reflect
    } else {
        togglePlayer(); //switch player
        resultDisplay.textContent = `Player ${currentPlayer === 'R' ? 'Red' : 'Yellow'}'s turn`; //display whoever's turn it is
    }
}

function togglePlayer() { //switch between players
    currentPlayer = currentPlayer === 'R' ? 'Y' : 'R'; 
}

function checkWinner() { //check if there is a winner
    for (let condition of winningConditions) { //go through winning conditions
        const [a, b, c, d] = condition.map(index => gameState[index]); //extract the values in each cell in the array
        if (a && a === b && b === c && c === d) { //if the same player occupies all 4 cells
            return a; // return the player who won 
        }
    }
    return null; //else don't return a winner
}

//computer's turn!
function computerMove() {
    let availableColumns = []; 
    //find available columns
    for (let col = 0; col < columns; col++) { //go through all of the columns
        if (findAvailableCellIndex(col) !== -1) { //if there is an open cell
            availableColumns.push(col); //add columns into an array of available copumns to choose from
        }
    }

    if (availableColumns.length > 0) { //if there is an available column
        const randomCol = availableColumns[Math.floor(Math.random() * availableColumns.length)]; //pick a random column
        const index = findAvailableCellIndex(randomCol); //find available index in the column (we know that there is one from prev check)
        handleCellPlayed(index, currentPlayer); //put the computer's chip (yellow) in the cell
        updateGameStatus(); //update game, toggle player
    }
}

function restartGame() {
    gameState.fill(""); //reset all cells to empty
    cells.forEach(cell => cell.style.backgroundColor = 'white');
    gameActive = true; //make the game active
    currentPlayer = 'R';  // Reset to Red player's turn
    let resultDisplay = document.getElementById('resultDisplay');
    resultDisplay.textContent = "Start by dropping a chip! You are Player Red."; //display starting message
}
