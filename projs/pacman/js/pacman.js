var gPacman;
var PACMAN = '<img class="pacman" src="img/pacman.png">';
var gTastyInterval
var gIsTastyOnFood = false;
var gIsTastyExist = false;

function createPacman(board) {
  gPacman = {
    location: {
      i: 3,
      j: 5
    },
    isSuper: false,
    isOnSuper: false
  };
  board[gPacman.location.i][gPacman.location.j] = PACMAN;
  gFoodCount--;
}

function movePacman(eventKeyboard) {
  if (!gGame.isOn) return;
  // console.log('eventKeyboard:', eventKeyboard);

  var nextLocation = getNextLocation(eventKeyboard);
  // User pressed none-relevant key in the keyboard
  if (!nextLocation) return;

  var nextCell = gBoard[nextLocation.i][nextLocation.j];
  console.log(nextCell);

  // Hitting a WALL, not moving anywhere
  if (nextCell === WALL) return;

  // Hitting FOOD? update score
  if (nextCell === FOOD) {
    updateScore(1);
    gFoodCount--
  } else if (typeof (nextCell) === 'object') {
    if (gPacman.isSuper) {
      nextCell.isActive = false;
      console.log('nextCellContent:' , nextCell.currCellContent);
      if (nextCell.currCellContent === FOOD) {
        gFoodCount--
        updateScore(1);
      }
      if (nextCell.currCellContent === TASTY_FOOD) {
        updateScore(15);
      }
      if (nextCell.currCellContent === SUPER_FOOD) {
        gPacman.isOnSuper = 'next';
      }
      setTimeout(function setNeewGhost() {
        var newGhost = createGhost(gBoard);
        renderCell(newGhost.location, newGhost.htmlStr);
      }, 3000);
    } else {
      gameOver(false)
      renderCell(gPacman.location, EMPTY);
      return;
    }
  } else if (nextCell === SUPER_FOOD) {
    // debugger;
    if (!gPacman.isSuper) {
      becomeSuper()
    } else {
      if (gPacman.isOnSuper === false) {
        gPacman.isOnSuper = 'next'
      }
    }
  } else if (nextCell === TASTY_FOOD) {
    updateScore(15);
    gIsTastyExist = false;
  }
  // Update the model to reflect movement
  var leaveBehind
  if (gPacman.isOnSuper === 'now') {
    gBoard[gPacman.location.i][gPacman.location.j] = SUPER_FOOD;
    gPacman.isOnSuper = false;
    leaveBehind = SUPER_FOOD;
  } else {
    gBoard[gPacman.location.i][gPacman.location.j] = EMPTY;
    leaveBehind = EMPTY;
  }
  // Update the DOM
  renderCell(gPacman.location, leaveBehind);

  // Update the pacman MODEL to new location  
  gPacman.location = nextLocation;

  gBoard[gPacman.location.i][gPacman.location.j] = PACMAN;
  // Render updated model to the DOM
  renderCell(gPacman.location, PACMAN);
  if (gFoodCount === 0) gameOver(true);
  if (gPacman.isOnSuper === 'next') {
    gPacman.isOnSuper = 'now'
  }
}

function getNextLocation(keyboardEvent) {
  var nextLocation = {
    i: gPacman.location.i,
    j: gPacman.location.j
  };

  switch (keyboardEvent.code) {
    case 'ArrowUp':
      nextLocation.i--;
      break;
    case 'ArrowDown':
      nextLocation.i++;
      break;
    case 'ArrowLeft':
      nextLocation.j--;
      break;
    case 'ArrowRight':
      nextLocation.j++;
      break;
    default: return null;
  }
  
  return nextLocation;
}

function rotatePacman(ev) {
  var pacman = document.querySelector('.pacman');
  // console.log(ev.code);
  if (!pacman) return;
  switch (ev.code) {
    case 'ArrowUp':
      pacman.style.transform = 'rotate(270deg)'
      break;
    case 'ArrowDown':
      pacman.style.transform = 'rotate(90deg)'
      break;
    case 'ArrowLeft':
      pacman.style.transform = 'rotate(0deg)'
      pacman.style.transform = 'rotateY(180deg)'
      break;
    case 'ArrowRight':
      pacman.style.transform = 'rotate(0deg)'
      break;
    default: return null;
  }
}

function becomeSuper() {
  if (gPacman.isSuper === true) return;
  gPacman.isSuper = true;
  colorGhostsSuper();
  PACMAN = '<img class="pacman" src="img/superpacman.png">'
  document.querySelector('.pacman').src = 'img/superpacman.png'
  setTimeout(function stopSuper() {
    gPacman.isSuper = false;
    unColorGhostsSuper();
    PACMAN = '<img class="pacman" src="img/pacman.png">'
    document.querySelector('.pacman').src = 'img/pacman.png'
  }, 5000)
}

function generateTasty() {
  if (!gTastyInterval) {
    gTastyInterval = setInterval(function () {
      var placed = false;
      while (!placed) {
        var newTastyLocation = { i: getRandomIntInclusive(1, 8), j: getRandomIntInclusive(1, 8) }
        var newTastyLocationCell = gBoard[newTastyLocation.i][newTastyLocation.j]

        switch (newTastyLocationCell) {
          case FOOD:
            gFoodCount--;
            gIsTastyOnFood = true;
            gBoard[newTastyLocation.i][newTastyLocation.j] = TASTY_FOOD;
            renderCell(newTastyLocation, TASTY_FOOD);
            gIsTastyExist = true;
            placed = true;
            break;
          case EMPTY:
            gBoard[newTastyLocation.i][newTastyLocation.j] = TASTY_FOOD;
            renderCell(newTastyLocation, TASTY_FOOD);
            gIsTastyExist = true;
            placed = true;
            gIsTastyOnFood = false;
        }
      }
      setTimeout(function removeTasty(location) {
        if (!gIsTastyExist) return;
        gBoard[location.i][location.j] = gIsTastyOnFood ? FOOD : EMPTY;
        if (gIsTastyOnFood) gFoodCount++
        renderCell(location, gBoard[location.i][location.j]);
        gIsTastyExist = false;
      }, 10000, newTastyLocation)
    }, 15000)
  }
}