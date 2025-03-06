# Musical Spells - The Wizards' Duel

[🇪🇸 Versión en español](README.es.md)

## Description

Musical Spells is a musical memory and reflex game where you play as a wizard apprentice who must face other sorcerers in musical duels. To defeat your rivals, you must correctly repeat the musical note sequences you hear when your opponent casts their spell.

This game combines elements of musical memory, tone recognition, and quick reflexes, all wrapped in a magical and fun theme.

## Features

- **Turn-based duel system**: Listen and repeat the note sequence to attack your opponent.
- **Multiple difficulty levels**: From Novice (2 notes) to Master (7 notes).
- **Four rival wizards**: Each with a progressive difficulty level.
- **Progress map**: View your advancement and the wizards you've defeated.
- **Complete musical scale**: Play with all seven musical notes (C, D, E, F, G, A, B).
- **Dual controls**: Play using on-screen buttons or keyboard with American notation.
- **Reference note**: Option to hear a C reference note before each duel.
- **Energy system**: Each successful spell reduces your opponent's energy. The first to run out of energy loses.
- **Multi-language support**: Available in English and Spanish, with possibility to add more languages.

## Prerequisites

- Node.js installed on your system (you can download it from [nodejs.org](https://nodejs.org/))

## How to Run the Game

1. Clone this repository or download the files:
   ```bash
   git clone https://github.com/alpgarcia/MusicalSpells.git
   cd MusicalSpells
   ```

2. Start the local server:
   ```bash
   node server.js
   ```

3. Open your web browser and visit:
   ```
   http://localhost:3000
   ```

The game will run in your browser and you can start playing immediately.

## How to Play

1. **Start Screen**:
   - Select your difficulty level:
     - **Novice**: Only 2 notes (C, D)
     - **Apprentice**: 3 notes (C, D, E)
     - **Adept**: 5 notes (C, D, E, F, G)
     - **Master**: 7 notes (C, D, E, F, G, A, B)
   - Enable/disable the option to hear a reference note before each duel.
   - Click "Start Adventure!" to begin the game.

2. **Progress Map**:
   - View all rival wizards and your current progress.
   - Click on an available wizard to start a duel.

3. **During the Duel**:
   - The rival wizard will cast a musical spell (a sequence of notes).
   - You must repeat exactly the same sequence to counter-attack.
   - If you repeat the sequence correctly, the rival wizard will lose energy.
   - If you make a mistake, you will lose energy.
   - The first to run out of energy loses the duel.

4. **Controls**:
   - **On-screen buttons**: Click the colored buttons to play the notes.
   - **Keyboard**: Use the keys C, D, E, F, G, A, B.

## Rival Wizards

1. **Melodic Apprentice** - Level 1
   - The first rival, perfect for practicing your basic skills.

2. **Octave Sorcerer** - Level 2
   - A more experienced wizard who tests your musical memory.

3. **Harmonic Mage** - Level 3
   - An expert sorceress who uses complex musical sequences.

4. **Symphonic Archmage** - Level 4
   - The most powerful wizard, with the longest and most difficult sequences.

## Scoring System

The game features a dynamic scoring system that takes into account several factors:

- **Base points**: 1000 points for each completed level
- **Health bonus**: 10 additional points for each remaining health point
- **Difficulty multipliers**:
  - Novice: x1
  - Apprentice: x1.5
  - Adept: x2
  - Master: x3
- **Reference modifier**: If you play with the reference note enabled, a 0.8 multiplier is applied to the final score

Scores are saved to the Hall of Fame in two cases:
1. Upon completing all levels and defeating the Symphonic Archmage
2. Upon being defeated, but only if you've scored more than 0 points and your score is high enough to enter the top 10

During the game, you can see your current score on the progress map, allowing you to decide if you want to repeat previous duels to improve your score before facing more powerful wizards.

## Technologies Used

- HTML5
- CSS3
- JavaScript (ES6 Modules)
- Web Audio API
- Node.js (local server)

## Browser Compatibility

Musical Spells is compatible with modern browsers such as:
- Google Chrome (recommended)
- Mozilla Firefox
- Safari
- Microsoft Edge

For the best experience, it's recommended to use the latest version of these browsers.

## Project Structure

```
MusicalSpells/
│
├── index.html          # Main game page
├── styles.css         # CSS styles
├── server.js         # Local development server
├── js/              # JavaScript modules
│   ├── main.js      # Main entry point
│   ├── game.js      # Main game logic
│   ├── audio.js     # Audio and musical notes management
│   ├── ui.js        # User interface management
│   ├── i18n.js      # Internationalization system
│   └── enemies.js   # Enemy configuration
│
├── i18n/            # Translation files
│   ├── en.json     # English translations
│   └── es.json     # Spanish translations
│
├── LICENSE          # GPL v3 License
├── TRANSLATIONS.md  # Guide for adding new translations
├── README.md        # This file (English)
└── README.es.md     # Spanish version
```

## Contributing Translations

Musical Spells supports multiple languages through its internationalization system. If you want to add support for a new language, please check our [Translation Guide](TRANSLATIONS.md) for detailed instructions.

## Possible Future Improvements

- Add bonus points when not using the reference note
- Implement a combo system for consecutive successful spells

- Story mode with dialogues and plot
- Add tests
- Remove the ability to repeat a battle?
- Add time bonus/penalty
- Add more levels and rival wizards
- Implement advanced visual effects
- Include a two-player mode
- Add special spells that generate different effects
- Create a progression system with unlockable abilities
- Customization options for the player character
- Support for additional languages

## License

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE](LICENSE) file for details.

## Credits

This project was developed primarily with AI assistance:

- **Claude 3.5 (also 3.7) Sonnet**: Used for the majority of code development, including game logic, mechanics, and structure. Both versions contributed to different aspects of the project's implementation.
- **GitHub Copilot**: Used for code completion, suggestions, and pair programming assistance throughout the development process.

The project demonstrates the capabilities of modern AI language models in software development, with almost all of the code being generated by Claude Sonnet. Human oversight was maintained for project design, game mechanics, and final decision-making.

---

Developed as an educational and entertainment project. Enjoy the game and become the best musical wizard!
