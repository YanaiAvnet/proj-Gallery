var gNextId = 1;
var gTodos = [];
var gTodoFilterBy = 'All';
var gTodoSortBy = 'Date'
const TODOS_KEY = 'todos';

function createTodos() {

    var todos = loadFromStorage(TODOS_KEY)

    if (!todos || todos.length === 0) {
        todos = [
            createTodo('Eat that thing', 1),
            createTodo('Learn how to code', 1),
            createTodo('Do the Ex', 1)
        ];
    } else {
        gNextId = findNextId(todos);
    }
    gTodos = todos;
}

function getTodosForDisplay() {
    if (gTodoSortBy !== 'manual') {
        gTodos.sort(function (todo1, todo2) {
            if (gTodoSortBy === 'Date') return todo1.timeCreated - todo2.timeCreated;
            if (gTodoSortBy === 'Importance') return todo1.importance - todo2.importance;
            if (gTodoSortBy === 'Alphabetically') return todo1.txt > todo2.txt ? 1 : -1;
        })
    }
    if (gTodoFilterBy === 'All') return gTodos;
    return gTodos.filter(function (todo) {
        return todo.isDone && gTodoFilterBy === 'Done' ||
            !todo.isDone && gTodoFilterBy === 'Active';
    });
}

function createTodo(txt, importance) {
    return {
        id: gNextId++,
        txt: txt,
        isDone: false,
        timeCreated: Date.now(),
        importance: importance
    }
}

function addTodo(txt, importance) {
    gTodos.push(createTodo(txt, importance))
    saveToStorage(TODOS_KEY, gTodos);
}

function toggleTodo(id) {
    var todo = gTodos.find(function (todo) {
        return todo.id === id;
    })
    todo.isDone = !todo.isDone;
    saveToStorage(TODOS_KEY, gTodos);
}

function deleteTodo(id) {
    var idx = gTodos.findIndex(function (todo) {
        return todo.id === id;
    })
    gTodos.splice(idx, 1);
    saveToStorage(TODOS_KEY, gTodos)
}

function findNextId(todos) {
    var max = 0;
    todos.forEach(function (todo) {
        if (todo.id > max) max = todo.id;
    })
    return max + 1;
}

function setTodosFilter(filterBy) {
    gTodoFilterBy = filterBy;
}

function getActiveCount() {
    var activeTodos = gTodos.filter(function (todo) {
        return !todo.isDone
    })
    return activeTodos.length;
}

function setTodosSort(sortMethod) {
    gTodoSortBy = sortMethod;
}

function moveTodo(id, direction) {
    var idx = gTodos.findIndex(function (todo) {
        return todo.id === id;
    })
    gTodoSortBy = 'manual';
    if (!gTodos[idx + direction]) return;
    gTodos.splice(idx + direction, 0, gTodos.splice(idx, 1)[0]);
}