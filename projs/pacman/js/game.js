'use strict';
var WALL = '<img class="wall" src="img/wall.png">';
var FOOD = '<img class="food" src="img/food.png">';
var EMPTY = ' ';
var SUPER_FOOD = '<img class="super-food" src="img/cookie.png">'
var TASTY_FOOD = '<img class="tasty-food" src="img/cherry.png">'
var gFoodCount
var gBoard;
var gGame = {
  score: 0,
  isOn: false
};
var gGhostColors = []

function init() {
  clearInterval(gTastyInterval);
  gTastyInterval = 0;
  document.querySelector('.game-over').style.display = 'none';
  document.querySelector('.victory').style.display = 'none';
  gFoodCount = 0
  gBoard = buildBoard();

  createPacman(gBoard);
  createGhosts(gBoard);
  console.table(gBoard);
  printMat(gBoard, '.board-container');
  // console.table(gBoard);
  gGame.isOn = true;
  generateTasty();
}

function buildBoard() {
  var SIZE = 10;
  var board = [];
  for (var i = 0; i < SIZE; i++) {
    board.push([]);
    for (var j = 0; j < SIZE; j++) {
      board[i][j] = FOOD;
      gFoodCount++

      if (i === 0 || i === SIZE - 1 ||
        j === 0 || j === SIZE - 1 ||
        (j === 3 && i > 4 && i < SIZE - 2)) {

        board[i][j] = WALL;
        gFoodCount--
      }
      if ((i === 1 || i === 8) && (j === 1 || j === 8)) {
        board[i][j] = SUPER_FOOD;
        gFoodCount--
      }
    }
  }
  // console.log('food Amount:', gFoodCount);
  return board;
}

function updateScore(value) {
  // Update both the model and the dom for the score
  gGame.score += value;
  document.querySelector('header h3 span').innerText = gGame.score;
}

function printMat(mat, selector) {
  var strHTML = '<table class="board" border="0"><tbody>';
  for (var i = 0; i < mat.length; i++) {
    strHTML += '<tr>';
    for (var j = 0; j < mat[0].length; j++) {
      var cell = mat[i][j];
      if (typeof(cell) === 'object') cell = cell.htmlStr;
      var className = 'cell cell' + i + '-' + j;
      strHTML += '<td class="' + className + '"> ' + cell + ' </td>'
    }
    strHTML += '</tr>'
  }
  strHTML += '</tbody></table>';
  var elContainer = document.querySelector(selector);
  elContainer.innerHTML = strHTML;
}

function renderCell(location, value) {
  // Select the elCell and set the value
  var elCell = document.querySelector(`.cell${location.i}-${location.j}`);
  elCell.innerHTML = value;
}

function gameOver(isWon) {
  // console.log('Game Over');
  gGame.isOn = false;
  isWon ? document.querySelector('.victory').style.display = 'block' : document.querySelector('.game-over').style.display = 'block';
  document.querySelector('.board').style.filter = 'blur(4px)'
  clearInterval(gIntervalGhosts);
  clearInterval(gTastyInterval);
  gTastyInterval = 0
  gIntervalGhosts = 0;
}