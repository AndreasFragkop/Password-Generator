/**
 * random.js
 * Cryptographically secure random utilities built on the Web Crypto API.
 * All functions use window.crypto.getRandomValues to ensure unpredictability.
 */

/**
 * Returns a secure random integer in the range [0, max).
 *
 * Uses rejection sampling to avoid modulo bias: if max doesn't divide evenly
 * into 2^32, values near the top of the range would be slightly more likely
 * without this step. We discard any raw value that falls in the biased tail
 * (>= limit) and retry until we get a fair result.
 *
 * @param {number} max - The exclusive upper bound (must be > 0).
 * @returns {number} A random integer from 0 up to (but not including) max.
 */
export function getRandomInt(max) {
    if (max <= 0) return 0;

    const array = new Uint32Array(1);
    // Largest multiple of max that fits in a 32-bit unsigned integer.
    const limit = Math.floor(0x100000000 / max) * max;
    let value = 0;

    do {
        window.crypto.getRandomValues(array);
        value = array[0];
    } while (value >= limit); // Reject biased tail values and resample.

    return value % max;
}

/**
 * Returns a single random character from a given string.
 *
 * @param {string} charset - The pool of characters to pick from.
 * @returns {string} One randomly selected character.
 */
export function getRandomChar(charset) {
    return charset[getRandomInt(charset.length)];
}

/**
 * Shuffles an array in-place using the Fisher-Yates algorithm.
 * Ensures every permutation is equally probable.
 *
 * @param {Array} items - The array to shuffle.
 */
export function shuffleArray(items) {
    for (let i = items.length - 1; i > 0; i--) {
        // Pick a random index from 0 to i (inclusive) and swap with position i.
        const j = getRandomInt(i + 1);
        [items[i], items[j]] = [items[j], items[i]];
    }
}
