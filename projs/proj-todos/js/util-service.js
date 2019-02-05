function dateToStr(date) {
    date = new Date(date);
    var hour = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
    var minute = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
    return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}&nbsp${hour}:${minute}`
}