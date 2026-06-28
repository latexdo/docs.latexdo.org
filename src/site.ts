(() => {
  type Theme = "white" | "black";

  const THEME_STORAGE_KEY = "latexdo.docs.theme";
  const themes: readonly Theme[] = ["white", "black"];

  const root = document.documentElement;
  const searchInput = document.querySelector<HTMLInputElement>("#docs-search");
  const searchableSections = Array.from(
    document.querySelectorAll<HTMLElement>("[data-search]"),
  );
  const navLinks = Array.from(
    document.querySelectorAll<HTMLAnchorElement>(".toc-link"),
  );
  const copyButtons = Array.from(
    document.querySelectorAll<HTMLButtonElement>("[data-copy]"),
  );
  const themeButtons = Array.from(
    document.querySelectorAll<HTMLButtonElement>("[data-theme-choice]"),
  );

  function normalize(value: string): string {
    return value.trim().toLowerCase();
  }

  function isTheme(value: string | null | undefined): value is Theme {
    return themes.includes(value as Theme);
  }

  function readStoredTheme(): Theme | null {
    try {
      const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
      return isTheme(storedTheme) ? storedTheme : null;
    } catch {
      return null;
    }
  }

  function writeStoredTheme(theme: Theme): void {
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // A blocked storage write should not prevent the theme from changing.
    }
  }

  function getPreferredTheme(): Theme {
    const storedTheme = readStoredTheme();
    if (storedTheme) return storedTheme;

    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "black"
      : "white";
  }

  function applyTheme(theme: Theme): void {
    root.dataset.theme = theme;

    themeButtons.forEach((button) => {
      const buttonTheme = button.dataset.themeChoice;
      button.setAttribute("aria-pressed", String(buttonTheme === theme));
    });
  }

  function setTheme(theme: Theme): void {
    applyTheme(theme);
    writeStoredTheme(theme);
  }

  function updateSearch(): void {
    const query = normalize(searchInput?.value ?? "");
    const tokens = query.split(/\s+/).filter(Boolean);

    searchableSections.forEach((section) => {
      const haystack = normalize(section.textContent ?? "");
      const matches = tokens.every((token) => haystack.includes(token));
      section.classList.toggle("is-filtered", tokens.length > 0 && !matches);
    });

    updateActiveNav();
  }

  function getLinkedSection(link: HTMLAnchorElement): HTMLElement | null {
    const href = link.getAttribute("href");
    if (!href?.startsWith("#")) return null;

    return document.querySelector<HTMLElement>(href);
  }

  function updateActiveNav(): void {
    const visibleSections = navLinks
      .map(getLinkedSection)
      .filter((section): section is HTMLElement => {
        return section !== null && !section.classList.contains("is-filtered");
      });

    let activeId = visibleSections[0]?.id;
    for (const section of visibleSections) {
      if (section.getBoundingClientRect().top <= 120) {
        activeId = section.id;
      }
    }

    navLinks.forEach((link) => {
      const href = link.getAttribute("href") ?? "";
      link.classList.toggle("active", activeId !== undefined && href === `#${activeId}`);
    });
  }

  applyTheme(getPreferredTheme());

  themeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const theme = button.dataset.themeChoice;
      if (isTheme(theme)) setTheme(theme);
    });
  });

  searchInput?.addEventListener("input", updateSearch);
  window.addEventListener("scroll", updateActiveNav, { passive: true });
  window.addEventListener("hashchange", updateActiveNav);
  updateActiveNav();

  copyButtons.forEach((button) => {
    button.addEventListener("click", async () => {
      const targetSelector = button.getAttribute("data-copy") ?? "";
      if (!targetSelector) return;

      const target = document.querySelector<HTMLElement>(targetSelector);
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
})();
