function init() {
    if (checkLoggedInUser()) renderSafeContent();
    else {
        showLoginForm();
        document.querySelector('.container').style.display = 'none';
    }
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