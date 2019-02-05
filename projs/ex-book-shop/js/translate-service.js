var gCurrLang = loadFromStorage('gCurrLang') || 'en';

var gDict = {
    en: {
        TITLE: 'Title',
        AUTHOR: 'Author',
        PRICE: 'Price',
        LINK_TO_COVER: 'Link to cover',
        RATING: 'Rating',
        QUANTITY: 'Quantity',
        CANCEL: 'Cancel',
        OK: 'OK',
        EMPTY_SHOP: 'No books to show',
        ID: 'ID',
        COVER: 'Cover',
        OPTIONS: 'Options',
        FILTER: 'Filter',
        ALL: 'All',
        IN_STOCK: 'In stock',
        SORT: 'Sort',
        CHANGE_PRICE: 'Change Price',
        CHANGE_RATING: 'Change Rating',
        BOOKS_SOLD: 'Books Sold',
        RESTOCK: 'Restock',
        PREV_PAGE: '⮜',
        NEXT_PAGE: '⮞',
        NEW_PRICE: 'New Price?',
        NEW_RATING: 'New Rating?',
        HOW_MANY_SOLD: 'How many sold?',
        HOW_MANY_BOUGHT: 'How many bought?',
        INVALID_PRICE: 'invalid price',
        INVALID_RATING: 'invalid rating',
        NOT_ENOUGH_IN_STOCK: 'not enough in stock',
        INVALID_NUMBER: 'invalid number',
        INVALID_VALUES: 'invalid values',
        ARE_YOU_SURE: 'Are You Sure?'
    },
    he: {
        TITLE: 'כותרת',
        AUTHOR: 'מאת',
        PRICE: 'מחיר',
        LINK_TO_COVER: 'קישור לתמונת עטיפה',
        RATING: 'ציון',
        QUANTITY: 'כמות',
        CANCEL: 'ביטול',
        OK: 'אישור',
        EMPTY_SHOP: 'אין ספרים להציג',
        ID: 'מק\"ט',
        COVER: 'עטיפה',
        OPTIONS: 'אפשרויות',
        FILTER: 'סנן',
        ALL: 'הכל',
        IN_STOCK: 'במלאי',
        SORT: 'מיין',
        CHANGE_PRICE: 'שינוי מחיר',
        CHANGE_RATING: 'שינוי ציון',
        BOOKS_SOLD: 'מכירת ספרים',
        RESTOCK: 'חידוש מלאי',
        PREV_PAGE: '⮞',
        NEXT_PAGE: '⮜',
        NEW_PRICE: 'מחיר מעודכן?',
        NEW_RATING: 'ציון מעודכן?',
        HOW_MANY_SOLD: 'כמה נמכרו?',
        HOW_MANY_BOUGHT: 'כמה נקנו?',
        INVALID_PRICE: 'מחיר לא חוקי',
        INVALID_RATING: 'ציון לא חוקי',
        NOT_ENOUGH_IN_STOCK: 'מלאי לא מספיק',
        INVALID_NUMBER: 'מספר לא חוקי',
        INVALID_VALUES: 'נתונים לא חוקיים',
        ARE_YOU_SURE: 'אתה בטוח?'
    }
}

function translateItem(key) {
    return gDict[gCurrLang][key];
}

function changeLang(lang) {
    gCurrLang = lang;
    saveToStorage('gCurrLang', gCurrLang);
}

function getCurrLang() {
    return gCurrLang;
}