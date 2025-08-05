export const theme = {
  colors: {
    // Fresh modern colors - Clean and contemporary
    primary: '#3B82F6', // Bright blue
    primaryDark: '#2563EB',
    primaryLight: '#93C5FD',
    secondary: '#10B981', // Emerald green
    secondaryDark: '#059669',
    secondaryLight: '#6EE7B7',
    
    // Accent colors - Clean and distinct
    accent: '#F59E0B', // Amber
    accentDark: '#D97706',
    accentLight: '#FCD34D',
    warning: '#EF4444', // Red
    error: '#DC2626', // Dark red
    info: '#8B5CF6', // Purple
    
    // Clean background colors - Light and modern
    background: '#FFFFFF', // Pure white
    backgroundSecondary: '#F8FAFC', // Slate 50
    backgroundTertiary: '#F1F5F9', // Slate 100
    backgroundCard: '#FFFFFF', // White cards
    backgroundElevated: '#F8FAFC', // Light elevated
    
    // Dark text colors - High contrast on light backgrounds
    textPrimary: '#0F172A', // Slate 900 - Dark text
    textSecondary: '#475569', // Slate 600 - Medium text
    textTertiary: '#64748B', // Slate 500 - Muted text
    textInverse: '#FFFFFF', // White text on dark backgrounds
    textMuted: '#94A3B8', // Slate 400 - Very muted
    
    // Clean border colors - Subtle and modern
    border: '#E2E8F0', // Slate 200 - Light borders
    borderLight: '#F1F5F9', // Slate 100 - Very light
    borderDark: '#CBD5E1', // Slate 300 - Darker borders
    
    // Subtle shadow colors - Clean and modern
    shadow: 'rgba(0, 0, 0, 0.1)',
    shadowDark: 'rgba(0, 0, 0, 0.2)',
    shadowLight: 'rgba(0, 0, 0, 0.05)',
    
    // Clean gradient colors
    gradientStart: '#3B82F6',
    gradientEnd: '#10B981',
    gradientCard: '#FFFFFF',
  },
  
  typography: {
    fontFamily: {
      regular: 'System',
      medium: 'System',
      bold: 'System',
      light: 'System',
    },
    
    fontSize: {
      xs: 10,
      sm: 12,
      md: 14,
      lg: 16,
      xl: 18,
      xxl: 20,
      xxxl: 24,
      display: 32,
      displayLarge: 40,
    },
    
    lineHeight: {
      tight: 1.2,
      normal: 1.4,
      relaxed: 1.6,
      loose: 1.8,
    },
    
    fontWeight: {
      light: '300',
      regular: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
    },
  },
  
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 32,
    huge: 48,
  },
  
  borderRadius: {
    xs: 6,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    round: 50,
    full: 9999,
  },
  
  shadows: {
    sm: {
      shadowColor: 'rgba(0, 0, 0, 0.1)',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 2,
      elevation: 2,
    },
    md: {
      shadowColor: 'rgba(0, 0, 0, 0.1)',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 4,
    },
    lg: {
      shadowColor: 'rgba(0, 0, 0, 0.1)',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.4,
      shadowRadius: 16,
      elevation: 8,
    },
    glow: {
      shadowColor: '#3B82F6',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.3,
      shadowRadius: 12,
      elevation: 6,
    },
  },
  
  layout: {
    maxWidth: 400,
    headerHeight: 70,
    tabBarHeight: 90,
    buttonHeight: 52,
    inputHeight: 52,
    cardPadding: 16,
  },
  
  animation: {
    duration: {
      fast: 150,
      normal: 250,
      slow: 400,
    },
    easing: {
      ease: 'ease',
      easeIn: 'ease-in',
      easeOut: 'ease-out',
      easeInOut: 'ease-in-out',
    },
  },
  
  // Clean design tokens
  glass: {
    background: 'rgba(255, 255, 255, 0.9)',
    border: 'rgba(0, 0, 0, 0.1)',
    backdrop: 'blur(20px)',
  },
  
  gradients: {
    primary: ['#3B82F6', '#10B981'],
    secondary: ['#F59E0B', '#EF4444'],
    card: ['#FFFFFF', '#F8FAFC'],
    button: ['#3B82F6', '#2563EB'],
  },
};

export type Theme = typeof theme; 