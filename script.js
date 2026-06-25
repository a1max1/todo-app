const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const list = document.getElementById('todo-list');

const renderEmptyState = () => {
  list.innerHTML = '';

  const emptyState = document.createElement('li');
  emptyState.className = 'empty-state';
  emptyState.textContent = 'No todos yet. Add one above to get started.';
  list.appendChild(emptyState);
};

const createTodoItem = (todoText) => {
  const item = document.createElement('li');
  item.className = 'todo-item';

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.className = 'todo-checkbox';
  checkbox.addEventListener('change', () => {
    item.classList.toggle('completed', checkbox.checked);
  });

  const text = document.createElement('span');
  text.textContent = todoText;

  const removeButton = document.createElement('button');
  removeButton.type = 'button';
  removeButton.textContent = 'Delete';
  removeButton.addEventListener('click', () => {
    item.remove();

    if (!list.querySelector('.todo-item')) {
      renderEmptyState();
    }
  });

  item.append(checkbox, text, removeButton);
  return item;
};

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const todoText = input.value.trim();
  if (!todoText) {
    input.focus();
    return;
  }

  const emptyState = list.querySelector('.empty-state');
  if (emptyState) {
    emptyState.remove();
  }

  list.appendChild(createTodoItem(todoText));
  form.reset();
  input.focus();
});

renderEmptyState();
