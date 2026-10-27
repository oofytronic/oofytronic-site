# Notes for agents and new contributors

Read `README.md` first, then the "Islands" and "Visual system" sections of `design.md`. This file is the short list
of rules and traps.

## Rules

1. **Branch:** work on `trunk` and push to `trunk`. Do not publish other branches. Do not open pull requests unless
   asked.
2. **No build tooling.** No bundler, framework, package manager or generated files. Edit the HTML, CSS and JS
   directly.
3. **Semantic HTML**, **CSS custom properties** for every design value (edit `css/tokens.css`, never hard-code a
   colour in a rule), **functional JavaScript** (small pure functions, no classes).
4. **Progressive enhancement.** Every page must work with JavaScript off and with `prefers-reduced-motion`. Islands
   are an enhancement over in-flow blocks, and they are one element with two presentations (never duplicate a
   control).
5. **Accessibility.** Keep focus styles, `aria-current`, the polite live region for counts, and the "away" island
   state (`visibility: hidden`) that removes hidden islands from the tab order.
6. **Corners are notched, never rounded.** Do not add `border-radius` to boxes; use the `.notched` family of
   classes.
7. **No analytics, ads or cookies.** The only stored value is the motion preference.

## Traps

- Header, footer and family dropdown markup are **duplicated in every page**. A change must be made in all of
  them: `index.html`, `about/`, `projects/`, `design-system/`, `articles/*/`.
- Every page needs the **inline `<script>` in `<head>`** that sets `data-motion` before paint, and floating islands
  need `data-dock="away"` in markup. Without them, islands flash on load.
- CSS order matters. A later base rule can silently override an earlier media-query rule with the same
  specificity (this has caused two regressions). When a rule "does nothing", check what comes after it.
- Do not run an old generator script if you find one in a scratch folder: they overwrite hand-edited pages.
- `localStorage` access must stay inside try/catch (private windows throw).
- The design-system page shows token values read live from the cascade; when you rename a token, update the list
  in `design-system/index.html` too.

## Checking your work

Serve the folder (`python3 -m http.server`) and check at about 1440, 1100, 900 and 390 px wide, scrolled to the
top and the middle of an article, with and without reduced motion, and with JavaScript disabled. Crawl internal
links. Headless Chromium (Playwright) was used for all checks so far; no real devices.

## Related sites

Feathermode (parent), motuALIS (one-screen LLC page) and rhsattaur (author site) are separate repositories that
reuse this system. Their copies of the CSS and JS have diverged on purpose (palette, type, corners, trimmed
features). There is no shared package yet.
