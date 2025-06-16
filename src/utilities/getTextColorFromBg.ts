/**
 * Utility function to determine text and border colors based on background color
 * Provides smart color selection for both light and dark modes
 */

type ColorResult = {
  textColor: string
  borderColor: string
}

export const getTextColorFromBg = (bgColor?: string): ColorResult => {
  if (!bgColor) {
    return {
      textColor: 'text-gray-900 dark:text-gray-100',
      borderColor: 'border-gray-900 dark:border-gray-100',
    }
  }

  // Extract color name and shade from bg class (e.g., 'bg-blue-500' -> 'blue', '500')
  const bgMatch = bgColor.match(/^bg-(.+)-(\d+)$/)
  if (!bgMatch) {
    // Handle special cases like bg-black, bg-white, bg-transparent, etc.
    switch (bgColor) {
      case 'bg-black':
        return {
          textColor: 'text-white',
          borderColor: 'border-gray-100',
        }
      case 'bg-white':
        return {
          textColor: 'text-gray-900',
          borderColor: 'border-gray-900',
        }
      case 'bg-transparent':
      case 'bg-inherit':
      case 'bg-current':
        return {
          textColor: 'text-gray-900 dark:text-gray-100',
          borderColor: 'border-gray-900 dark:border-gray-100',
        }
      default:
        return {
          textColor: 'text-gray-900 dark:text-gray-100',
          borderColor: 'border-gray-900 dark:border-gray-100',
        }
    }
  }

  const [, colorName, shade] = bgMatch
  const shadeNumber = parseInt(shade ? shade : '0', 10)

  // Define light colors (shades 50-400) and dark colors (shades 500-950)
  const isLightShade = shadeNumber <= 400
  const isDarkShade = shadeNumber >= 500

  // For very light shades (50-200), use dark text
  if (shadeNumber <= 200) {
    return {
      textColor: 'text-gray-900',
      borderColor: `border-${colorName}-900`,
    }
  }

  // For medium-light shades (300-400), use dark text with some contrast
  if (shadeNumber <= 400) {
    return {
      textColor: 'text-gray-800',
      borderColor: `border-${colorName}-800`,
    }
  }

  // For medium shades (500-600), use white text
  if (shadeNumber <= 600) {
    return {
      textColor: 'text-white',
      borderColor: `border-${colorName}-100`,
    }
  }

  // For dark shades (700-950), use white text
  return {
    textColor: 'text-white',
    borderColor: `border-${colorName}-100`,
  }
}

/**
 * Get contrasting text color for dark mode based on background
 */
export const getDarkModeTextColor = (bgColor?: string): string => {
  if (!bgColor) {
    return 'dark:text-gray-100'
  }

  const bgMatch = bgColor.match(/^bg-(.+)-(\d+)$/)
  if (!bgMatch) {
    switch (bgColor) {
      case 'bg-black':
        return 'dark:text-gray-300'
      case 'bg-white':
        return 'dark:text-gray-900'
      default:
        return 'dark:text-gray-100'
    }
  }

  const [, colorName, shade] = bgMatch
  const shadeNumber = parseInt(shade ? shade : '0', 10)

  // In dark mode, we want to ensure good contrast
  // For light background colors in dark mode, use dark text
  if (shadeNumber <= 300) {
    return 'dark:text-gray-900'
  }

  // For medium colors, use light text
  if (shadeNumber <= 600) {
    return 'dark:text-gray-100'
  }

  // For dark colors, use very light text
  return 'dark:text-gray-50'
}

/**
 * Combine light and dark mode text colors
 */
export const getResponsiveTextColor = (bgColor?: string): string => {
  const lightMode = getTextColorFromBg(bgColor).textColor
  const darkMode = getDarkModeTextColor(bgColor)

  // If lightMode already includes dark mode classes, return as is
  if (lightMode.includes('dark:')) {
    return lightMode
  }

  return `${lightMode} ${darkMode}`
}
