# TALI lab website

Live at https://wissamkontar.github.io. GitHub Pages rebuilds the site automatically a minute or two after every change.

## Where things are

| To change…                        | Edit this file              |
| --------------------------------- | --------------------------- |
| Publications                      | `_data/publications.yml`    |
| Talks                             | `_data/talks.yml`           |
| News                              | `_data/news.yml`            |
| Team members                      | `_data/team.yml`            |
| Research projects                 | `_data/projects.yml`        |
| Project drawings                  | `_includes/illustrations/`  |
| Email and profile links           | `_config.yml`               |
| Home page sections, hero, PI bio  | `index.html`                |
| Full publication list page        | `publications.html`         |
| Navigation bar and footer         | `_layouts/default.html`     |
| Colors, fonts, spacing            | `assets/css/style.css`      |
| Pop-ups and animations            | `assets/js/main.js`         |
| Photos and logo                   | `images/`                   |

## Adding content

Copy an existing entry in the right `_data` file, paste it at the top, and change the text. Each file starts with a short note on its fields.

- Every publication appears on the full list at `/publications/`. Add `selected: true` to also show it on the home page.
- Talks are labelled Upcoming or Past automatically from their date.
- A team member without a `photo` gets a placeholder avatar.
- A new research project needs an entry in `_data/projects.yml` and a drawing named `<id>.svg` in `_includes/illustrations/`.
