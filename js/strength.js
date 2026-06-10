/**
 * strength.js
 * Computes a heuristic strength score for a password and updates
 * the strength meter and entropy estimate in the UI.
 */

/**
 * Scores a password based on length and character diversity, then
 * updates the strength bar, label, and entropy display accordingly.
 *
 * Scoring breakdown:
 *   Length >= 8   → +1     Length >= 12  → +1     Length >= 16  → +1
 *   Has uppercase → +1     Has lowercase → +1
 *   Has numbers   → +1     Has symbols   → +2  (weighted higher for entropy)
 *
 *   Score 0–3  → Weak    (33% bar, red)
 *   Score 4–5  → Medium  (66% bar, amber)
 *   Score 6+   → Strong  (100% bar, green)
 *
 * @param {string} password - The password string to evaluate.
 */
export function updateStrengthMeter(password) {
    const meter = document.getElementById('strengthMeter');
    const fill = document.getElementById('strengthFill');
    const text = document.getElementById('strengthText');

    if (!meter || !fill || !text) return;

    let score = 0;

    // Length bonuses — each threshold adds independently.
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    if (password.length >= 16) score += 1;

    // Character diversity bonuses.
    if (/[A-Z]/.test(password)) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 2; // Symbols contribute more to entropy.

    // Default to strong; downgrade if score doesn't meet the thresholds.
    let strength = 'strong';
    let width = '100%';
    let className = 'strong';

    if (score <= 3) {
        strength = 'weak';
        width = '33%';
        className = 'weak';
    } else if (score <= 5) {
        strength = 'medium';
        width = '66%';
        className = 'medium';
    }

    text.textContent = strength;
    fill.style.width = width;
    fill.className = `strength-fill ${className}`;

    // Reveal the meter (hidden by default until first generation).
    meter.style.display = 'block';

    const entropyText = document.getElementById('entropyText');
    if (entropyText) {
        const bits = estimateEntropyBits(password);
        entropyText.textContent = bits ? `(${bits} bits)` : '';
    }
}

/**
 * Estimates entropy in bits using the formula: length × log₂(unique chars).
 *
 * This is a lower-bound approximation based on the observed character pool
 * rather than the theoretical pool size. It intentionally under-reports for
 * passwords with low character variety to reflect their weaker unpredictability.
 *
 * @param {string} password - The password to evaluate.
 * @returns {number} Estimated entropy in bits, rounded to the nearest integer.
 */
function estimateEntropyBits(password) {
    if (!password) return 0;

    const cleanPassword = password.replace(/\n/g, '');
    const length = cleanPassword.length;
    if (length === 0) return 0;

    const pool = new Set(cleanPassword.split('')).size;
    if (pool === 0) return 0;

    return Math.round(length * Math.log2(pool));
}
