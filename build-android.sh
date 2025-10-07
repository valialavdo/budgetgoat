#!/bin/bash

echo "🚀 Starting Android Build Process..."
echo "=================================="

# Run diagnostics first
echo "📋 Running pre-build diagnostics..."
node scripts/diagnose-build.js

if [ $? -ne 0 ]; then
    echo "❌ Diagnostics failed. Please fix issues before building."
    exit 1
fi

echo "✅ Diagnostics passed. Proceeding with build..."

# Build with EAS
echo "🔨 Building Android APK with EAS..."
echo "This will generate a keystore for signing if needed."
echo ""

# Try preview build first (simpler)
echo "Attempting preview build..."
npx eas build --platform android --profile preview --clear-cache

if [ $? -eq 0 ]; then
    echo "🎉 Build successful! Check the EAS dashboard for download link."
else
    echo "⚠️  Preview build failed. Trying development build..."
    npx eas build --platform android --profile development --clear-cache
    
    if [ $? -eq 0 ]; then
        echo "🎉 Development build successful! Check the EAS dashboard for download link."
    else
        echo "❌ Both builds failed. Check the logs above for details."
        exit 1
    fi
fi

echo ""
echo "📱 Build complete! Download the APK from:"
echo "https://expo.dev/accounts/valialavd/projects/budgetgoat/builds"
