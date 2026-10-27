# Oofytronic

A personal technology blog: essays on local-first software, peer-to-peer networks, cryptography, automation and AI.
The home page is headed *"Writing on Building an Ambient, Lighter-than-Air Future for Technology"*.

It is also the reference implementation of a small **design system built on "islands"**: floating, context-aware
panels (the wordmark, the nav, a contents list, a subscribe box) that appear, shrink or move as you scroll. The
other sites in the family (Feathermode, motuALIS, rhsattaur) reuse this system.

- Static HTML, CSS and vanilla JavaScript. **No build step, no framework, no dependencies.**
- Works with JavaScript off and with reduced motion (it falls back to an ordinary scrolling page).
- Live address recorded for this repo: `https://oofytronic-site.vercel.app`.

## Quick start

```sh
git clone https://github.com/oofytronic/oofytronic-site
cd oofytronic-site
python3 -m http.server 8000      # any static server works
# open http://localhost:8000/
```

Pages are folders with an `index.html` (`/about/`, `/articles/local-first/`), so you need a static server, not
`file://`. Deploying is "serve the repo root"; there is nothing to build.

## What is where

```
index.html                  home: hero, latest writing, projects, about teaser
about/index.html            about page (contents island)
projects/index.html         projects page (one placeholder for now)
design-system/index.html    the live design-system reference (tokens are read from the CSS)
articles/local-first/       the one real article (contents island + subscribe island)
css/tokens.css              every colour, size and space value (edit design here)
css/style.css               all styles, in labelled sections (Zones, Header, Cards, Article, ...)
js/main.js                  islands, triggers, motion preference, filters, family dropdown
design.md                   decisions, the why, and the open to-do list
HISTORY.md                  what changed and when
AGENTS.md                   notes for AI agents / new contributors
```

## How it works (in one minute)

- **Islands** are declared in markup: `data-island` (name), `data-zone` (where), `data-trigger` (rule),
  `data-target` (what the rule measures), `data-dock` (state). `js/main.js` reads them; there is no list in the
  script. Zones (`top-left`, `top-center`, `top-right`, `left`, `right`) are placed once in the **Zones** section of
  `css/style.css`.
- **Triggers** are pure functions of measurements: `scrolled`, `band`, `past`, `near-end`, `always`, plus scrollspy.
  `/design-system/` documents each one.
- **Motion modes.** `html[data-motion="full"]` turns the floating layout on; `"reduced"` is the static baseline.
  The mode comes from the footer toggle (stored in `localStorage` under `oofytronic:motion`) or from
  `prefers-reduced-motion`. A small inline script in every page's `<head>` sets it *before first paint*, and
  floating islands start as `data-dock="away"`, so islands never flash on load. If you add a page, copy that
  script and the `data-dock="away"` default.
- **Look.** Warm near-black ground, warm cream text, one **sky-blue** accent (`--sky-400`), Cormorant Garamond /
  Inter / Newsreader from Google Fonts, hairline borders instead of shadows, and **notched corners** (concave
  quarter-circle bites made with a CSS mask; see "Notched corners" in `css/style.css`).

## Common tasks

| I want to… | Do this |
| --- | --- |
| Add an article | Copy `articles/local-first/` to `articles/<slug>/`, edit it, add a card to the grid in `index.html`. Keep the `data-subscribe-cue` attribute on a heading about halfway down. If there is a next article, add a `next-island` (see `/design-system/`). |
| Add a page | New `folder/index.html`; copy the header, footer and `<head>` (including the inline motion script) from `about/index.html`; add the nav link in every page. |
| Change a colour or size | Edit `css/tokens.css` only. |
| Change the family dropdown | Hand-edit the `<details class="family">` block in the header of **every** page (the list is duplicated by design; a shared registry was deliberately skipped). |
| Make subscribe really work | The forms post to a `mailto:` (`hello@feathermode.com`). Point their `action` at a newsletter provider. Both forms are in the article and in every footer. |

## Conventions

Semantic HTML; CSS custom properties for every design value; JavaScript in a functional style (small pure
functions, no classes); presentation lives in CSS and is driven by data attributes; progressive enhancement; no
analytics, ads or cookies (the only stored value is the motion preference). Details and the reasons are in
`design.md`.

## Workflow

- Work on **`trunk`**. No other branches are published. An `experimental` branch will be created when wanted.
- Commit messages are plain descriptions; automated work adds a co-author trailer.
- Test in a real browser at about 1440, 1100, 900 and 390 px wide, with and without reduced motion. The layout
  has only been checked in headless Chromium, not on real devices, other browsers or a screen reader.

## Things to know

- Header, footer and family markup are copied into every page; edits must be repeated. (Removing the duplication
  is on the to-do list.)
- There is no generator in the repo. Earlier versions were produced with throwaway scripts; do not look for one.
- Fonts load from Google Fonts (the one third-party request). Self-hosting is on the to-do list.
- The About page is written only from the site's themes; the second and third writing cards and the project are
  placeholders.

See `design.md` for the open to-do list and `HISTORY.md` for how the site got here.
