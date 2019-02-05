var GHOST = '&#9781;';

var gIntervalGhosts;
var gGhosts;

function createGhost(board) {
    var ghost = {
        id: 1,
        isActive: true,
        location: {
            i: 3,
            j: 3,
            currCellContent: null
        },
        htmlStr: getGhostHTML()
    };
    var underGhost = gBoard[ghost.location.i][ghost.location.j];
    ghost.currCellContent = typeof (underGhost) === 'object' ? underGhost.currCellContent : underGhost;
    gGhosts.push(ghost);
    board[ghost.location.i][ghost.location.j] = ghost;
    // console.log(ghost);
    return ghost;
}


function createGhosts(board) {
    // Empty the gGhosts array, create some ghosts
    gGhosts = [];

    createGhost(board)
    createGhost(board)

    // Run the interval to move them
    gIntervalGhosts = setInterval(moveGhosts, 1000)
}

function moveGhosts() {
    for (var i = 0; i < gGhosts.length; i++) {
        var ghost = gGhosts[i];
        if (!ghost.isActive) continue;
        console.log(ghost);

        // Create the moveDiff
        var moveDiff = getMoveDiff();
        // console.log('moveDiff', moveDiff);
        var nextLocation = {
            i: ghost.location.i + moveDiff.i,
            j: ghost.location.j + moveDiff.j,
        }
        // console.log('nextLocation', nextLocation);

        var nextCell = gBoard[nextLocation.i][nextLocation.j]
        // If WALL return
        if (typeof (nextCell) === 'object') {
            // console.log('Ghost Hitting a GHOST');
            gBoard[ghost.location.i][ghost.location.j] = ghost;
            renderCell(ghost.location, ghost.htmlStr);
            continue;
        }
        if (nextCell === WALL) {
            // console.log('Ghost Hitting a Wall');
            continue;
        }
        // DETECT gameOver
        if (nextCell === PACMAN) {
            if (gPacman.isSuper) {
                gBoard[ghost.location.i][ghost.location.j] = ghost.currCellContent;
                renderCell(ghost.location, ghost.currCellContent);
                gGhosts[i].isActive = false;
                setTimeout(function setNewGhost() {
                    var newGhost = createGhost(gBoard);
                    renderCell(newGhost.location, newGhost.htmlStr);
                }, 3000);
                return;
            }
            else {
                gameOver(false);
            }
        }

        if (nextCell === TASTY_FOOD) {
            gIsTastyExist === false
            clearInterval(gTastyInterval);
            gTastyInterval = 0;
        }

        // Set back what we stepped on
        if (ghost.currCellContent === TASTY_FOOD) {
            gIsTastyExist = true;
            generateTasty();
        }
        gBoard[ghost.location.i][ghost.location.j] = ghost.currCellContent;
        renderCell(ghost.location, ghost.currCellContent);

        // Move the ghost MODEL
        ghost.currCellContent = nextCell;
        ghost.location = nextLocation
        gBoard[ghost.location.i][ghost.location.j] = ghost;

        // Updade the DOM 
        renderCell(ghost.location, ghost.htmlStr);
        if (gPacman.isSuper) {
            colorGhostsSuper();
        }
    }
}

// There are 4 options where to go
function getMoveDiff() {
    // return { i: getRandomIntInclusive(-1, 1), j: getRandomIntInclusive(-1, 1) }
    var opts = [{ i: 0, j: 1 }, { i: 1, j: 0 }, { i: -1, j: 0 }, { i: 0, j: -1 }];
    return opts[getRandomIntInclusive(0, opts.length - 1)];
}

function getGhostHTML() {
    // console.log(`<span style="color: ${getRandomColor()}">${GHOST}</span>`);
    return `<span class="ghost" style="color: ${getRandomColor()}">${GHOST}</span>`
}

function colorGhostsSuper() {
    var ghosts = document.querySelectorAll('.ghost')
    for (var i = 0; i < ghosts.length; i++) {
        ghosts[i].style.color = 'white';
        ghosts[i].style.fontWeight = 'bold';
    }
}

function unColorGhostsSuper() {
    for (var i = 0; i < gGhosts.length; i++) {
        if (gGhosts[i].isActive) renderCell(gGhosts[i].location, gGhosts[i].htmlStr);
    }
}