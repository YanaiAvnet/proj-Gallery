var gUsers = loadFromStorage('gUsers') || [{
    userName: 'Yanai',
    password: 'Yanai1',
    isAdmin: true,
    lastLogin: null
}];
var gLoggedInUser
var gUsersSortMethod

function createUser(userName, password, isAdmin) {
    var user = {
        userName: userName,
        password: password,
        isAdmin: isAdmin,
        lastLogin: null
    }
    gUsers.push(user);
    saveUsers(gUsers);
}

function login(userName, password) {
    var userLogged = gUsers.find(function (user) {
        return user.userName === userName;
    })
    if (!userLogged) {
        document.querySelector('.invalid-input').innerHTML = 'user name doesn\'t exist';
        return false;
    } else if (userLogged.password !== password) {
        document.querySelector('.invalid-input').innerHTML = 'wrong password';
        return false;
    }
    userLogged.lastLogin = Date.now();
    gLoggedInUser = userLogged;
    saveUsers(gUsers);
    saveToStorage('loggedInUser', userLogged)
    return (true);
}

function logout() {
    gLoggedInUser = null;
    saveToStorage('loggedInUser', null);
}

function sortUsersBy(method) {
    gUsersSortMethod = method;
    gUsers.sort(function (user1, user2) {
        switch (method) {
            case 'name':
                return user1.userName > user2.userName ? 1 : -1;
            case 'last login':
                if (user1.lastLogin !== user2.lastLogin) return user1.lastLogin > user2.lastLogin ? 1 : -1;
                else return user1.userName > user2.userName ? 1 : -1;
            case 'is admin':
                if (user1.isAdmin && !user2.isAdmin) return -1
                else if (!user1.isAdmin && user2.isAdmin) return 1
                else return user1.userName > user2.userName ? 1 : -1;
        }
    })
    console.table(gUsers);
}

function saveUsers(users) {
    saveToStorage('gUsers', users);
}

function getUsers() {
    sortUsersBy(gUsersSortMethod || 'name');
    return gUsers;
}

function checkLoggedInUser() {
    if (!loadFromStorage('loggedInUser')) {
        return false;
    } else {
        gLoggedInUser = loadFromStorage('loggedInUser');
        return gLoggedInUser;
    }
}

function checkAdmin() {
        gLoggedInUser = loadFromStorage('loggedInUser');
        return (gLoggedInUser && gLoggedInUser.isAdmin) ? true : false;
}

function checkDisplayMethod() {
    return loadFromStorage('displayMethod') || 'table';
}