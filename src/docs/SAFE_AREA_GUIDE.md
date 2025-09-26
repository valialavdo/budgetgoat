# Safe Area Guide for BudgetGoat App

This guide provides comprehensive instructions for implementing proper safe area spacing across all mobile devices and their specific UI elements.

## 🎯 Overview

The safe area system ensures that interactive elements (buttons, inputs, bottom sheets) are positioned with adequate spacing from system UI elements like:
- iPhone home indicator (iPhone X and later)
- iPhone home button (iPhone 8 and earlier)  
- Android navigation bar
- Status bars and notches

## 📱 Device-Specific Safe Areas

### iPhone with Home Indicator (iPhone X and later)
- **Home Indicator**: 34px
- **Recommended Button Safe Area**: 34px + 16px = 50px
- **Bottom Sheet Safe Area**: 34px + 8px = 42px
- **Content Safe Area**: 34px + 4px = 38px

### iPhone with Home Button (iPhone 8 and earlier)
- **Home Button Area**: 20px
- **Recommended Button Safe Area**: 20px + 16px = 36px
- **Bottom Sheet Safe Area**: 20px + 8px = 28px
- **Content Safe Area**: 20px + 4px = 24px

### Android Devices
- **Navigation Bar**: 24px
- **Recommended Button Safe Area**: 24px + 16px = 40px
- **Bottom Sheet Safe Area**: 24px + 8px = 32px
- **Content Safe Area**: 24px + 4px = 28px

## 🛠️ Implementation

### 1. Import Safe Area Utilities

```typescript
import { SafeAreaContexts, SafeAreaStyles } from '../utils/safeAreaUtils';
```

### 2. Use Context-Specific Helpers

```typescript
// For button containers (like bottom action buttons)
paddingBottom: SafeAreaContexts.buttonContainer()

// For bottom sheets
marginBottom: SafeAreaContexts.bottomSheet()

// For scrollable content
paddingBottom: SafeAreaContexts.scrollContent()

// For modal content
paddingBottom: SafeAreaContexts.modal()
```

### 3. Use Predefined Styles

```typescript
// For bottom button containers
<View style={SafeAreaStyles.bottomButtonContainer}>
  <ActionButton />
</View>

// For bottom sheets
<View style={SafeAreaStyles.bottomSheet}>
  <BottomSheetContent />
</View>
```

## 📋 Component Implementation Guide

### Bottom Sheets
```typescript
// In BottomSheetWrapper.tsx
const styles = StyleSheet.create({
  bottomSheet: {
    marginBottom: SafeAreaContexts.bottomSheet(), // ✅ Dynamic safe area
  },
});
```

### Button Containers
```typescript
// In any bottom sheet with action buttons
const styles = StyleSheet.create({
  buttonContainer: {
    paddingBottom: SafeAreaContexts.buttonContainer(), // ✅ Dynamic safe area
  },
});
```

### Scrollable Content
```typescript
// In screens with scrollable content
const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: SafeAreaContexts.scrollContent(), // ✅ Dynamic safe area
  },
});
```

## 🎨 Design System Integration

### Theme Integration
The safe area values are integrated into the theme system:

```typescript
// In theme.ts
export const Layout = {
  safeArea: {
    homeIndicator: 34,
    homeButton: 20,
    androidNavBar: 24,
    minBottomSafe: 20,
    recommendedBottomSafe: 32,
    bottomSheetSafe: 40,
  },
};
```

### Consistent Usage
All components should use the safe area utilities instead of hardcoded values:

```typescript
// ❌ Don't do this
paddingBottom: 16

// ✅ Do this
paddingBottom: SafeAreaContexts.buttonContainer()
```

## 🔧 Customization

### Adding New Contexts
To add new safe area contexts, extend the `SafeAreaContexts` object:

```typescript
// In safeAreaUtils.ts
export const SafeAreaContexts = {
  // Existing contexts...
  
  // New context for custom use case
  customElement: (): number => SafeAreaUtils.getBottomSafeArea('custom'),
};
```

### Device-Specific Adjustments
Modify the `getBottomSafeArea` function to add new device types or adjust existing values:

```typescript
// In safeAreaUtils.ts
getBottomSafeArea: (context: 'button' | 'sheet' | 'content' | 'custom' = 'button'): number => {
  const deviceType = DeviceUtils.getDeviceType();
  
  switch (context) {
    case 'custom':
      // Add custom logic here
      return 25;
    // ... existing cases
  }
}
```

## 🧪 Testing

### Device Testing Checklist
- [ ] iPhone X and later (home indicator)
- [ ] iPhone 8 and earlier (home button)
- [ ] Android devices (navigation bar)
- [ ] Different screen sizes
- [ ] Both portrait and landscape orientations

### Visual Verification
1. **Buttons**: Should have comfortable tapping space above system UI
2. **Bottom Sheets**: Should not overlap with system UI
3. **Content**: Should be fully visible above system UI
4. **Modals**: Should respect safe areas in all contexts

## 📚 Examples

### Complete Bottom Sheet Example
```typescript
import { SafeAreaContexts } from '../utils/safeAreaUtils';

const AddTransactionBottomSheet = () => {
  const styles = StyleSheet.create({
    buttonContainer: {
      marginTop: 'auto',
      paddingBottom: SafeAreaContexts.buttonContainer(), // ✅ Safe area
      paddingTop: theme.spacing.md,
    },
  });

  return (
    <BottomSheetWrapper
      style={{ marginBottom: SafeAreaContexts.bottomSheet() }} // ✅ Safe area
    >
      {/* Content */}
      <View style={styles.buttonContainer}>
        <ActionButton label="Save" />
      </View>
    </BottomSheetWrapper>
  );
};
```

### Screen Content Example
```typescript
const AccountScreen = () => {
  const styles = StyleSheet.create({
    scrollContent: {
      paddingBottom: SafeAreaContexts.scrollContent(), // ✅ Safe area
    },
  });

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      {/* Screen content */}
    </ScrollView>
  );
};
```

## 🚨 Common Mistakes

### ❌ Hardcoded Values
```typescript
// Don't use hardcoded values
paddingBottom: 16 // This won't work on all devices
```

### ❌ Ignoring Context
```typescript
// Don't use the same safe area for all contexts
paddingBottom: SafeAreaContexts.buttonContainer() // Too much space for content
```

### ❌ Missing Safe Areas
```typescript
// Don't forget safe areas in bottom sheets
<View style={{ paddingBottom: theme.spacing.md }}> // Not enough space
```

## ✅ Best Practices

1. **Always use safe area utilities** instead of hardcoded values
2. **Choose the right context** for each use case
3. **Test on multiple devices** to ensure consistency
4. **Use predefined styles** when available
5. **Document custom safe areas** for team consistency

## 🔄 Migration Guide

### From Hardcoded Values
```typescript
// Before
paddingBottom: 16

// After
paddingBottom: SafeAreaContexts.buttonContainer()
```

### From Theme Values
```typescript
// Before
paddingBottom: theme.layout.bottomSheetSafe

// After
paddingBottom: SafeAreaContexts.bottomSheet()
```

This guide ensures consistent, device-aware spacing across the entire BudgetGoat app!
