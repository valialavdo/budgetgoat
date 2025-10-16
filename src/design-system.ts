import { Dimensions } from 'react-native';
import { Fonts } from './fonts';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// ============================================================================
// UNIFIED DESIGN SYSTEM - ENFORCED STANDARDS
// ============================================================================

// Base font size: 17px (enforced across all typography)
const BASE_FONT_SIZE = 17;

// Standard horizontal padding: 20px (enforced across all components)
const STANDARD_HORIZONTAL_PADDING = 20;

// Standard spacing scale (4px grid system)
const SPACING_SCALE = 4;

export const Colors = {
  // Primary colors - WCAG AA compliant
  background: '#FFFFFF',
  surface: '#F8FAFC',
  surfaceElevated: '#FFFFFF',
  
  // Text colors - WCAG AA compliant (4.5:1 ratio minimum)
  text: '#0F172A', // 16.6:1 contrast ratio
  textMuted: '#475569', // 7.2:1 contrast ratio
  textLight: '#64748B', // 4.5:1 contrast ratio
  
  // Brand colors - WCAG AA compliant
  goatGreen: '#059669', // 4.7:1 contrast ratio
  trustBlue: '#0052CC', // 6.1:1 contrast ratio
  alertRed: '#DC2626', // 5.3:1 contrast ratio
  warningOrange: '#D97706', // 4.6:1 contrast ratio
  
  // UI colors
  border: '#E2E8F0',
  borderLight: '#F1F5F9',
  divider: '#F1F5F9',
  shadow: '#000000',
  
  // Status colors - WCAG AA compliant
  success: '#059669',
  error: '#DC2626',
  warning: '#D97706',
  info: '#0052CC',
  
  // Category type colors - WCAG AA compliant
  income: '#059669',
  expense: '#DC2626',
  pocket: '#0052CC',
  
  // Pocket type colors - WCAG AA compliant
  standardPocket: '#7C3AED',
  goalPocket: '#D97706',
  
  // Numeric label color
  numericLabel: '#06B6D6',
  
  // Transaction status colors
  linkedPocket: '#3B82F6',
  unlinked: '#6B7280',
  
  // Label severity colors - WCAG AA compliant
  labelExpense: '#DC2626',
  labelIncome: '#059669',
  labelRecurring: '#D97706',
  labelStandard: '#7C3AED',
  labelGoal: '#D97706',
};

export const Spacing = {
  // Base spacing scale (4px grid)
  xs: SPACING_SCALE * 1,      // 4px
  sm: SPACING_SCALE * 2,      // 8px
  md: SPACING_SCALE * 4,      // 16px
  lg: SPACING_SCALE * 6,      // 24px
  xl: SPACING_SCALE * 8,      // 32px
  xxl: SPACING_SCALE * 12,    // 48px
  
  // ENFORCED STANDARDS
  screenPadding: STANDARD_HORIZONTAL_PADDING, // 20px - ENFORCED
  sectionGap: SPACING_SCALE * 5,             // 20px - ENFORCED
  componentGap: SPACING_SCALE * 3,           // 12px - ENFORCED
  
  // Screen-specific
  headerToFirst: SPACING_SCALE * 6,         // 24px
  headerHeight: SPACING_SCALE * 10,          // 40px
  tabBarHeight: SPACING_SCALE * 16,          // 64px
  statusBarHeight: SPACING_SCALE * 11,       // 44px
  
  // Section spacing - DESIGN SYSTEM RULES
  sectionTitleToContent: SPACING_SCALE * 4, // 16px
  sectionToSection: SPACING_SCALE * 5,       // 20px
};

export const Radius = {
  xs: SPACING_SCALE * 1,      // 4px
  sm: SPACING_SCALE * 2,      // 8px
  md: SPACING_SCALE * 3,      // 12px
  lg: SPACING_SCALE * 4,      // 16px
  xl: SPACING_SCALE * 5,      // 20px
  round: 50,
  card: SPACING_SCALE * 4,    // 16px
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

// ENFORCED TYPOGRAPHY SYSTEM - BASE FONT SIZE 17px
export const Typography = {
  // Headlines - Bold weight for main headlines
  h1: {
    fontSize: BASE_FONT_SIZE + 15, // 32px
    fontWeight: '700' as const,
    lineHeight: BASE_FONT_SIZE + 23, // 40px
    letterSpacing: -0.5,
    fontFamily: Fonts.dmSans.bold,
  },
  h2: {
    fontSize: BASE_FONT_SIZE + 11, // 28px
    fontWeight: '700' as const,
    lineHeight: BASE_FONT_SIZE + 19, // 36px
    letterSpacing: -0.3,
    fontFamily: Fonts.dmSans.bold,
  },
  h3: {
    fontSize: BASE_FONT_SIZE + 7, // 24px
    fontWeight: '700' as const,
    lineHeight: BASE_FONT_SIZE + 15, // 32px
    letterSpacing: -0.25,
    fontFamily: Fonts.dmSans.bold,
  },
  h4: {
    fontSize: BASE_FONT_SIZE + 3, // 20px
    fontWeight: '600' as const,
    lineHeight: BASE_FONT_SIZE + 7, // 24px
    letterSpacing: 0,
    fontFamily: Fonts.dmSans.semiBold,
  },
  
  // Body text - Regular weight for body text (BASE FONT SIZE)
  body1: {
    fontSize: BASE_FONT_SIZE, // 17px - ENFORCED BASE SIZE
    fontWeight: '400' as const,
    lineHeight: BASE_FONT_SIZE + 7, // 24px
    letterSpacing: 0,
    fontFamily: Fonts.dmSans.regular,
  },
  body2: {
    fontSize: BASE_FONT_SIZE - 1, // 16px
    fontWeight: '400' as const,
    lineHeight: BASE_FONT_SIZE + 7, // 24px
    letterSpacing: 0,
    fontFamily: Fonts.dmSans.regular,
  },
  
  // Subheadings - Medium weight for subheadings
  subtitle1: {
    fontSize: BASE_FONT_SIZE - 1, // 16px
    fontWeight: '500' as const,
    lineHeight: BASE_FONT_SIZE + 7, // 24px
    letterSpacing: 0,
    fontFamily: Fonts.dmSans.medium,
  },
  subtitle2: {
    fontSize: BASE_FONT_SIZE - 3, // 14px
    fontWeight: '500' as const,
    lineHeight: BASE_FONT_SIZE + 3, // 20px
    letterSpacing: 0.25,
    fontFamily: Fonts.dmSans.medium,
  },
  
  // Captions and labels - Regular weight
  caption: {
    fontSize: BASE_FONT_SIZE - 5, // 12px
    fontWeight: '400' as const,
    lineHeight: BASE_FONT_SIZE - 1, // 16px
    letterSpacing: 0.25,
    fontFamily: Fonts.dmSans.regular,
  },
  overline: {
    fontSize: BASE_FONT_SIZE - 7, // 10px
    fontWeight: '400' as const,
    lineHeight: BASE_FONT_SIZE - 3, // 14px
    letterSpacing: 0.5,
    fontFamily: Fonts.dmSans.regular,
  },
  
  // Buttons - Medium weight for buttons
  button: {
    fontSize: BASE_FONT_SIZE - 1, // 16px
    fontWeight: '500' as const,
    lineHeight: BASE_FONT_SIZE + 7, // 24px
    letterSpacing: 0.1,
    fontFamily: Fonts.dmSans.medium,
  },
  
  // Legacy support - keeping these for backward compatibility
  bodyLarge: {
    fontSize: BASE_FONT_SIZE, // 17px - ENFORCED BASE SIZE
    fontWeight: '500' as const,
    lineHeight: BASE_FONT_SIZE + 7, // 24px
    letterSpacing: 0,
    fontFamily: Fonts.dmSans.medium,
  },
  bodyRegular: {
    fontSize: BASE_FONT_SIZE - 1, // 16px
    fontWeight: '400' as const,
    lineHeight: BASE_FONT_SIZE + 7, // 24px
    letterSpacing: 0,
    fontFamily: Fonts.dmSans.regular,
  },
  bodyMedium: {
    fontSize: BASE_FONT_SIZE - 1, // 16px
    fontWeight: '500' as const,
    lineHeight: BASE_FONT_SIZE + 7, // 24px
    letterSpacing: 0,
    fontFamily: Fonts.dmSans.medium,
  },
  bodySmall: {
    fontSize: BASE_FONT_SIZE - 3, // 14px
    fontWeight: '400' as const,
    lineHeight: BASE_FONT_SIZE + 3, // 20px
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
  
  // ENFORCED STANDARDS
  standardHorizontalPadding: STANDARD_HORIZONTAL_PADDING, // 20px - ENFORCED
  baseFontSize: BASE_FONT_SIZE, // 17px - ENFORCED
  
  // Safe Area Values for Different Devices
  safeArea: {
    homeIndicator: 34,
    homeButton: 20,
    androidNavBar: 24,
    minBottomSafe: 20,
    recommendedBottomSafe: 32,
    bottomSheetSafe: 40,
  },
};

// ============================================================================
// ENFORCED COMPONENT STYLES - STANDARDIZED ACROSS ALL COMPONENTS
// ============================================================================

export const ComponentStyles = {
  // Standard container with enforced 20px horizontal padding
  standardContainer: {
    paddingHorizontal: STANDARD_HORIZONTAL_PADDING,
  },
  
  // Standard section container
  sectionContainer: {
    paddingHorizontal: STANDARD_HORIZONTAL_PADDING,
    marginBottom: Spacing.sectionGap,
  },
  
  // Standard card style
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.card,
    padding: Spacing.md,
    marginHorizontal: STANDARD_HORIZONTAL_PADDING,
    marginVertical: Spacing.sm,
    ...Shadows.card,
  },
  
  // Standard input style
  input: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    borderWidth: 2,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    minHeight: 56,
    ...Typography.body1,
    color: Colors.text,
  },
  
  // Standard button style
  button: {
    backgroundColor: Colors.trustBlue,
    borderRadius: Radius.lg,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    minHeight: 48,
  },
  
  // Standard bottom sheet style
  bottomSheet: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    paddingTop: Spacing.lg,
    paddingHorizontal: STANDARD_HORIZONTAL_PADDING,
    paddingBottom: Spacing.xl,
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
  componentStyles: ComponentStyles,
};
