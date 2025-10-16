# UI Guidelines - BudgetGOAT

## Design System Overview

This document outlines the design system extracted from the BudgetGOAT React Native application codebase.

## Color Palette

### Primary Colors
- **GOAT Green**: `#10B981` (Success, positive actions)
- **Trust Blue**: `#3B82F6` (Primary actions, links)
- **Alert Red**: `#EF4444` (Errors, expenses, warnings)

### Neutral Colors
- **Text Primary**: `#1F2937` (Dark mode: `#F9FAFB`)
- **Text Secondary**: `#6B7280` (Dark mode: `#9CA3AF`)
- **Text Muted**: `#9CA3AF` (Dark mode: `#6B7280`)
- **Background**: `#FFFFFF` (Dark mode: `#111827`)
- **Surface**: `#F9FAFB` (Dark mode: `#1F2937`)
- **Border**: `#E5E7EB` (Dark mode: `#374151`)
- **Border Light**: `#F3F4F6` (Dark mode: `#4B5563`)

### Label Colors
- **Recurring**: `#FEF3C7` (Background) / `#D97706` (Text)
- **Linked**: `#E0F2FE` (Background) / `#0277BD` (Text)
- **Unlinked**: `#FEF2F2` (Background) / `#DC2626` (Text)
- **Category**: `#DBEAFE` (Background) / `#1D4ED8` (Text)

## Typography

### Font Family
- **Primary**: DM Sans (Regular, Medium, SemiBold)

### Font Sizes
- **H1**: 32px (Screen titles)
- **H2**: 24px (Section headers)
- **H3**: 20px (Card titles)
- **Body Large**: 18px
- **Body Medium**: 16px (Default text)
- **Body Small**: 14px (Secondary text)
- **Caption**: 12px (Labels, metadata)

### Font Weights
- **Regular**: 400 (Default)
- **Medium**: 500 (Emphasis, titles)
- **SemiBold**: 600 (Headers)

## Spacing System

### Base Unit: 4px Grid
- **xs**: 4px
- **sm**: 8px
- **md**: 16px
- **lg**: 24px
- **xl**: 32px
- **2xl**: 48px

### Component Spacing
- **Card Padding**: 16px
- **Screen Padding**: 20px
- **Section Margin**: 24px
- **Item Gap**: 12px

## Border Radius

- **Small**: 8px (Buttons, small elements)
- **Medium**: 12px (Cards, inputs)
- **Large**: 16px (Large cards, modals)

## Shadows

### Card Shadow
```css
shadowColor: '#000'
shadowOffset: { width: 0, height: 2 }
shadowOpacity: 0.1
shadowRadius: 8
elevation: 3
```

### Button Shadow
```css
shadowColor: '#000'
shadowOffset: { width: 0, height: 1 }
shadowOpacity: 0.05
shadowRadius: 4
elevation: 2
```

## Component Styles

### Cards
```typescript
const cardStyle = {
  backgroundColor: theme.colors.surface,
  borderRadius: theme.radius.medium,
  padding: theme.spacing.md,
  marginHorizontal: theme.spacing.md,
  marginVertical: theme.spacing.sm,
  borderWidth: 1,
  borderColor: theme.colors.border,
};
```

### Buttons
```typescript
const primaryButton = {
  backgroundColor: theme.colors.goatGreen,
  borderRadius: theme.radius.medium,
  paddingVertical: theme.spacing.md,
  paddingHorizontal: theme.spacing.lg,
  alignItems: 'center',
  justifyContent: 'center',
};
```

### Input Fields
```typescript
const inputField = {
  borderWidth: 1,
  borderColor: theme.colors.border,
  borderRadius: theme.radius.medium,
  paddingVertical: theme.spacing.md,
  paddingHorizontal: theme.spacing.md,
  backgroundColor: theme.colors.background,
  fontSize: theme.typography.bodyMedium.fontSize,
};
```

## Icon Guidelines

### Icon Library
- **Primary**: Phosphor React Native
- **Size**: 16px, 20px, 24px (standard sizes)
- **Weight**: Regular, Medium, Light
- **Color**: Inherit from parent text color

### Common Icons
- **Navigation**: House, Wallet, Receipt, User
- **Actions**: Plus, Pencil, Trash, X
- **Status**: CheckCircle, XCircle, WarningCircle, Info
- **Financial**: CurrencyDollar, ChartPie, Target, Link

## Layout Patterns

### Screen Structure
1. **Header**: Screen title + optional action buttons
2. **Content**: ScrollView with sections
3. **Bottom Sheet**: Modal overlays for forms/details
4. **Navigation**: Bottom tab bar

### Section Layout
```typescript
const sectionStyle = {
  marginBottom: theme.spacing.lg,
  paddingHorizontal: theme.spacing.lg,
};
```

### List Items
```typescript
const listItemStyle = {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingVertical: theme.spacing.md,
  borderBottomWidth: 1,
  borderBottomColor: theme.colors.borderLight,
};
```

## Dark Mode Support

All colors have dark mode variants defined in the theme context. Components automatically adapt using `theme.isDark` boolean.

## Inconsistencies Found

### 1. Font Weight Inconsistencies
- Some components use `'bold'` instead of `'500'` or `'600'`
- **Status**: ⚠️ Needs standardization

### 2. Color Usage
- Some hardcoded colors instead of theme colors
- **Status**: ⚠️ Needs refactoring

### 3. Spacing Inconsistencies
- Mixed use of hardcoded values vs theme spacing
- **Status**: ⚠️ Needs standardization

### 4. Border Radius
- Inconsistent radius values across components
- **Status**: ⚠️ Needs standardization

## Accessibility

### Color Contrast
- All colors meet WCAG AA standards
- High contrast ratios for text readability

### Touch Targets
- Minimum 44px touch target size
- Adequate spacing between interactive elements

### Typography
- Readable font sizes (minimum 14px)
- Sufficient line height for readability

## Implementation Notes

### Theme Context Usage
```typescript
import { useTheme } from '../context/ThemeContext';

const MyComponent = () => {
  const theme = useTheme();
  const styles = getStyles(theme);
  // Component implementation
};
```

### StyleSheet Creation
```typescript
const getStyles = (theme: any) => StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
    padding: theme.spacing.md,
  },
});
```

## Future Improvements

1. **Standardize all hardcoded values** to use theme system
2. **Create component variants** for different states
3. **Add animation guidelines** for micro-interactions
4. **Implement design tokens** for better maintainability
5. **Add responsive breakpoints** for different screen sizes
