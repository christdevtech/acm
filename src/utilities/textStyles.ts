/**
 * Text styles utility for consistent typography throughout the application
 * Uses Tailwind CSS classes for size, weight, line height, and spacing
 * Colors are excluded to allow for flexible theming
 */

export const textStyles = {
  //Hero Styles
  heroTitle: 'text-5xl md:text-6xl lg:text-7xl font-bold leading-none tracking-tight',
  heroSubTitle: 'text-3xl md:text-4xl lg:text-5xl font-bold leading-tight tracking-tight',
  heroDesription: 'text-lg md:text-xl lg:text-2xl leading-relaxed',

  // Main headings
  sectionHeading: 'text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight',
  pageHeading: 'text-3xl md:text-4xl lg:text-5xl font-bold leading-tight',
  blockHeading: 'text-2xl md:text-3xl lg:text-4xl font-semibold leading-tight',

  // Sub headings
  subHeading: 'text-xl md:text-2xl font-semibold leading-snug',
  cardTitle: 'text-lg md:text-xl font-semibold leading-snug',
  listTitle: 'text-base md:text-lg font-medium leading-normal',

  // Body text
  bodyText: 'text-base leading-relaxed',
  bodyTextLarge: 'text-lg leading-relaxed',
  bodyTextExtraLarge: 'text-xl md:text-2xl lg:text-3xl leading-relaxed',
  bodyTextSmall: 'text-sm leading-relaxed',

  // Descriptive text
  descriptionText: 'text-base leading-normal',
  captionText: 'text-sm leading-normal',
  helperText: 'text-xs leading-normal',

  // Interactive elements
  buttonText: 'text-sm md:text-base font-medium leading-none',
  buttonTextLarge: 'text-base md:text-lg font-medium leading-none',
  buttonTextSmall: 'text-xs md:text-sm font-medium leading-none',

  // Navigation and links
  navLink: 'text-base font-medium leading-normal',
  breadcrumb: 'text-sm leading-normal',
  linkText: 'text-base leading-normal underline-offset-4',

  // Form elements
  labelText: 'text-sm font-medium leading-normal',
  inputText: 'text-base leading-normal',
  placeholderText: 'text-base leading-normal',
  errorText: 'text-sm font-medium leading-normal',

  // Special text
  quoteText: 'text-lg md:text-xl leading-relaxed italic',
  codeText: 'text-sm font-mono leading-normal',
  metaText: 'text-xs md:text-sm leading-normal',
  badgeText: 'text-xs font-semibold leading-none uppercase tracking-wide',

  // Display text (for hero sections, etc.)

  displayText: 'text-4xl md:text-5xl lg:text-6xl font-bold leading-none tracking-tight',
} as const

/**
 * Type for text style keys
 */
export type TextStyleKey = keyof typeof textStyles

/**
 * Helper function to get text style classes
 * @param style - The text style key
 * @returns The corresponding Tailwind CSS classes
 */
export const getTextStyle = (style: TextStyleKey): string => {
  return textStyles[style]
}

/**
 * Helper function to combine text style with additional classes
 * @param style - The text style key
 * @param additionalClasses - Additional CSS classes to append
 * @returns Combined CSS classes
 */
export const combineTextStyle = (style: TextStyleKey, additionalClasses?: string): string => {
  const baseStyle = textStyles[style]
  return additionalClasses ? `${baseStyle} ${additionalClasses}` : baseStyle
}

/**
 * Customization options for text styles
 */
export interface TextStyleOptions {
  weight?:
    | 'font-thin'
    | 'font-extralight'
    | 'font-light'
    | 'font-normal'
    | 'font-medium'
    | 'font-semibold'
    | 'font-bold'
    | 'font-extrabold'
    | 'font-black'
  size?:
    | 'text-xs'
    | 'text-sm'
    | 'text-base'
    | 'text-lg'
    | 'text-xl'
    | 'text-2xl'
    | 'text-3xl'
    | 'text-4xl'
    | 'text-5xl'
    | 'text-6xl'
    | 'text-7xl'
  lineHeight?:
    | 'leading-none'
    | 'leading-tight'
    | 'leading-snug'
    | 'leading-normal'
    | 'leading-relaxed'
    | 'leading-loose'
  tracking?:
    | 'tracking-tighter'
    | 'tracking-tight'
    | 'tracking-normal'
    | 'tracking-wide'
    | 'tracking-wider'
    | 'tracking-widest'
  transform?: 'uppercase' | 'lowercase' | 'capitalize' | 'normal-case'
}

/**
 * Helper function to customize text styles with specific overrides
 * @param style - The base text style key
 * @param options - Customization options to override specific properties
 * @param additionalClasses - Additional CSS classes to append
 * @returns Customized CSS classes
 */
export const customizeTextStyle = (
  style: TextStyleKey,
  options: TextStyleOptions = {},
  additionalClasses?: string,
): string => {
  const baseStyle = textStyles[style]
  const { weight, size, lineHeight, tracking, transform } = options

  // Split base style into individual classes
  const baseClasses = baseStyle.split(' ')

  // Filter out classes that will be overridden
  const filteredClasses = baseClasses.filter((cls) => {
    if (weight && cls.startsWith('font-')) return false
    if (size && cls.startsWith('text-') && !cls.includes(':')) return false
    if (lineHeight && cls.startsWith('leading-')) return false
    if (tracking && cls.startsWith('tracking-')) return false
    if (
      transform &&
      (cls === 'uppercase' || cls === 'lowercase' || cls === 'capitalize' || cls === 'normal-case')
    )
      return false
    return true
  })

  // Add custom overrides
  const customClasses = [
    ...filteredClasses,
    ...(weight ? [weight] : []),
    ...(size ? [size] : []),
    ...(lineHeight ? [lineHeight] : []),
    ...(tracking ? [tracking] : []),
    ...(transform ? [transform] : []),
    ...(additionalClasses ? additionalClasses.split(' ') : []),
  ]

  return customClasses.join(' ')
}

/**
 * Helper function to create responsive text styles with different sizes for different breakpoints
 * @param style - The base text style key
 * @param responsiveOptions - Object with breakpoint-specific customizations
 * @param additionalClasses - Additional CSS classes to append
 * @returns Responsive CSS classes
 */
export const responsiveTextStyle = (
  style: TextStyleKey,
  responsiveOptions: {
    base?: TextStyleOptions
    sm?: Partial<TextStyleOptions>
    md?: Partial<TextStyleOptions>
    lg?: Partial<TextStyleOptions>
    xl?: Partial<TextStyleOptions>
  } = {},
  additionalClasses?: string,
): string => {
  const baseStyle = textStyles[style]
  const { base = {}, sm, md, lg, xl } = responsiveOptions

  // Start with customized base style
  const classes = customizeTextStyle(style, base).split(' ')

  // Add responsive classes
  const addResponsiveClasses = (breakpoint: string, options: Partial<TextStyleOptions>) => {
    Object.entries(options).forEach(([key, value]) => {
      if (value) {
        classes.push(`${breakpoint}:${value}`)
      }
    })
  }

  if (sm) addResponsiveClasses('sm', sm)
  if (md) addResponsiveClasses('md', md)
  if (lg) addResponsiveClasses('lg', lg)
  if (xl) addResponsiveClasses('xl', xl)

  if (additionalClasses) {
    classes.push(...additionalClasses.split(' '))
  }

  return classes.join(' ')
}

/**
 * Predefined weight variations for quick access
 */
export const textWeights = {
  thin: 'font-thin',
  light: 'font-light',
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
  extrabold: 'font-extrabold',
  black: 'font-black',
} as const

/**
 * Predefined size variations for quick access
 */
export const textSizes = {
  xs: 'text-xs',
  sm: 'text-sm',
  base: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
  '2xl': 'text-2xl',
  '3xl': 'text-3xl',
  '4xl': 'text-4xl',
  '5xl': 'text-5xl',
  '6xl': 'text-6xl',
  '7xl': 'text-7xl',
} as const
