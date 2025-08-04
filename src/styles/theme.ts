export const theme = {
  colors: {
    // Modern primary colors - Deep purple to pink gradient theme
    primary: '#6366F1', // Indigo
    primaryDark: '#4F46E5',
    primaryLight: '#A5B4FC',
    secondary: '#EC4899', // Pink
    secondaryDark: '#DB2777',
    secondaryLight: '#F9A8D4',
    
    // Accent colors
    accent: '#10B981', // Emerald green
    accentDark: '#059669',
    accentLight: '#6EE7B7',
    warning: '#F59E0B', // Amber
    error: '#EF4444', // Red
    info: '#3B82F6', // Blue
    
    // Modern background colors - Dark theme inspired
    background: '#0F172A', // Slate 900
    backgroundSecondary: '#1E293B', // Slate 800
    backgroundTertiary: '#334155', // Slate 700
    backgroundCard: '#1E293B', // Slate 800
    backgroundElevated: '#334155', // Slate 700
    
    // Text colors for dark theme
    textPrimary: '#F8FAFC', // Slate 50
    textSecondary: '#CBD5E1', // Slate 300
    textTertiary: '#64748B', // Slate 500
    textInverse: '#0F172A', // Slate 900
    textMuted: '#94A3B8', // Slate 400
    
    // Border colors
    border: '#334155', // Slate 700
    borderLight: '#475569', // Slate 600
    borderDark: '#1E293B', // Slate 800
    
    // Shadow colors for dark theme
    shadow: 'rgba(0, 0, 0, 0.3)',
    shadowDark: 'rgba(0, 0, 0, 0.5)',
    shadowLight: 'rgba(0, 0, 0, 0.1)',
    
    // Gradient colors
    gradientStart: '#6366F1',
    gradientEnd: '#EC4899',
    gradientCard: '#1E293B',
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
      shadowColor: 'rgba(0, 0, 0, 0.3)',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 3,
    },
    md: {
      shadowColor: 'rgba(0, 0, 0, 0.3)',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 6,
    },
    lg: {
      shadowColor: 'rgba(0, 0, 0, 0.3)',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.4,
      shadowRadius: 16,
      elevation: 12,
    },
    glow: {
      shadowColor: '#6366F1',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.3,
      shadowRadius: 12,
      elevation: 8,
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
  
  // New design tokens
  glass: {
    background: 'rgba(30, 41, 59, 0.8)',
    border: 'rgba(255, 255, 255, 0.1)',
    backdrop: 'blur(20px)',
  },
  
  gradients: {
    primary: ['#6366F1', '#EC4899'],
    secondary: ['#10B981', '#3B82F6'],
    card: ['#1E293B', '#334155'],
    button: ['#6366F1', '#4F46E5'],
  },
};

export type Theme = typeof theme; 