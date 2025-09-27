# Manual EAS Setup Guide

Since the EAS CLI requires interactive input, follow these steps manually:

## Step 1: Create EAS Project

1. **Go to Expo Dashboard**
   - Visit: https://expo.dev/accounts/valialavd/projects
   - Click "Create Project" or "New Project"

2. **Project Details**
   - Project Name: `budgetgoat`
   - Slug: `budgetgoat` (should auto-fill)
   - Platform: Android (and iOS if needed)

3. **Get Project ID**
   - After creating, copy the Project ID from the project page
   - It will look like: `abc123-def456-ghi789`

## Step 2: Update app.json

Replace the project ID in your `app.json`:

```json
{
  "expo": {
    "extra": {
      "eas": {
        "projectId": "YOUR_ACTUAL_PROJECT_ID_HERE"
      }
    }
  }
}
```

## Step 3: Build Commands

Once you have the project ID, run these commands:

### For Testing (APK)
```bash
npx eas-cli build --platform android --profile preview
```

### For Production (AAB)
```bash
npx eas-cli build --platform android --profile production
```

## Step 4: Monitor Build

1. **Check Build Status**
   - Visit: https://expo.dev/accounts/valialavd/projects/budgetgoat/builds
   - Monitor progress in real-time

2. **Download Build**
   - Click on completed build
   - Download APK (for testing) or AAB (for Play Store)

## Alternative: Use Expo Dashboard

You can also start builds directly from the web dashboard:

1. Go to your project page
2. Click "Build" tab
3. Select platform and profile
4. Start build
5. Download when complete

## Current Status

✅ EAS CLI installed and logged in
✅ Project configuration files ready
⏳ Need to create project in Expo dashboard
⏳ Need to update project ID in app.json
⏳ Ready to build SDK file

## Next Steps

1. Create project in Expo dashboard
2. Update app.json with project ID
3. Run build command
4. Download and test SDK file
