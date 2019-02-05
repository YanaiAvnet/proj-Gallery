'use strict';

function init() {
    console.log('Todos App');
    createTodos();
    render();
}

function render() {
    renderTodos();
    renderStats();
}

function renderTodos() {
    var todos = getTodosForDisplay();
    if (todos.length === 0) {
        var currFilter = gTodoFilterBy === 'All' ? '' : gTodoFilterBy;
        document.querySelector('.todos').innerHTML = `There are no todos ${currFilter}`
        return;
    }
    var strHtmls = todos.map(function (todo) {
        var className = (todo.isDone) ? 'done' : ''
        var timeStamp = dateToStr(todo.timeCreated);
        var strHtml = `<tr>
                        <td class="time-stamp">${timeStamp}</td>
                        <td class="${className}" onclick="onTodoClicked(this, ${todo.id})">${todo.txt}</td>
                        <td class="importance">${todo.importance}</td>
                        <td class="actions">
                            <button class="btn" onclick="onDeleteTodo(event, ${todo.id})">x</button>
                        </td>`
        if (gTodoFilterBy === 'All') strHtml += `<td class="move">
                                                <button class="btn move-down" onclick="onMoveTodoDown(event, ${todo.id})">↓</button>
                                                <button class="btn move-up" onclick="onMoveTodoUp(event, ${todo.id})">↑</button>
                                                </td>`
        strHtml += `</tr>`
        return strHtml;
    })
    var strHtml = `<thead>
                    <th>time</th>
                    <th>todo</th>
                    <th>importance</th>
                    <th>delete</th>`
    if (gTodoFilterBy === 'All') strHtml += `<th>move</th>`
    strHtml += `</thead>`
    document.querySelector('.todos').innerHTML = `${strHtml}<tbody>${strHtmls.join('')}</tbody>`;
    console.table(todos);
}

function renderStats() {
    var todos = getTodosForDisplay();
    document.querySelector('.active-count').innerHTML = todos.length
}

function onAddTodo() {
    var txt = prompt('What needs to be done?', 'Nothing');
    if (txt === 'Nothing' || !txt) return;
    var importance = +prompt('how Important is it? (1-3)', '1');
    while (importance !== 1 && importance !== 2 && importance !== 3) {
        alert('invalid number');
        importance = +prompt('how Important is it? (1-3)', '1');
    }
    addTodo(txt, importance);
    render();
}

function onTodoClicked(elTodo, todoId) {
    toggleTodo(todoId);
    render();
}

function onDeleteTodo(ev, todoId) {
    ev.stopPropagation();
    if (confirm('are you sure?')) {
        deleteTodo(todoId);
        render();
    }
}

function onFilterChange(filterByTxt, elBtn) {
    if (gTodoFilterBy === filterByTxt) return;
    setTodosFilter(filterByTxt);
    render();
    document.querySelectorAll('.filter-zone button').forEach(function (elButton) { elButton.classList.remove('selected') });
    elBtn.classList.add('selected');
}

function onSortChange(sortMethod) {
    setTodosSort(sortMethod);
    render();
}

function onMoveTodoDown(ev, todoId) {
    ev.stopPropagation();
    moveTodo(todoId, 1);
    render();
}

function onMoveTodoUp(ev, todoId) {
    ev.stopPropagation();
    moveTodo(todoId, -1);
    render();
}