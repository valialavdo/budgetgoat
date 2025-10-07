# Firebase-Integrated Android APK Build Guide

This guide provides step-by-step instructions to build a Firebase-integrated Android APK from your Expo React Native project.

## Prerequisites

1. **Firebase Project Setup** (Complete this first):
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project: `budgetgoat-app`
   - Enable Authentication (Email/Password)
   - Enable Firestore Database
   - Enable Analytics
   - Add Android app with package name: `com.budgetgoat.app`
   - Download `google-services.json` and place it in the project root

2. **Install EAS CLI**:
   ```bash
   npm install -g @expo/eas-cli
   ```

3. **Login to Expo**:
   ```bash
   eas login
   ```

## Step 1: Install Dependencies

```bash
cd /Users/valialavdogianni/budget-planner
npm install
```

## Step 2: Configure Firebase Files

1. **Place google-services.json**:
   - Download from Firebase Console
   - Place in project root: `/Users/valialavdogianni/budget-planner/google-services.json`

2. **Verify app.json configuration** (already updated):
   - Android package: `com.budgetgoat.app`
   - Firebase plugin: `@react-native-firebase/app`
   - Google services file reference

## Step 3: Build Development APK

### 3.1 Build for Testing
```bash
eas build --platform android --profile development
```

### 3.2 Monitor Build Progress
- Visit the build URL provided in terminal
- Download APK when build completes (usually 10-15 minutes)

### 3.3 Install APK on Android Device
1. **Enable Developer Options** on Android device:
   - Go to Settings → About Phone
   - Tap "Build Number" 7 times
   - Go back to Settings → Developer Options
   - Enable "USB Debugging"
   - Enable "Install via USB"

2. **Enable Unknown Sources**:
   - Go to Settings → Security
   - Enable "Unknown Sources" or "Install Unknown Apps"

3. **Install APK**:
   - Transfer APK to device via USB or cloud storage
   - Tap APK file to install
   - Grant necessary permissions when prompted

## Step 4: Test Firebase Features

### 4.1 Test Authentication
- Open app on device
- Try creating account with email/password
- Try signing in with existing account
- Check Firebase Console → Authentication for new users

### 4.2 Test Firestore Database
- Create a new pocket in the app
- Create a new transaction
- Check Firebase Console → Firestore Database for new documents

### 4.3 Test Analytics
- Navigate through different screens
- Perform various actions
- Check Firebase Console → Analytics for events (may take 24 hours to appear)

## Step 5: Build Production APK

### 5.1 Build Production APK
```bash
eas build --platform android --profile preview
```

### 5.2 Build Production AAB (for Play Store)
```bash
eas build --platform android --profile production
```

## Step 6: Beta Distribution (Optional)

### 6.1 Internal Testing
1. Go to [Google Play Console](https://play.google.com/console)
2. Create new app or select existing
3. Upload AAB file from production build
4. Set up internal testing track
5. Add testers via email addresses

### 6.2 Invite Testers
1. In Play Console → Testing → Internal testing
2. Copy testing link
3. Share with beta testers
4. Testers can install directly from Play Store

## Troubleshooting

### Common Issues:

1. **Build Fails with Firebase Error**:
   - Ensure `google-services.json` is in project root
   - Check Firebase project package name matches app.json
   - Verify Firebase services are enabled in console

2. **APK Installation Fails**:
   - Check device has enough storage
   - Ensure "Unknown Sources" is enabled
   - Try downloading APK again (may be corrupted)

3. **Firebase Features Not Working**:
   - Check internet connection
   - Verify Firebase project configuration
   - Check device logs for error messages

4. **EAS Build Timeout**:
   - Retry build command
   - Check EAS service status
   - Ensure project has valid configuration

### Debug Commands:
```bash
# Check EAS CLI version
eas --version

# Check build status
eas build:list

# View build logs
eas build:view [BUILD_ID]

# Clear build cache
eas build --clear-cache
```

## Security Notes

1. **Never commit** `google-services.json` to public repositories
2. **Use environment variables** for sensitive configuration
3. **Set up Firestore security rules** before production
4. **Enable App Check** for additional security

## Next Steps

After successful testing:
1. Set up Firestore security rules
2. Configure Firebase App Check
3. Set up crash reporting
4. Configure push notifications
5. Prepare for Play Store submission

## Support

- [Expo EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [Firebase React Native Documentation](https://rnfirebase.io/)
- [Firebase Console](https://console.firebase.google.com/)
