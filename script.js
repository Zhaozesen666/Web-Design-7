// 1. Переключение темы (с запоминанием выбора)
const root = document.documentElement;
const themeBtn = document.getElementById('themeBtn');

// localStorage в некоторых браузерах может быть недоступен, поэтому обращаемся к нему через try/catch
function readTheme() {
  try { return localStorage.getItem('theme'); } catch (e) { return null; }
}
function saveTheme(value) {
  try { localStorage.setItem('theme', value); } catch (e) { /* без сохранения */ }
}

const saved = readTheme();
if (saved) root.dataset.theme = saved;
else if (matchMedia('(prefers-color-scheme: dark)').matches) root.dataset.theme = 'dark';
else root.dataset.theme = 'light';

themeBtn.addEventListener('click', () => {
  const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
  root.dataset.theme = next;
  saveTheme(next);
});

// 2. Подсветка пункта меню при прокрутке
const links = document.querySelectorAll('.nav a');
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      links.forEach(l => l.classList.toggle('is-active', l.getAttribute('href') === '#' + e.target.id));
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });
document.querySelectorAll('.section').forEach(s => observer.observe(s));

// 3. Фильтр проектов
const filters = document.querySelectorAll('.filter');
const cards = document.querySelectorAll('.card');
filters.forEach(btn => btn.addEventListener('click', () => {
  filters.forEach(b => b.classList.toggle('is-active', b === btn));
  cards.forEach(c => { c.hidden = btn.dataset.filter !== 'all' && c.dataset.type !== btn.dataset.filter; });
}));

// 4. Проверка формы обратной связи
const form = document.getElementById('form');
const rules = [
  { id: 'name', err: 'nameErr', test: v => v.trim().length >= 2, text: 'Введите имя (минимум 2 символа).' },
  { id: 'email', err: 'emailErr', test: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), text: 'Введите почту в формате name@example.com.' },
  { id: 'msg', err: 'msgErr', test: v => v.trim().length >= 10, text: 'Напишите сообщение (минимум 10 символов).' }
];
form.addEventListener('submit', e => {
  e.preventDefault();
  let valid = true;
  rules.forEach(r => {
    const input = document.getElementById(r.id);
    const ok = r.test(input.value);
    input.classList.toggle('invalid', !ok);
    document.getElementById(r.err).textContent = ok ? '' : r.text;
    if (!ok) valid = false;
  });
  if (!valid) return;
  document.getElementById('ok').hidden = false;
  const body = `${document.getElementById('msg').value}\n\n— ${document.getElementById('name').value} (${document.getElementById('email').value})`;
  location.href = `mailto:zhao719347932@gmail.com?subject=${encodeURIComponent('Сообщение с портфолио')}&body=${encodeURIComponent(body)}`;
  form.reset();
});
