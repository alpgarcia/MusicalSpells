# Adding New Translations to Musical Spells

## Introduction

Musical Spells uses a flexible internationalization system that makes it easy to add new languages. This guide will walk you through the process of adding translations to the game.

## File Structure

Translations are managed through JavaScript modules located in the `js/translations` folder:
```
js/translations/
├── index.js     # Exports all translations
├── en.js        # English translations
├── es.js        # Spanish translations
└── [lang].js    # Your new language file
```

## Adding a New Language

1. Create a new file `js/translations/[lang].js` (e.g., `fr.js` for French)
2. Copy the structure from an existing translation file
3. Translate all strings
4. Add your language to `js/translations/index.js`
5. Add language button to index.html

### Translation File Template

```javascript
export default {
    enemies: {
        melodicApprentice: {
            name: "Translated name"
        },
        // ... more enemies
    },
    battle: {
        prepare: "Translated message",
        // ... more battle messages
    },
    // ... more sections
};
```

## Translation Keys

### Enemies Section
- `enemies.[enemyId].name`: Enemy names displayed in battle and map

### Battle Messages
- `battle.prepare`: Initial battle message
- `battle.enemyTurn`: Enemy turn message
- `battle.playerTurn`: Player turn message
- `battle.spellHit`: Successful spell message
- `battle.spellFail`: Failed spell message
- `battle.victory`: Victory message
- `battle.defeat`: Defeat message

### Map Messages
- `map.nextDuel`: Next duel message
- `map.allDefeated`: All enemies defeated message
- `map.level`: Level indicator
- `map.currentScore`: Score display

### Interface Elements
- `buttons.continue`: Continue button
- `buttons.startGame`: Start game button
- `difficulty.[level]`: Difficulty level names
- `hallOfFame.title`: Hall of Fame title
- `hallOfFame.enterName`: Name input prompt

## Testing Your Translation

1. Start the game: `node server.js`
2. Test all screens and messages
3. Verify text fits in UI elements
4. Check special characters display correctly
5. Test with different browser zoom levels

## Cultural Adaptations

Consider these aspects when translating:
- Keep the magical/fantasy theme consistent
- Maintain appropriate formality level
- Adapt idiomatic expressions
- Consider cultural sensitivities
- Preserve gameplay clarity

## Technical Guidelines

### Text Length
- Keep translations concise
- Test in UI elements
- Consider mobile displays
- Use abbreviations if needed

### Special Characters
- Use UTF-8 encoding
- Test with target fonts
- Consider fallback fonts
- Verify character display

### Placeholders
Messages can contain placeholders:
- `{enemy}`: Enemy name
- `{damage}`: Damage amount
- `{score}`: Player score
- `{level}`: Level number
- `{difficulty}`: Difficulty stars

Example:
```javascript
{
    battle: {
        spellHit: "{enemy} takes {damage} damage!"
    }
}
```

## Submitting Translations

1. Fork the repository
2. Create your translation module
3. Update translations index
4. Test thoroughly
5. Submit a pull request with:
   - Your translation module
   - Updated `index.js`
   - Updated documentation if needed
   - Any necessary cultural adaptations

## Quality Checklist

- [ ] All strings translated
- [ ] Placeholders preserved
- [ ] Special characters working
- [ ] Text fits UI elements
- [ ] Cultural adaptations made
- [ ] Documentation updated
- [ ] Tests passing

## Getting Help

If you need help with:
- Translation context
- Technical implementation
- Cultural adaptations
- UI constraints

Please:
1. Check existing translations
2. Review documentation
3. Open an issue if needed

## Translation Updates

When the game is updated:
1. New strings will be added to `en.js`
2. Update your language file
3. Test new content
4. Submit updates via PR

Remember to maintain:
- Consistent style
- Accurate meaning
- Cultural relevance
- Technical correctness