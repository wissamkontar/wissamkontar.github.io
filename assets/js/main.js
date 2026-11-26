/* TALI website scripts: scroll fade-in, upcoming and past talks, news filter, publication theme filters. */

const $ = (id) => document.getElementById(id);
const el = (tag, className, text) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
};
const query = new URLSearchParams(location.search);

/* Scroll fade-in */
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('visible');
    observer.unobserve(entry.target);
  });
}, { threshold: 0.1 });
document.querySelectorAll('.fade-in').forEach((node) => observer.observe(node));

/* Talks: the home page keeps this month's and future talks; the News page keeps the ones that have passed. */
const thisMonth = new Date().toISOString().slice(0, 7);
const timeline = $('talksTimeline');
if (timeline) {
  timeline.querySelectorAll('.talk-item').forEach((item) => {
    if (item.dataset.date < thisMonth) item.remove();
  });
  if (!timeline.querySelector('.talk-item')) {
    timeline.hidden = true;
    $('talksEmpty').hidden = false;
  }
}

/* News page: filter buttons. A link such as /news/?show=talk opens the page with that filter chosen. */
const feed = $('newsFeed');
if (feed) {
  feed.querySelectorAll('[data-talk-date]').forEach((row) => {
    if (row.dataset.talkDate >= thisMonth) row.remove();
  });
  const buttons = [...$('newsFilter').querySelectorAll('button')];
  const show = (cat) => {
    feed.querySelectorAll('.record').forEach((row) => { row.hidden = cat !== '' && row.dataset.cat !== cat; });
    feed.querySelectorAll('.news-year').forEach((group) => { group.hidden = !group.querySelector('.record:not([hidden])'); });
    buttons.forEach((button) => button.classList.toggle('active', button.dataset.cat === cat));
  };
  buttons.forEach((button) => button.addEventListener('click', () => show(button.dataset.cat)));
  const asked = query.get('show') || '';
  show(buttons.some((button) => button.dataset.cat === asked) ? asked : '');
}

/* Publication lists: filter buttons, one per research theme (themes come from _data/themes.yml).
   A link such as /publications/?theme=quantum opens the list with that theme already chosen. */
const themes = JSON.parse($('themesData').textContent);
const wanted = query.get('theme') || '';
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
