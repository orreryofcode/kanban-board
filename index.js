// This is dummy data that will be replaced with form data
const boardData = [
  {
    id: 1,
    title: "Sample Board",
    categories: {
      todo: [
        {
          title: "Todo Task",
          id: 1,
          description: "This is a task",
          subtasks: [1, 2, 3],
          category: "todo",
        },
      ],
      doing: [
        {
          title: "Doing Task",
          id: 1,
          description: "This is a task",
          subtasks: [1, 2, 3],
          category: "doing",
        },
      ],
      done: [
        {
          title: "Done Task",
          id: 1,
          description: "This is a task",
          subtasks: [1, 2, 3],
          category: "done",
        },
      ],
    },
  },
  {
    id: 2,
    title: "Sample Board #2",
    categories: {
      todo: [
        {
          title: "Todo Task",
          id: 1,
          description: "This is a task",
          subtasks: [1, 2, 3],
          category: "todo",
        },
      ],
      doing: [],
      done: [],
    },
  },
];

const boardTitle = document.querySelector("h1");
const boardList = document.querySelector(".nav__boardlist");
const taskBoard = document.querySelector(".task__board");

const newTaskBtn = document.querySelector(".heading__button-btn");
const modalWindow = document.querySelector(".modal__window-new-bg");

class App {
  constructor() {
    this._populateSidebar();
    newTaskBtn.addEventListener("click", this._openModal);
    modalWindow.addEventListener("click", this._closeModal);
    boardList.addEventListener("click", this._populateBoardTracks.bind(this));
  }

  _openModal() {
    if (modalWindow.classList.contains("hidemodal")) {
      modalWindow.classList.remove("hidemodal");
    }
  }

  _closeModal(e) {
    if (
      e.target === modalWindow &&
      !modalWindow.classList.contains("hidemodal")
    ) {
      modalWindow.classList.add("hidemodal");
    }
  }

  // Populate the list of boards in the sidebar
  _populateSidebar() {
    // boardData will be replaced by the elements we have in localstorage
    boardData.map((board) => {
      const boardTitle = document.createElement("li");
      boardTitle.innerText = board.title;
      boardTitle.classList.add("nav__board-item");
      boardList.append(boardTitle);
    });
  }

  // Populate the task tracks in the main section
  _populateBoardTracks(e) {
    taskBoard.innerHTML = "";

    const target = e.target.innerText;
    boardData.forEach((element) => {
      if (element.title === target) {
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
