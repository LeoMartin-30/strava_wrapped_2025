#!/bin/bash

# Script to fix mobile responsiveness across all slide components
# This script applies consistent mobile-friendly CSS classes

SLIDES_DIR="/Users/leomartin/Strava_Wrapped/components/slides"

# Array of slides to fix (excluding already fixed ones)
SLIDES=(
  "IntroSlide.tsx"
  "IdentitySlide.tsx"
  "IntensitySlide.tsx"
  "PowerSlide.tsx"
  "GravitySlide.tsx"
  "TrailSlide.tsx"
  "CalorieSlide.tsx"
  "ChronosSlide.tsx"
  "ChronosMonthSlide.tsx"
  "ChronosDaySlide.tsx"
  "WeatherSlide.tsx"
  "ConsistencySlide.tsx"
  "RecordsSlide.tsx"
  "KudosSlide.tsx"
  "MoteurSlide.tsx"
  "SocialButterflySlide.tsx"
  "SummarySlide.tsx"
)

echo "Fixing mobile responsiveness for ${#SLIDES[@]} slide components..."

for slide in "${SLIDES[@]}"; do
  FILE="$SLIDES_DIR/$slide"

  if [ ! -f "$FILE" ]; then
    echo "Skipping $slide (not found)"
    continue
  fi

  echo "Processing $slide..."

  # Create backup
  cp "$FILE" "$FILE.bak"

  # Fix main container layout (justify-center p-6 -> justify-between py-8 px-6 safe-top safe-bottom)
  sed -i '' 's/justify-center p-6/justify-between py-8 px-6 safe-top safe-bottom/g' "$FILE"
  sed -i '' 's/justify-center p-8/justify-between py-8 px-6 safe-top safe-bottom/g' "$FILE"

  # Fix header margins (mb-8 -> mb-4)
  sed -i '' 's/className="text-center mb-8"/className="text-center mb-4"/g' "$FILE"

  # Fix icon container sizes (w-20 h-20 -> w-16 h-16)
  sed -i '' 's/w-20 h-20 rounded-full/w-16 h-16 rounded-full/g' "$FILE"

  # Fix icon sizes (w-10 h-10 -> w-8 h-8)
  sed -i '' 's/w-10 h-10 text-/w-8 h-8 text-/g' "$FILE"

  # Fix icon margins (mb-4 -> mb-3)
  sed -i '' 's/inline-block mb-4"/inline-block mb-3"/g' "$FILE"

  # Fix title sizes (text-4xl -> text-3xl)
  sed -i '' 's/text-4xl font-black mb-2/text-3xl font-black mb-1.5/g' "$FILE"
  sed -i '' 's/text-4xl font-black mb-3/text-3xl font-black mb-1.5/g' "$FILE"

  # Fix subtitle sizes (text-sm -> text-xs)
  sed -i '' 's/text-sm text-gray-400 tracking-wide/text-xs text-gray-400 tracking-wide/g' "$FILE"

  # Fix large number sizes (text-7xl -> text-6xl)
  sed -i '' 's/text-7xl font-black/text-6xl font-black/g' "$FILE"

  # Fix medium number sizes (text-6xl -> text-5xl)
  sed -i '' 's/text-6xl font-black/text-5xl font-black/g' "$FILE"

  # Fix card padding (p-8 -> p-6)
  sed -i '' 's/className="p-8 rounded/className="p-6 rounded/g' "$FILE"
  sed -i '' 's/className="p-5 rounded/className="p-4 rounded/g' "$FILE"

  # Fix bottom indicator positioning (absolute bottom-6 right-6 -> text-center mt-4)
  sed -i '' 's/className="absolute bottom-6 right-6"/className="text-center mt-4"/g' "$FILE"
  sed -i '' 's/className="absolute bottom-8 right-6"/className="text-center mt-4"/g' "$FILE"

  # Fix bottom indicator text size
  sed -i '' 's/text-xs tracking-widest uppercase font-semibold"/text-[10px] tracking-widest uppercase font-semibold"/g' "$FILE"

done

echo "Done! Backups saved with .bak extension"
echo "To restore backups, run: for f in $SLIDES_DIR/*.bak; do mv \"\$f\" \"\${f%.bak}\"; done"
