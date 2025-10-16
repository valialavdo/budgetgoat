# BudgetGOAT Design System Documentation

## Overview
This document contains the comprehensive design system, reusable components, and development guidelines for the BudgetGOAT budgeting application. This design system was consolidated from multiple previous projects and represents the final, sophisticated UI architecture.

## 🎨 Design System

### Colors
The color palette follows WCAG AA compliance standards with a 4.5:1 contrast ratio minimum.

#### Primary Colors
- **GOAT Green**: `#059669` - Income, positives, CTAs (4.7:1 contrast ratio)
- **Trust Blue**: `#0052CC` - Pockets, navigation (6.1:1 contrast ratio)
- **Alert Red**: `#DC2626` - Expenses, warnings (5.3:1 contrast ratio)
- **Warning Orange**: `#D97706` - Alerts, goals (4.6:1 contrast ratio)

#### Background Colors
- **Background**: `#FFFFFF` (light) / `#0F172A` (dark)
- **Surface**: `#F8FAFC` (light) / `#1E293B` (dark)
- **Surface Elevated**: `#FFFFFF` (light) / `#334155` (dark)

#### Text Colors
- **Text**: `#0F172A` (light) / `#F8FAFC` (dark) - Primary text
- **Text Muted**: `#475569` (light) / `#CBD5E1` (dark) - Secondary text
- **Text Light**: `#64748B` (light) / `#94A3B8` (dark) - Tertiary text

#### UI Colors
- **Border**: `#E2E8F0` (light) / `#334155` (dark)
- **Border Light**: `#F1F5F9` (light) / `#475569` (dark)
- **Divider**: `#F1F5F9` (light) / `#334155` (dark)

#### Label Colors
- **Label Income**: `#059669` (light) / `#10B981` (dark)
- **Label Expense**: `#DC2626` (light) / `#F87171` (dark)
- **Label Recurring**: `#D97706` (light) / `#FBBF24` (dark)
- **Label Standard**: `#7C3AED` (light) / `#A78BFA` (dark)
- **Label Goal**: `#D97706` (light) / `#FBBF24` (dark)

### Typography
Uses DM Sans font family with a comprehensive type scale.

#### Font Weights
- **Regular**: 400 - Body text, captions
- **Medium**: 500 - Subheadings, buttons
- **SemiBold**: 600 - Section titles, important text
- **Bold**: 700 - Headlines, emphasis

#### Type Scale
- **H1**: 32pt Bold - Main headlines
- **H2**: 28pt Bold - Section headlines
- **H3**: 24pt Bold - Subsection headlines
- **H4**: 20pt SemiBold - Card titles
- **Body Large**: 17pt Medium - Important body text
- **Body Regular**: 16pt Regular - Standard body text
- **Body Medium**: 16pt Medium - Emphasized body text
- **Body Small**: 14pt Regular - Secondary text
- **Caption**: 12pt Regular - Labels, metadata
- **Button**: 16pt Medium - Button text

### Spacing
Based on a 4px grid system for consistent spacing.

#### Spacing Scale
- **xs**: 4px - Minimal spacing
- **sm**: 8px - Small spacing
- **md**: 16px - Medium spacing (default)
- **lg**: 24px - Large spacing
- **xl**: 32px - Extra large spacing
- **xxl**: 48px - Maximum spacing

#### Screen-Specific Spacing
- **Screen Padding**: 20px (left/right)
- **Header Height**: 40px
- **Tab Bar Height**: 64px
- **Status Bar Height**: 44px
- **Section to Section**: 20px gap
- **Section Title to Content**: 16px gap

### Radius
Consistent border radius values for UI elements.

- **xs**: 4px - Small elements
- **sm**: 8px - Buttons, inputs
- **md**: 12px - Cards, modals
- **lg**: 16px - Large cards
- **xl**: 20px - Bottom sheets
- **round**: 50px - Circular elements
- **card**: 16px - Standard card radius

### Shadows
Subtle elevation system for depth and hierarchy.

- **Small**: 2px offset, 0.08 opacity - Cards, buttons
- **Medium**: 4px offset, 0.12 opacity - Modals, dropdowns
- **Large**: 8px offset, 0.16 opacity - Bottom sheets, overlays
- **Card**: 2px offset, 0.08 opacity - Standard card shadow

## 🧩 Reusable Components

### Core Components

#### 1. ActionButton
Primary action button with consistent styling.
```typescript
interface ActionButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
}
```

#### 2. BaseBottomSheet
Foundation for all bottom sheet modals.
```typescript
interface BaseBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  height?: number | string;
  snapPoints?: string[];
}
```

#### 3. Card
Standard card container with consistent styling.
```typescript
interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  padding?: number;
  margin?: number;
  elevation?: 'none' | 'small' | 'medium' | 'large';
}
```

#### 4. ChipTag
Small tag component for categories and labels.
```typescript
interface ChipTagProps {
  text: string;
  color?: string;
  backgroundColor?: string;
  size?: 'small' | 'medium' | 'large';
  onPress?: () => void;
}
```

#### 5. FormInput
Standardized input component with validation.
```typescript
interface FormInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  error?: string;
  keyboardType?: KeyboardTypeOptions;
  secureTextEntry?: boolean;
  multiline?: boolean;
}
```

#### 6. Header
Screen header with optional actions.
```typescript
interface HeaderProps {
  title: string;
  rightIcon?: React.ReactNode;
  onRightPress?: () => void;
  showBackButton?: boolean;
  onBackPress?: () => void;
  scrollY?: Animated.Value;
  scrollThreshold?: number;
}
```

#### 7. FloatingActionButton
Floating action button for primary actions.
```typescript
interface FloatingActionButtonProps {
  onPress: () => void;
  icon: React.ReactNode;
  variant?: 'primary' | 'secondary';
  position?: 'bottom-right' | 'bottom-left';
}
```

#### 8. SectionTitle
Section header with optional action button.
```typescript
interface SectionTitleProps {
  title: string;
  rightButton?: {
    icon?: React.ReactNode;
    text?: string;
    onPress: () => void;
  };
  marginBottom?: number;
}
```

#### 9. ScreenTitle
Screen-level title component.
```typescript
interface ScreenTitleProps {
  title: string;
  subtitle?: string;
  showThemeToggle?: boolean;
  rightIcon?: React.ReactNode;
  onRightPress?: () => void;
}
```

#### 10. NavigationButton
Navigation button for tab bar and menus.
```typescript
interface NavigationButtonProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onPress: () => void;
  badge?: number;
}
```

### Specialized Components

#### 11. MicroInteractionWrapper
Provides haptic feedback and animations.
```typescript
interface MicroInteractionWrapperProps {
  children: React.ReactNode;
  onPress?: () => void;
  hapticFeedback?: 'light' | 'medium' | 'heavy';
  animationType?: 'scale' | 'opacity' | 'none';
}
```

#### 12. Overview
Budget overview component with charts and data.
```typescript
interface OverviewProps {
  label: string;
  amount: number;
  incomeData: number[];
  expenseData: number[];
  timeLabels: string[];
  currency?: string;
  selectedPeriod: '1M' | '3M' | '6M' | '1Y';
  onPeriodChange: (period: '1M' | '3M' | '6M' | '6M' | '1Y') => void;
}
```

#### 13. AICardInsight
AI-powered insight card component.
```typescript
interface AICardInsightProps {
  id: string;
  title: string;
  description: string;
  illustration: string | React.ReactNode;
  onDismiss: (id: string) => void;
  onPress: (id: string) => void;
  isFirst?: boolean;
}
```

#### 14. QuickActionButton
Quick action button for home screen.
```typescript
interface QuickActionButtonProps {
  icon: React.ReactNode;
  title: string;
  onPress: () => void;
}
```

#### 15. PocketHome
Pocket display component for home screen.
```typescript
interface PocketHomeProps {
  pocket: Pocket;
  onPress: (pocket: Pocket) => void;
}
```

#### 16. TransactionHome
Transaction display component for home screen.
```typescript
interface TransactionHomeProps {
  transaction: Transaction;
  pockets: Pocket[];
  onPress: (transaction: Transaction) => void;
}
```

### Form Components

#### 17. SelectionInput
Dropdown selection input component.
```typescript
interface SelectionInputProps {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  options: { label: string; value: string }[];
  icon: React.ReactNode;
  placeholder?: string;
  error?: string;
}
```

#### 18. DateInput
Date picker input component.
```typescript
interface DateInputProps {
  label: string;
  value: Date;
  onDateChange: (date: Date) => void;
  mode?: 'date' | 'time' | 'datetime';
  error?: string;
}
```

#### 19. KeyboardAwareBottomSheet
Bottom sheet that adjusts for keyboard.
```typescript
interface KeyboardAwareBottomSheetProps extends BaseBottomSheetProps {
  enableKeyboardAvoidance?: boolean;
  keyboardAvoidanceOffset?: number;
}
```

## 📱 Screen Components

### Primary Screens

#### 1. HomeScreen
Main dashboard with overview, pockets, and transactions.
- Uses `Overview` component for budget visualization
- Displays `PocketHome` components for pocket list
- Shows `TransactionHome` components for recent transactions
- Includes `QuickActionButton` for quick actions
- Features `AICardInsight` for AI recommendations

#### 2. PocketsScreen
Dedicated screen for pocket management.
- Lists all pockets with `PocketCard` components
- Includes create/edit/delete functionality
- Uses `NewPocketBottomSheet` for creation
- Uses `PocketBottomSheet` for editing

#### 3. TransactionsScreen
Transaction management screen.
- Lists all transactions with `TransactionList`
- Includes filtering and sorting options
- Uses `NewTransactionBottomSheet` for creation
- Features `TransactionBottomSheet` for details

#### 4. AccountScreen
User account and settings screen.
- Profile management
- Theme settings
- App preferences
- Secondary screen navigation

### Secondary Screens

#### 5. AppearanceScreen
Theme and appearance settings.
- Light/Dark mode toggle
- Color scheme selection
- Font size preferences

#### 6. CurrencyScreen
Currency and localization settings.
- Currency selection
- Number format preferences
- Regional settings

#### 7. ExportDataScreen
Data export functionality.
- Export to various formats
- Data backup options
- Privacy controls

#### 8. EditProfileScreen
User profile editing.
- Personal information
- Profile picture
- Contact details

#### 9. HelpSupportScreen
Help and support resources.
- FAQ section
- Contact support
- Documentation links

#### 10. PrivacyPolicyScreen
Privacy policy and terms.
- Legal information
- Data usage policies
- Terms of service

#### 11. AboutAppScreen
App information and version details.
- Version information
- Credits
- Legal notices

#### 12. RateUsScreen
App rating and feedback.
- Rating interface
- Feedback form
- App store links

#### 13. AIInsightsScreen
AI-powered insights and recommendations.
- Detailed insights
- Trend analysis
- Budget recommendations

#### 14. TransactionsListScreen
Comprehensive transaction list.
- Advanced filtering
- Search functionality
- Bulk operations

#### 15. ProjectionDetailsScreen
Budget projections and forecasting.
- Future projections
- Goal tracking
- Trend analysis

#### 16. SendToEmailScreen
Email sharing functionality.
- Export to email
- Sharing options
- Format selection

## 🎯 Design Principles

### 1. Consistency
- All components follow the same design patterns
- Consistent spacing, typography, and colors
- Unified interaction patterns

### 2. Accessibility
- WCAG AA compliance for all colors
- Proper touch targets (minimum 44px)
- Screen reader support
- High contrast support

### 3. Performance
- Optimized component rendering
- Efficient state management
- Minimal re-renders
- Lazy loading where appropriate

### 4. Responsiveness
- Adaptive layouts for different screen sizes
- Safe area handling
- Keyboard avoidance
- Orientation support

### 5. User Experience
- Intuitive navigation
- Clear visual hierarchy
- Smooth animations
- Haptic feedback

## 🔧 Development Guidelines

### Component Structure
```typescript
// 1. Imports
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

// 2. Interface definition
interface ComponentProps {
  // Props definition
}

// 3. Component implementation
export default function Component({ prop1, prop2 }: ComponentProps) {
  const theme = useTheme();
  const styles = getStyles(theme);

  return (
    <View style={styles.container}>
      {/* Component JSX */}
    </View>
  );
}

// 4. Styles function
function getStyles(theme: any) {
  return StyleSheet.create({
    container: {
      // Styles using theme values
    },
  });
}
```

### Theme Usage
- Always use `useTheme()` hook to access theme values
- Use theme colors, spacing, typography, and other properties
- Avoid hardcoded values
- Support both light and dark modes

### State Management
- Use React Context for global state
- Keep component state local when possible
- Use proper TypeScript interfaces
- Implement proper error handling

### Navigation
- Use React Navigation for screen navigation
- Implement proper navigation types
- Handle deep linking
- Support back navigation

### Testing
- Write unit tests for components
- Test user interactions
- Verify accessibility
- Test on different devices

## 📚 Additional Resources

### Font Loading
The app uses DM Sans font family. Ensure fonts are properly loaded:
```typescript
import { useAppFonts } from '../fonts';

// In your app component
const fontsLoaded = useAppFonts();
if (!fontsLoaded) {
  return <LoadingScreen />;
}
```

### Safe Area Handling
Use SafeAreaProvider and SafeAreaView for proper safe area handling:
```typescript
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

<SafeAreaProvider>
  <SafeAreaView style={{ flex: 1 }}>
    {/* Your app content */}
  </SafeAreaView>
</SafeAreaProvider>
```

### Error Boundaries
Implement error boundaries for graceful error handling:
```typescript
import ErrorBoundary from '../components/ErrorBoundary';

<ErrorBoundary>
  {/* Your app content */}
</ErrorBoundary>
```

## 🚀 Getting Started

1. **Install Dependencies**: Ensure all required packages are installed
2. **Load Fonts**: Set up DM Sans font loading
3. **Configure Theme**: Use the ThemeProvider in your app
4. **Implement Components**: Start with core components and build up
5. **Test Thoroughly**: Test on multiple devices and orientations
6. **Follow Guidelines**: Adhere to the design system and development guidelines

This design system provides a solid foundation for building a sophisticated, accessible, and performant budgeting application. All components are designed to work together seamlessly and provide a consistent user experience across the entire application.
