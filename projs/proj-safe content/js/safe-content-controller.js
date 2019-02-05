var gDisplayMethod

function init() {
    if (checkLoggedInUser()) renderSafeContent();
    else {
        showLoginForm();
    }
}

function initAdmin() {
    if (checkAdmin()) {
        gDisplayMethod = checkDisplayMethod();
        renderAdminContent(gDisplayMethod);
    }
    else window.location = 'safe-content.html';
}

function showLoginForm() {
    document.querySelector('.login-form').style.display = '';
    document.querySelector('.container').style.display = 'none';
}

function renderSafeContent() {
    document.querySelector('.login-form').style.display = 'none';
    var elContainer = document.querySelector('.container');
    document.querySelector('.logged-user').innerHTML = checkLoggedInUser().userName;
    var elToAdminButton = document.querySelector('.to-admin-page')
    if (checkAdmin()) elToAdminButton.style.display = ''
    else elToAdminButton.style.display = 'none'
    elContainer.style.display = '';
}

function renderAdminContent(method) {
    var strHtml
    switch (method) {
        case 'table':
            strHtml = getUsersTable();
            break;
        case 'cards':
            strHtml = getUsersCards();
            break;
    }
    document.querySelector('.users').innerHTML = strHtml;
}

function getUsersTable() {
    var strHtml = `<table><thead>
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

function onLogin() {
    var userNameInput = document.querySelector('.user-name').value;
    var passwordInput = document.querySelector('.password').value;
    if (login(userNameInput, passwordInput)) {
        document.querySelector('.login-form').style.display = 'none';
        renderSafeContent();
    }
}

function onLogout() {
    showLoginForm();
    logout();
}

function onGoToAdminPage() {
    window.location = 'admin-content.html';
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