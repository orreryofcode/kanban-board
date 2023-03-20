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
  #boardsInStorage = [];
  #lastSelectedBoard;

  constructor() {
    boardTitle.innerText === "" ?? newTaskBtn.setAttribute("disabled", "");

    /**
     * EVENT LISTENERS START
     */
    submitNewBoardForm.addEventListener("click", (e) => {
      this._createNewBoard(e);
    });
    submitNewTaskForm.addEventListener("click", (e) => {
      this._createNewTask(e);
    });
    newTaskFormSubtaskBtn.addEventListener("click", this._createNewSubtask);
    boardList.addEventListener(
      "click",
      this._renderSelectedBoardFromSideBar.bind(this)
    );
    newBoardBtn.addEventListener("click", this._openModal);
    newTaskBtn.addEventListener("click", this._openModal);
    newTaskModalWindow.addEventListener("click", this._closeModal);
    newBoardModalWindow.addEventListener("click", this._closeModal);
    // ---- EVENT LISTENERS END ----

    /**
     * INITIALIZATION START
     */
    this._init();
    // ---- INITIALIZATION END
  }

  _init() {
    this._getBoardsFromLocalStorage();
    this._getLastSelectedBoardFromLocalStorage();
    this._viewBoard(this.#lastSelectedBoard);
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
    this.#boardsInStorage.push(newBoard);
    this._saveBoardToLocalStorage();
    this.#lastSelectedBoard = newBoardTitle;
    this._saveLastSelectedBoardToLocalStorage();
    this._populateSidebar(newBoard);
    this._viewBoard(newBoardTitle);
    // Board needs to be saved to localStorage
  }

  // Creates a new Task object from the task form modal
  _createNewTask(e) {
    e.preventDefault();
    this.#boardsInStorage.forEach((board) => {
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
      this._saveBoardToLocalStorage();
    });
    location.reload();
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
    sidebarListHeading.innerHTML = `<p>ALL BOARDS (${
      this.#boardsInStorage.length
    })</p>`;
  }

  _viewBoard(boardToView) {
    taskBoard.innerHTML = "";
    this.#boardsInStorage.forEach((boardFromStorage) => {
      if (boardFromStorage.title && boardFromStorage.title === boardToView) {
        boardTitle.innerText = boardFromStorage.title;

        for (const key in boardFromStorage.categories) {
          if (boardFromStorage.categories[key].length > 0) {
            let categoryGroup = this._createCategoryGroups(key);
            boardFromStorage.categories[key].map((task) => {
              categoryGroup.append(this._createTaskCards(task));
            });
            taskBoard.append(categoryGroup);
          }
        }
      }
    });
  }

  _renderSelectedBoardFromSideBar(e) {
    taskBoard.innerHTML = "";
    newTaskBtn.removeAttribute("disabled");

    const selectedBoardToView = e.target.innerText;
    this.#lastSelectedBoard = e.target.innerText;
    this._saveLastSelectedBoardToLocalStorage();
    this._viewBoard(selectedBoardToView);
  }

  _createCategoryGroups(key) {
    const taskGroup = document.createElement("div");
    const category = document.createElement("div");
    const categoryHeading = document.createElement("h3");
    taskGroup.classList.add("task__board-track");
    category.classList.add("task__board-heading");
    categoryHeading.innerText = key.toUpperCase();
    category.append(categoryHeading);
    taskGroup.append(category);
    return taskGroup;
  }

  _createTaskCards(task) {
    const taskCard = document.createElement("div");
    const taskCardHeading = document.createElement("h4");
    const taskCardBody = document.createElement("p");
    taskCard.classList.add("task__board-card");
    taskCardHeading.innerText = task.title;
    taskCardBody.innerText = task.description;
    taskCard.append(taskCardHeading, taskCardBody);
    return taskCard;
  }

  _saveBoardToLocalStorage() {
    localStorage.setItem("boards", JSON.stringify(this.#boardsInStorage));
  }

  _saveLastSelectedBoardToLocalStorage() {
    localStorage.setItem("lastViewedBoard", this.#lastSelectedBoard);
  }

  _getBoardsFromLocalStorage() {
    const boardsFromLocalStorage = JSON.parse(
      localStorage.getItem("boards")
      //The call to .map below re-instantiates the prototype of the boards from local storage
    ).map((board) => {
      var newBoard = new Board(board.title, board.categories);
      return newBoard;
    });

    if (!boardsFromLocalStorage) return;

    this.#boardsInStorage = boardsFromLocalStorage;

    this.#boardsInStorage.forEach((board) => {
      this._populateSidebar(board);
    });
  }

  _getLastSelectedBoardFromLocalStorage() {
    const lastViewedBoardFromStorage = localStorage.getItem("lastViewedBoard");
    if (!lastViewedBoardFromStorage) return;

    this.#lastSelectedBoard = lastViewedBoardFromStorage;
  }
}

const app = new App();

/**
 * ---- TODO ----
 * 1. Finish styling of following:
 *  a. Logo
 *  b. Selected Task in Sidebar
 *
 * 2. Create task card detailed modal
 * 3. Deletion of tasks + boards
 * 4. Responsive design
 *
 */
