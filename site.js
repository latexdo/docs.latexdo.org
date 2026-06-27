const searchInput = document.querySelector("#docs-search");
const searchableSections = Array.from(document.querySelectorAll("[data-search]"));
const navLinks = Array.from(document.querySelectorAll(".toc-link"));
const copyButtons = Array.from(document.querySelectorAll("[data-copy]"));

function normalize(value) {
  return value.trim().toLowerCase();
}

function updateSearch() {
  const query = normalize(searchInput?.value ?? "");
  const tokens = query.split(/\s+/).filter(Boolean);

  searchableSections.forEach((section) => {
    const haystack = normalize(section.textContent ?? "");
    const matches = tokens.every((token) => haystack.includes(token));
    section.classList.toggle("is-filtered", tokens.length > 0 && !matches);
  });
}

function updateActiveNav() {
  const visibleHeadings = navLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  let activeId = visibleHeadings[0]?.id;
  for (const heading of visibleHeadings) {
    if (heading.getBoundingClientRect().top <= 120) {
      activeId = heading.id;
    }
  }

  navLinks.forEach((link) => {
    const href = link.getAttribute("href") ?? "";
    link.classList.toggle("active", href === `#${activeId}`);
  });
}

searchInput?.addEventListener("input", updateSearch);
window.addEventListener("scroll", updateActiveNav, { passive: true });
window.addEventListener("hashchange", updateActiveNav);
updateActiveNav();

copyButtons.forEach((button) => {
  button.addEventListener("click", async () => {
    const target = document.querySelector(button.getAttribute("data-copy") ?? "");
    const text = target?.textContent?.trim();
    if (!text || !navigator.clipboard) return;

    const original = button.textContent;
    try {
      await navigator.clipboard.writeText(text);
      button.textContent = "Copied";
      window.setTimeout(() => {
        button.textContent = original;
      }, 1200);
    } catch {
      button.textContent = "Copy failed";
      window.setTimeout(() => {
        button.textContent = original;
      }, 1200);
    }
  });
});
