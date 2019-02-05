'use strict';

var gCurrId = loadFromStorage('gCurrId') || 1;
var gBooks = loadFromStorage('gBooks') || [];
var gFilterMethod = 'all';
var gSortMethod = 'title';

function createBook(title, author, price, imgUrl, rating, qty) {
    var newBook = {
        id: gCurrId,
        title: title,
        author: author,
        price: price,
        imgUrl: imgUrl,
        rating: rating,
        qty: qty
    };
    gCurrId++;
    saveToStorage('gCurrId', gCurrId);
    gBooks.push(newBook);
    saveBooks();
}

function deleteBook(id) {
    gBooks.splice(getBookIdx(id), 1);
    saveBooks();
}

function getBookById(id) {
    return gBooks.find(function (book) {
        return book.id === id;
    });
}

function getBookIdx(id) {
    return gBooks.findIndex(function (book) {
        return book.id === id;
    });
}

function updateBook(id, property, value) {
    getBookById(id)[property] = value;
}

function getBooksForDisplay(page, booksPerPage) {  
    var filteredBooks = gBooks.filter(function filterBooks(book) {
        switch (gFilterMethod) {
            case 'all': return true;
            case 'in-stock': return book.qty > 0;
        }
    })
    filteredBooks.sort(function (book1, book2) {
        switch (gSortMethod) {
            case ('title'): return book1.title.toLowerCase() > book2.title.toLowerCase() ? 1 : -1;
            case ('author'): return book1.author.toLowerCase() > book2.author.toLowerCase() ? 1 : -1;
            case ('rating'): if (book1.rating !== book2.rating) return book2.rating - book1.rating;
                             else return book1.title.toLowerCase() > book2.title.toLowerCase() ? 1 : -1;
            case ('price'): if (book1.price !== book2.price) return book1.price - book2.price;
                            else return book1.title.toLowerCase() > book2.title.toLowerCase() ? 1 : -1;
        }
    })
    return filteredBooks.slice(page * booksPerPage, (page + 1) * booksPerPage);
}

function getBooksNum() {
    return gBooks.length;
}

function changeSortMethod(method) {
    gSortMethod = method;
}

function changeFilterMethod(method) {
    gFilterMethod = method;
}

function saveBooks() {
    saveToStorage('gBooks', gBooks);
}

function stepRating(id, value) {
    var newRating = getBookById(id).rating + value;
    if (newRating >= 0 && newRating <= 10) getBookById(id).rating = newRating;
    saveBooks();
}