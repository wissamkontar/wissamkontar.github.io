# TALI lab website

Live at https://wissamkontar.github.io. GitHub Pages rebuilds the site automatically a minute or two after every change.

## Where things are

| To change…                            | Edit this file                 |
| ------------------------------------- | ------------------------------ |
| Research themes (text, order, figure) | `_data/themes.yml`             |
| Publications                          | `_data/publications.yml`       |
| Talks                                 | `_data/talks.yml`              |
| News                                  | `_data/news.yml`               |
| Team members                          | `_data/team.yml`               |
| Theme drawings                        | `_includes/illustrations/`     |
| Email and profile links               | `_config.yml`                  |
| Home page sections, hero, PI bio      | `index.html`                   |
| Layout of the research panels         | `_includes/research.html`      |
| Layout of a publication row           | `_includes/publication.html`   |
| Full publication list page            | `publications.html`            |
| Navigation bar and footer             | `_layouts/default.html`        |
| Colors, fonts, spacing                | `assets/css/style.css`         |
| Theme colours and panel styling       | `assets/css/themes.css`        |
| Filters and animations                | `assets/js/main.js`            |
| Photos, logo and theme figures        | `images/`                      |

## Adding content

Copy an existing entry in the right `_data` file, paste it at the top, and change the text. Each file starts with a short note on its fields.

- Every publication appears on the full list at `/publications/`. Add `selected: true` to also show it on the home page, and `themes:` to label it with one or two research themes.
- A research theme shows its `image` when that file is in `images/`, and its `illustration` otherwise.
- Talks are labelled Upcoming or Past automatically from their date.
- A team member without a `photo` gets a placeholder avatar.
- A team member with `cite_as` is underlined in publication author lists.
