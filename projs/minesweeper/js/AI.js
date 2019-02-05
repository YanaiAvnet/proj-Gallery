var gChanceBoard
var gLastMoveUser = false;

function solveAI() {
    if (!gChanceBoard) {
        gChanceBoard = buildBoard();
        for (let i = 0; i < gChanceBoard.length; i++) { //fill with standard chance
            gChanceBoard[i].fill(gLevel.MINES / gLevel.SIZE ** 2);
        }
        if (!gIsFirstClick) { //if game already started, map chances
            mapChanceAll();
        }
    }
    if (gLastMoveUser) {
        mapChanceAll();
        gLastMoveUser = false;
    }
    var currBestChance = findMatMinimum(gChanceBoard);
    var elBestChanceCell = document.querySelector(`.cell${currBestChance.i}-${currBestChance.j}`);
    if (gBoard[currBestChance.i][currBestChance.j].isMarked) {
        gBoard[currBestChance.i][currBestChance.j].isMarked = false;
        gMarkedCellsNum--;
    }
    cellClicked(elBestChanceCell, currBestChance.i, currBestChance.j);
    if (!gState.isGameOn) return;
    if (gBoard[currBestChance.i][currBestChance.j].minesAroundCount === 0) mapChanceAll();
    else {
        gChanceBoard[currBestChance.i][currBestChance.j] = 2;
        for (let i = currBestChance.i - 1; i <= currBestChance.i + 1; i++) {
            for (let j = currBestChance.j - 1; j <= currBestChance.j + 1; j++) {
                if (gBoard[i] && gBoard[i][j] && gBoard[i][j].isShown) mapChanceNeighbours(i, j);
            }
        }
    }
    checkGameOver();
}

function findMatMinimum(board) {
    var currMin = 2;
    var currMinLocation
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[0].length; j++) {
            if (gChanceBoard[i][j] < currMin) {
                currMin = gChanceBoard[i][j];
                currMinLocation = { i: i, j: j };
            }
        }
    }
    return currMinLocation;
}

function mapChanceAll() {
    for (let i = 0; i < gLevel.SIZE; i++) {
        for (let j = 0; j < gLevel.SIZE; j++) {
            if (gBoard[i][j].isShown) { //for every open cell, map neigbours
                if (gBoard[i][j].minesAroundCount !== 0) mapChanceNeighbours(i, j);
                gChanceBoard[i][j] = 2;
            }
        }
    }
}

function mapChanceNeighbours(i, j) {
    var minesAroundCurrCell = gBoard[i][j].minesAroundCount;
    var unOpenedNeighbourCount = 0;
    for (let k = i - 1; k <= i + 1; k++) {
        for (let l = j - 1; l <= j + 1; l++) {
            if (gBoard[k] && gBoard[k][l] && !gBoard[k][l].isShown &&
                !(i === k && j === l) && gChanceBoard[k][l] !== 2) {
                if (gChanceBoard[k][l] === 1) minesAroundCurrCell--;
                else unOpenedNeighbourCount++;
            }
        }
    }
    var currChance = minesAroundCurrCell / unOpenedNeighbourCount;
    for (let k = i - 1; k <= i + 1; k++) {
        for (let l = j - 1; l <= j + 1; l++) {
            if (gChanceBoard[k] && gChanceBoard[k][l] && !(i === k && j === l) &&
                !gBoard[k][l].isShown && gChanceBoard[k][l] !== 1 && gChanceBoard[k][l] !== 2) {
                if (currChance > gChanceBoard[k][l] || currChance === 0) gChanceBoard[k][l] = currChance;
                if (currChance === 1 && !gBoard[k][l].isMarked) {
                    gBoard[k][l].isMarked = true;
                    document.querySelector(`.cell${k}-${l}`).innerHTML = FLAG;
                    gMarkedCellsNum++;
                    for (let m = k - 1; m <= k + 1; m++) {
                        for (let n = l - 1; n <= l + 1; n++) {
                            if (gChanceBoard[m] && gChanceBoard[m][n] && !(k === m && l === n) && gBoard[m][n].isShown) {
                                mapChanceNeighbours(m, n)
                            }
                        }
                    }
                }
            }
        }
    }
}

function userMoved() {
    gLastMoveUser = true;
}