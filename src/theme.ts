import { Dimensions } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export const Colors = {
  // Primary colors
  background: '#FFFFFF',
  surface: '#F8FAFC',
  surfaceElevated: '#FFFFFF',
  
  // Text colors
  text: '#0F172A',
  textMuted: '#64748B',
  textLight: '#94A3B8',
  
  // Brand colors
  goatGreen: '#00D084',
  trustBlue: '#007BFF',
  alertRed: '#FF4D4F',
  warningOrange: '#FF9500',
  
  // UI colors
  border: '#E2E8F0',
  borderLight: '#F1F5F9',
  divider: '#F1F5F9',
  shadow: '#000000',
  
  // Status colors
  success: '#00D084',
  error: '#FF4D4F',
  warning: '#FF9500',
  info: '#007BFF',
  
  // Category type colors
  income: '#00D084',
  expense: '#FF4D4F',
  pocket: '#007BFF',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  
  // Screen-specific
  screenPadding: 20,
  headerHeight: 40,
  tabBarHeight: 64,
  statusBarHeight: 44,
};

export const Radius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  round: 50,
  card: 16,
};

export const Shadows = {
  small: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  large: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 16,
    elevation: 8,
  },
  card: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
};

export const Typography = {
  h1: {
    fontSize: 32,
    fontWeight: '700' as const,
    lineHeight: 40,
    letterSpacing: -0.5,
  },
  h2: {
    fontSize: 24,
    fontWeight: '700' as const,
    lineHeight: 32,
    letterSpacing: -0.25,
  },
  h3: {
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 28,
    letterSpacing: 0,
  },
  h4: {
    fontSize: 18,
    fontWeight: '600' as const,
    lineHeight: 24,
    letterSpacing: 0,
  },
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24,
    letterSpacing: 0,
  },
  bodyMedium: {
    fontSize: 16,
    fontWeight: '500' as const,
    lineHeight: 24,
    letterSpacing: 0,
  },
  caption: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
    letterSpacing: 0.25,
  },
  button: {
    fontSize: 16,
    fontWeight: '600' as const,
    lineHeight: 24,
    letterSpacing: 0.5,
    textTransform: 'uppercase' as const,
  },
};

export const Layout = {
  screenWidth,
  screenHeight,
  headerHeight: Spacing.headerHeight + Spacing.statusBarHeight,
  tabBarHeight: Spacing.tabBarHeight,
  minTapArea: 48,
  cardPadding: Spacing.md,
  sectionSpacing: Spacing.lg,
};

export default {
  colors: Colors,
  spacing: Spacing,
  radius: Radius,
  shadows: Shadows,
  typography: Typography,
  layout: Layout,
};


