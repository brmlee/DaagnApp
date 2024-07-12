let todos = [];

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('todo-form');
    const input = document.getElementById('todo-input');
    const dateInput = document.getElementById('todo-date');
    const list = document.getElementById('todo-list');

    // 로컬 스토리지에서 데이터 로드
    loadTodos();

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        addTodo(input.value, dateInput.value);
        input.value = '';
        dateInput.value = '';
    });

    function addTodo(text, date) {
        const todo = {
            id: Date.now(),
            text,
            date,
            completed: false
        };

        todos.push(todo);
        renderTodo(todo);
        saveTodos();
    }

    function renderTodo(todo) {
        const item = document.createElement('li');
        item.setAttribute('class', 'todo-item');
        item.setAttribute('data-id', todo.id);

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = todo.completed;
        checkbox.addEventListener('change', () => {
            todo.completed = !todo.completed;
            saveTodos();
            item.classList.toggle('completed');
        });

        const textSpan = document.createElement('span');
        textSpan.textContent = todo.text;
        textSpan.setAttribute('class', 'todo-text');

        const dateSpan = document.createElement('span');
        dateSpan.textContent = todo.date;
        dateSpan.setAttribute('class', 'todo-date');

        const deleteButton = document.createElement('button');
        deleteButton.textContent = '삭제';
        deleteButton.addEventListener('click', () => {
            deleteTodo(todo.id);
        });

        item.appendChild(checkbox);
        item.appendChild(textSpan);
        item.appendChild(dateSpan);
        item.appendChild(deleteButton);

        list.appendChild(item);
    }

    function deleteTodo(id) {
        todos = todos.filter(todo => todo.id !== id);
        document.querySelector(`[data-id="${id}"]`).remove();
        saveTodos();
    }

    function saveTodos() {
        localStorage.setItem('todos', JSON.stringify(todos));
        if (window.Android) {
            window.Android.saveTodos(JSON.stringify(todos));
        }
    }

    function loadTodos() {
        const savedTodos = localStorage.getItem('todos');
        if (savedTodos) {
            todos = JSON.parse(savedTodos);
            todos.forEach(renderTodo);
        }
    }
});

// 안드로이드에서 호출할 함수
function setTodosFromAndroid(todosJson) {
    todos = JSON.parse(todosJson);
    document.getElementById('todo-list').innerHTML = '';
    todos.forEach(renderTodo);
    localStorage.setItem('todos', todosJson);
}