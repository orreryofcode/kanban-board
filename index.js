class Board {
  constructor(title, categories = "") {
    this.title = title;
    this.categories = categories;
  }

  _addCategories(...categories) {
    const obj = {};

    for (const key of categories) {
      obj[key] = [];
    }

    this.categories = obj;
  }

  _addTask(title, description, [...subtasks], category) {
    const task = new Task(title, description, [...subtasks], category);
    for (const key in this.categories) {
      if (task.category === key) {
        this.categories[key].push(task);
      }
    }
  }
}

class Task extends Board {
  constructor(title, description, [...subtasks], category) {
    super(title);
    this.description = description;
    this.subtasks = [...subtasks];
    this.category = category;
  }
}

const boardTitle = document.querySelector("h1");
const sidebarListHeading = document.querySelector(".sidebar__nav-heading");
const boardList = document.querySelector(".nav__boardlist");
const taskBoard = document.querySelector(".task__board");

const newBoardBtn = document.querySelector(".sidebar__button-btn");
const submitNewBoardForm = document.querySelector("#newBoardForm");
const newBoardFormTitleInput = document.querySelector("#newboardtitle"); // Change this id in the html

const newTaskBtn = document.querySelector(".heading__button-btn");
const submitNewTaskForm = document.querySelector("#newTaskForm");
const newTaskFormTitleInput = document.querySelector("#title"); // Change this id in the html
const newTaskFormDescriptionInput = document.querySelector("#description");
const newTaskFormSubtasksContainer = document.querySelector(".form__subtasks");
const newTaskFormSubtasksInputs = Array.from(
  document.querySelectorAll(".subtasks")
);
const newTaskFormSubtaskBtn = document.querySelector(".subtasks-btn");
const newTaskFormStatusInput = document.querySelector("#status");

const newBoardModalWindow = document.querySelector(".modal__window-board");
const newTaskModalWindow = document.querySelector(".modal__window-new-bg");

class App {
  #boards = [];
  constructor() {
    this._getFromLocalStorage();
    boardTitle.innerText === "" ?? newTaskBtn.setAttribute("disabled", "");
    // Populates sidebar with data pulled from localstorage;
    // this._populateSidebar();
    // Add event listener to create a new board;
    submitNewBoardForm.addEventListener("click", (e) => {
      this._createNewBoard(e);
    });
    // Add event listener to add tasks to boards;
    submitNewTaskForm.addEventListener("click", (e) => {
      this._createNewTask(e);
    });
    // Add event listener to add subtasks when creating a new task;
    newTaskFormSubtaskBtn.addEventListener("click", this._createNewSubtask);
    boardList.addEventListener("click", this._populateBoardTracks.bind(this));

    newBoardBtn.addEventListener("click", this._openModal);
    newTaskBtn.addEventListener("click", this._openModal);
    newTaskModalWindow.addEventListener("click", this._closeModal);
    newBoardModalWindow.addEventListener("click", this._closeModal);
  }

  _openModal(e) {
    if (e.target.id === "newBoardBtn") {
      if (newBoardModalWindow.classList.contains("hidemodal")) {
        newBoardModalWindow.classList.remove("hidemodal");
      }
    } else if ((e.target.id = "newTaskBtn")) {
      if (newTaskModalWindow.classList.contains("hidemodal")) {
        newTaskModalWindow.classList.remove("hidemodal");
      }
    }
  }

  _closeModal(e) {
    if (
      e.target === newBoardModalWindow ||
      (e.target === submitNewBoardForm &&
        !newBoardModalWindow.classList.contains("hidemodal"))
    ) {
      newBoardModalWindow.classList.add("hidemodal");
    } else if (
      e.target === newTaskModalWindow ||
      (e.target === submitNewTaskForm &&
        !newTaskModalWindow.classList.contains("hidemodal"))
    ) {
      newTaskModalWindow.classList.add("hidemodal");
    }
  }

  // Creates new Board object from form input
  _createNewBoard(e) {
    e.preventDefault();

    const newBoardTitle = newBoardFormTitleInput.value;
    const newBoard = new Board(newBoardTitle);
    this.#boards.push(newBoard);
    this._saveToLocalStorage();
    this._populateSidebar(newBoard);
    // Board needs to be saved to localStorage
  }

  // Creates a new Task object from the task form modal
  _createNewTask(e) {
    e.preventDefault();
    this.#boards.forEach((board) => {
      if (boardTitle.innerText == board.title) {
        if (!board.categories) {
          const options = Array.from(document.querySelectorAll("option")).map(
            (option) => option.value.toLowerCase()
          );
          board._addCategories(...options);
        }

        board._addTask(
          newTaskFormTitleInput.value,
          newTaskFormDescriptionInput.value,
          newTaskFormSubtasksInputs.map((input) => input.value),
          newTaskFormStatusInput.value.toLowerCase()
        );
      }
      this._saveToLocalStorage();
    });
  }

  // Creates a new subtasks to be added to the Task object
  _createNewSubtask(e) {
    e.preventDefault();
    const newSubtask = document.createElement("input");
    newSubtask.classList.add("subtasks");
    // Add attributes to subtask input
    Object.assign(newSubtask, {
      type: "text",
      name: "subtasks",
      placeholder: "e.g. Take coffee break",
      value: "",
    });

    newTaskFormSubtasksContainer.append(newSubtask);
    newTaskFormSubtasksInputs.push(newSubtask);
  }

  // Populate the list of boards in the sidebar
  _populateSidebar(board) {
    const boardTitle = document.createElement("li");
    boardTitle.innerText = board.title;
    boardTitle.classList.add("nav__board-item");
    boardList.append(boardTitle);
    sidebarListHeading.innerHTML = `<p>ALL BOARDS (${this.#boards.length})</p>`;
  }

  // Populate the task tracks in the main section THIS FUNCTION NEEDS TO BE REWRITTEN
  _populateBoardTracks(e) {
    taskBoard.innerHTML = "";
    newTaskBtn.removeAttribute("disabled");
    const target = e.target.innerText;

    this.#boards.forEach((element) => {
      if (element.title && element.title === target) {
        boardTitle.innerText = element.title;
        for (const key in element.categories) {
          if (element.categories[key].length > 0) {
            // Create Task Track
            let track = this._createCategoryTracks(key);
            //Append task cards to track here
            element.categories[key].map((task) => {
              track.append(this._createTaskCards(task));
            });
            taskBoard.append(track);
          }
        }
      }
    });
  }

  _createCategoryTracks(key) {
    const track = document.createElement("div");
    const category = document.createElement("div");
    const categoryHeading = document.createElement("h3");
    track.classList.add("task__board-track");
    category.classList.add("task__board-heading");
    categoryHeading.innerText = key.toUpperCase();
    category.append(categoryHeading);
    track.append(category);
    return track;
  }

  _createTaskCards(task) {
    const card = document.createElement("div");
    const cardHeading = document.createElement("h4");
    const cardBody = document.createElement("p");
    card.classList.add("task__board-card");
    cardHeading.innerText = task.title;
    cardBody.innerText = task.description;
    card.append(cardHeading, cardBody);
    return card;
  }

  _saveToLocalStorage() {
    localStorage.setItem("boards", JSON.stringify(this.#boards));
  }

  _getFromLocalStorage() {
    const data = JSON.parse(localStorage.getItem("boards")).map((board) => {
      var newBoard = new Board(board.title, board.categories);
      return newBoard;
    });

    if (!data) return;

    this.#boards = data;

    // console.log(this.#boards.length);
    this.#boards.forEach((board) => {
      this._populateSidebar(board);
    });
  }
}

const app = new App();
