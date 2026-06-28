"use strict";
(() => {
    const THEME_STORAGE_KEY = "latexdo.docs.theme";
    const themes = ["white", "black"];
    const root = document.documentElement;
    const searchInput = document.querySelector("#docs-search");
    const searchableSections = Array.from(document.querySelectorAll("[data-search]"));
    const navLinks = Array.from(document.querySelectorAll(".toc-link"));
    const copyButtons = Array.from(document.querySelectorAll("[data-copy]"));
    const themeButtons = Array.from(document.querySelectorAll("[data-theme-choice]"));
    function normalize(value) {
        return value.trim().toLowerCase();
    }
    function isTheme(value) {
        return themes.includes(value);
    }
    function readStoredTheme() {
        try {
            const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
            return isTheme(storedTheme) ? storedTheme : null;
        }
        catch {
            return null;
        }
    }
    function writeStoredTheme(theme) {
        try {
            window.localStorage.setItem(THEME_STORAGE_KEY, theme);
        }
        catch {
            // A blocked storage write should not prevent the theme from changing.
        }
    }
    function getPreferredTheme() {
        const storedTheme = readStoredTheme();
        if (storedTheme)
            return storedTheme;
        return window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "black"
            : "white";
    }
    function applyTheme(theme) {
        root.dataset.theme = theme;
        themeButtons.forEach((button) => {
            const buttonTheme = button.dataset.themeChoice;
            button.setAttribute("aria-pressed", String(buttonTheme === theme));
        });
    }
    function setTheme(theme) {
        applyTheme(theme);
        writeStoredTheme(theme);
    }
    function updateSearch() {
        const query = normalize(searchInput?.value ?? "");
        const tokens = query.split(/\s+/).filter(Boolean);
        searchableSections.forEach((section) => {
            const haystack = normalize(section.textContent ?? "");
            const matches = tokens.every((token) => haystack.includes(token));
            section.classList.toggle("is-filtered", tokens.length > 0 && !matches);
        });
        updateActiveNav();
    }
    function getLinkedSection(link) {
        const href = link.getAttribute("href");
        if (!href?.startsWith("#"))
            return null;
        return document.querySelector(href);
    }
    function updateActiveNav() {
        const visibleSections = navLinks
            .map(getLinkedSection)
            .filter((section) => {
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
            if (isTheme(theme))
                setTheme(theme);
        });
    });
    searchInput?.addEventListener("input", updateSearch);
    window.addEventListener("scroll", updateActiveNav, { passive: true });
    window.addEventListener("hashchange", updateActiveNav);
    updateActiveNav();
    copyButtons.forEach((button) => {
        button.addEventListener("click", async () => {
            const targetSelector = button.getAttribute("data-copy") ?? "";
            if (!targetSelector)
                return;
            const target = document.querySelector(targetSelector);
            const text = target?.textContent?.trim();
            if (!text || !navigator.clipboard)
                return;
            const original = button.textContent;
            try {
                await navigator.clipboard.writeText(text);
                button.textContent = "Copied";
                window.setTimeout(() => {
                    button.textContent = original;
                }, 1200);
            }
            catch {
                button.textContent = "Copy failed";
                window.setTimeout(() => {
                    button.textContent = original;
                }, 1200);
            }
        });
    });
})();
