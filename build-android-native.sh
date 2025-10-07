#!/bin/bash

echo "🚀 Building Native Android APK (No Expo)"
echo "========================================"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Clean previous builds
echo "🧹 Cleaning previous builds..."
cd android
./gradlew clean
cd ..

# Build the APK using React Native CLI
echo "🔨 Building APK with React Native CLI..."
npx react-native run-android --mode=release

echo "✅ Build complete!"
echo ""
echo "📱 APK Location:"
echo "   Debug: android/app/build/outputs/apk/debug/app-debug.apk"
echo "   Release: android/app/build/outputs/apk/release/app-release.apk"
echo ""
echo "🔍 This build uses pure React Native without Expo dependencies"
