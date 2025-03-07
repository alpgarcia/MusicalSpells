# Adding New Translations to Musical Spells

This guide explains how to add support for new languages to Musical Spells.

## File Structure

Translations are managed through JavaScript modules located in the `js/translations` folder:
```
js/translations/
├── index.js   # Exports all translations
├── en.js      # English translations
├── es.js      # Spanish translations
└── [lang].js  # Your new language file
```

## Adding a New Language

1. Create a new JavaScript file in the `js/translations` folder named with your language's ISO 639-1 code (e.g., `fr.js` for French, `de.js` for German).

2. Export your translations as a constant. Copy the structure from `en.js` and translate all values, keeping the keys unchanged. The basic structure is:

```js
export const frenchTranslations = {
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

3. Add your translation module to `index.js`:
```js
import { frenchTranslations } from './fr.js';
// ...existing imports...

export const TRANSLATIONS = {
    // ...existing translations...
    fr: frenchTranslations
};
```

4. Pay special attention to:
   - Placeholders like `{enemy}`, `{damage}`, `{score}` - keep these exactly as they are
   - Musical notes - decide whether to use local notation or keep C, D, E, F, G, A, B
   - Keep special characters like "✓", "★", etc.
   - Maintain consistent casing and spacing in translation keys
   - Keep your translation module organized like the existing ones

## Translation Keys

Here's a complete list of sections that need to be translated:

- `game`: Main game texts
- `difficulty`: Difficulty level names and descriptions
- `options`: Game options and settings
- `buttons`: All button texts
- `battle`: Battle-related messages
- `map`: Map screen texts
- `hallOfFame`: Hall of Fame texts and labels
- `screens`: Various screen-specific texts
- `enemies`: Names and descriptions of rival wizards

## Testing Your Translation

1. Once you've added your translation module and updated `index.js`, the game will automatically detect it and make it available in the language selector.

2. Test your translation by:
   - Starting the game
   - Clicking the language selector
   - Selecting your newly added language
   - Going through all game screens to verify the translations
   - Testing all placeholders work correctly
   - Verifying special characters display properly

## Notes for Translators

- Keep the same tone and style as the original text
- Maintain the magical/fantasy theme
- Ensure messages fit in their UI elements (keep translations concise)
- Test special characters and ensure proper encoding (UTF-8)
- Consider cultural adaptations while maintaining gameplay clarity
- Follow the existing code style in translation modules

## Technical Implementation

If you need to modify how translations are handled, check these files:

- `js/i18n.js`: Main internationalization system
- `js/ui.js`: UI update logic when language changes
- `index.html`: Elements with `data-i18n` and `data-i18n-placeholder` attributes

The internationalization system uses a simple key-based approach where:
- Keys are defined in a hierarchical object structure
- The `i18n.t()` function handles placeholders replacement
- Language changes trigger a UI update event
- The UI manager handles translation of DOM elements

## Contributing Translations

1. Fork the repository
2. Create your translation module
3. Update the translations index
4. Test thoroughly
5. Submit a pull request with:
   - Your translation module
   - Updated `index.js`
   - Updated README files if needed
   - Any necessary cultural adaptations in the UI

## Questions?

If you have questions about:
- Translating specific terms
- Context for certain strings
- Technical implementation
- Cultural adaptations

Please open an issue in the repository.