/**
 * generator.js
 * Core password and passphrase generation logic.
 * Handles character set assembly, guaranteed-inclusion seeding, and word joining.
 */

import { renderPassword } from './display.js';
import { getSelectedMode } from './mode.js';
import { getRandomChar, getRandomInt, shuffleArray } from './random.js';
import { WORD_LIST } from './word-list.js';

/** Available character pools keyed by their option checkbox id. */
const CHARACTER_SETS = {
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    numbers: '0123456789',
    symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
};

/**
 * Characters that look alike and are excluded when "Exclude Similar" is on.
 * Covers: capital O / zero, lowercase l / one / capital I.
 */
const SIMILAR_CHARS = new Set(['O', '0', 'l', '1', 'I']);

/**
 * Entry point for generation. Delegates to the correct generator
 * based on the currently selected mode (password or passphrase).
 */
export function generatePassword() {
    if (getSelectedMode() === 'passphrase') {
        generatePassphrase();
        return;
    }

    const length = parseInt(document.getElementById('length').value, 10);
    const enabledSets = getEnabledCharacterSets();
    const charset = enabledSets.join(''); // Full pool of all allowed characters.

    if (charset === '') {
        alert('Please select at least one character type!');
        return;
    }

    // The password must be at least as long as the number of selected sets
    // so we can guarantee one character from each set is present.
    if (length < enabledSets.length) {
        alert(`Length must be at least ${enabledSets.length} to include all selected character types.`);
        return;
    }

    // Seed with one character from each enabled set to guarantee full coverage,
    // then fill the remaining slots from the combined charset.
    const passwordChars = enabledSets.map((set) => getRandomChar(set));

    for (let i = passwordChars.length; i < length; i++) {
        passwordChars.push(getRandomChar(charset));
    }

    // Shuffle so the guaranteed characters don't always appear at the start.
    shuffleArray(passwordChars);
    renderPassword(passwordChars.join(''));
}

/**
 * Reads the checkbox states from the DOM and returns an array of
 * filtered character set strings for each enabled option.
 *
 * @returns {string[]} Array of charset strings for each enabled character type.
 */
function getEnabledCharacterSets() {
    const excludeSimilar = document.getElementById('excludeSimilar').checked;
    const requestedSets = [
        ['uppercase', document.getElementById('uppercase').checked],
        ['lowercase', document.getElementById('lowercase').checked],
        ['numbers', document.getElementById('numbers').checked],
        ['symbols', document.getElementById('symbols').checked],
    ];

    return requestedSets
        .filter(([, isEnabled]) => isEnabled)
        .map(([name]) => filterCharacterSet(CHARACTER_SETS[name], excludeSimilar));
}

/**
 * Optionally removes visually similar characters from a charset string.
 * SIMILAR_CHARS only contains alphanumeric characters, so the symbols set
 * passes through unchanged regardless of the excludeSimilar flag.
 *
 * @param {string} charset - The character pool to filter.
 * @param {boolean} excludeSimilar - Whether to remove similar-looking chars.
 * @returns {string} The filtered (or original) charset.
 */
function filterCharacterSet(charset, excludeSimilar) {
    if (!excludeSimilar) return charset;
    return charset.split('').filter((char) => !SIMILAR_CHARS.has(char)).join('');
}

/**
 * Generates a multi-word passphrase from the built-in word list
 * and passes it to the renderer.
 */
function generatePassphrase() {
    const wordCount = parseInt(document.getElementById('wordCount').value, 10);
    const separatorSetting = document.getElementById('separator').value;

    if (!wordCount || wordCount < 2) {
        alert('Please choose at least 2 words!');
        return;
    }

    const words = Array.from({ length: wordCount }, () => WORD_LIST[getRandomInt(WORD_LIST.length)]);
    renderPassword(joinPassphraseWords(words, separatorSetting));
}

/**
 * Joins an array of words into a passphrase string using the chosen separator.
 * When separator is "random", each gap between words picks independently
 * from the available separators for extra unpredictability.
 *
 * @param {string[]} words - The words to join.
 * @param {string} separatorSetting - The separator option value from the select element.
 * @returns {string} The assembled passphrase.
 */
function joinPassphraseWords(words, separatorSetting) {
    const separators = ['-', '.', '_', ' '];

    if (separatorSetting !== 'random') {
        // The "space" value can't be used directly as a separator string.
        const separator = separatorSetting === 'space' ? ' ' : separatorSetting;
        return words.join(separator);
    }

    // Each inter-word gap gets its own independently chosen separator.
    return words.reduce((passphrase, word, index) => {
        const separator = index < words.length - 1 ? separators[getRandomInt(separators.length)] : '';
        return `${passphrase}${word}${separator}`;
    }, '');
}
