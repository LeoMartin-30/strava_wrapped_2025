# Contributing to Strava Wrapped

Thank you for your interest in contributing to Strava Wrapped! This document provides guidelines and instructions for contributing.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Adding New Slides](#adding-new-slides)
- [Code Style Guidelines](#code-style-guidelines)
- [Testing](#testing)
- [Pull Request Process](#pull-request-process)
- [Translation Contributions](#translation-contributions)

## Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inclusive experience for everyone. We expect all contributors to:

- Use welcoming and inclusive language
- Be respectful of differing viewpoints
- Accept constructive criticism gracefully
- Focus on what is best for the community
- Show empathy towards other community members

### Our Standards

Examples of behavior that contributes to a positive environment:
- Providing helpful feedback
- Being patient with newcomers
- Focusing on collaboration over competition

Examples of unacceptable behavior:
- Harassment, trolling, or personal attacks
- Publishing others' private information
- Other conduct inappropriate in a professional setting

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- Git
- A code editor (VS Code recommended)
- Basic knowledge of React, TypeScript, and Next.js

### Setup

1. **Fork the repository** on GitHub

2. **Clone your fork** locally:
```bash
git clone https://github.com/YOUR_USERNAME/strava-wrapped.git
cd strava-wrapped
```

3. **Add upstream remote**:
```bash
git remote add upstream https://github.com/ORIGINAL_OWNER/strava-wrapped.git
```

4. **Install dependencies**:
```bash
npm install
```

5. **Start development server**:
```bash
npm run dev
```

6. **Open http://localhost:3000** to see the app

## Development Workflow

### Creating a Feature Branch

Always create a new branch for your work:

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
# or
git checkout -b translation/language-code
```

### Branch Naming Convention

- `feature/` - New features or enhancements
- `fix/` - Bug fixes
- `translation/` - Translation additions
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Adding or updating tests

### Keeping Your Fork Updated

```bash
git fetch upstream
git checkout main
git merge upstream/main
git push origin main
```

### Making Changes

1. Make your changes in your feature branch
2. Test thoroughly (see Testing section)
3. Commit with clear, descriptive messages
4. Push to your fork
5. Open a Pull Request

## Adding New Slides

### Slide Component Template

Create a new file in `/components/slides/YourSlide.tsx`:

```typescript
'use client';

import { motion } from 'framer-motion';
import { SlideProps } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';
import AnimatedCounter from '../AnimatedCounter';

export default function YourSlide({ data, onNext, onPrevious }: SlideProps) {
  const { t } = useLanguage();

  // Skip if no data
  if (!data.yourMetric) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onNext}
      className="h-full w-full relative overflow-hidden cursor-pointer"
      style={{
        background: 'linear-gradient(160deg, #0f1419 0%, #1a1f29 50%, #0a0d12 100%)',
      }}
    >
      {/* Your slide content */}
      <div className="relative h-full w-full flex flex-col items-center justify-center p-6">
        <h2>{t('slide.yourslide.title')}</h2>
        <p>{t('slide.yourslide.description')}</p>
        
        {/* Use AnimatedCounter for numbers */}
        <AnimatedCounter to={data.yourMetric} duration={2} delay={0.8} />
      </div>
    </motion.div>
  );
}
```

### Slide Requirements

1. **Always include:**
   - `'use client'` directive (Next.js App Router)
   - Framer Motion animations (initial, animate, exit)
   - Click handler for `onNext`
   - Null guard if data might be missing
   - Translation support via `useLanguage()`

2. **Design guidelines:**
   - Use the gradient background pattern
   - Follow 9:16 aspect ratio constraints
   - Include "Tap to continue" indicator
   - Maintain visual consistency with existing slides
   - Test on mobile viewports

3. **Performance:**
   - Keep animations smooth (60fps)
   - Use `transform` and `opacity` for animations (GPU-accelerated)
   - Avoid heavy calculations in render
   - Lazy load images if used

### Integrating Your Slide

1. Add to main app (`/app/page.tsx`):

```typescript
import YourSlide from '@/components/slides/YourSlide';

// In renderSlide():
case slideIndex === currentSlideIndex: {
  return (
    <YourSlide
      key="your-slide"
      data={processedData}
      onNext={handleNext}
      onPrevious={handlePrevious}
    />
  );
}
```

2. Update slide count in `getTotalSlides()`

3. Add translations to `LanguageContext.tsx`

## Code Style Guidelines

### TypeScript

- Use strict mode
- Prefer interfaces over types for object shapes
- Avoid `any` - use `unknown` if type is truly unknown
- Export types that might be used elsewhere

### React

- Use functional components only
- Prefer hooks over HOCs or render props
- Keep components small and focused
- Extract reusable logic into custom hooks

### Naming Conventions

- **Components**: PascalCase (`MyComponent.tsx`)
- **Hooks**: camelCase starting with `use` (`useMyHook.ts`)
- **Utilities**: camelCase (`dataProcessor.ts`)
- **Types**: PascalCase (`interface SlideProps`)
- **Constants**: SCREAMING_SNAKE_CASE (`MAX_FILE_SIZE`)

### File Organization

```
Component.tsx structure:
1. 'use client' directive (if needed)
2. Imports (React, external libs, internal)
3. Type definitions
4. Main component
5. Helper functions (below component)
6. Styled components (if any)
```

### Comments

```typescript
// Good: Explain WHY, not WHAT
// Calculate FTP zones using the standard 7-zone model
const zones = calculateFTPZones(ftp);

// Bad: Explains obvious code
// Set the FTP variable to the FTP value
const ftp = data.ftp;

// Good: JSDoc for public functions
/**
 * Processes Strava activities and calculates comprehensive statistics
 * @param activities - Array of Strava activity objects
 * @param year - Optional year filter (defaults to current year)
 * @returns Processed statistics object
 */
export function processActivities(activities: Activity[], year?: number) {
  // ...
}
```

### Formatting

- Use Prettier (auto-format on save)
- 2 spaces for indentation
- Single quotes for strings
- Semicolons required
- Trailing commas in multi-line objects/arrays

## Testing

### Manual Testing Checklist

Before submitting a PR, test:

- [ ] Upload a real Strava ZIP file
- [ ] Navigate through all slides
- [ ] Test on mobile viewport (375x667, 414x896)
- [ ] Test on desktop (1920x1080)
- [ ] Try both French and English languages
- [ ] Test with edge cases:
  - [ ] Minimal data (1 activity)
  - [ ] Large dataset (1000+ activities)
  - [ ] Missing data fields (no heart rate, no power)
  - [ ] Year with no activities
- [ ] Check browser console for errors
- [ ] Verify animations are smooth
- [ ] Test export functionality

### Testing Different Data Scenarios

Create test ZIP files with:
1. Only running activities
2. Only cycling activities
3. Mix of all activity types
4. Activities without GPS data
5. Activities without heart rate
6. Activities without power meter

### Browser Testing

Test on:
- Chrome/Edge (Chromium)
- Firefox
- Safari (desktop and iOS)

## Pull Request Process

### Before Submitting

1. ✅ Your code follows the style guidelines
2. ✅ You've tested thoroughly
3. ✅ You've updated documentation if needed
4. ✅ Your commits have clear messages
5. ✅ You've resolved any merge conflicts
6. ✅ Build succeeds: `npm run build`

### PR Title Format

```
<type>: <description>

Types:
- feat: New feature
- fix: Bug fix
- docs: Documentation changes
- style: Code style changes (formatting)
- refactor: Code refactoring
- test: Adding tests
- chore: Build process or tooling changes

Examples:
- feat: Add PowerSlide for displaying wattage statistics
- fix: Correct date formatting for English locale
- docs: Update translation guide with Spanish example
- refactor: Extract CSV parsing logic into separate module
```

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update
- [ ] Translation

## Testing
Describe how you tested this

## Screenshots (if applicable)
Add screenshots for visual changes

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-reviewed code
- [ ] Commented hard-to-understand areas
- [ ] Updated documentation
- [ ] No new warnings
- [ ] Tested on mobile and desktop
```

### Review Process

1. Maintainer will review within 48-72 hours
2. Address any requested changes
3. Once approved, it will be merged
4. Your contribution will be credited

## Translation Contributions

See [TRANSLATION_GUIDE.md](./TRANSLATION_GUIDE.md) for detailed translation instructions.

### Quick Translation PR Checklist

- [ ] Added all translations to `LanguageContext.tsx`
- [ ] Tested every slide in the new language
- [ ] Verified text doesn't overflow
- [ ] Included screenshots of key slides
- [ ] Updated README to list the new language

## Recognition

All contributors will be:
- Listed in the project README
- Credited in release notes
- Given a shoutout on social media (if desired)

## Questions?

- Open an issue with the `question` label
- Check existing issues and discussions
- Review closed PRs for similar changes

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for making Strava Wrapped better for everyone!** 🚀
