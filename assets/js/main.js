/* TALI website scripts: scroll fade-in, talk status labels, publication theme filters. */

const $ = (id) => document.getElementById(id);
const el = (tag, className, text) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
};

/* ── Scroll fade-in ── */
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('visible');
    observer.unobserve(entry.target);
  });
}, { threshold: 0.1 });
document.querySelectorAll('.fade-in').forEach((node) => observer.observe(node));

/* ── Talks: mark this month's and future talks as upcoming ── */
const thisMonth = new Date().toISOString().slice(0, 7);
document.querySelectorAll('.talk-item').forEach((item) => {
  if (item.dataset.date < thisMonth) return;
  item.classList.add('upcoming');
  const badge = item.querySelector('[data-status]');
  badge.className = 'talk-badge upcoming';
  badge.textContent = 'Upcoming';
});

/* ── Publication lists: filter buttons, one per research theme (themes come from _data/themes.yml).
      A link such as /publications/?theme=quantum opens the list with that theme already chosen. ── */
const themes = JSON.parse($('themesData').textContent);
const wanted = new URLSearchParams(location.search).get('theme') || '';
document.querySelectorAll('.pub-table').forEach((table) => {
  const rows = [...table.querySelectorAll('.pub-row')];
  const has = (row, id) => row.dataset.themes.split(' ').includes(id);
  const used = themes.filter((theme) => rows.some((row) => has(row, theme.id)));
  if (!used.length) return;

  const bar = el('div', 'theme-filter');
  const show = (button) => {
    const id = button.dataset.theme;
    rows.forEach((row) => { row.hidden = id !== '' && !has(row, id); });
    bar.querySelectorAll('button').forEach((other) => other.classList.toggle('active', other === button));
  };
  [{ id: '', name: 'All' }, ...used].forEach((theme) => {
    const button = el('button', 'theme-tag theme-' + (theme.id || 'all'), theme.name);
    button.type = 'button';
    button.dataset.theme = theme.id;
    button.addEventListener('click', () => show(button));
    bar.append(button);
  });
  table.before(bar);
  show([...bar.children].find((button) => button.dataset.theme === wanted) || bar.firstChild);
});
