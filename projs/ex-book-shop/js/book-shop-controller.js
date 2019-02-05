'use strict';

var gCurrPage;
var gBooksPerPage = 4;

function init() {
    onMoveToPage(0);
    renderBooks();
    renderPageNav();
    $('.modal').hide();
    onChangeLang(getCurrLang());
}

function renderBooks() {
    var booksForDisplay = getBooksForDisplay(gCurrPage, gBooksPerPage);
    if (!booksForDisplay || booksForDisplay.length === 0) {
        $('.books-container').hide();
        $('.empty-display').show();
    }
    else {
        var strHtml = booksForDisplay.reduce(function (acc, book) {
            return acc + `<tr>
                            <td>${book.id}</td>
                            <td>${book.title}</td>
                            <td>${book.author}</td>
                            <td>${book[`PRICE_${getCurrLang()}`]}</td>
                            <td><img class="book-cover" onclick="onViewDetails(${book.id})" src="${book.imgUrl}"</td>
                            <td>${book.rating}/10</td>
                            <td>${book.qty}</td>
                            <td>
                                <div class="book-options">
                                    <div class="book-options1">
                                        <button type="button" class="btn btn-secondary change-price" onclick="onChangePrice(${book.id})">${translateItem('CHANGE_PRICE')}</button>
                                        <button type="button" class="btn btn-secondary change-rating" onclick="onChangeRating(${book.id})">${translateItem('CHANGE_RATING')}</button>
                                        </div>    
                                    <div class="book-options2">   
                                        <button type="button" class="btn btn-success books-sold" onclick="onBooksSold(${book.id})">${translateItem('BOOKS_SOLD')}</button>
                                        <button type="button" class="btn btn-primary books-restock" onclick="onBooksRestock(${book.id})">${translateItem('RESTOCK')}</button>
                                        <button type="button" class="btn btn-danger delete" onclick="onDeleteBook(${book.id})">X</button>
                                    </div>
                                </div>
                            </td>
                          </tr>`
        }, '')
        $('.books-container tbody').html(strHtml);
        $('.empty-display').hide();
        $('.books-container').show();
    }
}

function renderPageNav() {
    var pageAmt = Math.ceil(getBooksNum() / gBooksPerPage);
    var strHtml = `<button class="btn btn-light page-selection" onclick="onMoveToPage(\'back\')" data-trans="PREV_PAGE">⮜</button>`;
    for (let i = 0; i < pageAmt; i++) {
        strHtml += `<button class="btn btn-light page-selection" onclick="onMoveToPage(${i})">${i + 1}</button>`;
    }
    strHtml += '<button class="btn btn-light page-selection" onclick="onMoveToPage(\'next\')" data-trans="NEXT_PAGE">⮞</button>';
    $('.page-nav').html(strHtml);

}

function onDeleteBook(id) {
    var $confirmModal = $('.confirm-modal');
    $confirmModal.show();
    $confirmModal.find('.confirm').click(function () { onConfirmDeletion(id) })
}

function onConfirmDeletion(id) {
    onCloseModal();
    deleteBook(id);
    renderBooks();
    renderPageNav();
}

function onChangePrice(id) {
    var $updateModal = $('.update-modal');
    var $button = $updateModal.find('.update-button');
    var $updateLabel = $updateModal.find('.update');
    $button.off();
    $button.click(function () {
        var newPropertyVal = +$updateModal.find('.update').val();
        if (newPropertyVal < 0 || !newPropertyVal) myAlert(translateItem('INVALID_PRICE'));
        else updateBook(id, 'price', newPropertyVal);
        $('.main-container').removeClass('blur');
        $updateModal.hide();
        renderBooks();
    });
    $updateLabel.attr('placeholder', translateItem('NEW_PRICE'));
    $updateModal.show();
    $('.main-container').addClass('blur');
}

function onChangeRating(id) {
    var $updateModal = $('.update-modal');
    var $button = $updateModal.find('.update-button');
    var $updateLabel = $updateModal.find('.update');
    $button.off();
    $button.click(function () {
        var newPropertyVal = +$updateModal.find('.update').val();
        if (newPropertyVal < 0 || newPropertyVal > 10 || !newPropertyVal) myAlert(translateItem('INVALID_RATING'));
        else updateBook(id, 'rating', newPropertyVal);
        $('.main-container').removeClass('blur');
        $updateModal.hide();
        renderBooks();
    });
    $updateLabel.attr('placeholder', translateItem('NEW_RATING'));
    $updateModal.show();
    $('.main-container').addClass('blur');
}

function onBooksSold(id) {
    var $updateModal = $('.update-modal');
    var $button = $updateModal.find('.update-button');
    var $updateLabel = $updateModal.find('.update');
    $button.off();
    $button.click(function () {
        var newPropertyVal = +$updateModal.find('.update').val();
        if (newPropertyVal > getBookById(id).qty) myAlert(translateItem('NOT_ENOUGH_IN_STOCK'));
        else if (!newPropertyVal) myAlert(translateItem('INVALID_NUMBER'));
        else updateBook(id, 'qty', getBookById(id).qty - newPropertyVal);
        $('.main-container').removeClass('blur');
        $updateModal.hide();
        renderBooks();
    });
    $updateLabel.attr('placeholder', translateItem('HOW_MANY_SOLD'));
    $updateModal.show();
    $('.main-container').addClass('blur');
}

function onBooksRestock(id) {
    var $updateModal = $('.update-modal');
    var $button = $updateModal.find('.update-button');
    var $updateLabel = $updateModal.find('.update');
    $button.off();
    $button.click(function () {
        var newPropertyVal = +$updateModal.find('.update').val();
        if (!newPropertyVal || newPropertyVal < 0) myAlert(translateItem('INVALID_NUMBER'));
        else updateBook(id, 'qty', getBookById(id).qty + newPropertyVal);
        $('.main-container').removeClass('blur');
        $updateModal.hide();
        renderBooks();
    });
    $updateLabel.attr('placeholder', translateItem('HOW_MANY_BOUGHT'));
    $updateModal.show();
    $('.main-container').addClass('blur');
}

function myAlert(message) {
    var $alert = $('.alert');
    $alert.html(message);
    $alert.show();
    setTimeout(function hideAlert() { $alert.hide(); }, 2000)
}

function onSortBooks(method) {
    changeSortMethod(method)
    onMoveToPage(0);
}

function onFilterBooks(method) {
    changeFilterMethod(method)
    onMoveToPage(0);
    renderPageNav();
}

function onAddBook() {
    $('.new-book-modal').show();
    $('.main-container').addClass('blur');
}

function onSubmitNewBook() {
    var $newBookModal = $('.new-book-modal');
    var newBookTitle = $newBookModal.find('.title').val();
    var newBookAuthor = $newBookModal.find('.author').val();
    var newBookPrice = $newBookModal.find('.price').val();
    var newBookimage = $newBookModal.find('.img-url').val();
    var newBookRating = +$newBookModal.find('.rating').val();
    var newBookQty = +$newBookModal.find('.qty').val();
    if (!newBookTitle || !newBookAuthor || !newBookPrice ||
        newBookPrice < 0 || !newBookimage || !newBookRating ||
        newBookRating < 0 || newBookRating > 10 ||
        newBookQty < 0 || !Number.isInteger(+newBookQty)) {
        myAlert(translateItem('INVALID_VALUES'));
        return;
    };
    $newBookModal.hide();
    $('.main-container').removeClass('blur');
    createBook(newBookTitle, newBookAuthor, newBookPrice, newBookimage, newBookRating, newBookQty);
    renderBooks();
    renderPageNav();
}

function onMoveToPage(pageNum) {
    var pageAmt = Math.ceil(getBooksNum() / gBooksPerPage);
    switch (pageNum) {
        case 'back': if (gCurrPage > 0) gCurrPage--;
            break;
        case 'next': if (gCurrPage < pageAmt - 1) gCurrPage++;
            break;
        default: gCurrPage = pageNum;
    }
    $('.page-label').html((gCurrPage + 1) + '/' + pageAmt);
    renderBooks();
}

function onCloseModal() {
    $('.modal').hide();
    $('.main-container').removeClass('blur');
}

function onViewDetails(id) {
    var book = getBookById(id);
    var $detailsModal = $('.details-modal');
    var starsStr = ''
    for (let i = 0; i < book.rating; i++) {
        starsStr += '★'
    }
    $detailsModal.find('.img').html(`<img class="book-cover-big" src="${book.imgUrl}">`);
    $detailsModal.find('.title').html(book.title + '/' + book.author);
    $detailsModal.find('.rating').html(starsStr);
    $detailsModal.find('.plus-rating').off();
    $detailsModal.find('.plus-rating').click(function () { onStepRating(id, 1) });
    $detailsModal.find('.minus-rating').off();
    $detailsModal.find('.minus-rating').click(function () { onStepRating(id, -1) });
    $detailsModal.show();
    $('.main-container').addClass('blur');
}

function onStepRating(id, value) {
    stepRating(id, value);
    renderBooks();
    onViewDetails(id);
}

function onChangeLang(lang) {
    // debugger;
    changeLang(lang);
    if (lang === 'he') $('body').addClass('rtl');
    else $('body').removeClass('rtl');
    var elsForTranslate = document.querySelectorAll('[data-trans]');
    for (var i = 0; i < elsForTranslate.length; i++) {
        var elCurr = elsForTranslate[i];
        var transTxt = translateItem(elCurr.dataset.trans);
        if (elCurr.nodeName === 'INPUT') elCurr.placeholder = transTxt;
        else elCurr.innerHTML = transTxt;
    }
    renderBooks();
}