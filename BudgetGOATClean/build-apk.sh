#!/bin/bash

echo "🚀 Building BudgetGOAT APK"
echo "=========================="

# Set Java environment
export JAVA_HOME="/Applications/Android Studio.app/Contents/jbr/Contents/Home"
export PATH="$JAVA_HOME/bin:$PATH"

# Clean and build
echo "🧹 Cleaning previous build..."
cd android
./gradlew clean

echo "🔨 Building new APK..."
./gradlew assembleDebug

echo "✅ Build complete!"
echo ""
echo "📱 APK Location:"
echo "   $(pwd)/app/build/outputs/apk/debug/app-debug.apk"
echo ""
echo "📲 To install:"
echo "   1. Transfer the APK to your Android device"
echo "   2. Enable 'Install from unknown sources'"
echo "   3. Install the APK"
