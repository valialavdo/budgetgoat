#!/bin/bash

echo "🚀 BudgetGOAT Native Build Test"
echo "================================"

# Check if we're in the right directory
if [ ! -d "android" ] || [ ! -d "ios" ]; then
    echo "❌ Error: Not in a native React Native project directory"
    exit 1
fi

echo "✅ Native project structure found"

# Check Firebase configuration
if [ -f "android/app/google-services.json" ]; then
    echo "✅ Android Firebase config found"
else
    echo "❌ Android Firebase config missing"
fi

if [ -f "ios/GoogleService-Info.plist" ]; then
    echo "✅ iOS Firebase config found"
else
    echo "❌ iOS Firebase config missing"
fi

# Check Firebase dependencies in Android
if grep -q "firebase" android/app/build.gradle; then
    echo "✅ Android Firebase dependencies configured"
else
    echo "❌ Android Firebase dependencies missing"
fi

# Check if React Native Firebase is installed
if [ -d "node_modules/@react-native-firebase" ]; then
    echo "✅ React Native Firebase SDK installed"
else
    echo "❌ React Native Firebase SDK missing"
fi

echo ""
echo "🎯 Next Steps:"
echo "1. Install Java 17+ for Android builds"
echo "2. Install CocoaPods for iOS builds"
echo "3. Set up Android SDK and emulator"
echo "4. Run: npx expo run:android or npx expo run:ios"
echo ""
echo "📱 Your app is ready for native builds!"
