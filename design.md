# Design decisions

The running record of decisions made for the Oofytronic site. The live reference for tokens, islands and
components is the design-system page (`/design-system/`), whose token values are read straight from
`css/tokens.css`. This file holds the *why* and the open work; if the two disagree, the code wins and this
file should be corrected.

## To do

- [ ] **Subscribe needs a real list.** The footer form and the article island post to a `mailto:` address
  (`hello@feathermode.com`, subject "Subscribe to Oofytronic"), so submitting opens the visitor's mail app.
  Connect a newsletter provider and point the forms' `action` at it.
- [ ] **Zone collisions.** Detect overlap between islands that share a zone, or stack them, so two islands can
  safely occupy one zone. Today "one island per zone is visible at a time" is a documented rule that holds
  only because islands in the same zone appear on different pages. Nothing enforces it.

Raised along the way, not yet scheduled:

- [ ] Brand registry (deliberately skipped for now): one data file feeding the family island and portfolio
  lists, so a new product is one entry instead of edits in every site's header.
- [ ] Set the real domains for Oofytronic, Aerodash, Gondola and Nimbus Nectar in the family island once they exist.
- [ ] Drive the header zones (`top-left`, `top-right`) fully from the Zones CSS. They currently control only
  alignment and the phone behaviour; the wordmark and nav keep their own scroll-state styling.
- [ ] Try `corner-shape: scoop` (with `border-radius`) as a progressive enhancement over the mask-based notched
  corners, keeping the mask as the fallback. Check browser support first.
- [ ] Self-host the fonts (Cormorant Garamond, Inter, Newsreader). They load from Google Fonts today, which is
  the one third-party request on the site.
- [ ] Remove the duplicated header and footer markup (copied across every page) with a small generator or
  another approach that keeps pages working without JavaScript.
- [ ] Fill the placeholders: the home page has one real article (Sovereign Software) plus two "coming soon"
  cards and one "coming soon" project, and the Projects page has one placeholder entry. The About page is
  written only from what is known about the site's themes.
- [ ] Add an `/articles/` index page. Article URLs are folders, so `/articles/` itself currently has nothing.
- [ ] Create the `experimental` branch when it is wanted (see Workflow).
- [ ] Consider a light theme. The site is dark only.

## Purpose and voice

- A personal site for articles and projects under the name **Oofytronic**, on decentralized, distributed,
  local-first, peer-to-peer, crypto/web3, automation and AI technology.
- The look is **restrained neoclassical editorial**, not costume. An early medieval-ornament version (blackletter,
  fleurons, crests, double borders, Roman folios) was rejected as novelty. The target is clean, laid out and
  royal in tone, in the way Venice AI's homepage is described. (That reference was not viewable from the build
  environment, so it is remembered, not measured.)
- Neo-feudal / neo-medieval is an *idea* the writing explores (platforms as manors), not an interface style.

## Engineering principles

- Plain **semantic HTML**, **CSS custom properties** for every design value, and **vanilla JavaScript in a
  functional style** (small pure functions, composition, no classes). No framework, no build step.
- **Progressive enhancement.** Every page works with no JavaScript and with motion reduced; dynamic behaviour is
  layered on top.
- Presentation lives in CSS and is driven by data attributes on `<html>` and on islands. JavaScript computes
  state; it does not style.
- No analytics, ads or cookies. The only stored value is the visitor's motion preference (`localStorage`).

## Visual system

All values live in `css/tokens.css`.

- **Colour.** Warm near-black ground, warm cream text, and a single **sky-blue** accent used sparingly: labels, the
  active item, hover. Pigments are `--night-950..700`, `--cream-100/300`, `--stone-500`, `--sky-400/600`;
  roles (`--bg`, `--surface`, `--text`, `--accent`, `--hairline`, …) are built from them.
- **Type.** Cormorant Garamond for display (headlines, wordmark), Inter for interface and metadata, Newsreader
  for long-form reading. A seven-step scale (`--step--2` to `--step-4`).
- **Space.** A seven-step scale (`--space-1` to `--space-7`) and a generous `--section-space` between sections.
- **Lines, not shadows.** One-pixel hairlines (`--hairline`, `--hairline-strong`). No drop shadows.
- **Corners are never rounded.** They are square, or **notched**: a concave quarter-circle bite cut with a
  mask, with the border stroked along the arc (`.notched`, `--notch-sm`, `--notch-lg`). Pills and rounded
  buttons were removed everywhere.
- **Whitespace.** Sections are given extra height in dynamic mode so scroll triggers have room to fire.
- **Measure.** Reading column `--measure` (40rem); wider pages `--measure-wide` (48rem); content shell `--wrap`
  (80rem).

## Islands

The layout is built from **islands**: small, self-contained pieces of interface that appear, shrink or move as
the visitor scrolls. The aim is a strict, structured end state for this pattern, not one-off effects.

- **One element, two presentations.** An island is a single DOM element: an in-flow block when static, a
  floating panel when dynamic. Controls are never duplicated.
- **Declared in markup.** `data-island` (name), `data-zone` (where), `data-trigger` (rule), `data-target`
  (what the rule measures), optional `data-anchor`. The script reads these; there is no hard-coded list.
- **States.** `data-dock` is `flow` (in place), `docked` (floating, visible) or `away` (floating, hidden,
  out of the tab order and accessibility tree).
- **Triggers** are pure functions of measurements: `scrolled` (past 48px), `always` (docked whenever dynamic), `band` (target overlaps the middle
  40–60% of the viewport), `near-end` (target bottom above 85% of the viewport), plus scrollspy (reading line
  at 30%; the page end selects the last target).
- **Zones**, defined once in the Zones section of `css/style.css`. Islands only name their zone.

  | Zone | 70rem and up | Below 70rem | Used by |
  | --- | --- | --- | --- |
  | `top-left` | Header, left edge | Same | Wordmark |
  | `top-center` | Header, centred | Same; header right edge on phones (the nav is at the bottom then) | Family |
  | `top-right` | Header, right edge | Same; bottom pill on phones (40rem) | Nav |
  | `left` | Left gutter, just under the header | In flow | Contents |
  | `right` | Right gutter (`data-anchor="middle"` centres it) | Bottom pill | Filters, Next essay |

- **Island registry.**
  - *Family*: a `<details>` dropdown in the header listing every member of the Feathermode family and marking
    the current one. Native open/close (works with no JavaScript); the script only closes it on outside click
    or Escape. Boxes on scroll like the nav.
  - *Wordmark*: the "oof" icon plus the name; collapses to the bare icon (no box or border) on scroll.
  - *Nav*: Writing / Projects / About; boxes on scroll and shows a context label (the section or article being
    read) with scrollspy highlighting.
  - *Filters*: topic list with a live count, shown while a writing list is on screen. Defined and styled, but
    not in use now (the home page has only one article); `js/main.js` still handles it if it is added back.
  - *Contents* (articles, projects, about, design system): section list with a reading-progress meter.
  - *Subscribe* (articles): an email form in the right gutter that docks once a marked point in the article
    (`[data-subscribe-cue]`) has come into view (trigger `past`) and stays until the reader scrolls back above
    it. Hidden under 70rem and in the static layout, where the footer form is the way to subscribe.
  - *Next essay* (articles): appears as the end of the article approaches.
- **Gutters.** From 70rem up, sections get `--gutter` (14rem) of side padding so islands sit beside content and
  never on top of it.
- **No flash on load.** A tiny inline script in each page's `<head>` sets `html[data-motion]` from the stored choice or the OS setting before the first paint, and floating islands start as `data-dock="away"` in the markup, so an island never shows up and then disappears. Only an island whose trigger is already satisfied fades in.
- **Motion and access.** The page follows `prefers-reduced-motion` live; the footer toggle overrides it and is
  remembered. Reduced motion means the static baseline (nothing floats, nothing changes on scroll), not slower
  animation. Context text inside islands is `aria-hidden` because it repeats the page; the filter count is a
  polite live region. Anchor jumps leave room for the islands (`scroll-padding`).

## Stage (for sites whose content is not long-form text)

The design system has a second layout for content that is not long-form text. The rule is **access, don't
scroll**: long-form text scrolls; everything else is reached, not scrolled to.

- The page becomes a fixed **stage** of full-screen **scenes**. Landscape moves along x (like film frames),
  portrait along y (like a reel). The page itself never scrolls.
- Multiple items in one scene (platforms, principles) become a **picker**: a tablist chooses, one panel shows.
- The islands are the HUD. The wordmark collapses after the title scene, the nav names the scene, and the
  contents island becomes the **scene list** (`data-trigger="always"`): a left gutter list at 70rem and up, a
  numbered dock with previous/next buttons below that.
- Controls: arrow keys, Page Up/Down, Home/End, wheel (one scene per burst), swipe (48px), scene list, dock,
  step buttons, `#scene` links and deep links. Arrows inside a picker move tabs, not scenes.
- **Access.** It is an enhancement: with JavaScript off, or `prefers-reduced-motion`, or after the first-tab
  "use the scrolling layout" button or the footer toggle, the same markup is an ordinary scrolling page.
  Inactive scenes are `inert`; a polite live region announces the scene; focus moves to the scene heading on
  link navigation; the stage cannot be scrolled by a `#fragment` jump (`overflow: clip` plus a scroll reset).
- **Fit.** Type follows viewport height as well as width. On short screens secondary text (intros, notes, tags)
  is visually hidden but stays available to assistive technology. Tested to fit with no scrolling from 360x640
  phones to 1920x1080 monitors; a scene may scroll inside itself on a landscape phone.
- Oofytronic itself is long-form, so it scrolls. Feathermode uses the stage. The implementation lives in the
  `feathermode-web` repository (`js/main.js`: `initStage`, `initPickers`; `css/style.css`: "Stage").

## The Feathermode family

Oofytronic is one member of a family under **Feathermode** (the parent; legal entity motuALIS, LLC, doing
business as Feathermode). Members, in dropdown order: Feathermode (parent), Aerodash (the everything app),
Gondola (distribution, a mini-app inside Aerodash), Oofytronic (this personal blog) and Nimbus Nectar (a publication from Feathermode, to be
spun up). Everything but Feathermode and Oofytronic shows as "Soon". Aerodash and Gondola are working
names.

- The parent is quiet and institutional; each product has its own domain and its own look.
- Shared across the family: this design system's grammar (spacing, hairlines, islands, zones, accessibility).
  Free per brand: accent colours, typeface, corner shape. Oofytronic is sky blue, serif, notched; Feathermode is
  cyan/violet, Urbanist, slightly rounded.
- The dropdown sits top centre, and top right on phones (the nav is a bottom pill there, so the corner is free).
- The family island's member list is **hand-maintained markup in each site**. A shared brand registry was
  deliberately skipped for now.
- The full family and naming write-up lives in the `feathermode-web` repository's `design.md`.

## Pages and URLs

- Every page is a folder containing an `index.html`, so URLs have no `.html`: `/`, `/about/`, `/projects/`,
  `/design-system/`, `/articles/<slug>/`. Directory URLs need a static server or host; opening files straight
  from disk will not follow them.
- **Home**: hero (the tagline is the h1: "Writing on Building an Ambient Lighter-than-Air Future for
  Technology"), latest writing (one article and two dimmed "coming soon" cards, `.card--placeholder`),
  projects (one placeholder row), about teaser.
- **Articles**: header, contents island, body, next-essay island (only when there is a next essay). One
  article so far.
- **Projects**: one full-height section per project, each linking to the related essay. One placeholder for now.
- **About**: introduction, topics, principles, notes on the site.
- **Design system**: principles, islands (zones, states, triggers, registry, contract), colour, type, space and
  shape, components.

## Workflow

- All work goes on **`trunk`**. No Claude-created branches are published to the repository.
- An **`experimental`** branch will be added later, when asked for.
- Commits carry the Claude co-author trailer requested by the environment.

## Known limits

- Layout and behaviour were checked in headless Chromium at 1280, 1120, 900 and 390px, plus reduced motion;
  not on real devices, other browsers, or with a screen reader.
- Trigger thresholds (48px, 40–60%, 85%, 30%) were tuned by eye.
- Keyboard users cannot reach an island that is `away` until it fades in; the footer toggle gives them the
  static layout.
