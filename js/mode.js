/**
 * mode.js
 * Manages the generation mode selector (password vs. passphrase) and
 * shows or hides the relevant option rows based on the active mode.
 */

/**
 * Returns the currently selected generation mode from the radio group.
 * Defaults to 'password' if no radio button is checked (should not happen
 * in normal usage since one is checked by default in the HTML).
 *
 * @returns {'password'|'passphrase'} The active mode value.
 */
export function getSelectedMode() {
    const selected = document.querySelector('input[name="mode"]:checked');
    return selected ? selected.value : 'password';
}

/**
 * Synchronises the visible option rows with the active mode.
 *
 * - Password mode shows the length input and hides word count / separator.
 * - Passphrase mode shows word count and separator, hides the length input.
 */
export function setModeUI() {
    const isPassphrase = getSelectedMode() === 'passphrase';

    document.getElementById('lengthOption')?.classList.toggle('is-hidden', isPassphrase);
    document.getElementById('wordCountOption')?.classList.toggle('is-hidden', !isPassphrase);
    document.getElementById('separatorOption')?.classList.toggle('is-hidden', !isPassphrase);
}
