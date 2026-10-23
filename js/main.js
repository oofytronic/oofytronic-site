// Functional helpers — small, pure, composed.
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const clamp = (min, max) => (n) => Math.min(max, Math.max(min, n));
const on = (event, handler) => (target) => (target.addEventListener(event, handler, { passive: true }), target);

// ---------- Tag filtering ----------
const tagsOf = (el) => (el.dataset.tags ?? "").split(" ").filter(Boolean);
const matchesTag = (tag) => (el) => tag === "all" || tagsOf(el).includes(tag);
const setHidden = (hidden) => (el) => { el.hidden = hidden; return el; };
const applyFilter = (items) => (tag) =>
  items.forEach((item) => setHidden(!matchesTag(tag)(item))(item));
const setPressed = (buttons) => (tag) =>
  buttons.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.filter === tag)));

const initFilters = () => {
  const buttons = $$("[data-filter]");
  const items = $$("[data-tags]");
  if (!buttons.length) return;
  const select = (tag) => (applyFilter(items)(tag), setPressed(buttons)(tag));
  buttons.forEach(on("click", (e) => select(e.currentTarget.dataset.filter)));
};

// ---------- Reading progress ----------
const scrollRatio = () => {
  const { scrollHeight, clientHeight } = document.documentElement;
  const span = scrollHeight - clientHeight;
  return span > 0 ? clamp(0, 1)(window.scrollY / span) : 0;
};
const paintProgress = (bar) => () => bar.style.setProperty("--progress", scrollRatio());

const initProgress = () => {
  const bar = $(".progress");
  if (!bar) return;
  on("scroll", paintProgress(bar))(window);
  paintProgress(bar)();
};

[initFilters, initProgress].forEach((init) => init());
