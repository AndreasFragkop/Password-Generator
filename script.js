
function generatePassword() {
    const length = parseInt(document.getElementById('length').value);
    const includeUppercase = document.getElementById('uppercase').checked;
    const includeLowercase = document.getElementById('lowercase').checked;
    const includeNumbers = document.getElementById('numbers').checked;
    const includeSymbols = document.getElementById('symbols').checked;
    
    // Character sets
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    let charset = '';
    let password = '';
    
    // Build character set based on selections
    if (includeUppercase) charset += uppercase;
    if (includeLowercase) charset += lowercase;
    if (includeNumbers) charset += numbers;
    if (includeSymbols) charset += symbols;
    
    // Check if at least one option is selected
    if (charset === '') {
        alert('Please select at least one character type!');
        return;
    }
    
    // Generate password
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
    }
    
    // Display password
    const displayElement = document.getElementById('passwordDisplay');
    displayElement.textContent = password;
    
    // Show copy button
    document.getElementById('copyBtn').style.display = 'block';
    
    // Show and update strength meter
    updateStrengthMeter(password, includeUppercase, includeLowercase, includeNumbers, includeSymbols);
}

function updateStrengthMeter(password, hasUpper, hasLower, hasNumbers, hasSymbols) {
    const meter = document.getElementById('strengthMeter');
    const fill = document.getElementById('strengthFill');
    const text = document.getElementById('strengthText');
    
    let score = 0;
    
    // Length scoring
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    if (password.length >= 16) score += 1;
    
    // Character variety scoring
    if (hasUpper) score += 1;
    if (hasLower) score += 1;
    if (hasNumbers) score += 1;
    if (hasSymbols) score += 2;
    
    // Determine strength
    let strength, width, className;
    if (score <= 3) {
        strength = 'Weak';
        width = '33%';
        className = 'weak';
    } else if (score <= 6) {
        strength = 'Medium';
        width = '66%';
        className = 'medium';
    } else {
        strength = 'Strong';
        width = '100%';
        className = 'strong';
    }
    
    // Update display
    text.textContent = strength;
    fill.style.width = width;
    fill.className = `strength-fill ${className}`;
    meter.style.display = 'block';
}

function copyPassword() {
    const passwordText = document.getElementById('passwordDisplay').textContent;
    navigator.clipboard.writeText(passwordText).then(() => {
        const copyBtn = document.getElementById('copyBtn');
        const originalText = copyBtn.textContent;
        copyBtn.textContent = 'Copied!';
        copyBtn.style.background = '#28a745';
        
        setTimeout(() => {
            copyBtn.textContent = originalText;
            copyBtn.style.background = '#28a745';
        }, 2000);
    });
}

// Generate initial password when page loads
window.addEventListener('load', function() {
    generatePassword();
});