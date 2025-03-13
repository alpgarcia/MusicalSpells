# Contributing to Musical Spells

Thank you for your interest in contributing to Musical Spells! This guide will help you understand how to contribute to the project.

## Project Structure

```
MusicalSpells/
├── js/              # JavaScript modules
│   ├── main.js      # Main entry point
│   ├── game.js      # Main game logic
│   ├── audio.js     # Audio and musical notes management
│   ├── scores.js    # Score system and hall of fame
│   ├── ui.js        # User interface management
│   ├── i18n.js      # Internationalization system
│   ├── config.js    # Configuration constants
│   ├── enemies.js   # Enemy configuration
│   ├── __tests__/   # Unit tests
│   └── translations/ # Translation modules
├── docs/            # Documentation
├── styles.css       # CSS styles
├── index.html       # Main game page
└── server.js        # Local development server
```

## Development Setup

1. Fork and clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   node server.js
   ```
4. Open http://localhost:3000 to see the game

## Core Components

### Game Engine (game.js)
The core game logic is managed by the `Game` class, which handles:
- Game state management
- Battle system
- Enemy AI and difficulty scaling
- Score tracking
- Player input processing

### Audio System (audio.js)
Handles all sound-related functionality:
- Musical note generation using Web Audio API
- Sound effects
- Audio context management
- Note frequency mapping

### User Interface (ui.js)
Manages the game's UI components:
- Screen transitions
- Health bars
- Battle messages
- Language switching
- Score display
- Progress map

### Internationalization (i18n.js)
Provides multi-language support:
- Dynamic language switching
- Translation key management
- Text replacement system
- DOM updates on language change

### Score System (scores.js)
Handles scoring and achievements:
- Score calculation
- Hall of Fame management
- Local storage integration
- High score validation

## Contributing Code

### Code Style
- Use ES6+ features appropriately
- Follow existing naming conventions
- Comment complex logic
- Keep functions focused and small
- Use meaningful variable names

### Pull Request Process
1. Create a feature branch
2. Make your changes
3. Add/update tests
4. Update documentation
5. Run tests (`npm test`)
6. Submit PR with clear description

### Commit Messages

We follow [The Seven Rules of a Great Git Commit Message](https://cbea.ms/git-commit/):

1. **Separate subject from body with a blank line**
   ```
   Add spell combo multiplier system

   This system encourages players to chain successful spells by:
   - Increasing score multiplier with each hit (max 4x)
   - Resetting multiplier on spell failure
   - Adding visual feedback for current multiplier
   ```

2. **Limit the subject line to 50 characters**
   - Good: "Add volume control to reference note"
   - Bad: "Added a new feature that lets users control the volume of the reference note when practicing"

3. **Capitalize the subject line**
   - Good: "Fix audio latency in mobile browsers"
   - Bad: "fix audio latency in mobile browsers"

4. **Do not end the subject line with a period**
   - Good: "Update enemy difficulty scaling"
   - Bad: "Update enemy difficulty scaling."

5. **Use the imperative mood in the subject line**
   - Good: "Add high score tracking"
   - Bad: "Added high score tracking"
   - Bad: "Adds high score tracking"

6. **Wrap the body at 72 characters**
   Each line in the commit body should be 72 characters or less for optimal readability in git tools.

7. **Use the body to explain what and why vs. how**
   ```
   Refactor spell validation system

   The previous implementation mixed game logic with UI updates,
   making it hard to test and maintain. This change separates
   concerns by moving all spell validation to the Game class.

   The UI now listens for game events instead of handling
   validation directly.
   ```

Examples of good commit messages:
```
Add practice mode with infinite health

This allows players to practice spell patterns without the
pressure of combat. Key changes:
- New UI toggle for practice mode
- Disable damage calculation in practice
- Add visual indicator for practice mode
```

```
Fix incorrect score calculation for Master difficulty

Score multiplier was being applied twice for Master level
battles. This resulted in artificially inflated scores
that made the leaderboard unfair.
```

Remember:
- Each commit should represent one logical change
- Write commits as instructions to the codebase
- Explain non-obvious changes in the commit body
- Consider your commit messages as documentation

## Development Guidelines

### Adding New Features
1. Start with an issue discussion
2. Plan implementation approach
3. Consider backwards compatibility
4. Add necessary tests
5. Update documentation
6. Submit changes as PR

### Modifying Existing Features
1. Understand current implementation
2. Maintain backward compatibility
3. Update affected tests
4. Document changes
5. Test thoroughly

### Code Quality
- Maintain test coverage
- Follow SOLID principles
- Keep code modular
- Consider performance
- Handle errors gracefully

## Getting Help

- Check existing issues
- Read documentation
- Ask for clarification
- Join discussions

## Review Process

PRs are reviewed for:
- Code quality
- Test coverage
- Documentation
- Performance impact
- Browser compatibility

## Technical Debt Management

Report technical debt as issues with:
- Clear problem description
- Impact assessment
- Suggested solutions
- Priority level

## Release Process

1. Version bump in:
   - package.json
   - js/config.js
2. Update changelog
3. Run full test suite
4. Create release tag
5. Deploy to GitHub Pages

Remember: Quality over quantity. Take time to write good code that others can maintain.