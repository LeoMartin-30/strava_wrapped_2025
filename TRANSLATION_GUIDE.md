# Translation Guide - Strava Wrapped

This guide explains how to add translations to Strava Wrapped or modify existing ones.

## Overview

Strava Wrapped uses a React Context-based i18n system located in `/contexts/LanguageContext.tsx`. All translatable text is stored in a centralized dictionary.

## Translation System Architecture

### File Structure
```
/contexts/
  └── LanguageContext.tsx  # Main translation dictionary and context

/components/slides/
  └── *Slide.tsx           # All slide components use useLanguage() hook
```

### How It Works

1. **Translation Dictionary** (`LanguageContext.tsx`)
   - Contains all translations in a nested object structure
   - Organized by language code (`fr`, `en`, etc.)
   - Keys follow the pattern: `category.subcategory.key`

2. **Usage in Components**
   ```typescript
   import { useLanguage } from '@/contexts/LanguageContext';
   
   export default function MySlide() {
     const { t, language } = useLanguage();
     
     return <h1>{t('slide.example.title')}</h1>;
   }
   ```

3. **Language Persistence**
   - User's language preference is saved to `localStorage`
   - Automatically restored on page reload
   - Defaults to French if no preference is set

## Adding a New Language

### Step 1: Add Language to Type Definition

In `LanguageContext.tsx`, update the `Language` type:

```typescript
export type Language = 'fr' | 'en' | 'es';  // Add 'es' for Spanish
```

### Step 2: Create Translation Dictionary

Add a new language object to the `translations` object:

```typescript
const translations: Record<Language, Record<string, string>> = {
  fr: { /* existing French translations */ },
  en: { /* existing English translations */ },
  es: {
    // Upload screen
    'upload.title': 'Strava Wrapped',
    'upload.subtitle': 'Tu 2025 en Movimiento',
    'upload.humor': 'A Strava no le gusta que juegues con tus datos. Vamos a liberarlos.',
    // ... add ALL keys from French/English
  },
};
```

### Step 3: Update Language Switcher

Create or update the language switcher component to include the new language option.

### Step 4: Test Thoroughly

- Check ALL slides in the new language
- Verify date formatting
- Test number formatting (decimal separators)
- Ensure text doesn't overflow containers
- Check for RTL languages (requires additional work)

## Translation Key Naming Convention

Follow this pattern for consistency:

```
{category}.{subcategory}.{descriptor}

Examples:
- upload.title
- upload.error.zipOnly
- slide.intro.title
- slide.intro.message1
- slide.records.longestDistance
- common.activities
- common.km
```

### Categories

- `upload.*` - File upload screen
- `tutorial.*` - Tutorial/instructions
- `common.*` - Reusable terms (activities, km, hours, etc.)
- `slide.{slidename}.*` - Slide-specific translations

### Best Practices

1. **Keep keys descriptive**: `slide.records.longestDistance` not `slide.records.text1`
2. **Use common keys**: Don't duplicate "Tap to continue" - use `common.tapToContinue`
3. **Consistent casing**: All keys in camelCase
4. **No abbreviations**: `longestDistance` not `longDist`

## Complete Translation Checklist

When adding a new language, translate ALL these sections:

### Upload Screen (15 keys)
- [ ] upload.title
- [ ] upload.subtitle
- [ ] upload.humor
- [ ] upload.dropzone
- [ ] upload.instruction
- [ ] upload.fileType
- [ ] upload.privacy
- [ ] upload.loading
- [ ] upload.extracting
- [ ] upload.wait
- [ ] upload.processing
- [ ] upload.pleaseWait
- [ ] upload.error.zipOnly
- [ ] upload.error.tooLarge

### Tutorial (5 keys)
- [ ] tutorial.howTo
- [ ] tutorial.step1
- [ ] tutorial.step2
- [ ] tutorial.step2Link
- [ ] tutorial.step3
- [ ] tutorial.step4

### Common Terms (10+ keys)
- [ ] common.tapToContinue
- [ ] common.activities
- [ ] common.km
- [ ] common.hours
- [ ] common.morning
- [ ] common.midday
- [ ] common.afternoon
- [ ] common.evening
- [ ] common.night

### Slides (200+ keys across 20+ slides)
Each slide typically has 5-15 translation keys. See the French section in `LanguageContext.tsx` for the complete list.

## Handling Dynamic Text

### Plurals

Use conditional rendering:

```typescript
{count} {count === 1 ? t('common.activity') : t('common.activities')}
```

### Template Strings

Some translations contain placeholders like `{percentage}`:

```typescript
// Translation: "Spent {percentage}% of time in this zone"
t('slide.intensity.spentInZone').replace('{percentage}', percentage.toString())
```

### Numbers

Format numbers according to locale:

```typescript
const formatNumber = (num: number) => {
  return new Intl.NumberFormat(language === 'fr' ? 'fr-FR' : 'en-US').format(num);
};
```

### Dates

Always use `Intl.DateTimeFormat` with the current language:

```typescript
const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat(
    language === 'fr' ? 'fr-FR' : 'en-US',
    { month: 'short', day: 'numeric' }
  ).format(date);
};
```

## Translation Quality Guidelines

### Do's
✅ Use natural, conversational language
✅ Maintain the tone and energy of the original
✅ Keep text concise (slides have limited space)
✅ Test on mobile (9:16 aspect ratio)
✅ Preserve emoji meanings
✅ Adapt cultural references when needed

### Don'ts
❌ Don't use machine translation without review
❌ Don't translate proper nouns (Strava, Mont Blanc, etc.)
❌ Don't change formatting (bold, caps, etc.)
❌ Don't make text significantly longer
❌ Don't translate units (km, m, °C stay the same)

## Testing Your Translation

### Visual Test
1. Set language to your new language
2. Go through ALL slides
3. Check for:
   - Text overflow
   - Alignment issues
   - Missing translations (shows key instead of text)
   - Grammar/spelling errors

### Functional Test
1. Upload a Strava ZIP file
2. Navigate through all slides using:
   - Click/tap
   - Arrow keys
   - Progress dots
3. Test export functionality
4. Test language switcher

### Edge Cases
- Very long activity names
- Zero values (0 activities, 0 km)
- Null data (no heart rate, no power)
- Single vs. plural (1 activity vs 2 activities)

## Examples

### Good Translation
```typescript
// French: "Année Incroyable!"
// English: "Incredible Year!"
// Spanish: "¡Año Increíble!"
```

### Bad Translation (too long)
```typescript
// French: "Année Incroyable!"
// Bad English: "This Has Been An Absolutely Amazing Year!"
// (Won't fit in the UI)
```

### Good Adaptation
```typescript
// French: "La boulangerie te remercie" (The bakery thanks you)
// English: "The bakery thanks you"
// Spanish: "La panadería te agradece"
```

## Getting Help

- Open an issue on GitHub
- Ask in the Pull Request
- Check existing translations for patterns
- Test with real data from multiple users

## Contributing Your Translation

1. Fork the repository
2. Create a branch: `feature/translation-{language-code}`
3. Add translations to `LanguageContext.tsx`
4. Test thoroughly
5. Take screenshots of all slides
6. Submit Pull Request with:
   - Translation complete
   - Screenshots attached
   - Brief description of any adaptations made

Thank you for contributing to Strava Wrapped! 🌍
