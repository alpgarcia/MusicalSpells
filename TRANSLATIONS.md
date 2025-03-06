# Adding New Translations to Musical Spells

This guide explains how to add support for new languages to Musical Spells.

## File Structure

Translations are managed through JSON files located in the `i18n` folder:
```
i18n/
├── en.json    # English translations
├── es.json    # Spanish translations
└── [lang].json # Your new language file
```

## Adding a New Language

1. Create a new JSON file in the `i18n` folder named with your language's ISO 639-1 code (e.g., `fr.json` for French, `de.json` for German).

2. Copy the structure from `en.json` and translate all values, keeping the keys unchanged. The basic structure is:

```json
{
    "game": {
        "title": "Musical Spells",
        "subtitle": "Your translated subtitle",
        "description": "Your translated description",
        "instructions": "Your translated instructions"
    },
    "difficulty": {
        "title": "Your translation",
        "novice": "Your translation (2 notes)",
        "apprentice": "Your translation (3 notes)",
        "adept": "Your translation (5 notes)",
        "master": "Your translation (7 notes)"
    },
    ...
}
```

3. Pay special attention to:
   - Placeholders like `{enemy}`, `{damage}`, `{score}` - keep these exactly as they are
   - Musical notes - decide whether to use local notation or keep C, D, E, F, G, A, B
   - Keep special characters like "✓", "★", etc.

## Translation Keys

Here's a complete list of sections that need to be translated:

- `game`: Main game texts
- `difficulty`: Difficulty level names and descriptions
- `options`: Game options and settings
- `buttons`: All button texts
- `battle`: Battle-related messages
- `map`: Map screen texts
- `hallOfFame`: Hall of Fame texts and labels
- `enemies`: Names of the rival wizards

## Testing Your Translation

1. Once you've created your translation file, the game will automatically detect it and make it available in the language selector.

2. Test your translation by:
   - Starting the game
   - Clicking the language selector
   - Selecting your newly added language
   - Going through all game screens to verify the translations

## Notes for Translators

- Keep the same tone and style as the original text
- Maintain the magical/fantasy theme
- Ensure messages fit in their UI elements (keep translations concise)
- Test special characters and ensure proper encoding (UTF-8)
- Consider cultural adaptations while maintaining gameplay clarity

## Technical Implementation

If you need to modify how translations are handled, check these files:

- `js/i18n.js`: Main internationalization module
- `js/ui.js`: UI update logic when language changes
- `index.html`: Elements with `data-i18n` attributes

## Contributing Translations

1. Fork the repository
2. Add your translation file
3. Test thoroughly
4. Submit a pull request with:
   - Your translation file
   - Updated README files if needed
   - Any necessary cultural adaptations in the UI

## Questions?

If you have questions about translating specific terms or need context for certain strings, please open an issue in the repository.