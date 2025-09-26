# BudgetGOAT - Google Play Store Deployment Guide

## Prerequisites

1. **Google Play Console Account**
   - Create a Google Play Console account
   - Pay the one-time $25 registration fee
   - Complete developer profile verification

2. **EAS CLI Setup**
   ```bash
   npm install -g @expo/eas-cli
   eas login
   ```

3. **Project Setup**
   ```bash
   eas build:configure
   ```

## Step 1: Configure EAS Build

1. **Update app.json**
   - Replace `"your-project-id-here"` with your actual EAS project ID
   - Ensure all required permissions are listed
   - Verify version numbers and build numbers

2. **Create EAS Project**
   ```bash
   eas project:create
   ```

## Step 2: Build for Production

1. **Build Android AAB (Android App Bundle)**
   ```bash
   eas build --platform android --profile production
   ```

2. **Monitor Build Progress**
   - Check build status at: https://expo.dev/accounts/[your-username]/projects/budgetgoat/builds
   - Download the AAB file when complete

## Step 3: Google Play Console Setup

1. **Create New App**
   - Go to Google Play Console
   - Click "Create app"
   - Fill in app details:
     - App name: BudgetGOAT
     - Default language: English
     - App or game: App
     - Free or paid: Free

2. **App Information**
   - Upload app icon (512x512 PNG)
   - Add feature graphic (1024x500 PNG)
   - Write app description
   - Add screenshots (minimum 2, maximum 8)
   - Set content rating
   - Add privacy policy URL

3. **Store Listing**
   - Short description (80 characters max)
   - Full description (4000 characters max)
   - Keywords for search
   - Contact details
   - Website URL

## Step 4: Upload and Release

1. **Upload AAB File**
   - Go to "Release" > "Production"
   - Click "Create new release"
   - Upload the AAB file from EAS build
   - Add release notes

2. **Content Rating**
   - Complete content rating questionnaire
   - Submit for review

3. **App Content**
   - Privacy policy (required)
   - Data safety form
   - Target audience
   - Ads declaration

4. **Pricing & Distribution**
   - Set as free app
   - Select countries for distribution
   - Configure device categories

## Step 5: Review and Publish

1. **Review Process**
   - Google reviews typically take 1-3 days
   - Check for any policy violations
   - Respond to any feedback from Google

2. **Publish**
   - Once approved, click "Publish"
   - App will be live within a few hours

## Step 6: Post-Launch

1. **Monitor Performance**
   - Check crash reports
   - Monitor user reviews
   - Track download statistics

2. **Updates**
   - For updates, increment version in app.json
   - Build new AAB: `eas build --platform android --profile production`
   - Upload to Google Play Console

## Required Assets

### App Icon
- Size: 512x512 PNG
- Format: PNG with transparency
- Location: `./assets/icon.png`

### Feature Graphic
- Size: 1024x500 PNG
- Format: PNG or JPEG
- Purpose: Store listing banner

### Screenshots
- Minimum: 2 screenshots
- Maximum: 8 screenshots
- Sizes: Various device sizes
- Format: PNG or JPEG

## Important Notes

1. **Privacy Policy**: Required for apps that collect user data
2. **Data Safety**: Complete the data safety form accurately
3. **Permissions**: Only request necessary permissions
4. **Testing**: Test thoroughly before submission
5. **Compliance**: Ensure compliance with Google Play policies

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check EAS build logs
   - Verify app.json configuration
   - Ensure all dependencies are compatible

2. **Rejection Reasons**
   - Policy violations
   - Missing required information
   - Technical issues
   - Content rating problems

3. **Performance Issues**
   - Monitor crash reports
   - Optimize app size
   - Improve loading times

## Support Resources

- [Google Play Console Help](https://support.google.com/googleplay/android-developer/)
- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [Expo Documentation](https://docs.expo.dev/)

## Next Steps After Launch

1. **Marketing**
   - Create app store optimization (ASO) strategy
   - Set up analytics tracking
   - Plan user acquisition campaigns

2. **Maintenance**
   - Regular updates and bug fixes
   - Monitor user feedback
   - Plan feature roadmap

3. **Scaling**
   - Consider iOS App Store release
   - Plan for international expansion
   - Implement user feedback features
