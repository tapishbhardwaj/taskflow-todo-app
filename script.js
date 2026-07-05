

const input = document.getElementById("todo-input");
const addBtn = document.getElementById("add-btn");
const taskList = document.getElementById("task-list");
const searchInput = document.getElementById("search-input");

const taskCount = document.getElementById("task-count");
const remainingCount = document.getElementById("remaining-count");

const deleteAllBtn = document.getElementById("delete-all");
const emptyMessage = document.getElementById("empty-message");

const filterButtons = document.querySelectorAll(".filter-btn");
const completedCount = document.getElementById("completed-count");


let todos = JSON.parse(localStorage.getItem("todos")) || [];

let currentFilter = "all";



function saveTodos() {
    localStorage.setItem("todos", JSON.stringify(todos));
}


function createTodoNode(todo, index) {

    const li = document.createElement("li");
    li.classList.add("task-item");


    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = todo.completed;



    const text = document.createElement("span");
    text.classList.add("task-text");
    text.textContent = todo.text;

    if (todo.completed) {
        text.classList.add("completed");
    }

   

    checkbox.addEventListener("change", () => {

        todo.completed = checkbox.checked;

        saveTodos();

        render();

    });

  

    text.addEventListener("dblclick", () => {

        const editInput = document.createElement("input");

        editInput.type = "text";

        editInput.value = todo.text;

        editInput.classList.add("edit-input");

        li.replaceChild(editInput, text);

        editInput.focus();

        function saveEdit() {

            const value = editInput.value.trim();

            if (value !== "") {

                todo.text = value;

            }

            saveTodos();

            render();

        }

        editInput.addEventListener("blur", saveEdit);

        editInput.addEventListener("keydown", (e) => {

            if (e.key === "Escape") {
    render();
}

            if (e.key === "Enter") {

                saveEdit();

            }

        });

    });


    const deleteBtn = document.createElement("button");

    deleteBtn.textContent = "🗑";

    deleteBtn.classList.add("delete-btn");

    deleteBtn.addEventListener("click", () => {

        todos.splice(index, 1);

        saveTodos();

        render();

    });

    li.append(
        checkbox,
        text,
        deleteBtn
    );

    return li;

}



function render() {

    taskList.innerHTML = "";

   
    taskCount.textContent = `Total : ${todos.length}`;

    const remainingTasks = todos.filter(todo => !todo.completed).length;

    remainingCount.textContent = `Remaining : ${remainingTasks}`;



    let filteredTodos = [...todos];

    if (currentFilter === "active") {

        filteredTodos = filteredTodos.filter(todo => !todo.completed);

    }

    if (currentFilter === "completed") {

        filteredTodos = filteredTodos.filter(todo => todo.completed);

    }



    const keyword = searchInput.value.trim().toLowerCase();

    if (keyword !== "") {

        filteredTodos = filteredTodos.filter(todo =>
            todo.text.toLowerCase().includes(keyword)
        );

    }

  if (filteredTodos.length === 0) {

    emptyMessage.style.display = "block";

    if (todos.length === 0) {

        emptyMessage.innerHTML = `
            <h3>No Tasks Yet 😴</h3>
            <p>Add your first task to get started.</p>
        `;

    } else {

        emptyMessage.innerHTML = `
            <h3>No Matching Task 🔍</h3>
            <p>Try another search.</p>
        `;

    }

} else {

    emptyMessage.style.display = "none";

}

const completedTasks =
todos.filter(todo => todo.completed).length;

completedCount.textContent =
`Completed : ${completedTasks}`;

   

    filteredTodos.forEach(todo => {

        const index = todos.indexOf(todo);

        const task = createTodoNode(todo, index);

        taskList.appendChild(task);

    });

}


function addTodo() {

    const text = input.value.trim();

    if (text === "") {

        return;

    }

    todos.push({

        text: text,

        completed: false

    });

    input.value = "";

    input.focus();

    saveTodos();

    render();

}


function deleteAllTodos() {

    if (todos.length === 0) {

        alert("No tasks available.");

        return;

    }

    const confirmDelete = confirm("Delete all tasks?");

    if (!confirmDelete) {

        return;

    }

    todos.length = 0;

    saveTodos();

    render();

}


filterButtons.forEach(button => {

    button.addEventListener("click", () => {

        filterButtons.forEach(btn => {

            btn.classList.remove("active");

        });

        button.classList.add("active");

        currentFilter = button.dataset.filter;

        render();

    });

});


addBtn.addEventListener("click", addTodo);

input.addEventListener("keydown", (e) => {

    if (e.key === "Enter") {

        addTodo();

    }

});

searchInput.addEventListener("input", () => {

    render();

});

deleteAllBtn.addEventListener("click", deleteAllTodos);


render();