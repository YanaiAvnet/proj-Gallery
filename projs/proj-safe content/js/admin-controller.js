var gDisplayMethod

function init() {
    if (checkAdmin()) {
        gDisplayMethod = checkDisplayMethod();
        renderAdminContent(gDisplayMethod);
    }
    else window.location = 'safe-content.html';
}

function renderAdminContent(method) {
    switch (method) {
        case 'table':
            var strHtml = getUsersTable();
            break;
        case 'cards':
            var strHtml = getUsersCards();
            break;
    }
    document.querySelector('.users').innerHTML = strHtml;
}

function getUsersTable() {
    var strHtml = `<table class="table"><thead>
    <th>user name</th>
    <th>password</th>
    <th>is admin</th>
    <th>last login</th>
    </thead>
    <tbody>`;
    strHtml += getUsers().reduce(function (acc, user) {
        return acc + `<tr>
    <td>${user.userName}</td>
    <td>${user.password}</td>
    <td>${user.isAdmin}</td>
    <td>${dateToStr(user.lastLogin)}</td>
    </tr>`;
    }, '')
    strHtml += `</tbody></table>`;
    return strHtml;
}

function getUsersCards() {
    var strHtml = getUsers().reduce(function (acc, user) {
        return acc + `<div class="${user.userName}">
                        <h1>${user.userName}</h1>
                        <img src="img/${user.userName}.png">
                      </div>`
    }, '');
    return strHtml;
}

function onToMainContent() {
    window.location = 'safe-content.html';
}

function onSortChange(elSort) {
    sortUsersBy(elSort.value);
    renderAdminContent(gDisplayMethod);
}

function onView(method) {
    renderAdminContent(method);
    gDisplayMethod = method;
    saveToStorage('displayMethod', gDisplayMethod);
}