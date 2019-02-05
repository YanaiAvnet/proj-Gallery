'use strict';

var gLastRes = null;

$(document).ready(init);

function init() {
    createQuestsTree();
}

function onStartGuessing() {
    // hide the game-start section
    $('.game-start').hide();
    renderQuest();
    $('.quest').show();
    // show the quest section
}

function renderQuest() {
    // select the <h2> inside quest and update its text by the currQuest text
    $('.quest h2').html(getCurrQuest().txt);
}

function onUserResponse(res) {
    // If this node has no children
    if (isChildless(getCurrQuest())) {
        if (res === 'yes') {
            $('.alert-right').show();
            $('.quest').hide();
        } else {
            $('.alert-wrong').show();
            // hide and show new-quest section
            $('.quest').hide();
        }
    } else {
        // update the lastRes global var
        gLastRes = res;
        moveToNextQuest(res);
        renderQuest();
    }
}

function onAddGuess() {
    // Get the inputs' values
    var newGuess = $('#newGuess').val();
    var newQuest = $('#newQuest').val();

    // Call the service addGuess
    addGuess(newQuest, newGuess, gLastRes);
    onRestartGame();
}


function onRestartGame() {
    $('.new-quest').hide();
    $('.game-start').show();
    gLastRes = null;
    init();
}

function closeAlertRight() {
    $('.alert-right').hide();
    onRestartGame();
}

function closeAlertWrong() {
    $('.alert-wrong').hide();
    $('.new-quest').show();
}