# 🚀 BudgetGOAT Build Instructions

## **Prerequisites**

### **1. Environment Setup**
```bash
# Install Node.js 18.x
nvm install 18
nvm use 18

# Install EAS CLI globally
npm install -g @expo/eas-cli

# Install Expo CLI
npm install -g @expo/cli
```

### **2. Firebase Setup**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create new project: "BudgetGOAT"
3. Enable Authentication (Email/Password)
4. Enable Firestore Database
5. Enable Analytics
6. Download configuration files:
   - `google-services.json` → `android/app/google-services.json`
   - `GoogleService-Info.plist` → `ios/GoogleService-Info.plist`

### **3. EAS Setup**
```bash
# Login to Expo
eas login

# Configure project
eas build:configure
```

## **Build Process**

### **Step 1: Pre-Build Diagnostics**
```bash
# Run diagnostic script
npm run diagnose

# If errors found, fix them before proceeding
```

### **Step 2: Install Dependencies**
```bash
# Clean install
npm run clean

# Or manually:
rm -rf node_modules package-lock.json
npm install
```

### **Step 3: Development Build**
```bash
# Build development APK
npm run build:dev

# Or manually:
npx eas build --platform android --profile development --clear-cache
```

### **Step 4: Preview Build**
```bash
# Build preview APK for testing
npm run build:preview

# Or manually:
npx eas build --platform android --profile preview --clear-cache
```

### **Step 5: Production Build**
```bash
# Build production AAB for Play Store
npm run build:production

# Or manually:
npx eas build --platform android --profile production
```

## **Testing**

### **Local Testing (Expo Go)**
```bash
# Start development server
npm start

# Scan QR code with Expo Go app
```

### **Development Client Testing**
```bash
# Install development build
# Download APK from EAS build
# Install on device
# Run: npm start --dev-client
```

## **Deployment**

### **Google Play Store**
1. Build production AAB: `npm run build:production`
2. Download AAB from EAS
3. Upload to Google Play Console
4. Submit for review

### **Internal Testing**
1. Build preview APK: `npm run build:preview`
2. Download APK from EAS
3. Distribute to testers
4. Collect feedback

## **Troubleshooting**

### **Common Issues**

#### **"Gradle build failed"**
```bash
# Check dependencies
npm run diagnose

# Clean everything
npm run clean
npx eas build --clear-cache
```

#### **"Firebase not initialized"**
- Check `google-services.json` is in correct location
- Verify Firebase plugin in `app.json`
- Ensure native Firebase SDKs are installed

#### **"Metro bundler errors"**
```bash
# Clear Metro cache
npx expo start --clear

# Reset Metro bundler
npx expo r -c
```

#### **"Dependency conflicts"**
```bash
# Use legacy peer deps
npm install --legacy-peer-deps

# Or force install
npm install --force
```

### **Debug Commands**
```bash
# Verbose build logs
npx eas build --platform android --profile development --log-level debug

# Check build status
npx eas build:list

# View build logs
npx eas build:view [BUILD_ID]
```

## **File Structure Checklist**

Ensure these files exist:
- ✅ `package.json` - Dependencies
- ✅ `app.json` - Expo configuration
- ✅ `eas.json` - EAS build configuration
- ✅ `android/app/google-services.json` - Firebase Android config
- ✅ `ios/GoogleService-Info.plist` - Firebase iOS config
- ✅ `src/services/firebase.ts` - Firebase service
- ✅ `src/context/FirebaseContext.tsx` - Firebase context
- ✅ `scripts/diagnose-build.js` - Diagnostic script

## **Version Compatibility Matrix**

| Component | Version | Notes |
|-----------|---------|-------|
| Expo SDK | 51.0.39 | Stable |
| React Native | 0.74.5 | Compatible with SDK 51 |
| React | 18.2.0 | Compatible |
| Firebase | 20.4.0 | Native SDK |
| Node.js | 18.x | Required |

## **Best Practices**

1. **Always run diagnostics before building**
2. **Use native Firebase SDKs, not web SDK**
3. **Keep dependencies pinned to specific versions**
4. **Test locally before building**
5. **Use development builds for Firebase testing**
6. **Keep build profiles separate for different environments**

## **Quick Reference**

```bash
# Full build process
npm run diagnose && npm run clean && npm run build:dev

# Test locally
npm start

# Production build
npm run build:production

# Submit to Play Store
npm run submit:android
```
