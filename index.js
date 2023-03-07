const newTaskBtn = document.querySelector(".heading__button-btn");
const modalWindow = document.querySelector(".modal__window-new-bg");

newTaskBtn.addEventListener("click", openModal);
modalWindow.addEventListener("click", closeModal);

function openModal() {
  if (modalWindow.classList.contains("hidemodal")) {
    modalWindow.classList.remove("hidemodal");
  }
}

function closeModal() {
  if (!modalWindow.classList.contains("hidemodal")) {
    modalWindow.classList.add("hidemodal");
  }
}
