
let tasks = [];       
let nextId = 1;       
let currentFilter = "all"; 

const formEl = document.getElementById("todo-form");
const inputEl = document.getElementById("task-input");
const warningEl = document.getElementById("warning");
const listEl = document.getElementById("task-list");
const counterEl = document.getElementById("counter");
const filterBtns = document.querySelectorAll(".filter-btn");

function render() {

  const doneCount = tasks.filter(t => t.completed).length;
  const activeCount = tasks.length - doneCount;
  counterEl.textContent = "Осталось: " + activeCount + ", Выполнено: " + doneCount;

  let filtered = tasks;
  if (currentFilter === "active") {
    filtered = tasks.filter(t => !t.completed);
  }
  if (currentFilter === "completed") {
    filtered = tasks.filter(t => t.completed);

  }
  

  const items = filtered.map(task => {
    const li = document.createElement("li");
    li.className = "task-item";
    if (task.completed) {
      li.classList.add("completed");
    }

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.addEventListener("change", () => {
      task.completed = !task.completed;
      render();
    });

    const span = document.createElement("span");
    span.textContent = task.text;

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Удалить";
    deleteBtn.className = "delete-btn";
    deleteBtn.addEventListener("click", () => {
      tasks = tasks.filter(t => t.id !== task.id);
      render();
    });

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(deleteBtn);

    return li;
  });

  listEl.innerHTML = "";
  items.forEach(li => {
    listEl.prepend(li);
  });
}


formEl.addEventListener("submit", (e) => {
  e.preventDefault();

  const text = inputEl.value.trim();

  if (text === "") {
    warningEl.hidden = false;
    return;
  }

  warningEl.hidden = true;

  const newTask = {
    id: nextId,
    text: text,
    completed: false
  };

  nextId++;
  tasks.push(newTask);
  inputEl.value = "";
  inputEl.focus();

  render();
});

filterBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    currentFilter = btn.dataset.filter; 
    filterBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    render();
  });
});

render();