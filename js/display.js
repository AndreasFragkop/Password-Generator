/**
 * display.js
 * Responsible for rendering a generated password to the DOM.
 * Acts as the bridge between the generators and the UI output area.
 */

import { resetCopyButton } from './clipboard.js';
import { updateStrengthMeter } from './strength.js';

/**
 * Writes a password string to the output display, reveals the copy button,
 * resets the copy button state, and triggers the strength meter update.
 *
 * @param {string} password - The generated password or passphrase to display.
 */
export function renderPassword(password) {
    const displayElement = document.getElementById('passwordDisplay');
    const copyBtn = document.getElementById('copyBtn');

    if (!displayElement || !copyBtn) return;

    displayElement.textContent = password;

    // Show the copy button — it stays hidden until a password exists.
    copyBtn.style.display = 'block';

    // Reset the button in case it was left in a "Copied" / disabled state.
    resetCopyButton(copyBtn);

    updateStrengthMeter(password);
}
