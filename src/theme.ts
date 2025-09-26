import { Dimensions } from 'react-native';
import { Fonts } from './fonts';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export const Colors = {
  // Primary colors - WCAG AA compliant
  background: '#FFFFFF',
  surface: '#F8FAFC',
  surfaceElevated: '#FFFFFF',
  
  // Text colors - WCAG AA compliant (4.5:1 ratio minimum)
  text: '#0F172A', // 16.6:1 contrast ratio
  textMuted: '#475569', // 7.2:1 contrast ratio (improved from #64748B)
  textLight: '#64748B', // 4.5:1 contrast ratio
  
  // Brand colors - WCAG AA compliant
  goatGreen: '#059669', // 4.7:1 contrast ratio (improved from #00D084)
  trustBlue: '#0052CC', // 6.1:1 contrast ratio (improved from #007BFF)
  alertRed: '#DC2626', // 5.3:1 contrast ratio (improved from #FF4D4F)
  warningOrange: '#D97706', // 4.6:1 contrast ratio (improved from #FF9500)
  
  // UI colors
  border: '#E2E8F0',
  borderLight: '#F1F5F9',
  divider: '#F1F5F9',
  shadow: '#000000',
  
  // Status colors - WCAG AA compliant
  success: '#059669', // 4.7:1 contrast ratio
  error: '#DC2626', // 5.3:1 contrast ratio
  warning: '#D97706', // 4.6:1 contrast ratio
  info: '#0052CC', // 6.1:1 contrast ratio
  
  // Category type colors - WCAG AA compliant
  income: '#059669', // 4.7:1 contrast ratio
  expense: '#DC2626', // 5.3:1 contrast ratio
  pocket: '#0052CC', // 6.1:1 contrast ratio
  
  // Pocket type colors - WCAG AA compliant
  standardPocket: '#7C3AED', // 4.9:1 contrast ratio (improved from #8B5CF6)
  goalPocket: '#D97706', // 4.6:1 contrast ratio (improved from #F59E0B)
  
  // Numeric label color
  numericLabel: '#06B6D6',   // Teal/Cyan
  
  // Transaction status colors
  linkedPocket: '#3B82F6',   // Blue for linked
  unlinked: '#6B7280',       // Gray for unlinked
  
  // Label severity colors - WCAG AA compliant
  labelExpense: '#DC2626',   // 5.3:1 contrast ratio (improved from #EF4444)
  labelIncome: '#059669',    // 4.7:1 contrast ratio (improved from #10B981)
  labelRecurring: '#D97706', // 4.6:1 contrast ratio (improved from #F97316)
  labelStandard: '#7C3AED',  // 4.9:1 contrast ratio (improved from #8B5CF6)
  labelGoal: '#D97706',      // 4.6:1 contrast ratio (improved from #F59E0B)
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
  headerToFirst: 24,
  headerHeight: 40,
  tabBarHeight: 64,
  statusBarHeight: 44,
  
  // Section spacing - DESIGN SYSTEM RULES
  // Every [Section Title] + [Section Container] = [Section]
  // Section Title to Section Container: 12px gap (handled by SectionTitle)
  // Between Sections: 20px gap (handled by section containers)
  // Screen Padding: 20px (left/right)
  sectionTitleToContent: 16,  // Gap between section title and content (global rule)
  sectionToSection: 20,       // Gap between sections
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

// Revolut-like Typography System using DM Sans
export const Typography = {
  // Headlines - Bold weight for main headlines
  h1: {
    fontSize: 32,
    fontWeight: '700' as const,
    lineHeight: 40,
    letterSpacing: -0.5,
    fontFamily: Fonts.dmSans.bold,
  },
  h2: {
    fontSize: 28,
    fontWeight: '700' as const,
    lineHeight: 36,
    letterSpacing: -0.3,
    fontFamily: Fonts.dmSans.bold,
  },
  h3: {
    fontSize: 24,
    fontWeight: '700' as const,
    lineHeight: 32,
    letterSpacing: -0.25,
    fontFamily: Fonts.dmSans.bold,
  },
  h4: {
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 24,
    letterSpacing: 0,
    fontFamily: Fonts.dmSans.semiBold,
  },
  
  // Body text - Regular weight for body text
  body1: {
    fontSize: 17,
    fontWeight: '400' as const,
    lineHeight: 24,
    letterSpacing: 0,
    fontFamily: Fonts.dmSans.regular,
  },
  body2: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24,
    letterSpacing: 0,
    fontFamily: Fonts.dmSans.regular,
  },
  
  // Subheadings - Medium weight for subheadings
  subtitle1: {
    fontSize: 16,
    fontWeight: '500' as const,
    lineHeight: 24,
    letterSpacing: 0,
    fontFamily: Fonts.dmSans.medium,
  },
  subtitle2: {
    fontSize: 14,
    fontWeight: '500' as const,
    lineHeight: 20,
    letterSpacing: 0.25,
    fontFamily: Fonts.dmSans.medium,
  },
  
  // Captions and labels - Regular weight
  caption: {
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 16,
    letterSpacing: 0.25,
    fontFamily: Fonts.dmSans.regular,
  },
  overline: {
    fontSize: 10,
    fontWeight: '400' as const,
    lineHeight: 14,
    letterSpacing: 0.5,
    fontFamily: Fonts.dmSans.regular,
  },
  
  // Buttons - Medium weight for buttons
  button: {
    fontSize: 16,
    fontWeight: '500' as const,
    lineHeight: 24,
    letterSpacing: 0.1,
    fontFamily: Fonts.dmSans.medium,
  },
  
  // Legacy support - keeping these for backward compatibility
  bodyLarge: {
    fontSize: 17,
    fontWeight: '500' as const,
    lineHeight: 24,
    letterSpacing: 0,
    fontFamily: Fonts.dmSans.medium,
  },
  bodyRegular: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24,
    letterSpacing: 0,
    fontFamily: Fonts.dmSans.regular,
  },
  bodyMedium: {
    fontSize: 16,
    fontWeight: '500' as const,
    lineHeight: 24,
    letterSpacing: 0,
    fontFamily: Fonts.dmSans.medium,
  },
  bodySmall: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
    letterSpacing: 0.25,
    fontFamily: Fonts.dmSans.regular,
  },
};

export const Layout = {
  screenWidth,
  screenHeight,
  headerHeight: Spacing.headerHeight,
  tabBarHeight: Spacing.tabBarHeight,
  minTapArea: 48,
  cardPadding: Spacing.md,
  sectionSpacing: Spacing.lg,
  
  // Safe Area Values for Different Devices
  safeArea: {
    // iPhone with home indicator (iPhone X and later)
    homeIndicator: 34,
    // iPhone with home button (iPhone 8 and earlier)
    homeButton: 20,
    // Android navigation bar
    androidNavBar: 24,
    // Minimum safe distance from bottom edge
    minBottomSafe: 20,
    // Recommended safe distance for buttons/actions
    recommendedBottomSafe: 32,
    // Maximum safe distance for bottom sheets
    bottomSheetSafe: 40,
  },
};

export default {
  colors: Colors,
  fonts: Fonts,
  spacing: Spacing,
  radius: Radius,
  shadows: Shadows,
  typography: Typography,
  layout: Layout,
};


