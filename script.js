
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

function getSelectedMode() {
    const selected = document.querySelector('input[name="mode"]:checked');
    return selected ? selected.value : 'password';
}

function setModeUI() {
    const isPassphrase = getSelectedMode() === 'passphrase';
    document.getElementById('lengthOption').classList.toggle('is-hidden', isPassphrase);
    document.getElementById('wordCountOption').classList.toggle('is-hidden', !isPassphrase);
    document.getElementById('separatorOption').classList.toggle('is-hidden', !isPassphrase);
}

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

function renderPassword(password) {
    const displayElement = document.getElementById('passwordDisplay');
    displayElement.textContent = password;
    document.getElementById('copyBtn').style.display = 'block';
    updateStrengthMeter(password);
}

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
    
    const uppercase     = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase     = 'abcdefghijklmnopqrstuvwxyz';
    const numbers       = '0123456789';
    const symbols       = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    let charset   = '';
    let password  = '';

    if (includeUppercase) charset  += uppercase;
    if (includeLowercase) charset  += lowercase;
    if (includenumbers) charset    += numbers;
    if (includesymbols) charset    += symbols;

    if (charset === '') {
        alert('Please select at least one character type!');
        return; 
    }

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
    }

    renderPassword(password);

}

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
        const word = WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)];
        words.push(word);
    }

    let passphrase = '';
    if (separatorSetting === 'random') {
        for (let i = 0; i < words.length; i++) {
            passphrase += words[i];
            if (i < words.length - 1) {
                passphrase += separators[Math.floor(Math.random() * separators.length)];
            }
        }
    } else {
        const sep = separatorSetting === 'space' ? ' ' : separatorSetting;
        passphrase = words.join(sep);
    }

    renderPassword(passphrase);
}

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

}

function copyPassword() {
    const passwordText = document.getElementById('passwordDisplay').textContent;
    navigator.clipboard.writeText(passwordText).then(() => {
        const copyBtn             = document.getElementById('copyBtn');
        const originalText        = copyBtn.textContent;
        const originalBg          = copyBtn.style.background;
        copyBtn.textContent       = 'copied';
        copyBtn.style.background  = '#28a745';

        setTimeout(() => {
            copyBtn.textContent       = originalText;
            copyBtn.style.background  = originalBg;
        }, 2000);
    });    
}

window.addEventListener('load', function() {
    initThemeToggle();
    setModeUI();
    document.querySelectorAll('input[name="mode"]').forEach((radio) => {
        radio.addEventListener('change', () => {
            setModeUI();
            generatePassword();
        });
    });
    generatePassword();
});
