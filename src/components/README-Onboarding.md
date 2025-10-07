# BudgetGOAT Onboarding System

A complete, reusable onboarding system that mimics modern app onboarding patterns with smooth animations, proper keyboard handling, and full accessibility support.

## 🎯 Features

- **Horizontal Scrolling**: Smooth FlatList-based card navigation
- **Animated Indicators**: Beautiful dot indicators with smooth transitions
- **Multiple Auth Options**: Google, Apple, and Email sign-in buttons
- **Email Input Modal**: Proper keyboard handling with bottom sheet
- **Fully Accessible**: ARIA labels, proper touch targets, screen reader support
- **Cross-Platform**: Works identically on iOS and Android
- **Highly Reusable**: Modular components for any onboarding flow
- **Themed**: Full integration with BudgetGOAT theme system

## 📦 Components

### OnboardingCard
Reusable card component for individual onboarding steps.

```tsx
<OnboardingCard
  title="Welcome to BudgetGOAT"
  subtitle="Smart budget planning at the speed of thought"
  description="Take control of your finances..."
  image={<CustomImageComponent />}
>
  <CustomButtonGroup />
</OnboardingCard>
```

**Props:**
- `title: string` - Main title text
- `subtitle?: string` - Optional subtitle
- `description?: string` - Optional description text
- `image?: React.ReactNode` - Custom image/content
- `children?: React.ReactNode` - Additional content (buttons, etc.)
- `style?: ViewStyle` - Custom styling

### DotIndicator
Animated pagination dots with smooth transitions.

```tsx
<DotIndicator
  count={3}
  activeIndex={currentStep}
  color="#CCCCCC"
  activeColor="#007AFF"
  size={8}
  activeSize={24}
  spacing={8}
/>
```

**Props:**
- `count: number` - Total number of dots
- `activeIndex: number` - Currently active dot index
- `color?: string` - Inactive dot color (defaults to theme)
- `activeColor?: string` - Active dot color (defaults to theme)
- `size?: number` - Dot size (default: 8)
- `activeSize?: number` - Active dot width (default: 24)
- `spacing?: number` - Space between dots (default: 8)

### AuthButton
Pre-configured authentication buttons for different providers.

```tsx
<AuthButton
  provider="google"
  onPress={handleGoogleSignIn}
  loading={isLoading}
  disabled={isDisabled}
/>
```

**Props:**
- `provider: 'google' | 'apple' | 'email'` - Authentication provider
- `onPress: () => void` - Button press handler
- `style?: ViewStyle` - Custom button styling
- `textStyle?: TextStyle` - Custom text styling
- `disabled?: boolean` - Disabled state
- `loading?: boolean` - Loading state

### EmailInputModal
Email input modal with proper keyboard handling.

```tsx
<EmailInputModal
  visible={showModal}
  onClose={() => setShowModal(false)}
  onSubmit={(email) => handleEmailSignIn(email)}
/>
```

**Props:**
- `visible: boolean` - Modal visibility
- `onClose: () => void` - Close handler
- `onSubmit: (email: string) => void` - Email submission handler

### OnboardingFlow
Complete onboarding flow component that integrates all pieces.

```tsx
<OnboardingFlow onComplete={() => setOnboardingComplete(true)} />
```

**Props:**
- `onComplete: () => void` - Completion handler

## 🎨 Theming

All components fully support the BudgetGOAT theme system:

```tsx
const theme = useTheme();

// Colors
theme.colors.trustBlue      // Primary blue
theme.colors.goatGreen      // Success green
theme.colors.alertRed       // Error red
theme.colors.warningOrange  // Warning orange

// Typography
theme.typography.h1         // Large titles
theme.typography.h3         // Section titles
theme.typography.bodyLarge  // Descriptions

// Spacing
theme.spacing.screenPadding // 20px horizontal padding
theme.spacing.xl           // 32px vertical spacing
```

## 📱 Usage Examples

### Basic Onboarding
```tsx
import OnboardingFlow from '../components/OnboardingFlow';

function App() {
  const [onboardingComplete, setOnboardingComplete] = useState(false);

  if (!onboardingComplete) {
    return <OnboardingFlow onComplete={() => setOnboardingComplete(true)} />;
  }

  return <MainApp />;
}
```

### Custom Onboarding Steps
```tsx
import { getOnboardingSteps } from '../data/onboardingData';

const customSteps = getOnboardingSteps().map(step => ({
  ...step,
  title: `Custom: ${step.title}`,
}));
```

### Individual Component Usage
```tsx
import OnboardingCard from '../components/OnboardingCard';
import DotIndicator from '../components/DotIndicator';

function CustomScreen() {
  return (
    <View>
      <OnboardingCard
        title="Custom Title"
        description="Custom description"
      />
      <DotIndicator count={3} activeIndex={1} />
    </View>
  );
}
```

## 🔧 Customization

### Custom Onboarding Data
Edit `src/data/onboardingData.tsx` to customize:
- Step titles and descriptions
- Images and icons
- Feature cards
- Task examples

### Custom Styling
Override component styles:
```tsx
<OnboardingCard
  title="Custom Title"
  style={{ backgroundColor: 'custom-color' }}
/>
```

### Custom Auth Providers
Add new providers to `AuthButton`:
```tsx
// In AuthButton.tsx
case 'microsoft':
  return {
    title: 'Continue with Microsoft',
    icon: '🔷',
    variant: 'secondary' as const,
  };
```

## ♿ Accessibility

All components include:
- **ARIA Labels**: Proper accessibility labels
- **Touch Targets**: Minimum 44px touch targets
- **Screen Reader**: Full screen reader support
- **Keyboard Navigation**: Proper keyboard handling
- **Color Contrast**: WCAG AA compliant colors

## 🚀 Performance

- **FlatList**: Efficient horizontal scrolling
- **Native Animations**: Uses `useNativeDriver: true`
- **Lazy Loading**: Components render only when visible
- **Memory Efficient**: Proper cleanup and ref management

## 🧪 Testing

Test components individually:
```tsx
import { OnboardingCardExample } from '../examples/OnboardingExample';

// Test individual components
<OnboardingCardExample />
<DotIndicatorExample />
<AuthButtonExample />
```

## 🔄 Integration

The onboarding system integrates with:
- **Navigation**: `RootNavigator` handles onboarding flow
- **Context**: `OnboardingContext` manages completion state
- **Storage**: `AsyncStorage` persists completion status
- **Theme**: Full theme system integration
- **Auth**: MockFirebase integration for development

## 📋 Platform Notes

### iOS
- Smooth native scrolling
- Proper safe area handling
- iOS-style animations

### Android
- Material Design compliance
- Proper keyboard handling
- Android-specific optimizations

## 🎯 Future Enhancements

Potential improvements:
- **Video Support**: Add video backgrounds
- **Custom Animations**: More transition options
- **Analytics**: Track onboarding completion
- **A/B Testing**: Multiple onboarding variants
- **Localization**: Multi-language support

## 🐛 Troubleshooting

### Common Issues

**Dots not animating:**
- Ensure `activeIndex` is properly managed
- Check that `count` matches data length

**Keyboard issues:**
- Verify `KeyboardAvoidingView` setup
- Check `keyboardVerticalOffset` values

**Scroll not working:**
- Ensure `pagingEnabled={true}`
- Check `snapToInterval` matches screen width

### Debug Mode
Enable debug logging:
```tsx
// In OnboardingFlow.tsx
console.log('Current step:', currentIndex);
console.log('Total steps:', onboardingSteps.length);
```
