# Header Guidelines for BudgetGOAT App

## Overview
This document defines the consistent header design patterns for all screens and components in the BudgetGOAT application.

## General Header Principles

### 1. Title Alignment
- **All titles should be LEFT ALIGNED**
- No center alignment or right alignment for titles
- Titles should be prominent and readable

### 2. Icon Button Placement
- **Icon buttons should be positioned on the RIGHT side**
- Multiple icon buttons can be placed next to each other on the right
- Icon buttons should maintain consistent spacing and sizing

### 3. Header Layout Structure
```
[Title] ←→ [Icon Button 1] [Icon Button 2]
```

## Bottom Sheet Headers

### Required Elements
Every bottom sheet header **MUST** include:
1. **Close button (X)** - Always required
2. **Title** - Left aligned
3. **Optional action icon** - When needed (delete, edit, etc.)

### Layout Pattern
```jsx
<BaseBottomSheet
  visible={visible}
  onClose={onClose}
  title="Screen Title"
  headerRightIcon={<ActionIcon />} // Optional
  onHeaderRightPress={handleAction} // Optional
>
```

### Examples

#### 1. Simple Bottom Sheet (Close only)
```jsx
<BaseBottomSheet
  visible={visible}
  onClose={onClose}
  title="AI Insights"
>
```

#### 2. Bottom Sheet with Delete Action
```jsx
<BaseBottomSheet
  visible={visible}
  onClose={onClose}
  title="Emergency Fund"
  headerRightIcon={<Trash size={24} color={theme.colors.alertRed} weight="light" />}
  onHeaderRightPress={handleDelete}
>
```

#### 3. Bottom Sheet with Edit Action
```jsx
<BaseBottomSheet
  visible={visible}
  onClose={onClose}
  title="Transaction Details"
  headerRightIcon={<PencilSimple size={24} color={theme.colors.text} weight="light" />}
  onHeaderRightPress={handleEdit}
>
```

## Screen Headers (Secondary Screens)

### Required Elements
Every secondary screen header **MUST** include:
1. **Back button** - Left side
2. **Title** - Left aligned (after back button)
3. **Optional action button** - Right side (notification, settings, etc.)

### Layout Pattern
```jsx
<SecondaryHeader
  title="Screen Title"
  onBackPress={handleBack}
  rightIcon={<ActionIcon />} // Optional
  onRightPress={handleAction} // Optional
/>
```

### Examples

#### 1. Simple Screen Header
```jsx
<SecondaryHeader
  title="Currency Settings"
  onBackPress={() => navigation.goBack()}
/>
```

#### 2. Screen Header with Action
```jsx
<SecondaryHeader
  title="Account"
  onBackPress={() => navigation.goBack()}
  rightIcon={<Bell size={24} color={theme.colors.text} weight="light" />}
  onRightPress={handleNotifications}
/>
```

## Icon Button Guidelines

### Standard Sizes
- **Icon buttons**: 32px for touch targets
- **Icons within buttons**: 24px for most icons
- **Close (X) icon**: 24px

### Common Icons
- **Close**: `<X size={24} color={theme.colors.text} weight="light" />`
- **Delete**: `<Trash size={24} color={theme.colors.alertRed} weight="light" />`
- **Edit**: `<PencilSimple size={24} color={theme.colors.text} weight="light" />`
- **Back**: `<CaretLeft size={24} color={theme.colors.text} weight="light" />`
- **Notifications**: `<Bell size={24} color={theme.colors.text} weight="light" />`

### Icon Colors
- **Default**: `theme.colors.text`
- **Destructive actions**: `theme.colors.alertRed`
- **Primary actions**: `theme.colors.trustBlue`
- **Muted actions**: `theme.colors.textMuted`

## Spacing Guidelines

### Header Padding
- **Horizontal**: `theme.spacing.lg` (16px)
- **Vertical**: `theme.spacing.md` (12px)

### Icon Spacing
- **Between icons**: `theme.spacing.sm` (8px)
- **From edge**: `theme.spacing.md` (12px)

### Title Spacing
- **From back button**: `theme.spacing.sm` (8px)
- **From edge**: `theme.spacing.lg` (16px)

## Implementation Examples

### BaseBottomSheet Header Implementation
```jsx
// In BaseBottomSheet.tsx
<View style={styles.header}>
  <Text style={styles.headerTitle}>{title}</Text>
  {headerRightIcon && onHeaderRightPress ? (
    <IconButton
      icon={headerRightIcon}
      onPress={onHeaderRightPress}
      variant="ghost"
      size="small"
      accessibilityLabel="Action"
    />
  ) : (
    <IconButton
      icon={<X size={24} color={theme.colors.text} weight="light" />}
      onPress={onClose}
      variant="ghost"
      size="small"
      accessibilityLabel="Close"
    />
  )}
</View>
```

### SecondaryHeader Implementation
```jsx
// In SecondaryHeader.tsx
<View style={styles.header}>
  <IconButton
    icon={<CaretLeft size={24} color={theme.colors.text} weight="light" />}
    onPress={onBackPress}
    variant="ghost"
    size="small"
    accessibilityLabel="Go back"
  />
  <Text style={styles.title}>{title}</Text>
  {rightIcon && onRightPress && (
    <IconButton
      icon={rightIcon}
      onPress={onRightPress}
      variant="ghost"
      size="small"
      accessibilityLabel="Action"
    />
  )}
</View>
```

## Accessibility Guidelines

### Required Props
- `accessibilityLabel` - Clear description of button purpose
- `accessibilityRole` - "button" for interactive elements
- `accessibilityHint` - Optional additional context

### Examples
```jsx
<IconButton
  icon={<Trash size={24} color={theme.colors.alertRed} weight="light" />}
  onPress={handleDelete}
  accessibilityLabel="Delete pocket"
  accessibilityRole="button"
  accessibilityHint="Permanently removes this pocket and all its data"
/>
```

## Consistency Checklist

Before implementing any header, ensure:
- [ ] Title is left aligned
- [ ] Icon buttons are on the right
- [ ] Close button is always present (for bottom sheets)
- [ ] Back button is always present (for secondary screens)
- [ ] Icons are 24px and buttons are 32px
- [ ] Proper spacing is applied
- [ ] Accessibility props are included
- [ ] Theme colors are used consistently
- [ ] Icon weights are "light" unless specified otherwise

## Common Mistakes to Avoid

1. **Center-aligned titles** - Always left align
2. **Missing close buttons** - Required for all bottom sheets
3. **Missing back buttons** - Required for all secondary screens
4. **Inconsistent icon sizes** - Use 24px for icons, 32px for buttons
5. **Hard-coded colors** - Always use theme colors
6. **Missing accessibility props** - Always include labels and roles
7. **Inconsistent spacing** - Use theme spacing values

## Theme Integration

All headers should use the centralized theme system:
- Colors: `theme.colors.*`
- Spacing: `theme.spacing.*`
- Typography: `theme.typography.*`
- Radius: `theme.radius.*`

This ensures consistency across light/dark modes and future theme updates.