const formNote = document.forms["form-note"];
const inputNote = formNote.noteText;
const important = formNote.important;
const btnAdd = formNote.createNote;
const listNotes = document.getElementById("list");

// Отримуємо замітки з localStorage або створюємо пустий масив
const notes = JSON.parse(localStorage.getItem("notes")) || [];

// Оновлюємо localStorage, якщо вже є замітки
localStorage.setItem("notes", JSON.stringify(notes));

// Функція для визначення класу важливості
function importantNote(important) {
  switch (important) {
    case 1:
      return "text-bg-secondary";
    case 2:
      return "text-bg-warning";
    case 3:
      return "text-bg-primary";
    default:
      return "";
  }
}

// Шаблон для відображення кожної замітки
function templateNote(note) {
  return `
          <li data-id="${note.id}"
            class="${importantNote(
              note.important
            )} list-group-item d-flex justify-content-between align-items-start gap-5 mb-2"
          >
            <span
              class="${note.completed ? "text-decoration-line-through text-success" : ""}"
            >${note.text}</span>
            <div class="btn-group" role="group">
              <button type="button" class="btn btn-success btn-toggle">
                &check;
              </button>
              <button type="button" class="btn btn-danger btn-remove">
                &times;
              </button>
            </div>
          </li>`;
}

// Функція для рендерингу заміток
function render() {
  const notes = JSON.parse(localStorage.getItem("notes"));
  listNotes.innerHTML = notes.map((note) => templateNote(note)).join("");
}

// Викликаємо рендеринг на початку
render();

// Функція для генерації унікального ID
function generateId() {
  return Math.floor(Math.random() * 1000000);
}

// Додавання нової замітки
btnAdd.addEventListener("click", () => {
  const note = {
    id: generateId(),
    text: inputNote.value,
    important: +important.value,
    completed: false,
  };

  notes.push(note);
  localStorage.setItem("notes", JSON.stringify(notes));
  render();
  formNote.reset();
});

// Обробка кліків на кнопки (перекреслення або видалення)
listNotes.addEventListener("click", (event) => {
  const target = event.target;
  const li = target.closest("li");
  const noteId = li?.dataset.id;

  if (target.classList.contains("btn-toggle")) {
    // Перекреслюємо завдання
    const note = notes.find((n) => n.id == noteId);
    note.completed = !note.completed; // Змінюємо статус
    localStorage.setItem("notes", JSON.stringify(notes));
    render();
  } else if (target.classList.contains("btn-remove")) {
    // Видаляємо завдання
    const noteIndex = notes.findIndex((n) => n.id == noteId);
    notes.splice(noteIndex, 1); // Видаляємо замітку з масиву
    localStorage.setItem("notes", JSON.stringify(notes));
    render();
  }
});
