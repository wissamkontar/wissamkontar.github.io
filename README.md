# TALI lab website

Live at https://wissamkontar.com. 

## Pages

| Page              | Address            | File                  |
| ----------------- | ------------------ | --------------------- |
| Home              | `/`                | `index.html`          |
| Research Projects | `/projects/`       | `projects.html`       |
| Publications      | `/publications/`   | `publications.html`   |
| Funding & Awards  | `/funding-awards/` | `funding-awards.html` |
| Team              | `/team/`           | `team.html`           |
| News              | `/news/`           | `news.html`           |

## Where things are

| To change…                             | Edit this file                 |
| -------------------------------------- | ------------------------------ |
| Research themes (text, order, figure)  | `_data/themes.yml`             |
| Research projects and funding          | `_data/projects.yml`           |
| Awards and recognition                 | `_data/awards.yml`             |
| Publications                           | `_data/publications.yml`       |
| Talks                                  | `_data/talks.yml`              |
| Other lab news                         | `_data/news.yml`               |
| Team members                           | `_data/team.yml`               |
| Theme drawings                         | `_includes/illustrations/`     |
| Email and profile links                | `_config.yml`                  |
| Home page sections and hero            | `index.html`                   |
| Layout of the research panels          | `_includes/research.html`      |
| Layout of a publication row            | `_includes/publication.html`   |
| Navigation bar and footer              | `_layouts/default.html`        |
| Colors, fonts, spacing                 | `assets/css/style.css`         |
| Theme colours and panel styling        | `assets/css/themes.css`        |
| Projects, funding, news and hero badge | `assets/css/pages.css`         |
| Filters and animations                 | `assets/js/main.js`            |
| Photos, logo and theme figures         | `images/`                      |

## Adding content

Copy an existing entry in the right `_data` file, paste it at the top, and change the text. Each file starts with a short note on its fields.

- Every publication appears on the full list at `/publications/`. Add `selected: true` to also show it on the home page, and `themes:` to label it with one or two research themes.
- A research theme shows its `image` when that file is in `images/`, and its `illustration` otherwise.
- The News page builds itself: funding comes from `projects.yml`, awards from `awards.yml`, past talks from `talks.yml`, and everything else from `news.yml`. Add each item once, in its own file.
- A project with a `sponsor` and an `awarded` date is listed on the Research Projects page, under Funding, and in News.
- A talk shows on the home page while it is upcoming and moves to News once its month has passed.
- A team member without a `photo` gets a placeholder avatar.
- A team member with `cite_as` is underlined in publication author lists.
