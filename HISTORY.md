# History

How the site got to where it is, newest first within each stage. Commit hashes are on `trunk`. Decisions that were
tried and reversed are listed on purpose, so nobody tries them again by accident.

## Stage 5: part of a family, tidied up (25 to 27 Oct 2026)

- **Logo and favicon (29 Oct 2026).** The "oof" icon from the `oofytronic/playlister` repo (`public/oof-icon.svg`) is now the
  nav logo (shown beside the name, and alone in the collapsed badge) and, recoloured sky blue on the dark ground, the
  favicon. Also fixed a horizontal overflow on narrow phones caused by the footer subscribe form.

- `c53bf75` **No flash on load.** A tiny inline script in each `<head>` chooses the motion mode before first paint,
  and floating islands start as `data-dock="away"`. Before this, islands showed briefly and then vanished.
- `717ee44` **Accent changed from brass to sky blue** (`--sky-400: #6fb3f2`, `--sky-600: #2f6fa8`), so the site no
  longer resembled the warm palette of the author site (rhsattaur). Tokens renamed from `brass-*` to `sky-*`.
- `e568d62` **Subscribe forms**: one in every footer and a docked island beside the article, driven by a new
  `past` trigger (appears once a marked point in the article has come into view). Posts to a `mailto:` for now.
  Tagline got its comma ("Ambient, Lighter-than-Air").
- `634dd2b` **Trimmed to one real article** plus "coming soon" placeholder cards and one placeholder project.
  Removed the two other example essays, the three example projects (Quill, Courier, Scribe), the topic filters
  (kept in the code, unused) and the next-essay island. New h1: "Writing on Building an Ambient Lighter-than-Air
  Future for Technology".
- `b959d57` Family dropdown now lists the **Feathermode family** (Feathermode, Common Tongue, Airlift, Oofytronic,
  Nimbus Nectar) and moves to the top right on phones (the nav is a bottom pill there).
- `6ec141a` Design-system page documents the **Stage** layout (used by Feathermode and motuALIS in an earlier
  form), "access, don't scroll".
- `2a7173e`, `aa7d60d` The **family island** first added: a `<details>` dropdown in the header, markup duplicated
  per site.

## Stage 4: docs, pages and the island architecture (23 Oct 2026)

- `8ffc832` Fixed the nav context label showing on phones (a later rule was overriding the hide).
- `7c50262` Added `design.md` and the About page; **every page moved to `folder/index.html`** so URLs have no
  `.html`.
- `742746a` **Zones**: island placement is defined once per zone in CSS; islands only name their zone.
- `4bbc19a` Projects section and page, the `/design-system/` page, and islands **declared by data attributes**
  instead of a hard-coded list in the script.

## Stage 3: the look settles (23 Oct 2026)

- `e36a6f4` Fixed missing bottom borders on notched boxes (fractional heights and percentage-sized mask layers
  dropped them; now a single mask layer minus four corner discs).
- `4ea2151` **Rounded corners replaced with concave "notched" corners** (arcs bitten out of the corners, drawn with
  a CSS mask and a stroked `::before`). Oofytronic keeps these; rhsattaur chose square corners, Feathermode and
  motuALIS chose slightly rounded ones.

## Stage 2: islands (23 Oct 2026)

- `359ac0d` Islands extended to articles: contents island, next-essay island, title as nav context.
- `bd6864d` Topic filter became a vertical gutter list; more side and vertical breathing room.
- `eeb631b` Filters docked as a floating island under the nav.
- `520290e` **Dynamic header islands**: the wordmark shrinks to an "O" badge and the nav boxes itself and shows a
  context label on scroll. Motion preference (footer toggle + `prefers-reduced-motion`) controls it.

## Stage 1: the first designs (23 Oct 2026)

- `fc2db82` **Restyled as restrained, editorial neoclassical.** The first version (`33f28da`) leaned on
  neo-medieval ornament (blackletter, fleurons, crests, double borders, Roman folios) and was rejected as
  "comical/novelty". The target became clean, laid out and royal in tone, with neo-feudalism as an *idea the
  writing explores*, not an interface style.
- `33f28da` First commit: the Oofytronic site with three example articles on decentralized, local-first, AI and
  automation topics.

## Things decided along the way

- All work happens on **`trunk`**; no Claude-created branches are published. An `experimental` branch will come
  when asked for.
- Semantic HTML, CSS custom properties and **functional (non-OO) JavaScript** are standing constraints.
- A **shared brand registry** for the family dropdown was deliberately skipped; each site hand-maintains its list.
- Reduced motion means the *static baseline*, not slower animation.

## Not done yet

See the to-do list at the top of `design.md`: zone-collision handling, real domains for the family members,
self-hosted fonts, removing duplicated header/footer markup, an `/articles/` index, a real newsletter provider, a
light theme.
