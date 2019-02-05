'use strist';
const MINE_CLICKED = '<img class="mineclicked" src="img/mineclicked.png">'
const MINE_WRONG = '<img class="minewrong" src="img/minewrong.png">'
const MINE = '<img class="mine" src="img/mine.png">'
const TILE = '<img class="tile" src="img/tile.png">'
const FLAG = '<img class="flag" src="img/flag.png">'
const SMILE = '<img class="smile" src="img/smile.png">'
const HAPPY = '<img class="happy" src="img/happy.png">'
const COOL = '<img class="cool" src="img/cool.png">'
const DEAD = '<img class="dead" src="img/dead.png">'
const THINKING = '<img class="thinking" src="img/thinking.png">'
// const NEG1 = '<img class="neg neg1" src="1.png">'
// const NEG2 = '<img class="neg neg2" src="2.png">'
// const NEG3 = '<img class="neg neg3" src="3.png">'
// const NEG4 = '<img class="neg neg4" src="4.png">'
// const NEG5 = '<img class="neg neg5" src="5.png">'
// const NEG6 = '<img class="neg neg6" src="6.png">'
// const NEG7 = '<img class="neg neg7" src="7.png">'
// const NEG8 = '<img class="neg neg8" src="8.png">'

var gBoard /*– Matrix contains cell objects:
{
 minesAroundCount: 4,
 isShown: true,
 isMine: false,
 isMarked: true,
}
*/

var gLevel /*
{
 SIZE: 4,
 MINES: 2
};
This is an object by which the
board size is set (in this case:
4*4), and how many mines to
put
*/

var gState = {
    isGameOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}
/*
This is an object in which you
can keep and update the current
state:
isGameOn – boolean, when
true we let the user play
shownCount: how many cells
are shown
markedCount: how many cells
are marked (with a flag)
secsPassed: how many seconds
passed
*/

var gTilesRevealed
var gIsFirstClick
var gStartTime
var gTimerInterval
var gIsHinting
var gUserName
var gCurrScore
var gBestScore
var gMarkedCellsNum

function startGame() {
    var elChosenDifficulty = document.querySelector('input[name="difficulty"]:checked');
    switch (elChosenDifficulty.value) {
        case '1':
            gLevel = {
                SIZE: 4,
                MINES: 2
            };
            break;
        case '2':
            gLevel = {
                SIZE: 6,
                MINES: 5
            };
            break;
        case '3':
            gLevel = {
                SIZE: 8,
                MINES: 15
            };
            break;
    }
    gUserName = document.querySelector('.name-input').value;
    document.querySelector('.difficulty-menu').style.display = 'none';
    document.querySelector('.gamearea').style.display = 'block';
    // document.querySelector('.restart-button').style.display = 'block';
    // document.querySelector('.change-difficulty').style.display = 'block';
    initGame();
}

function initGame() {
    clearInterval(gTimerInterval);
    document.querySelector('.clock').innerText = '0'
    document.querySelector('.score').innerText = '0'
    gTilesRevealed = 0;
    gStartTime = 0;
    gMarkedCellsNum = 0;
    gChanceBoard = 0;
    gState.isGameOn = true;
    gIsFirstClick = true;
    document.querySelector('.smileysquare').innerHTML = SMILE;
    document.querySelectorAll('.hints img').forEach(function (element) {
        // console.log(element);
        element.style.opacity = 1;
        element.dataset.isUsed = 'no';
    })
    gBestScore = localStorage.getItem('bestScore' + gLevel.SIZE);
    gBoard = buildBoard()
    renderBoard(gBoard);
}

function buildBoard() { //Builds the board
    var board = [];
    for (let i = 0; i < gLevel.SIZE; i++) {
        board.push([]);
        for (let j = 0; j < gLevel.SIZE; j++) {
            board[i].push({
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false,
            });
        }
    }
    // setMinesNegsCount(board);
    // console.table(board);
    return board;
}

function setMines(board, i, j) { //i and j of first click
    for (let k = 0; k < gLevel.MINES; k++) {
        var currLocation = {
            i: getRandomIntInclusive(0, gLevel.SIZE - 1),
            j: getRandomIntInclusive(0, gLevel.SIZE - 1)
        };
        while (board[currLocation.i][currLocation.j].isMine ||
            (currLocation.i === i && currLocation.j === j)) { //if there's already a mine there or it's the first click location look again.
            currLocation.i = getRandomIntInclusive(0, gLevel.SIZE - 1)
            currLocation.j = getRandomIntInclusive(0, gLevel.SIZE - 1)
        };
        board[currLocation.i][currLocation.j].isMine = true;
        incrementNeigbours(board, currLocation.i, currLocation.j)
    }
}

// function setMinesNegsCount(board) { // Sets mines-count to neighbours
//     for (let i = 0; i < gLevel.SIZE; i++) {
//         for (let j = 0; j < gLevel.SIZE; j++) {
//             if (board[i][j].isMine) { //loop on the board, found a mine?
//                 incrementNeigbours(board, i, j);
//             }
//         }
//     }
// }

function incrementNeigbours(board, i, j) { //neighbour loop
    for (let k = i - 1; k <= i + 1; k++) {
        for (let l = j - 1; l <= j + 1; l++) {
            if (board[k] !== undefined && board[k][l] !== undefined && !(k === i && l === j)) {
                board[k][l].minesAroundCount++  //if cell exists and it's not the mine itself, increment
            }
        }
    }
}

function renderBoard(board) {//Print the board as a <table> to the page
    var strHTML = '<table class="board"><tbody>';
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>';
        for (var j = 0; j < board[0].length; j++) {
            var cell = board[i][j];
            var className = `cell cell${i}-${j}`;
            strHTML += `<td class="${className}" onmouseout="unHighlight(this)" onmouseover="highlight(this)" onmousedown="pressTile(this)" onmouseup="unpressTile(this)" onmouseout="unpressTile(this)" onclick="cellClicked(this, ${i}, ${j}), userMoved()" oncontextmenu = "cellMarked(event, ${i}, ${j})">${TILE}</td>`
        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>';
    document.querySelector('.container').innerHTML = strHTML;
}

function cellClicked(elCell, i, j) { //Called when a cell (td) is clicked
    if (!gState.isGameOn) return;
    if (gIsFirstClick) {
        setMines(gBoard, i, j);
        gStartTime = Date.now();
        startTimer();
        gIsFirstClick = false;
    }
    if (gIsHinting) {
        hintAround(i, j)
        gIsHinting = false;
        document.querySelector('.hint-notification').style.visibility = 'hidden';
        return;
    }
    var cellInModel = gBoard[i][j];
    if (cellInModel.isShown) return;
    if (cellInModel.isMarked) return;
    else cellInModel.isShown = true;
    if (cellInModel.isMine) {
        mineClicked(i, j);
        return;
    }
    elCell.innerHTML = `<img class="neg neg${cellInModel.minesAroundCount}" src="img/${cellInModel.minesAroundCount}.png">`;
    if (cellInModel.minesAroundCount === 0) openNeigbours(i, j); //recursion!
    gTilesRevealed++;
    checkGameOver();
}

function openNeigbours(i, j) { //neighbour loop
    for (let k = i - 1; k <= i + 1; k++) {
        for (let l = j - 1; l <= j + 1; l++) {
            if (gBoard[k] && gBoard[k][l] && !(k === i && l === j)) {
                cellClicked(document.querySelector(`.cell${k}-${l}`), k, l); //if cell exists and it's not the cell itself, open;
            }
        }
    }
}

function cellMarked(ev, i, j) { //Called on right click to mark a cell as suspected to have a mine
    if (ev.which !== 3) return; //ignore non-right clicks
    ev.preventDefault();
    if (!gState.isGameOn) return;
    var cellInModel = gBoard[i][j];
    if (cellInModel.isShown) return;
    if (cellInModel.isMarked) { //if marked, unmark
        cellInModel.isMarked = false;
        ev.target.innerHTML = TILE;
        gMarkedCellsNum--;
    } else {                     //if unmarked, mark
        cellInModel.isMarked = true;
        ev.target.innerHTML = FLAG;
        gMarkedCellsNum++;
    }
    checkGameOver();
}

function checkGameOver() { //Game ends when all mines are marked and all the other cells are shown
    if (gTilesRevealed === gLevel.SIZE ** 2 - gLevel.MINES &&
        gMarkedCellsNum === gLevel.MINES) {
        gameOver(true);
    }
}

function mineClicked(i, j) {
    //TODO: game over show mines
    revealMines(i, j);
    document.querySelector('.smileysquare').innerHTML = DEAD;
    gameOver(false);
}

function revealMines(i, j) {
    for (var k = 0; k < gLevel.SIZE; k++) {
        for (var l = 0; l < gLevel.SIZE; l++) {
            if (gBoard[k][l].isMine) {
                document.querySelector(`.cell${k}-${l}`).innerHTML = MINE;
            }
            if (gBoard[k][l].isMarked && !gBoard[k][l].isMine) {
                document.querySelector(`.cell${k}-${l}`).innerHTML = MINE_WRONG;
            }
        }
    }
    document.querySelector(`.cell${i}-${j}`).innerHTML = MINE_CLICKED;
}

function gameOver(isWon) {
    gState.isGameOn = false;
    clearInterval(gTimerInterval);
    if (isWon) {
        // console.log('game over, you won!');
        document.querySelector('.smileysquare').innerHTML = COOL;
        gCurrScore = ((Date.now() - gStartTime) / 1000).toFixed(2);
        document.querySelector('.score').innerText = gCurrScore;
        if (!gBestScore || gCurrScore < gBestScore) {
            localStorage.setItem('bestScore' + gLevel.SIZE, gCurrScore)
        }
    }
}

function getHint(elHint) {
    if (elHint.dataset.isUsed === 'yes' || gIsFirstClick || !gState.isGameOn || gIsHinting) return;
    gIsHinting = true;
    document.querySelector('.hint-notification').style.visibility = 'visible';
    elHint.dataset.isUsed = 'yes';
    elHint.style.opacity = 0;
}

function hintAround(i, j) {
    for (var k = i - 1; k <= i + 1; k++) {
        for (var l = j - 1; l <= j + 1; l++) {
            if (gBoard[k] && gBoard[k][l]) {
                temporarilyReveal(k, l);
            }
        }
    }
}

function temporarilyReveal(i, j) {
    var elCell = document.querySelector(`.cell${i}-${j}`)
    var cellInModel = gBoard[i][j]
    if (cellInModel.isShown) return;
    gState.isGameOn = false;
    if (cellInModel.isMine) {
        elCell.innerHTML = MINE;
    } else {
        elCell.innerHTML = `<img class="neg neg${cellInModel.minesAroundCount}" src="img/${cellInModel.minesAroundCount}.png">`;
    }
    setTimeout(function cover() {
        if (cellInModel.isMarked) {
            elCell.innerHTML = FLAG;
        } else {
            elCell.innerHTML = TILE;
        }
        gState.isGameOn = true;
    }, 1000)
}

function startTimer() {
    gTimerInterval = setInterval(function timer() {
        document.querySelector('.clock').innerText = parseInt((Date.now() - gStartTime) / 1000);
    }, 1000);
}

function press(elBtn) {
    elBtn.style.borderTopColor = "gray";
    elBtn.style.borderLeftColor = "gray";
    elBtn.style.borderRightColor = "white";
    elBtn.style.borderBottomColor = "white";
}

function unpress(elBtn) {
    elBtn.style.borderTopColor = "white";
    elBtn.style.borderLeftColor = "white";
    elBtn.style.borderRightColor = "gray";
    elBtn.style.borderBottomColor = "gray";
}

function changeDifficulty() {
    document.querySelector('.gamearea').style.display = 'none';
    document.querySelector('.difficulty-menu').style.display = 'block';
}

function pressTile(elTd) {
    if (elTd.querySelector('.tile') && gState.isGameOn) {
        elTd.querySelector('.tile').style.transform = 'rotate(180deg)'
        document.querySelector('.smileysquare').innerHTML = THINKING;
    }
}

function unpressTile(elTd) {
    if (elTd.querySelector('.tile') && gState.isGameOn) {
        elTd.querySelector('.tile').style.transform = 'rotate(0deg)'
        document.querySelector('.smileysquare').innerHTML = SMILE;
    }

}

function showHighScores() {
    document.querySelector('.difficulty-menu').style.display = 'none'
    document.querySelector('.highscores').style.display = 'block'
    document.querySelector('.easy-score').innerText = localStorage.getItem('bestScore4')
    document.querySelector('.medium-score').innerText = localStorage.getItem('bestScore6')
    document.querySelector('.hard-score').innerText = localStorage.getItem('bestScore8')
}

function backToMenu() {
    document.querySelector('.difficulty-menu').style.display = 'block'
    document.querySelector('.highscores').style.display = 'none'
}

function highlight(elCell) {

}

function unHighlight(elCell) {

}