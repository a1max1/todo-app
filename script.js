const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const list = document.getElementById('todo-list');
const themeToggle = document.getElementById('theme-toggle');
const todoStats = document.getElementById('todo-stats');
const todoStatsText = document.getElementById('todo-stats-text');
const progressFill = document.getElementById('progress-fill');
const THEME_STORAGE_KEY = 'todo-theme';

const isTheme = (value) => value === 'light' || value === 'dark';

const getPreferredTheme = () => {
  const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  if (isTheme(storedTheme)) {
    return storedTheme;
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const applyTheme = (theme) => {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;

  const nextTheme = theme === 'dark' ? 'light' : 'dark';
  themeToggle.textContent = theme === 'dark' ? 'Light mode' : 'Dark mode';
  themeToggle.setAttribute('aria-label', `Switch to ${nextTheme} mode`);
};

const toggleTheme = () => {
  const currentTheme = document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
  const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';

  applyTheme(nextTheme);
  localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
};

const updateStats = () => {
  const items = list.querySelectorAll('.todo-item');
  const total = items.length;

  if (total === 0) {
    todoStats.hidden = true;
    return;
  }

  const completed = list.querySelectorAll('.todo-item.completed').length;
  const percent = Math.round((completed / total) * 100);

  todoStats.hidden = false;
  todoStatsText.textContent = completed === total
    ? `All ${total} task${total !== 1 ? 's' : ''} completed 🎉`
    : `${completed} of ${total} task${total !== 1 ? 's' : ''} completed`;

  progressFill.style.width = `${percent}%`;
  progressFill.closest('[role="progressbar"]').setAttribute('aria-valuenow', percent);
};

const renderEmptyState = () => {
  list.innerHTML = '';
  todoStats.hidden = true;

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
    updateStats();
  });

  const text = document.createElement('span');
  text.textContent = todoText;

  const removeButton = document.createElement('button');
  removeButton.type = 'button';
  removeButton.textContent = 'Delete';
  removeButton.addEventListener('click', () => {
    item.classList.add('removing');
    item.addEventListener('animationend', () => {
      item.remove();

      if (!list.querySelector('.todo-item')) {
        renderEmptyState();
      } else {
        updateStats();
      }
    }, { once: true });
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
  updateStats();
  form.reset();
  input.focus();
});

themeToggle.addEventListener('click', toggleTheme);
applyTheme(getPreferredTheme());

renderEmptyState();
