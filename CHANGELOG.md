# Changelog
All notable changes to Musical Spells will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

> **Note**: When updating the version number, remember to update it in both:
> - `package.json`: Used by npm for dependency management and scripts
> - `js/config.js`: Used by the game to display the version in the UI and ensure proper version display in both local and online environments
>
> This dual location is necessary because `package.json` is not accessible in the browser when deployed to GitHub Pages, while `config.js` ensures the version is always visible to users regardless of deployment environment.

## [0.6.0-beta] - 2025-03-14
### Added
- Complete unit test coverage for all major components:
  - Overall coverage: 95.4% statements, 92.43% branches, 94.93% functions
  - Full coverage (100%) achieved in audio.js, config.js, scores.js and translations
  - High coverage in core components: game.js (94.28%), i18n.js (97.67%), ui.js (94.05%)
- Organization of documentation into specialized guides:
  - User guides: getting-started and gameplay documentation
  - Developer guides: contributing and testing guides
  - Translation guide with detailed instructions

### Changed
- Improved documentation structure and organization:
  - Moved most documentation to `docs/` directory
  - Simplified README to be more focused and concise
  - Separated user and developer documentation
  - Enhanced git commit message guidelines
- Updated development documentation with improved testing instructions
- Added online version link to documentation

## [0.5.2-beta] - 2025-03-08
### Changed
- Increased display time for damage messages during combat.
- Improved translations presentation in the Wall of Sorcery.

### Fixed
- Fixed translation system issues:
    - Fixed multiple errors in map and combat screens when changing language.
    - Fixed incorrect placeholders in the scores screen.
    - Fixed button translation errors.
- Changed 'Continue' button position in combat screen.
- Fixed touch controls on mobile devices (note taps were not being detected).

## [0.5.0-beta] - 2025-03-08
### Added
- Basic musical duel system.
- Four difficulty levels: Novice, Apprentice, Adept, and Master.
- Multi-language support (English and Spanish).
- Option to hear reference note before each duel.
- Sound effects system and visual feedback.
- Keyboard and mouse control support.
- Scoring system with leaderboard (Wall of Sorcery).