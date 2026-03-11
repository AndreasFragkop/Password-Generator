# Password Generator

A client-side password and passphrase generator with theme toggle, strength meter, and copy support.

![Password Generator](images/Password-generator.png)

## Project Structure
```text
password-generator/
├── index.html                    # App markup
├── style.css                     # Styling and themes
├── script.js                     # Generation logic and UI behavior
├── README.md                     # Project documentation
└── images/
    └── Password-generator.png    # README screenshot
```

## Run
1. Quick start: open `index.html` in your browser.
2. Local server option:
   - From `password-generator/`, run:
     ```bash
     python3 -m http.server 8000
     ```
   - Open `http://localhost:8000`.

## How to Use
1. Choose a mode: Password or Passphrase.
2. Set the length (or word count for passphrases).
3. Toggle character types and optional exclude-similar.
4. Click **Generate Password**.
5. Click **Copy Password** (or press Ctrl/Cmd + C).

## How It Works
- Generates passwords locally in the browser.
- Uses `crypto.getRandomValues` for cryptographically secure randomness.
- Ensures at least one character from each selected type when applicable.
- Estimates strength and entropy based on the generated output.
- Stores theme preference with localStorage.

## Features
- Custom length (4-50) with guaranteed inclusion of selected character types
- Uppercase, lowercase, numbers, symbols toggles
- Exclude similar characters (O/0, l/1, I)
- Passphrase mode (word list, 2–10 words, separator: random, `-`, `.`, `_`, space)
- Strength indicator (heuristic)
- Entropy estimate (bits, based on unique characters in the generated password)
- Copy to clipboard with cooldown and toast feedback
- Light/dark theme toggle
- Keyboard shortcuts (Enter = generate, Ctrl/Cmd + C = copy)
- Cryptographically secure randomness via `crypto.getRandomValues`
- Remembers theme preference with localStorage
- Auto-generates a password on page load

## Privacy
- Passwords and passphrases are generated locally in your browser.
- No backend service is required for generation.
- Theme preference is stored in localStorage.

## Roadmap
- Add customizable passphrase word lists.
- Add export/import for generator presets.
- Improve strength feedback explanations.
- Add optional strict policy templates (e.g., enterprise defaults).

## Notes
- Passwords are generated locally in the browser.
- If you select multiple character types, length must be at least the number of selected types.
