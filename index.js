class Board {
  constructor(title) {
    this.title = title;
  }
}

// This is dummy data that will be replaced with form data
const boardData = [];

const boardTitle = document.querySelector("h1");
const boardList = document.querySelector(".nav__boardlist");
const taskBoard = document.querySelector(".task__board");

const newBoardBtn = document.querySelector(".sidebar__button-btn");
const newTaskBtn = document.querySelector(".heading__button-btn");
const submitNewBoardForm = document.querySelector("#newBoardForm");
const newBoardFormInput = document.querySelector("#newboardtitle");
const newBoardModalWindow = document.querySelector(".modal__window-board");
const newTaskModalWindow = document.querySelector(".modal__window-new-bg");

class App {
  constructor() {
    this._populateSidebar();
    submitNewBoardForm.addEventListener("click", (e) => {
      this._createNewBoard(e);
      this._populateSidebar();
      this._closeModal();
    });
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
      e.target === newBoardModalWindow &&
      !newBoardModalWindow.classList.contains("hidemodal")
    ) {
      newBoardModalWindow.classList.add("hidemodal");
    } else if (
      e.target === newTaskModalWindow &&
      !newTaskModalWindow.classList.contains("hidemodal")
    ) {
      newTaskModalWindow.classList.add("hidemodal");
    }
  }

  // Creates new Board object from form input
  _createNewBoard(e) {
    e.preventDefault();
    const newBoardTitle = newBoardFormInput.value;
    const newBoard = new Board(newBoardTitle);
    boardData.push(newBoard);
  }

  // Populate the list of boards in the sidebar
  _populateSidebar() {
    // boardData will be replaced by the elements we have in localstorage

    if (boardData.length > 0) {
      let boardTitle;
      boardData.map((board) => {
        boardTitle = document.createElement("li");
        boardTitle.innerText = board.title;
        boardTitle.classList.add("nav__board-item");
      });
      boardList.append(boardTitle);
    }
  }

  // Populate the task tracks in the main section
  _populateBoardTracks(e) {
    taskBoard.innerHTML = "";

    const target = e.target.innerText;
    boardData.forEach((element) => {
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
}

const app = new App();
