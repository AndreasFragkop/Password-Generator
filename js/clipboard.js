/**
 * clipboard.js
 * Handles copying the generated password to the clipboard and
 * providing visual feedback through a toast notification and button cooldown.
 */

// Module-level timeout IDs allow pending timers to be cancelled and restarted
// if the user triggers another copy or toast before the previous one expires.
let toastTimeoutId = null;
let copyTimeoutId = null;

/**
 * Reads the current password from the display element and writes it to
 * the clipboard using the async Clipboard API.
 * Shows a success or error toast depending on the outcome.
 */
export function copyPassword() {
    const passwordText = document.getElementById('passwordDisplay')?.textContent;
    const copyBtn = document.getElementById('copyBtn');

    // Nothing to copy if the display is empty.
    if (!passwordText) return;

    // Clipboard API requires a secure context (HTTPS or localhost).
    if (!navigator.clipboard || !navigator.clipboard.writeText) {
        showToast('Clipboard unavailable', true);
        return;
    }

    navigator.clipboard.writeText(passwordText).then(() => {
        showToast('Copied to clipboard');
        startCopyCooldown(copyBtn);
    }).catch(() => {
        showToast('Copy failed', true);
        resetCopyButton(copyBtn);
    });
}

/**
 * Resets the copy button to its default label and re-enables it.
 * The default label is read from the button's data-default attribute
 * so it can be customised in HTML without touching JS.
 *
 * @param {HTMLButtonElement|null} copyBtn - The button element, or null to query the DOM.
 */
export function resetCopyButton(copyBtn) {
    const btn = copyBtn || document.getElementById('copyBtn');
    if (!btn) return;

    const defaultLabel = btn.dataset.default || 'Copy Password';
    btn.textContent = defaultLabel;
    btn.disabled = false;
}

/**
 * Displays a temporary status toast at the bottom of the screen.
 * Clears any existing toast timer so rapid calls always show the full duration.
 *
 * @param {string} message - The text to display in the toast.
 * @param {boolean} [isError=false] - When true, applies the error colour to the toast.
 */
function showToast(message, isError = false) {
    const toast = document.getElementById('toast');
    if (!toast) return;

    toast.textContent = message;
    toast.classList.toggle('is-error', isError);
    toast.classList.add('show');

    // Cancel any pending hide so the new toast always gets its full 2 s.
    if (toastTimeoutId) {
        clearTimeout(toastTimeoutId);
    }

    toastTimeoutId = setTimeout(() => {
        toast.classList.remove('show');
    }, 2000);
}

/**
 * Temporarily disables the copy button and changes its label to "Copied"
 * to prevent duplicate copies and confirm the action to the user.
 * Resets automatically after the cooldown period.
 *
 * @param {HTMLButtonElement|null} copyBtn - The button element, or null to query the DOM.
 * @param {number} [duration=2000] - How long (ms) to keep the button disabled.
 */
function startCopyCooldown(copyBtn, duration = 2000) {
    const btn = copyBtn || document.getElementById('copyBtn');
    if (!btn) return;

    // Cancel a previous cooldown if the user somehow triggers copy again mid-wait.
    if (copyTimeoutId) {
        clearTimeout(copyTimeoutId);
    }

    btn.textContent = 'Copied';
    btn.disabled = true;
    copyTimeoutId = setTimeout(() => {
        resetCopyButton(btn);
    }, duration);
}
