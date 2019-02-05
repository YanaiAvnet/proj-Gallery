'use strict';

var gProjs = [
    {
        id: 'safe content',
        name: 'safe content',
        title: 'safe content',
        desc: 'A page of content is available for display only to logged in users, certain users have admin credentials and can view a special page with informatin about all users',
        url: 'img/safe-content.png',
        publishedAt: 1448693940000,
        labels: ['MVC', 'local storage'],
        projUrl: 'projs/proj-safe content/safe-content.html'
    },
    {
        id: 'todos',
        name: 'todos',
        title: 'todos',
        desc: 'user can manage a list of todos, mark each one as done, create new ones and delete old ones, filter them and sort them freely',
        url: 'img/todo.png',
        publishedAt: 1448693940000,
        labels: ['MVC', 'array extras'],
        projUrl: 'projs/proj-todos/index.html'
    },
    {
        id: 'book shop',
        name: 'book shop',
        title: 'book shop',
        desc: 'user can manage a stock of books, navigate through it, filter and sort it, add new books and delete books and update their properties',
        url: 'img/book-shop.png',
        publishedAt: 1448693940000,
        labels: ['MVC', 'local storage', 'pagination'],
        projUrl: 'projs/ex-book-shop/book-shop.html'
    },
    {
        id: 'guess me',
        name: 'guess me',
        title: 'guess me',
        desc: 'a game where a user is asked to think of a character and the computer attempts to find out who it is by asking yes or no questions. if the computer fails the user is asked to teach it.',
        url: 'img/guess-me.png',
        publishedAt: 1448693940000,
        labels: ['MVC', 'data tree'],
        projUrl: 'projs/guessMe/index.html'
    },
    {
        id: 'minesweeper',
        name: 'minesweeper',
        title: 'minesweeper',
        desc: 'a game where a user is asked to think of a character and the computer attempts to find out who it is by asking yes or no questions. if the computer fails the user is asked to teach it.',
        url: 'img/minesweeper.png',
        publishedAt: 1448693940000,
        labels: ['bot', 'recursions'],
        projUrl: 'projs/minesweeper/minesweeper.html'
    }
]
function getProjectsForDisplay() {
    return gProjs;
}

function getProjById(id) {
    return gProjs.find(function(proj){
        return proj.id === id;
    });
}