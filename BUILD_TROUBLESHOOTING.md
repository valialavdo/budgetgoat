# 🔧 BudgetGOAT Build Troubleshooting Guide

## **Pre-Build Checklist** ✅

Run this checklist before every EAS build to prevent failures:

### **1. Configuration Validation**
- [ ] Run `node diagnose-build.js` - all checks must pass
- [ ] Verify `app.json` has no duplicate sections
- [ ] Check `package.json` for version compatibility
- [ ] Ensure Firebase Web SDK is used (not native SDKs)
- [ ] Remove `google-services.json` references for web SDK

### **2. Dependency Verification**
```bash
# Check for problematic dependencies
npm ls @react-native-firebase/app  # Should show "empty"
npm ls @react-native-firebase/auth  # Should show "empty"
npm ls @react-native-firebase/firestore  # Should show "empty"

# Verify core versions
npm ls expo  # Should be ~51.0.39
npm ls react-native  # Should be 0.76.3
npm ls react  # Should be 18.3.1
```

### **3. Clean Environment**
```bash
# Clear all caches
npx expo r -c
rm -rf node_modules
npm install --legacy-peer-deps
npx eas build --clear-cache
```

### **4. Firebase Configuration Check**
- [ ] Firebase config uses Web SDK imports (`firebase/app`, `firebase/auth`, etc.)
- [ ] No native Firebase imports (`@react-native-firebase/*`)
- [ ] Analytics disabled for web SDK
- [ ] Real Firebase project credentials in `src/config/firebase.ts`

## **Common Build Failures & Solutions**

### **❌ "Gradle build failed with unknown error"**

**Causes:**
1. Version incompatibilities
2. Firebase native SDK conflicts
3. Duplicate configurations
4. Missing dependencies

**Solutions:**
```bash
# 1. Check versions
node diagnose-build.js

# 2. Clean everything
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps

# 3. Verify Firebase config
grep -r "@react-native-firebase" src/  # Should return nothing

# 4. Try different build profile
npx eas build --platform android --profile preview
```

### **❌ "Failed to resolve plugin"**

**Cause:** Plugin configuration issues in `app.json`

**Solution:**
```bash
# Check app.json syntax
npx expo config --json > /dev/null

# Remove problematic plugins temporarily
# Test build without Firebase plugins
```

### **❌ "ERESOLVE could not resolve"**

**Cause:** Dependency version conflicts

**Solution:**
```bash
npm install --legacy-peer-deps
# OR
npm install --force
```

### **❌ "Unknown error in Install dependencies"**

**Cause:** Package installation issues

**Solution:**
```bash
# Use specific Node version
nvm use 18
npm install --legacy-peer-deps

# Clear npm cache
npm cache clean --force
```

## **Build Profiles Explained**

### **Development Build**
```json
{
  "development": {
    "developmentClient": true,
    "distribution": "internal",
    "android": {
      "buildType": "apk",
      "gradleCommand": ":app:assembleDebug"
    }
  }
}
```
- **Use for:** Testing and development
- **Features:** Development client, debugging enabled
- **Size:** Larger (includes dev tools)

### **Preview Build**
```json
{
  "preview": {
    "distribution": "internal",
    "android": {
      "buildType": "apk",
      "gradleCommand": ":app:assembleRelease"
    }
  }
}
```
- **Use for:** Internal testing, beta distribution
- **Features:** Optimized, production-like
- **Size:** Smaller, faster

### **Production Build**
```json
{
  "production": {
    "android": {
      "buildType": "app-bundle"
    }
  }
}
```
- **Use for:** Google Play Store submission
- **Features:** Fully optimized, signed
- **Format:** AAB (Android App Bundle)

## **Debugging Commands**

### **Get Verbose Build Logs**
```bash
npx eas build --platform android --profile development --log-level debug
```

### **Check Build Status**
```bash
npx eas build:list
npx eas build:view [BUILD_ID]
```

### **Local Build Test**
```bash
# Test locally first (requires Android Studio)
npx expo run:android
```

### **Validate Configuration**
```bash
# Check if config is valid
npx expo config --json > config.json && echo "Config valid" || echo "Config invalid"
```

## **Version Compatibility Matrix**

| Expo SDK | React Native | React | Node.js |
|----------|--------------|-------|---------|
| 51.0.39  | 0.76.3       | 18.3.1| 18.x    |

### **Firebase Compatibility**
- **Expo SDK 51**: Use Firebase Web SDK (`firebase@^12.3.0`)
- **Native Firebase**: Requires bare workflow or EAS build with custom config

## **Emergency Recovery Steps**

If builds keep failing:

1. **Reset to working state:**
```bash
git stash
git checkout main
npm install --legacy-peer-deps
```

2. **Try minimal build:**
```bash
# Remove Firebase temporarily
# Comment out Firebase imports in App.tsx
# Use MockFirebaseProvider
npx eas build --platform android --profile development
```

3. **Alternative approaches:**
```bash
# Use Expo Go for testing
npx expo start

# Try local build
npx expo run:android

# Use different EAS profile
npx eas build --platform android --profile preview
```

## **Prevention Strategies**

1. **Always run diagnostics before building:**
   ```bash
   node diagnose-build.js
   ```

2. **Pin dependency versions:**
   ```json
   {
     "expo": "~51.0.39",
     "react-native": "0.76.3",
     "react": "18.3.1"
   }
   ```

3. **Use `.nvmrc` file:**
   ```
   18.19.0
   ```

4. **Regular dependency updates:**
   ```bash
   npm audit
   npm update
   ```

5. **Test builds regularly:**
   ```bash
   # Weekly preview builds
   npx eas build --platform android --profile preview
   ```

## **Support Resources**

- [Expo EAS Build Docs](https://docs.expo.dev/build/introduction/)
- [Firebase Web SDK Docs](https://firebase.google.com/docs/web/setup)
- [React Native Compatibility](https://reactnative.dev/docs/compatibility)
- [Gradle Troubleshooting](https://gradle.org/help/)

## **Quick Reference Commands**

```bash
# Full diagnostic and build
node diagnose-build.js && npx eas build --platform android --profile development --clear-cache

# Emergency clean build
rm -rf node_modules package-lock.json && npm install --legacy-peer-deps && npx eas build --platform android --profile development --clear-cache

# Test in Expo Go
npx expo start

# Local Android build
npx expo run:android
```

---

**Remember:** Always run the diagnostic script before building to catch issues early! 🎯
