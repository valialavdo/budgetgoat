# BudgetGOAT Native Build Migration Guide

## Phase 1: Environment Setup

### Prerequisites
- Android Studio (latest stable)
- Xcode (for iOS development)
- Node.js 18+
- Java 17+ (for Android)

### 1. Convert to Bare Workflow
```bash
# Navigate to clean project
cd budgetgoat-clean

# Convert to bare workflow
npx expo eject

# Install React Native CLI
npm install -g @react-native-community/cli
```

### 2. Firebase Native Setup

#### Android Configuration:
1. Place `google-services.json` in `android/app/`
2. Update `android/app/build.gradle`:
```gradle
apply plugin: 'com.google.gms.google-services'

dependencies {
    implementation platform('com.google.firebase:firebase-bom:32.7.0')
    implementation 'com.google.firebase:firebase-auth'
    implementation 'com.google.firebase:firebase-firestore'
    implementation 'com.google.firebase:firebase-analytics'
}
```

#### iOS Configuration:
1. Place `GoogleService-Info.plist` in `ios/` directory
2. Add to Xcode project
3. Update `ios/Podfile`:
```ruby
pod 'Firebase/Auth'
pod 'Firebase/Firestore'
pod 'Firebase/Analytics'
```

### 3. Build Commands

#### Development Builds:
```bash
# Android development
npx react-native run-android

# iOS development (requires macOS)
npx react-native run-ios
```

#### Production Builds:
```bash
# Android APK
cd android && ./gradlew assembleRelease

# Android AAB (for Play Store)
cd android && ./gradlew bundleRelease

# iOS (requires Xcode)
# Open ios/BudgetGOAT.xcworkspace in Xcode
# Archive → Distribute App
```

## Phase 2: CI/CD Setup

### GitHub Actions (Free)
```yaml
name: Build and Test
on: [push, pull_request]
jobs:
  build-android:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - uses: actions/setup-java@v3
        with:
          java-version: '17'
      - name: Install dependencies
        run: npm install
      - name: Build APK
        run: |
          cd android
          ./gradlew assembleRelease
```

## Phase 3: Firebase Integration

### Install Firebase Native SDKs
```bash
# React Native Firebase
npm install @react-native-firebase/app
npm install @react-native-firebase/auth
npm install @react-native-firebase/firestore
npm install @react-native-firebase/analytics
```

### Update Code
```typescript
// Replace Expo Firebase with React Native Firebase
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import analytics from '@react-native-firebase/analytics';
```

## Benefits of This Approach

1. **Unlimited Builds**: No credit limits
2. **Full Control**: Complete control over native modules
3. **Better Debugging**: Local logs and immediate feedback
4. **Cost Effective**: No monthly subscription
5. **Industry Standard**: Standard React Native development
6. **Firebase Native**: Direct integration without workarounds
7. **CI/CD Flexibility**: Use any CI/CD platform
8. **Version Control**: Full control over dependency versions

## Migration Timeline

- **Day 1-2**: Environment setup and conversion
- **Day 3-4**: Firebase native integration
- **Day 5-6**: Testing and debugging
- **Day 7**: First production build

## Risk Mitigation

1. **Keep Expo project as backup** until native builds are stable
2. **Test thoroughly** before removing Expo dependencies
3. **Document all configurations** for team knowledge
4. **Set up automated testing** to catch issues early
