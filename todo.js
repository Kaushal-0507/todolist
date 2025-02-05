import dayjs from "https://unpkg.com/dayjs@1.11.10/esm/index.js";

const todayDate = dayjs();
const dateString = todayDate.format(" D MMMM YYYY");
const dayPart = todayDate.format("dddd,");

const dateFormat = new Date(dateString);
const day = dateFormat.getDate();
const month = dateFormat.toLocaleString("en-US", { month: "numeric" });
const year = dateFormat.getFullYear();
const currentFormatDate = `${day}-${month}-${year}`;

document.querySelector(".js-day-part").innerHTML = dayPart;
document.querySelector(".js-date-part").innerHTML = dateString;

const calendarIcon = document.getElementById("calendarIcon");
const dateInput = document.getElementById("dateInput");
const selectedDate = document.getElementById("selectedDate");
const listContainer = document.querySelector(".list-container");
const trashBin = document.querySelector(".trash-bin");
const todoContainer = document.querySelector(".todo-list");
const themeOptions = document.querySelectorAll(".theme-option");
const themeDiv = document.querySelector(".theme");
const body = document.body;
const lightThemeBtn = document.querySelector(".light-theme");
const darkThemeBtn = document.querySelector(".dark-theme");
const glassThemeBtn = document.querySelector(".glass-theme");

function saveToStorage(key, value) {
  if (typeof value === "object") {
    localStorage.setItem(key, JSON.stringify(value));
  } else if (typeof value === "string") {
    localStorage.setItem(key, value);
  }
}

darkThemeBtn.addEventListener("click", () => {
  body.classList.add("dark-mode");
  body.classList.remove("glass-mode");
  themeDiv.style.backgroundColor = "black";
  saveToStorage("theme", "dark");
});

glassThemeBtn.addEventListener("click", () => {
  body.classList.add("glass-mode");
  body.classList.remove("dark-mode");
  themeDiv.style.background = "rgba(255, 255, 255, 0.2)";
  themeDiv.style.backdropFilter = "blur(10px)";
  saveToStorage("theme", "glass");
});

lightThemeBtn.addEventListener("click", () => {
  body.classList.remove("dark-mode");
  body.classList.remove("glass-mode");
  themeDiv.style.backgroundColor = "rgb(243, 242, 242)";
  saveToStorage("theme", "light");
});

document.addEventListener("DOMContentLoaded", () => {
  const saveTodo = JSON.parse(localStorage.getItem("todo")) ?? [];
  todoList = saveTodo;
  renderTodoList();

  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    if (savedTheme === "dark") {
      body.classList.add("dark-mode");
      themeDiv.style.backgroundColor = "black";
    } else if (savedTheme === "glass") {
      body.classList.add("glass-mode");
      themeDiv.style.background = "rgba(255, 255, 255, 0.2)";
      themeDiv.style.backdropFilter = "blur(10px)";
    } else {
      body.classList.remove("dark-mode", "glass-mode");
      themeDiv.style.backgroundColor = "rgb(223, 222, 222)";
    }
  }
});

themeDiv.addEventListener("click", () => {
  themeOptions.forEach((option) => {
    option.classList.remove("hidden");
  });
});

function calendarOption() {
  calendarIcon.addEventListener("click", () => {
    dateInput.focus();
  });

  dateInput.addEventListener("change", () => {
    const dateValue = dateInput.value;

    const dateObject = new Date(dateValue);
    const day = dateObject.getDate();
    const month = dateObject.toLocaleString("en-US", { month: "numeric" });
    const year = dateObject.getFullYear();
    const formattedDate = `${day}-${month}-${year}`;

    selectedDate.style.display = "inline";
    selectedDate.innerHTML = formattedDate;
    calendarIcon.style.display = "none";
    inputBox.focus();
  });
}
calendarOption();

const inputArea = document.querySelector(".input-area");
const showInput = document.querySelector(".display-input-area");
showInput.addEventListener("click", () => {
  inputArea.style.display = "inline-flex";
  showInput.style.display = "none";
});

const addButton = document.querySelector(".js-add-button");
let todoList = [];

function renderTodoList() {
  let todoListHTML = "";
  todoList.forEach((todo) => {
    const { name, dueDate } = todo;
    let html = ``;

    if (!dueDate) {
      html = `<div class="list-msg para-msg" data-todo-name="${name}">
          <span class="delete-sign" data-delete-name="${name}" >&#43;</span> ${name}
          <span class="msg-due-date">${currentFormatDate}</span>
        </div>`;
    } else {
      html = `<div class="list-msg para-msg" data-todo-name="${name}">
          <span class="delete-sign">&#43;</span> ${name}
          <span class="msg-due-date">${dueDate}</span>
        </div>`;
    }
    todoListHTML += html;
  });
  listContainer.innerHTML = todoListHTML;

  if (window.innerWidth > 768) {
    if (todoList.length > 5 && todoList.length <= 10) {
      listContainer.style.gridTemplateColumns = "1fr 1fr";
      todoContainer.style.width = "900px";
      body.style.overflowY = "hidden";
    } else if (todoList.length > 10 && todoList.length <= 15) {
      listContainer.style.gridTemplateColumns = "1fr 1fr 1fr";
      todoContainer.style.width = "1200px";
      body.style.overflowY = "hidden";
    } else if (todoList.length > 15) {
      listContainer.style.gridTemplateColumns = "1fr 1fr 1fr";
      todoContainer.style.width = "1200px";
      body.style.overflowY = "scroll";
    } else {
      listContainer.style.gridTemplateColumns = "1fr";
    }
  } else if (window.innerWidth > 480 && window.innerWidth <= 768) {
    if (todoList.length > 5 && todoList.length <= 10) {
      listContainer.style.gridTemplateColumns = "1fr 1fr";
      todoContainer.style.width = "700px";
    } else {
      listContainer.style.gridTemplateColumns = "1fr";
      todoContainer.style.width = "70%";
    }
  } else if (window.innerWidth < 480) {
    listContainer.style.gridTemplateColumns = "1fr";
    todoContainer.style.width = "90%";
  }
}

function displayBin() {
  if (todoList.length === "0") {
    trashBin.style.display = "none";
  } else {
    trashBin.style.display = "inline-flex";
  }
}

function deleteAnimation() {
  let deleteMode = false;
  let deleteEventListeners = [];

  trashBin.addEventListener("click", () => {
    deleteMode = !deleteMode;

    document.querySelectorAll(".delete-sign").forEach((sign) => {
      sign.style.display = deleteMode ? "inline-flex" : "none";
    });

    const paraMsgElements = document.querySelectorAll(".para-msg");
    if (deleteMode) {
      paraMsgElements.forEach((para) => {
        const deleteListener = () => {
          para.querySelector(".delete-sign").style.transform = "rotate(0deg)";

          const todoName = para.dataset.todoName;

          function deletePara() {
            const newTodoList = [];
            todoList.forEach((todo) => {
              if (todo.name !== todoName) {
                newTodoList.push(todo);
              }
            });
            todoList = newTodoList;
          }

          setTimeout(() => {
            para.remove();
            deletePara();
            saveToStorage("todo", todoList);
          }, 2000);
          para.classList.add("active");
        };

        para.addEventListener("click", deleteListener);
        deleteEventListeners.push({ para, deleteListener });
      });
    } else {
      deleteEventListeners.forEach(({ para, deleteListener }) => {
        para.removeEventListener("click", deleteListener);
      });
      deleteEventListeners = [];
    }
  });
}

const inputBox = document.querySelector(".js-input-box");
function addTask() {
  const name = inputBox.value;
  calendarOption();
  const dateValue = dateInput.value;
  const dateObject = new Date(dateValue);
  const day = dateObject.getDate();
  const month = dateObject.toLocaleString("en-US", { month: "numeric" });
  const year = dateObject.getFullYear();
  const dueDate = `${day}-${month}-${year}`;

  dateValue === "" ? todoList.push({ name }) : todoList.push({ name, dueDate });

  inputBox.value = "";
  dateInput.value = "";
  calendarIcon.style.display = "inline-flex";
  selectedDate.style.display = "none";
  renderTodoList();
}
addButton.addEventListener("click", () => {
  if (inputBox.value === "") {
    alert("Add Task!");
  } else {
    addTask();
    displayBin();
    deleteAnimation();
    saveToStorage("todo", todoList);
  }
});

inputBox.addEventListener("keydown", (event) => {
  if (event.keyCode === 13) {
    addButton.click();
  }
});
