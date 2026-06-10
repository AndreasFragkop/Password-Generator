/**
 * theme.js
 * Manages the light/dark theme toggle.
 * Persists the user's choice in localStorage and respects the OS
 * colour-scheme preference when no explicit choice has been saved.
 */

/** localStorage key used to persist the user's theme choice across sessions. */
const STORAGE_KEY = 'password-generator-theme';

/**
 * Initialises the theme toggle button.
 * Reads the stored preference (or falls back to the OS preference),
 * applies the starting theme, and registers the click and system-change handlers.
 */
export function initThemeToggle() {
    const toggle = document.getElementById('themeToggle');
    const toggleText = document.getElementById('themeToggleText');
    if (!toggle) return;

    const storedTheme = localStorage.getItem(STORAGE_KEY);
    const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
    // Explicit user choice wins; otherwise honour the OS setting.
    const startingTheme = storedTheme || (prefersDark ? 'dark' : 'light');

    applyTheme(startingTheme, toggle, toggleText);

    toggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';

        // Persist immediately so page reloads use the chosen theme.
        localStorage.setItem(STORAGE_KEY, nextTheme);
        applyTheme(nextTheme, toggle, toggleText);
    });

    watchSystemTheme(toggle, toggleText, storedTheme);
}

/**
 * Applies a theme by setting the data-theme attribute on <html>,
 * updating the button's aria-pressed state, and refreshing the label text.
 *
 * @param {string} theme - Either 'light' or 'dark'.
 * @param {HTMLButtonElement} toggle - The theme toggle button element.
 * @param {HTMLElement|null} toggleText - The element that shows the current theme label.
 */
function applyTheme(theme, toggle, toggleText) {
    // CSS variables in theme.css are scoped to :root[data-theme="dark"].
    document.documentElement.setAttribute('data-theme', theme);

    // aria-pressed communicates the active state to screen readers.
    toggle.setAttribute('aria-pressed', theme === 'dark');

    if (toggleText) {
        toggleText.textContent = theme === 'dark' ? 'Dark' : 'Light';
    }
}

/**
 * Listens for OS-level colour-scheme changes and updates the theme
 * automatically — but only when the user has not yet set a preference.
 * Once the user makes a manual choice, their selection takes priority forever.
 *
 * @param {HTMLButtonElement} toggle - The theme toggle button element.
 * @param {HTMLElement|null} toggleText - The theme label element.
 * @param {string|null} storedTheme - The previously saved theme, if any.
 */
function watchSystemTheme(toggle, toggleText, storedTheme) {
    // If a theme is already stored, the user has opted in explicitly — stop here.
    if (storedTheme || !window.matchMedia) return;

    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (event) => {
        // Re-check localStorage in case the user set a preference since this
        // listener was registered (e.g. in another tab).
        if (localStorage.getItem(STORAGE_KEY)) return;
        applyTheme(event.matches ? 'dark' : 'light', toggle, toggleText);
    };

    // addEventListener is the modern API; addListener is the legacy fallback.
    if (typeof media.addEventListener === 'function') {
        media.addEventListener('change', handler);
    } else if (typeof media.addListener === 'function') {
        media.addListener(handler);
    }
}
