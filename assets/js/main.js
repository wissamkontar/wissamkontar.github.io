/* TALI website scripts: scroll fade-in, talk status labels, publication theme filters, project pop-up. */

const $ = (id) => document.getElementById(id);
const el = (tag, className, text) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
};
const link = (href, className, text) => {
  const a = el('a', className, text);
  a.href = href;
  a.target = '_blank';
  a.rel = 'noopener noreferrer';
  return a;
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

/* ── Publication lists: filter buttons, one per research theme (themes come from _data/themes.yml) ── */
const themes = JSON.parse($('themesData').textContent);
document.querySelectorAll('.pub-table').forEach((table) => {
  const rows = [...table.querySelectorAll('.pub-row')];
  const has = (row, id) => row.dataset.themes.split(' ').includes(id);
  const used = themes.filter((theme) => rows.some((row) => has(row, theme.id)));
  if (!used.length) return;

  const bar = el('div', 'theme-filter');
  const show = (id, button) => {
    rows.forEach((row) => { row.hidden = id !== '' && !has(row, id); });
    bar.querySelectorAll('button').forEach((other) => other.classList.toggle('active', other === button));
  };
  [{ id: '', name: 'All' }, ...used].forEach((theme) => {
    const button = el('button', 'theme-tag ' + (theme.id || 'all'), theme.name);
    button.type = 'button';
    button.addEventListener('click', () => show(theme.id, button));
    bar.append(button);
  });
  table.before(bar);
  show('', bar.firstChild);
});

/* ── Project pop-up, home page only (content comes from _data/projects.yml) ── */
const overlay = $('modalOverlay');
if (overlay) initProjectPopup();

function initProjectPopup() {
  const projects = JSON.parse($('projectsData').textContent);
  const gap = ' ' + String.fromCharCode(160);

  function openModal(card) {
    const p = projects.find((project) => project.id === card.dataset.project);
    if (!p) return;

    $('modalImage').innerHTML = card.querySelector('.card-image').innerHTML;
    $('modalBadge').textContent = p.badge;
    $('modalTitle').textContent = p.title;
    $('modalDesc').textContent = p.overview;

    $('modalMeta').replaceChildren(...[['Funder', p.funder], ['Period', p.period], ['PI', p.pi]].map(([label, value]) => {
      const item = el('div', 'modal-meta-item', label + gap);
      item.append(el('span', '', value));
      return item;
    }));

    $('modalHighlights').replaceChildren(...p.highlights.map((text) => el('li', '', text)));

    $('modalPubs').replaceChildren(...p.publications.map((pub) => {
      const item = el('div', 'modal-pub-item');
      const title = el('strong');
      title.append(pub.url ? link(pub.url, '', pub.title) : pub.title);
      item.append(title, pub.authors, el('div', 'modal-pub-venue', pub.venue));
      return item;
    }));

    const close = el('button', 'modal-btn modal-btn-ghost', 'Close');
    close.addEventListener('click', closeModal);
    const actions = [];
    if (p.project_url) actions.push(link(p.project_url, 'modal-btn modal-btn-primary', 'Project Page ↗'));
    if (p.paper_url) actions.push(link(p.paper_url, 'modal-btn modal-btn-ext', 'Read Paper ↗'));
    $('modalActions').replaceChildren(...actions, close);

    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('[data-project]').forEach((card) => {
    card.addEventListener('click', () => openModal(card));
  });
  $('modalClose').addEventListener('click', closeModal);
  overlay.addEventListener('click', (event) => { if (event.target === overlay) closeModal(); });
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeModal(); });
}
