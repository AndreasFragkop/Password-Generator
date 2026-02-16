# Password Generator

A client-side password and passphrase generator with theme toggle, strength meter, and copy support.

## Features
- Custom length (4-50) with guaranteed inclusion of selected character types
- Uppercase, lowercase, numbers, symbols toggles
- Passphrase mode (word list + separators)
- Strength indicator
- Copy to clipboard
- Light/dark theme toggle
- Keyboard shortcuts (Enter = generate, Ctrl/Cmd + C = copy)
- Cryptographically secure randomness via `crypto.getRandomValues`

## Run
Open `index.html` in your browser.

## Notes
- Passwords are generated locally in the browser.
- If you select multiple character types, length must be at least the number of selected types.

## Files
- `index.html`
- `style.css`
- `script.js`
