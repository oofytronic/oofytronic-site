// Functional helpers — small, pure, composed.
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const clamp = (min, max) => (n) => Math.min(max, Math.max(min, n));
const on = (event, handler) => (target) => (target.addEventListener(event, handler, { passive: true }), target);
const root = document.documentElement;

// ---------- Tag filtering ----------
const tagsOf = (el) => (el.dataset.tags ?? "").split(" ").filter(Boolean);
const matchesTag = (tag) => (el) => tag === "all" || tagsOf(el).includes(tag);
const setHidden = (hidden) => (el) => { el.hidden = hidden; return el; };
const applyFilter = (items) => (tag) =>
  items.forEach((item) => setHidden(!matchesTag(tag)(item))(item));
const setPressed = (buttons) => (tag) =>
  buttons.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.filter === tag)));

const countLabel = (visible, total) =>
  visible === total ? `${total} essays` : `${visible} of ${total} essays`;
const paintCount = (items) => {
  const status = $(".filters__count");
  if (status) status.textContent = countLabel(items.filter((el) => !el.hidden).length, items.length);
};

const initFilters = () => {
  const buttons = $$("[data-filter]");
  const items = $$("[data-tags]");
  if (!buttons.length) return;
  const select = (tag) => (applyFilter(items)(tag), setPressed(buttons)(tag), paintCount(items));
  buttons.forEach(on("click", (e) => select(e.currentTarget.dataset.filter)));
};

// ---------- Reading progress ----------
const scrollRatio = () => {
  const { scrollHeight, clientHeight } = root;
  const span = scrollHeight - clientHeight;
  return span > 0 ? clamp(0, 1)(window.scrollY / span) : 0;
};
const paintProgress = () => root.style.setProperty("--progress", scrollRatio());

const initProgress = () => {
  const bar = $(".progress");
  if (!bar) return;
  on("scroll", paintProgress)(window);
  paintProgress();
};

// ---------- Motion preference ----------
// "full" turns on the floating islands; "reduced" (or no JS) leaves a static page.
const STORAGE_KEY = "oofytronic:motion";
const readStored = () => { try { return localStorage.getItem(STORAGE_KEY); } catch { return null; } };
const writeStored = (value) => { try { localStorage.setItem(STORAGE_KEY, value); } catch { /* storage unavailable */ } };
const systemPrefersReduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const resolveMotion = (stored, systemReduced) => stored ?? (systemReduced ? "reduced" : "full");
const currentMotion = () => resolveMotion(readStored(), systemPrefersReduced());

// ---------- Islands: pure state calculations ----------
const isScrolled = (y, threshold = 48) => y > threshold;
// Index of the last target whose top edge has passed the reading line (-1 = none yet).
const activeIndex = (tops, line) => tops.reduce((active, top, i) => (top <= line ? i : active), -1);
const labelOf = (el) => el?.dataset.context ?? el?.textContent.trim() ?? "";
const hashOf = (a) => new URL(a.href, location.href).hash;

// A short final section may never reach the reading line, so the page end selects the last target.
const islandState = ({ y, tops, line, atEnd }) => ({
  scrolled: isScrolled(y),
  index: atEnd ? tops.length - 1 : activeIndex(tops, line),
});

// ---------- Floating islands: pure visibility rules ----------
// Each rule takes the target's rect plus viewport height and returns "docked" or "away".
const inBand = ({ top, bottom, viewport }) =>
  top <= viewport * 0.6 && bottom >= viewport * 0.4 ? "docked" : "away"; // target overlaps the middle band
const nearEnd = ({ bottom, viewport }) =>
  bottom <= viewport * 0.85 ? "docked" : "away"; // the end of the target is approaching

const FLOATING = [
  { selector: ".filters", target: "#writing", rule: inBand },
  { selector: ".toc", target: ".article__body", rule: inBand },
  { selector: ".next-island", target: ".article__body", rule: nearEnd },
];

// ---------- Islands: DOM effects ----------
const setFlag = (name) => (on_) => on_ ? root.setAttribute(name, "") : root.removeAttribute(name);
const setScrolled = setFlag("data-scrolled");
const setContextOpen = setFlag("data-context-open");

const paintContext = (slot) => (label) => {
  if (label) slot.textContent = label; // keep old text while the slot collapses
  setContextOpen(Boolean(label));
};
const paintCurrent = (links) => (target) =>
  links.forEach((a) =>
    target?.id && hashOf(a) === `#${target.id}`
      ? a.setAttribute("aria-current", "location")
      : a.removeAttribute("aria-current"));

const initFloating = () =>
  FLOATING.flatMap(({ selector, target, rule }) => {
    const el = $(selector);
    const anchor = $(target);
    if (!el || !anchor) return [];
    const setDock = (state) => { el.dataset.dock = state; };
    const measure = () => {
      const { top, bottom } = anchor.getBoundingClientRect();
      return { top, bottom, viewport: window.innerHeight };
    };
    return [{ update: () => setDock(rule(measure())), reset: () => setDock("flow") }];
  });

// Highlight the contents link for the heading currently being read.
const initContents = () => {
  const links = $$(".toc__list a");
  const headings = links.map((a) => $(hashOf(a)));
  if (!links.length) return { update: () => {}, reset: () => {} };
  const mark = (index) =>
    links.forEach((a, i) => i === index ? a.setAttribute("aria-current", "location") : a.removeAttribute("aria-current"));
  return {
    update: ({ tops, line, atEnd }) => mark(atEnd ? headings.length - 1 : activeIndex(headings.map((h) => h.getBoundingClientRect().top), line)),
    reset: () => mark(-1),
  };
};

const initIslands = () => {
  const floats = initFloating();
  const contents = initContents();
  const slot = $(".island__context > span");
  const links = $$(".island li a");
  const targets = $$("[data-context]");
  const measure = () => ({
    y: window.scrollY,
    tops: targets.map((el) => el.getBoundingClientRect().top),
    line: window.innerHeight * 0.3,
    atEnd: window.scrollY + window.innerHeight >= root.scrollHeight - 2,
  });
  const update = () => {
    const reading = measure();
    const state = islandState(reading);
    const target = targets[state.index];
    setScrolled(state.scrolled);
    paintContext(slot)(state.scrolled ? labelOf(target) : "");
    paintCurrent(links)(target);
    floats.forEach((f) => f.update());
    contents.update(reading);
  };
  let frame = 0;
  const schedule = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(update); };
  const listen = () => (["scroll", "resize"].forEach((e) => window.addEventListener(e, schedule, { passive: true })), update());
  const stop = () => (["scroll", "resize"].forEach((e) => window.removeEventListener(e, schedule)), setScrolled(false), setContextOpen(false), paintCurrent(links)(null), floats.forEach((f) => f.reset()), contents.reset());
  return { start: listen, stop };
};

const initMotion = () => {
  const islands = initIslands();
  const toggle = $("[data-motion-toggle]");
  const apply = (motion) => {
    root.dataset.motion = motion;
    (motion === "full" ? islands.start : islands.stop)();
    toggle?.setAttribute("aria-pressed", String(motion === "reduced"));
  };
  apply(currentMotion());
  if (toggle) {
    toggle.hidden = false;
    on("click", () => {
      const next = root.dataset.motion === "full" ? "reduced" : "full";
      writeStored(next);
      apply(next);
    })(toggle);
  }
  // Follow the OS setting live, unless the visitor has chosen explicitly.
  on("change", () => readStored() === null && apply(currentMotion()))(window.matchMedia("(prefers-reduced-motion: reduce)"));
};

[initFilters, initProgress, initMotion].forEach((init) => init());
