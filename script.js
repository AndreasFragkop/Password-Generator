/**
 * script.js
 * Application entry point. Imports all feature modules and wires up
 * the UI once the page has fully loaded.
 *
 * This file intentionally contains no logic of its own — each concern
 * lives in its own module under js/.
 */

import { copyPassword } from './js/clipboard.js';
import { generatePassword } from './js/generator.js';
import { initKeyboardShortcuts } from './js/keyboard.js';
import { setModeUI } from './js/mode.js';
import { initThemeToggle } from './js/theme.js';

/**
 * Attaches change listeners to the mode radio buttons so switching between
 * "Password" and "Passphrase" updates the visible options and immediately
 * generates an output in the new mode.
 */
function initModeControls() {
    document.querySelectorAll('input[name="mode"]').forEach((radio) => {
        radio.addEventListener('change', () => {
            setModeUI();
            generatePassword();
        });
    });
}

/**
 * Bootstrap sequence — runs after all HTML and resources are parsed.
 * Order matters: theme must be applied before anything is rendered to avoid
 * a flash of the wrong colour scheme.
 */
window.addEventListener('load', () => {
    initThemeToggle();   // Apply stored/system theme before first paint.
    setModeUI();         // Show/hide option rows for the default mode.
    initKeyboardShortcuts(generatePassword, copyPassword);
    initModeControls();

    document.getElementById('generateBtn')?.addEventListener('click', generatePassword);
    document.getElementById('copyBtn')?.addEventListener('click', copyPassword);

    // Generate an initial password so the output area isn't empty on load.
    generatePassword();
});
