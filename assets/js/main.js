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

/* Research Products page: ask GitHub for the account's public repositories and add a card for any
   that is not listed in _data/products.yml yet, so a new repository shows up without editing the site. */
const productGrid = $('productGrid');
if (productGrid) {
  const listed = new Set([...productGrid.querySelectorAll('[data-repo]')].map((card) => card.dataset.repo));
  productGrid.dataset.hidden.split(' ').filter(Boolean).forEach((name) => listed.add(name));
  const user = productGrid.dataset.user;
  fetch('https://api.github.com/users/' + user + '/repos?per_page=100&sort=created')
    .then((response) => (response.ok ? response.json() : []))
    .then((repos) => {
      repos.filter((repo) => !repo.fork && !repo.archived && !repo.private && !listed.has(repo.name)).forEach((repo) => {
        const card = el('a', 'product-card');
        card.href = repo.html_url;
        card.target = '_blank';
        card.rel = 'noopener noreferrer';
        card.dataset.repo = repo.name;
        const foot = el('div', 'product-foot');
        if (repo.language) foot.append(el('span', 'product-lang', repo.language));
        foot.append(el('span', 'product-go', 'View on GitHub →'));
        card.append(
          el('div', 'product-kind', 'New repository'),
          el('h3', 'product-name', repo.name.replace(/[-_]+/g, ' ').trim()),
          el('p', 'product-summary', repo.description || 'Recently added. A description is on its way.'),
          foot,
        );
        productGrid.append(card);
      });
    })
    .catch(() => {});
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
