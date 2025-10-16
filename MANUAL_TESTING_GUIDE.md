# BudgetGOAT Manual Testing Guide

## Quick Testing Workflow

### Step 1: Start Metro Bundler
```bash
npx react-native start --reset-cache
```
**Expected**: Metro bundler starts without errors, shows "Metro waiting on exp://192.168.x.x:8081"

### Step 2: Test iOS Simulator
```bash
npx react-native run-ios
```
**Expected**: 
- Xcode builds the project successfully
- iOS Simulator opens
- App shows "BudgetGOAT" with "Phase 1 Complete - Expo Ejected!" message
- Blue "Test Button" works and shows alert

### Step 3: Test Android Emulator
```bash
npx react-native run-android
```
**Expected**:
- Android emulator opens (if not already running)
- App installs and launches
- Same UI as iOS version

## What to Look For

### ✅ Success Indicators
- No white screen crashes
- App loads within 5-10 seconds
- Button interactions work
- No red error screens
- Console shows minimal warnings

### ❌ Failure Indicators
- White screen that never loads
- Red error screen with stack trace
- App crashes immediately
- Metro bundler errors
- Build failures

## Common Issues & Solutions

### Metro Config Error
**Error**: `Cannot find module 'expo/metro-config'`
**Solution**: Already fixed in metro.config.js

### iOS Build Issues
**Error**: Pods configuration missing
**Solution**: 
```bash
cd ios && pod install && cd ..
```

### Android Build Issues
**Error**: Java runtime not found
**Solution**: Install Java JDK 17 or 21

## Testing Each Phase

### Phase 1: Expo Ejection ✅
- [x] Removed all Expo dependencies
- [x] Updated package.json
- [x] Fixed metro.config.js
- [x] Created minimal App.tsx

### Phase 2: Minimal App Foundation (Current)
- [ ] Test basic app launch
- [ ] Verify no crashes
- [ ] Test button interactions
- [ ] Check both iOS and Android

### Phase 3: Context Providers (Next)
- [ ] Add safe AsyncStorage hook
- [ ] Test context loading
- [ ] Verify error handling

## Debug Commands

### Check Metro Status
```bash
curl http://localhost:8081/status
```

### Clear All Caches
```bash
npx react-native start --reset-cache
rm -rf node_modules && npm install
cd ios && pod install && cd ..
```

### View Logs
```bash
# iOS
npx react-native log-ios

# Android
npx react-native log-android
```

## Visual Verification Checklist

When the app loads successfully, you should see:
1. **Title**: "BudgetGOAT" in large, bold text
2. **Subtitle**: "Phase 1 Complete - Expo Ejected!" in blue
3. **Description**: "App is now running on pure React Native CLI"
4. **Button**: Blue "Test Button" that shows alert when pressed
5. **Background**: Clean white background
6. **No errors**: No red screens or error messages
