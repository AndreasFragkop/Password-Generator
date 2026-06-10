/**
 * keyboard.js
 * Registers global keyboard shortcuts for the app.
 *
 * Shortcuts:
 *   Enter          — Generate a new password
 *   Ctrl/Cmd + C   — Copy the current password (only when copy button is visible)
 */

/**
 * Attaches a keydown listener to the document and wires up the shortcuts.
 * Accepts generate and copy as parameters (dependency injection) so this
 * module doesn't import from generator or clipboard, keeping the dependency
 * graph acyclic.
 *
 * @param {Function} generatePassword - Called when the user presses Enter.
 * @param {Function} copyPassword - Called when the user presses Ctrl/Cmd+C.
 */
export function initKeyboardShortcuts(generatePassword, copyPassword) {
    document.addEventListener('keydown', (event) => {
        // Don't intercept keypresses while the user is typing in a form field.
        if (isTypingTarget(document.activeElement)) return;

        if (event.key === 'Enter') {
            event.preventDefault();
            generatePassword();
            return;
        }

        // Only intercept Ctrl+C / Cmd+C when the copy button is actually visible.
        // If no password has been generated yet, the button is hidden and we let
        // the browser handle the shortcut normally (e.g. copy selected text).
        const isCopyCombo = (event.key === 'c' || event.key === 'C') && (event.ctrlKey || event.metaKey);
        if (isCopyCombo) {
            const copyBtn = document.getElementById('copyBtn');
            if (copyBtn && getComputedStyle(copyBtn).display !== 'none') {
                event.preventDefault();
                copyPassword();
            }
        }
    });
}

/**
 * Returns true if the given element is one where the user is actively typing,
 * so keyboard shortcuts don't interfere with normal text input.
 *
 * @param {Element|null} element - The currently focused element.
 * @returns {boolean}
 */
function isTypingTarget(element) {
    if (!element) return false;

    const tag = element.tagName ? element.tagName.toLowerCase() : '';
    if (tag === 'input' || tag === 'textarea' || tag === 'select') return true;

    // Also covers rich-text editors and contenteditable divs.
    return element.isContentEditable === true;
}
