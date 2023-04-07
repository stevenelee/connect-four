"use strict";

/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;
const GAME_BOARD = document.getElementById('board');

let currPlayer = 1; // active player: 1 or 2
let board = []; // array of rows, each row is array of cells  (board[y][x])
let gameStatus = "on";

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])*/
function makeBoard() {
  for (let y = 0; y < HEIGHT; y++) {
    let row = [];
    // TODO: look into Array.from method
    for (let x = 0; x < WIDTH; x++) {
      row.push(null);
    }
    board.push(row);
  }
}

/** displays game board in HTML and adds row on top */
function makeHTMLBoard() {
  /** makes the row above the game board, where players can click to make a move.
 * takes no input, returns nothing, but appends a row to gameboard*/
  function _makeGameTop() {
    let topRow = document.createElement("tr");
    topRow.setAttribute("id", "column-top");
    topRow.addEventListener("click", handleClick);

    // create row of column tops
    for (let x = 0; x < WIDTH; x++) {
      let rowCell = document.createElement("td");
      rowCell.setAttribute("id", `top-${x}`);
      topRow.append(rowCell);
    }
    GAME_BOARD.append(topRow);
  }
  _makeGameTop();

  for (let y = 0; y < HEIGHT; y++) {
    let row = document.createElement("tr");
    for (let x = 0; x < WIDTH; x++) {
      let rowCell = document.createElement("td");
      rowCell.setAttribute("id", `c-${y}-${x}`);
      row.append(rowCell);
    }
    GAME_BOARD.append(row);
  }
}

/** findSpotForCol: given column x, return bottom empty y (null if filled) */

function findSpotForCol(x) {
  for (let i = HEIGHT - 1; i >= 0; i--) {
    if (board[i][x] === null) {
      return i;
    }
  }
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
  let piece = document.createElement("div");
  piece.classList.add("piece", `p${currPlayer}`);
  let insertLocation = document.getElementById(`c-${y}-${x}`);
  insertLocation.appendChild(piece);
}

/** endGame: announce game end */

function endGame(msg) {
  alert(msg);
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  if (gameStatus === "off") {
    return;
  }
  // get x from ID of clicked cell
  let x = Number(evt.target.id.slice('top-'.length));

  // get next spot in column (if none, ignore click)
  let y = findSpotForCol(x);
  if (y === null) {
    return;
  }

  // place piece in board and add to HTML table
  placeInTable(y, x);
  board[y][x] = `p${currPlayer}`;

  // check for win
  if (checkForWin()) {
    gameStatus = "off";
    return endGame(`Player ${currPlayer} won!`);
  }

  // check for tie
  let flatBoard = board.flat();
  let tie = flatBoard.every(x => x !== null);
  if (tie === true) {
    gameStatus = "off";
    return endGame(`All slots have been filled. Results in tie`);
  }

  // switch players
  currPlayer = currPlayer === 1 ? 2 : 1;
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {

  /** _win:
   * takes input array of 4 cell coordinates [ [y, x], [y, x], [y, x], [y, x] ]
   * returns true if all are legal coordinates for a cell & all cells match
   * currPlayer
   */
  function _win(cells) {
    for (let cell of cells) {
      if (cell[0] < 0 || cell[0] >= HEIGHT || cell[1] < 0 || cell[1] >= WIDTH) {
        return false;
      }
      if (board[cell[0]][cell[1]] !== `p${currPlayer}`) {
        return false;
      }
    }
    return true;
  }

  // using HEIGHT and WIDTH, generate "check list" of coordinates
  // for 4 cells (starting here) for each of the different
  // ways to win: horizontal, vertical, diagonalDR, diagonalDL
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      let horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      let vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      let diagDL = [[y, x], [y - 1, x - 1], [y - 2, x - 2], [y - 3, x - 3]];
      let diagDR = [[y, x], [y - 1, x + 1], [y - 2, x + 2], [y - 3, x + 3]];

      // find winner (only checking each win-possibility as needed)
      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

makeBoard();
makeHTMLBoard();
