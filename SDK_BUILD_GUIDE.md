# BudgetGOAT - SDK Build Guide

## Step 1: Create EAS Account

1. **Go to Expo website**
   - Visit: https://expo.dev
   - Click "Sign Up" or "Get Started"
   - Create account with email or GitHub

2. **Verify your account**
   - Check your email for verification link
   - Complete the verification process

## Step 2: Install EAS CLI

```bash
# Install EAS CLI globally (you may need to enter your password)
sudo npm install -g eas-cli

# Or use npx (no global install needed)
npx eas-cli --version
```

## Step 3: Login to EAS

```bash
# Login to EAS (this will open a browser for authentication)
npx eas-cli login

# Follow the prompts:
# 1. Enter your email/username
# 2. Complete browser authentication
# 3. Return to terminal
```

## Step 4: Configure EAS Project

```bash
# Initialize EAS in your project
npx eas-cli build:configure

# This will:
# - Create/update eas.json
# - Set up build profiles
# - Configure project settings
```

## Step 5: Update Project ID

1. **Get your project ID from EAS**
   ```bash
   npx eas-cli project:info
   ```

2. **Update app.json**
   - Replace `"your-project-id-here"` in app.json with your actual project ID
   - The line should look like: `"projectId": "abc123-def456-ghi789"`

## Step 6: Build SDK File

### For Android (AAB - Android App Bundle)
```bash
# Build for production (creates AAB file for Google Play Store)
npx eas-cli build --platform android --profile production

# Build for testing (creates APK file)
npx eas-cli build --platform android --profile preview
```

### For iOS (if needed)
```bash
# Build for iOS (requires Apple Developer account)
npx eas-cli build --platform ios --profile production
```

## Step 7: Monitor Build Progress

1. **Check build status**
   - Visit: https://expo.dev/accounts/[your-username]/projects/budgetgoat/builds
   - Monitor build progress in real-time

2. **Download when complete**
   - Click on completed build
   - Download the AAB/APK file
   - File will be saved to your Downloads folder

## Step 8: Test the Build

### For Android APK (Preview Build)
1. **Install on device**
   ```bash
   # Enable developer options on Android device
   # Enable "Install from unknown sources"
   # Transfer APK to device and install
   ```

2. **Test functionality**
   - Create pockets
   - Add transactions
   - Test export functionality
   - Verify profile editing

### For Android AAB (Production Build)
- AAB files are for Google Play Store submission
- Cannot be installed directly on devices
- Must be uploaded to Google Play Console

## Step 9: Prepare for Google Play Store

1. **Create Google Play Console Account**
   - Visit: https://play.google.com/console
   - Pay $25 registration fee
   - Complete developer profile

2. **Upload AAB File**
   - Go to "Release" > "Production"
   - Upload the AAB file from EAS build
   - Complete store listing information

## Troubleshooting

### Common Issues

1. **Build Failures**
   ```bash
   # Check build logs
   npx eas-cli build:list
   
   # View specific build details
   npx eas-cli build:view [build-id]
   ```

2. **Authentication Issues**
   ```bash
   # Re-login if needed
   npx eas-cli logout
   npx eas-cli login
   ```

3. **Project Configuration**
   ```bash
   # Reconfigure if needed
   npx eas-cli build:configure
   ```

### Build Profiles

The `eas.json` file contains different build profiles:

- **development**: For development testing
- **preview**: For internal testing (creates APK)
- **production**: For store submission (creates AAB)

## Next Steps After Build

1. **Test thoroughly** on real devices
2. **Prepare store assets** (screenshots, descriptions)
3. **Submit to Google Play Store**
4. **Monitor performance** and user feedback

## Important Notes

- **Build time**: 5-15 minutes depending on complexity
- **File size**: Typically 15-25MB for Android
- **Updates**: Increment version in app.json for new builds
- **Testing**: Always test on real devices before submission

## Support

- [EAS Documentation](https://docs.expo.dev/build/introduction/)
- [Expo Discord](https://chat.expo.dev/)
- [GitHub Issues](https://github.com/expo/expo/issues)
