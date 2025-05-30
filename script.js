
function generatePassword() {
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

    const displayElement = document.getElementById('passwordDisplay');
    displayElement.textContent = password;

    document.getElementById('copyBtn').style.display = 'block';

    updateStrengthMeter(password, includeUppercase, includeLowercase, includenumbers, includesymbols);

}

function updateStrengthMeter(password, hasUpper, hasLower, hasNumbers, hasSymbols) {
    const meter  = document.getElementById('strengthMeter');
    const fill   = document.getElementById('strengthFill');
    const text   = document.getElementById('strengthText');

    let score = 0;

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
    } else if (score <= 6) {
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
    meter.style.dysplay  = 'block';

}

function copyPassword() {
    const passwordText = document.getElementById('passwordDisplay').textContent;
    navigator.clipboard.writeText(passwordText).then(() => {
        const copyBtn             = document.getElementById('copyBnt');
        const originalText        = copyBtn.textContent;
        copyBtn.textContent       = 'copied';
        copyBtn.style.background  = '#28a745';

        setTimeout(() => {
            copyBtn.textContent       = originalText;
            copyBtn.style.background  = '#28a745';
        }, 2000);
    });    
}

window.addEventListener('load', function() {
    generatePassword();
});