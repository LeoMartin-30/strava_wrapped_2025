# Strava Wrapped 2025 🏃‍♂️⛰️

> "2025 n'était pas une année, c'était une épopée."

A privacy-first, beautifully designed year-in-review experience for Strava athletes. Transform your athletic data into an engaging visual story with 20+ interactive slides.

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat&logo=next.js) ![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?style=flat&logo=typescript) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?style=flat&logo=tailwindcss) ![Privacy](https://img.shields.io/badge/Privacy-First-00D084?style=flat)

## ✨ Features

### 🎨 Vintage Athletic Passport Design
- **Cohesive vintage aesthetic**: Dark gradients, animated grids, retro-inspired badges
- **Smooth animations**: GPU-accelerated with Framer Motion
- **Mobile-optimized**: 9:16 aspect ratio, perfect for social sharing
- **French localization**: Immersive French copy throughout

### 📊 Comprehensive Analytics (20+ Slides)
1. **Identity**: Personalized welcome with profile data
2. **Intro**: Dashboard with key metrics
3. **Activity Breakdown**: Top 5 activity types with distribution
4. **Intensity**: Heart rate zone distribution
5. **Power**: Peak and average wattage
6. **Elevation**: Mountain comparisons (Mont Blanc, Everest)
7. **Gravity**: Elevation loss and knee impact
8. **Trail**: Trail vs. road percentage with badges
9. **Calories**: Burned calories converted to croissants 🥐
10. **Chronos**: Time of day distribution (5h-12h, 12h-18h, 18h-22h, 22h-5h)
11. **Weather**: Temperature extremes
12. **Emoji**: Top 3 emojis from activity names
13. **Kudos**: Comments marquee and community engagement
14. **Moteur**: FTP and max heart rate metrics
15. **Social**: Messages sent and clubs joined
16. **Addict**: Login patterns and peak activity times
17. **Consistency**: Activity streaks and dedication
18. **Records**: Personal bests (longest, fastest)
19. **Badge**: Unique badge showcasing your year.
20. **Summary**: Year recap with confetti celebration

### 🔒 Privacy-First Architecture
- **100% client-side**: Your data never leaves your browser
- **No backend**: Zero data collection, storage, or transmission
- **Secure by design**: No API keys, no databases, no tracking
- **Instant processing**: Analyze your entire Strava export in seconds

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/yourusername/strava-wrapped.git
cd strava-wrapped

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

### Getting Your Strava Data

1. Visit [strava.com/account](https://www.strava.com/account)
2. Under "Download or Delete Your Account", click ["Request Your Archive"](https://www.strava.com/athlete/delete_your_account)
3. Receive download link via email (< 3 minutes)
4. Upload the ZIP file to Strava Wrapped

## 🏗️ Tech Stack

| Technology | Purpose |
|------------|---------|
| [Next.js 15](https://nextjs.org/) | React framework with App Router |
| [TypeScript 5.7](https://www.typescriptlang.org/) | Type safety and developer experience |
| [Tailwind CSS 3.4](https://tailwindcss.com/) | Utility-first styling |
| [Framer Motion 11](https://www.framer.com/motion/) | Fluid animations |
| [JSZip](https://stuk.github.io/jszip/) | Client-side ZIP extraction |
| [PapaParse](https://www.papaparse.com/) | CSV parsing |
| [Lucide React](https://lucide.dev/) | Beautiful icons |

## 📁 Project Structure

```
strava-wrapped/
├── app/
│   ├── page.tsx              # Main application with slide orchestration
│   └── layout.tsx            # Root layout and fonts
├── components/
│   ├── slides/               # 20+ interactive slide components
│   ├── upload/
│   │   └── FileUpload.tsx    # Drag-and-drop ZIP upload
│   └── AnimatedCounter.tsx   # Smooth number animations
├── lib/
│   ├── zipParser.ts          # Strava ZIP extraction and parsing
│   ├── csvParser.ts          # Activity data CSV parsing
│   └── dataProcessor.ts      # Statistics calculation engine
├── types/
│   └── index.ts              # TypeScript type definitions
└── public/                   # Static assets
```

## 🎯 Key Technical Highlights

### Security & Privacy
- ✅ Client-side only (no server exposure)
- ✅ No external API calls or data transmission
- ✅ File validation (ZIP format, 500MB limit)
- ✅ Secure error handling with boundaries
- ✅ No cookies, no tracking, no analytics

### Performance
- ✅ Optimized ZIP parsing for large exports
- ✅ Efficient CSV streaming processing
- ✅ Lazy loading for slide components
- ✅ Minimal bundle size (no chart libraries bloat)
- ✅ Hardware-accelerated animations

### Code Quality
- ✅ TypeScript strict mode
- ✅ Component modularity and reusability
- ✅ Clean architecture with separation of concerns
- ✅ Professional-grade codebase
- ✅ ESLint and Prettier configured

## 🎮 Navigation

- **Click/Tap**: Advance to next slide
- **Arrow Left (←)**: Go back
- **Arrow Right (→)** or **Space**: Go forward
- **Progress Dots**: Click to jump to any slide

## 📦 Deployment

### Vercel (Recommended)

```bash
npm run build
vercel --prod
```

### Netlify

```bash
npm run build
netlify deploy --prod
```

### Docker

```bash
docker build -t strava-wrapped .
docker run -p 3000:3000 strava-wrapped
```

## 🛠️ Development

### Adding New Slides

1. Create component in `components/slides/YourSlide.tsx`
2. Import in `app/page.tsx`
3. Add to `renderSlide()` with conditional logic
4. Update `getTotalSlides()` count

### Customizing Colors

Edit `tailwind.config.ts`:

```typescript
colors: {
  strava: {
    orange: '#FC4C02',
    anthracite: '#242428',
    dark: '#1A1A1D',
    gray: '#4A4A4F',
  },
}
```

## 🌍 Internationalization & Personalization 

### Supported Languages
- 🇫🇷 **French** (Français) - Primary language
- 🇬🇧 **English** - Fully supported

### Adding Your Language

Want to add support for Spanish, German, Italian, or Portuguese? See [TRANSLATION_GUIDE.md](./TRANSLATION_GUIDE.md) for detailed instructions.

Quick overview:
1. Add translations to `/contexts/LanguageContext.tsx`
2. Follow the naming pattern: `slide.{slidename}.{descriptor}`
3. Test all slides in both languages
4. Submit a pull request!

### Gender Specifics
- 🇫🇷 In French, some slides are adapted to gender of the user (data available in profile.csv), to be personnalized : "Chasseur de Kudos" becomes "Chasseuse de Kudos" for example.


## 📄 License

MIT License - Free to use for personal or commercial projects.

## 🙏 Acknowledgments

- Inspired by [Spotify Wrapped](https://www.spotify.com/wrapped/)
- Built for the Strava athlete community
- Next.js and React

---

**Built with ❤️ by athlete, for athletes**

*Keep moving. Keep climbing. Keep conquering.*
