# Bottom Sheet Update Status

## ✅ Completed Updates

### 1. TransactionDetailsBottomSheet.tsx
- ✅ Replaced TouchableOpacity Edit button with ActionButton
- ✅ Added i18n support with useTranslation hook
- ✅ Updated imports to include ActionButton
- ✅ Removed hardcoded button styles
- ✅ Used proper accessibility labels from translations

### 2. PocketBottomSheet.tsx (Partial)
- ✅ Added ActionButton and ActionRow imports
- ✅ Added i18n support with useTranslation hook
- ✅ Replaced action buttons (Cancel/Save) with ActionRow
- ✅ Replaced "Add Transaction" button with ActionButton
- 🔄 Still need to replace other TouchableOpacity buttons (field editing, type selection, remove transaction)

### 3. TransactionForm.tsx (Partial)
- ✅ Added ActionButton, ActionRow, FormInput imports
- ✅ Added i18n support with useTranslation hook
- ✅ Replaced save button with ActionButton
- 🔄 Still need to update styles to use theme system completely
- 🔄 Still need to replace TextInput with FormInput

## 🚧 Remaining Bottom Sheets to Update

### High Priority
1. **CreateTransactionBottomSheet.tsx**
   - Replace TouchableOpacity buttons with ActionButton
   - Replace TextInput with FormInput
   - Add i18n support
   - Update styles to use theme system

2. **AddTransactionBottomSheet.tsx**
   - Replace TouchableOpacity buttons with ActionButton
   - Replace TextInput with FormInput
   - Add i18n support
   - Update styles to use theme system

3. **FiltersModal.tsx** (already partially updated)
   - Ensure all buttons use ActionButton
   - Update remaining hardcoded styles
   - Add i18n support

4. **ClearDataConfirmationBottomSheet.tsx**
   - Replace TouchableOpacity buttons with ActionButton
   - Add i18n support
   - Update styles to use theme system

5. **HideBalancesConfirmationBottomSheet.tsx**
   - Replace TouchableOpacity buttons with ActionButton
   - Add i18n support
   - Update styles to use theme system

### Medium Priority
6. **AddItemBottomSheet.tsx**
7. **AddPocketBottomSheet.tsx**
8. **CreatePocketBottomSheet.tsx**
9. **ProjectionBottomSheet.tsx**
10. **InfoBottomSheet.tsx**
11. **AIInsightsBottomSheet.tsx**

## 🔧 Update Pattern

For each bottom sheet, follow this pattern:

### 1. Update Imports
```tsx
// Add these imports
import { useTranslation } from '../i18n';
import ActionButton from './ActionButton';
import ActionRow from './ActionRow';
import FormInput from './FormInput';

// Remove TouchableOpacity if not needed elsewhere
```

### 2. Add Translation Hook
```tsx
export default function SomeBottomSheet({ ... }) {
  const theme = useTheme();
  const { t } = useTranslation();
  const styles = getStyles(theme);
  // ... rest of component
}
```

### 3. Replace Buttons
```tsx
// Before
<TouchableOpacity style={styles.button} onPress={handlePress}>
  <Text style={styles.buttonText}>Save</Text>
</TouchableOpacity>

// After
<ActionButton
  title={t('common.save')}
  onPress={handlePress}
  variant="primary"
  size="medium"
  accessibilityLabel={t('common.save')}
/>
```

### 4. Replace Action Button Rows
```tsx
// Before
<View style={styles.actionButtons}>
  <TouchableOpacity onPress={handleCancel}>
    <Text>Cancel</Text>
  </TouchableOpacity>
  <TouchableOpacity onPress={handleSave}>
    <Text>Save</Text>
  </TouchableOpacity>
</View>

// After
<ActionRow
  actions={[
    { title: t('common.cancel'), onPress: handleCancel, variant: 'ghost' },
    { title: t('common.save'), onPress: handleSave, variant: 'primary' }
  ]}
  direction="horizontal"
  fullWidth
/>
```

### 5. Replace Form Inputs
```tsx
// Before
<TextInput
  style={styles.input}
  placeholder="Enter amount"
  value={amount}
  onChangeText={setAmount}
/>

// After
<FormInput
  label={t('transactions.amount')}
  placeholder={t('forms.enterAmount')}
  value={amount}
  onChangeText={setAmount}
  keyboardType="numeric"
/>
```

### 6. Update Styles
```tsx
// Before
const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.primary,
    // ... hardcoded styles
  }
});

// After
const getStyles = (theme: any) => StyleSheet.create({
  button: {
    backgroundColor: theme.colors.trustBlue,
    // ... theme-based styles
  }
});
```

## 📋 Benefits of These Updates

1. **Consistency**: All bottom sheets will have the same look and feel
2. **Accessibility**: Proper accessibility labels and touch targets
3. **Localization**: All text will be translatable
4. **Maintainability**: Changes to button styles happen in one place
5. **Theme Support**: All components will respect light/dark mode
6. **Type Safety**: TypeScript interfaces ensure proper usage

## 🎯 Next Steps

1. Continue updating the remaining bottom sheets using the pattern above
2. Test each updated bottom sheet to ensure it works correctly
3. Update any missing translation keys in the i18n file
4. Remove unused styles after updating components
5. Ensure all bottom sheets use the same spacing and layout patterns

This systematic approach will ensure all bottom sheets are consistent and use the new reusable component system.
