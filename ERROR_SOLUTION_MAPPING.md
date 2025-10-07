# 🚨 Error-Solution Mapping

## **Gradle Build Errors**

### **❌ "Gradle build failed with unknown error"**
**Root Cause:** Version incompatibilities, Firebase Web SDK conflicts, duplicate configurations
**Solution:**
```bash
# Use native Firebase SDKs only
npm install @react-native-firebase/app @react-native-firebase/auth @react-native-firebase/firestore
npm uninstall firebase  # Remove web SDK

# Fix app.json duplicates
# Remove duplicate iOS sections
# Add Firebase plugin: "@react-native-firebase/app"

# Use compatible versions
# React Native 0.74.5 with Expo SDK 51
# React 18.2.0
```

### **❌ "Failed to resolve plugin"**
**Root Cause:** Missing or incorrect plugin configuration
**Solution:**
```json
// app.json
"plugins": [
  "@react-native-firebase/app",
  ["expo-build-properties", { ... }]
]
```

### **❌ "ERESOLVE could not resolve"**
**Root Cause:** Peer dependency conflicts
**Solution:**
```bash
npm install --legacy-peer-deps
# OR
npm install --force
```

## **Metro Bundler Errors**

### **❌ "Unable to resolve 'idb' from '@firebase/app'"
**Root Cause:** Firebase Web SDK in React Native project
**Solution:**
```bash
# Remove web SDK
npm uninstall firebase

# Use native SDKs
npm install @react-native-firebase/app @react-native-firebase/auth @react-native-firebase/firestore
```

### **❌ "Module not found"**
**Root Cause:** Missing dependencies or incorrect imports
**Solution:**
```bash
# Check imports
import auth from '@react-native-firebase/auth';  // ✅ Correct
import { auth } from 'firebase/app';             // ❌ Wrong

# Install missing deps
npm install [missing-package]
```

## **Configuration Errors**

### **❌ "Duplicate iOS section in app.json"**
**Root Cause:** Multiple iOS configuration blocks
**Solution:**
```json
// app.json - Single iOS section only
{
  "expo": {
    "ios": {
      "bundleIdentifier": "com.budgetgoat.app",
      "buildNumber": "1",
      "googleServicesFile": "./ios/GoogleService-Info.plist"
    }
  }
}
```

### **❌ "Google Services file not found"**
**Root Cause:** Missing or incorrectly placed Firebase config files
**Solution:**
```bash
# Download from Firebase Console
# Place in correct locations:
android/app/google-services.json
ios/GoogleService-Info.plist

# Update app.json
"android": {
  "googleServicesFile": "./android/app/google-services.json"
},
"ios": {
  "googleServicesFile": "./ios/GoogleService-Info.plist"
}
```

## **Dependency Errors**

### **❌ "React Native version mismatch"**
**Root Cause:** Incompatible React Native version for Expo SDK
**Solution:**
```json
// package.json - Use compatible versions
{
  "dependencies": {
    "expo": "~51.0.39",
    "react-native": "0.74.5",
    "react": "18.2.0"
  }
}
```

### **❌ "Firebase not initialized"**
**Root Cause:** Missing Firebase configuration or using wrong SDK
**Solution:**
```typescript
// src/services/firebase.ts - Use native SDK
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

// NOT web SDK:
// import { auth } from 'firebase/app';
```

## **Build Environment Errors**

### **❌ "Java Runtime not found"**
**Root Cause:** Missing Java/JDK installation
**Solution:**
```bash
# Install Java 17
brew install openjdk@17

# Set JAVA_HOME
export JAVA_HOME=/opt/homebrew/opt/openjdk@17
```

### **❌ "Android SDK not found"**
**Root Cause:** Missing Android Studio/SDK
**Solution:**
```bash
# Install Android Studio
# Set ANDROID_HOME
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

## **Do's and Don'ts**

### **✅ DO:**
- Use Firebase Native SDKs (`@react-native-firebase/*`)
- Keep dependencies pinned to specific versions
- Run diagnostic script before building
- Use separate build profiles for different environments
- Test locally before building
- Keep configuration files clean and valid

### **❌ DON'T:**
- Mix Firebase Web SDK with React Native
- Use floating dependency versions (`^`, `~`)
- Skip dependency compatibility checks
- Modify build files without understanding
- Use Expo Go for Firebase native features
- Ignore build warnings

## **Prevention Checklist**

Before every build:
- [ ] Run `npm run diagnose`
- [ ] Check Firebase configuration
- [ ] Verify Google Services files
- [ ] Clean dependencies: `npm run clean`
- [ ] Test locally: `npm start`
- [ ] Check EAS build status
- [ ] Review build logs for warnings

## **Emergency Recovery**

If builds keep failing:
1. **Reset to clean state:**
   ```bash
   git stash
   git checkout main
   npm run clean
   ```

2. **Use minimal configuration:**
   - Remove Firebase temporarily
   - Use MockFirebaseProvider
   - Test basic functionality

3. **Alternative approaches:**
   - Use Expo Go for UI testing
   - Try local builds with Android Studio
   - Use different EAS build profiles

## **Quick Fix Commands**

```bash
# Fix dependency conflicts
npm install --legacy-peer-deps

# Clean everything
npm run clean

# Fix Firebase
npm uninstall firebase
npm install @react-native-firebase/app @react-native-firebase/auth @react-native-firebase/firestore

# Fix app.json
# Remove duplicates manually

# Test build
npm run diagnose && npm run build:dev
```
