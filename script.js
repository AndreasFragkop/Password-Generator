
// Word list for passphrase generation.
const WORD_LIST = [
    'apple','arrow','baker','beach','blaze','bloom','brisk','cabin','candy','cargo',
    'cider','cloud','coral','dance','delta','dizzy','drift','eagle','ember','fable',
    'fancy','field','flame','fleet','flint','flora','frost','glade','glint','grain',
    'grape','green','harbor','honey','ivory','jolly','karma','lunar','maple','mellow',
    'minty','mirth','naval','noble','oasis','olive','orbit','pearl','piano','poppy',
    'prism','quill','quiet','rainy','raven','river','robin','royal','sable','salty',
    'satin','scope','shade','shine','silky','sketch','slope','smile','solar','spice',
    'sprig','storm','swift','tango','tiger','toasty','token','trail','tulip','vivid',
    'vocal','whale','wheat','windy','witty','zesty'
];

// Returns the active generation mode from the radio group.
function getSelectedMode() {
    const selected = document.querySelector('input[name="mode"]:checked');
    return selected ? selected.value : 'password';
}

// Shows or hides mode-specific controls.
function setModeUI() {
    const isPassphrase = getSelectedMode() === 'passphrase';
    document.getElementById('lengthOption').classList.toggle('is-hidden', isPassphrase);
    document.getElementById('wordCountOption').classList.toggle('is-hidden', !isPassphrase);
    document.getElementById('separatorOption').classList.toggle('is-hidden', !isPassphrase);
}

// Initializes the theme toggle and persists selection.
function initThemeToggle() {
    const toggle = document.getElementById('themeToggle');
    const toggleText = document.getElementById('themeToggleText');
    if (!toggle) return;

    const storageKey = 'password-generator-theme';
    const storedTheme = localStorage.getItem(storageKey);
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const startingTheme = storedTheme || (prefersDark ? 'dark' : 'light');

    const applyTheme = (theme) => {
        document.documentElement.setAttribute('data-theme', theme);
        toggle.setAttribute('aria-pressed', theme === 'dark');
        if (toggleText) {
            toggleText.textContent = theme === 'dark' ? 'Dark' : 'Light';
        }
    };

    applyTheme(startingTheme);

    toggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
        localStorage.setItem(storageKey, nextTheme);
        applyTheme(nextTheme);
    });

    if (!storedTheme && window.matchMedia) {
        const media = window.matchMedia('(prefers-color-scheme: dark)');
        const handler = (event) => {
            const savedTheme = localStorage.getItem(storageKey);
            if (savedTheme) return;
            applyTheme(event.matches ? 'dark' : 'light');
        };
        if (typeof media.addEventListener === 'function') {
            media.addEventListener('change', handler);
        } else if (typeof media.addListener === 'function') {
            media.addListener(handler);
        }
    }
}

// Renders output, reveals copy button, and updates strength info.
function renderPassword(password) {
    const displayElement = document.getElementById('passwordDisplay');
    displayElement.textContent = password;
    const copyBtn = document.getElementById('copyBtn');
    copyBtn.style.display = 'block';
    resetCopyButton(copyBtn);
    updateStrengthMeter(password);

}

// Entry point for generation based on selected mode.
function generatePassword() {
    const mode = getSelectedMode();
    if (mode === 'passphrase') {
        generatePassphrase();
        return;
    }

    const length = parseInt(document.getElementById('length').value);
    const includeUppercase  = document.getElementById('uppercase').checked;
    const includeLowercase  = document.getElementById('lowercase').checked;
    const includenumbers    = document.getElementById('numbers').checked;
    const includesymbols    = document.getElementById('symbols').checked;
    const excludeSimilar    = document.getElementById('excludeSimilar').checked;
    
    // Character pools (with optional similar-character filtering).
    const uppercase     = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase     = 'abcdefghijklmnopqrstuvwxyz';
    const numbers       = '0123456789';
    const symbols       = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    const similarChars  = new Set(['O','0','l','1','I']);

    const enabledSets = [];
    let charset = '';

    if (includeUppercase) {
        const set = excludeSimilar ? uppercase.split('').filter(c => !similarChars.has(c)).join('') : uppercase;
        charset += set;
        enabledSets.push(set);
    }
    if (includeLowercase) {
        const set = excludeSimilar ? lowercase.split('').filter(c => !similarChars.has(c)).join('') : lowercase;
        charset += set;
        enabledSets.push(set);
    }
    if (includenumbers) {
        const set = excludeSimilar ? numbers.split('').filter(c => !similarChars.has(c)).join('') : numbers;
        charset += set;
        enabledSets.push(set);
    }
    if (includesymbols) {
        charset += symbols;
        enabledSets.push(symbols);
    }

    if (charset === '') {
        alert('Please select at least one character type!');
        return; 
    }

    if (length < enabledSets.length) {
        alert(`Length must be at least ${enabledSets.length} to include all selected character types.`);
        return;
    }

    const passwordChars = [];

    // Ensure each selected set appears at least once.
    enabledSets.forEach((set) => {
        passwordChars.push(getRandomChar(set));
    });

    for (let i = passwordChars.length; i < length; i++) {
        passwordChars.push(getRandomChar(charset));
    }

    shuffleArray(passwordChars);
    renderPassword(passwordChars.join(''));
}

// Generates a multi-word passphrase using the word list.
function generatePassphrase() {
    const wordCount = parseInt(document.getElementById('wordCount').value);
    const separatorSetting = document.getElementById('separator').value;
    const separators = ['-','.', '_', ' '];

    if (!wordCount || wordCount < 2) {
        alert('Please choose at least 2 words!');
        return;
    }

    const words = [];
    for (let i = 0; i < wordCount; i++) {
        const word = WORD_LIST[getRandomInt(WORD_LIST.length)];
        words.push(word);
    }

    let passphrase = '';
    if (separatorSetting === 'random') {
        for (let i = 0; i < words.length; i++) {
            passphrase += words[i];
            if (i < words.length - 1) {
                passphrase += separators[getRandomInt(separators.length)];
            }
        }
    } else {
        const sep = separatorSetting === 'space' ? ' ' : separatorSetting;
        passphrase = words.join(sep);
    }

    renderPassword(passphrase);
}

// Returns a secure random integer in [0, max).
function getRandomInt(max) {
    if (max <= 0) return 0;
    const array = new Uint32Array(1);
    const limit = Math.floor(0x100000000 / max) * max;
    let value = 0;
    do {
        window.crypto.getRandomValues(array);
        value = array[0];
    } while (value >= limit);
    return value % max;
}

// Picks a random character from a charset.
function getRandomChar(charset) {
    return charset[getRandomInt(charset.length)];
}

// Shuffles an array in-place (Fisher-Yates).
function shuffleArray(items) {
    for (let i = items.length - 1; i > 0; i--) {
        const j = getRandomInt(i + 1);
        [items[i], items[j]] = [items[j], items[i]];
    }
}

// Computes heuristic strength and updates the meter UI.
function updateStrengthMeter(password) {
    const meter  = document.getElementById('strengthMeter');
    const fill   = document.getElementById('strengthFill');
    const text   = document.getElementById('strengthText');

    let score = 0;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);
    const hasSymbols = /[^A-Za-z0-9]/.test(password);

    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    if (password.length >= 16) score += 1;

    if (hasUpper) score += 1;
    if (hasLower) score += 1;
    if (hasNumbers) score += 1;
    if (hasSymbols) score += 2;

    let strength, width, className;
    if (score <= 3) {
        strength   = 'weak';
        width      = '33%';
        className  = 'weak';
    } else if (score <= 5) {
        strength   = 'medium';
        width      = '66%';
        className  = 'medium';
    } else {
        strength   = 'strong';
        width      = '100%';
        className  = 'strong';
    }

    text.textContent     = strength;
    fill.style.width     = width;
    fill.className       = `strength-fill ${className}`;
    meter.style.display  = 'block';

    const entropyText = document.getElementById('entropyText');
    if (entropyText) {
        const bits = estimateEntropyBits(password);
        entropyText.textContent = bits ? `(${bits} bits)` : '';
    }
}

// Estimates entropy using unique character pool size.
function estimateEntropyBits(password) {
    if (!password) return 0;
    const length = password.replace(/\n/g, '').length;
    if (length === 0) return 0;
    const unique = new Set(password.replace(/\n/g, '').split(''));
    const pool = unique.size;
    if (pool === 0) return 0;
    return Math.round(length * Math.log2(pool));
}

let toastTimeoutId = null;
let copyTimeoutId = null;

// Shows a temporary status toast.
function showToast(message, isError = false) {
    const toast = document.getElementById('toast');
    if (!toast) return;

    toast.textContent = message;
    toast.classList.toggle('is-error', isError);
    toast.classList.add('show');

    if (toastTimeoutId) {
        clearTimeout(toastTimeoutId);
    }

    toastTimeoutId = setTimeout(() => {
        toast.classList.remove('show');
    }, 2000);
}

// Resets copy button label/state.
function resetCopyButton(copyBtn) {
    const btn = copyBtn || document.getElementById('copyBtn');
    if (!btn) return;
    const defaultLabel = btn.dataset.default || 'Copy Password';
    btn.textContent = defaultLabel;
    btn.disabled = false;
}

// Temporarily disables copy button after copying.
function startCopyCooldown(copyBtn, duration = 2000) {
    const btn = copyBtn || document.getElementById('copyBtn');
    if (!btn) return;
    if (copyTimeoutId) {
        clearTimeout(copyTimeoutId);
    }
    btn.textContent = 'Copied';
    btn.disabled = true;
    copyTimeoutId = setTimeout(() => {
        resetCopyButton(btn);
    }, duration);
}

// Copies the current password to clipboard with feedback.
function copyPassword() {
    const passwordText = document.getElementById('passwordDisplay').textContent;
    const copyBtn = document.getElementById('copyBtn');

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

// Detects inputs so keyboard shortcuts don't interfere.
function isTypingTarget(element) {
    if (!element) return false;
    const tag = element.tagName ? element.tagName.toLowerCase() : '';
    if (tag === 'input' || tag === 'textarea' || tag === 'select') return true;
    return element.isContentEditable === true;
}

// Registers keyboard shortcuts for generate/copy.
function initKeyboardShortcuts() {
    document.addEventListener('keydown', (event) => {
        if (isTypingTarget(document.activeElement)) return;

        if (event.key === 'Enter') {
            event.preventDefault();
            generatePassword();
            return;
        }

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

// Bootstraps UI state and generates an initial password.
window.addEventListener('load', function() {
    initThemeToggle();
    setModeUI();
    initKeyboardShortcuts();
    document.querySelectorAll('input[name="mode"]').forEach((radio) => {
        radio.addEventListener('change', () => {
            setModeUI();
            generatePassword();
        });
    });
    generatePassword();
});
