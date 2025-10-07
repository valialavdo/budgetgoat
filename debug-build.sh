#!/bin/bash

echo "🔍 BudgetGOAT Debug Build Script"
echo "================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

echo "📱 Building debug APK with enhanced error handling..."

# Clean previous builds
echo "🧹 Cleaning previous builds..."
npx expo run:android --clear

# Build the APK
echo "🔨 Building APK..."
npx expo run:android --variant debug

echo "✅ Build complete!"
echo ""
echo "🔍 Debug Information:"
echo "- Error boundaries added to catch and display errors"
echo "- AsyncStorage error handling improved"
echo "- Debug info component added (visible in development)"
echo "- Enhanced loading states for context providers"
echo ""
echo "📱 To test:"
echo "1. Install the APK on your device"
echo "2. If you see a white screen, check the debug info overlay"
echo "3. Look for error messages in the console/logs"
echo "4. The app should now show proper error messages instead of white screen"
