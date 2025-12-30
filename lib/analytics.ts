/**
 * Vercel Analytics tracking utilities
 * Provides reusable functions for tracking user events throughout the application
 */

import { track } from '@vercel/analytics'

/**
 * Track when a user uploads a ZIP file
 * @param fileName - Name of the uploaded file
 * @param fileSize - Size of the file in bytes
 */
export function trackZipUpload(fileName: string, fileSize: number) {
  // Format file size for better readability (KB, MB)
  const fileSizeFormatted = fileSize > 1024 * 1024
    ? `${(fileSize / (1024 * 1024)).toFixed(2)}MB`
    : `${(fileSize / 1024).toFixed(2)}KB`

  track('Zip Uploaded', {
    fileName: fileName.substring(0, 100), // Truncate to stay within 255 char limit
    fileSize: fileSizeFormatted,
  })

  console.log('📊 Analytics: Zip Uploaded', { fileName, fileSize: fileSizeFormatted })
}

/**
 * Track progress through the slide funnel
 * @param stepNumber - Current step number (0-based index)
 * @param stepName - Name of the current slide/step
 */
export function trackFunnelStep(stepNumber: number, stepName: string) {
  track('Funnel Step Reached', {
    stepNumber: stepNumber.toString(),
    stepName: stepName.substring(0, 100), // Truncate to stay within limits
  })

  console.log('📊 Analytics: Funnel Step Reached', { stepNumber, stepName })
}

/**
 * Track when a user completes the entire funnel
 * @param totalSlides - Total number of slides viewed
 * @param totalActivities - Number of activities processed
 */
export function trackConversionComplete(totalSlides: number, totalActivities: number) {
  track('Conversion Complete', {
    totalSlides: totalSlides.toString(),
    totalActivities: totalActivities.toString(),
  })

  console.log('📊 Analytics: Conversion Complete', { totalSlides, totalActivities })
}

/**
 * Track when a user exports/shares a slide
 * @param slideNumber - Which slide was exported
 * @param slideName - Name of the exported slide
 */
export function trackSlideExport(slideNumber: number, slideName: string) {
  track('Slide Exported', {
    slideNumber: slideNumber.toString(),
    slideName: slideName.substring(0, 100),
  })

  console.log('📊 Analytics: Slide Exported', { slideNumber, slideName })
}

/**
 * Track navigation between slides
 * @param direction - 'next' or 'previous'
 * @param fromSlide - Current slide number
 * @param toSlide - Target slide number
 */
export function trackSlideNavigation(direction: 'next' | 'previous', fromSlide: number, toSlide: number) {
  track('Slide Navigation', {
    direction,
    fromSlide: fromSlide.toString(),
    toSlide: toSlide.toString(),
  })

  console.log('📊 Analytics: Slide Navigation', { direction, fromSlide, toSlide })
}

/**
 * Track errors during file processing
 * @param errorType - Type of error encountered
 * @param errorMessage - Brief error message (truncated)
 */
export function trackError(errorType: string, errorMessage: string) {
  track('Error Encountered', {
    errorType: errorType.substring(0, 50),
    errorMessage: errorMessage.substring(0, 150),
  })

  console.log('📊 Analytics: Error Encountered', { errorType, errorMessage })
}
