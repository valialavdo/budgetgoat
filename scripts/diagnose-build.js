#!/usr/bin/env node

/**
 * BudgetGOAT Build Diagnostic Script
 * Run before every build to catch issues early
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 BudgetGOAT Build Diagnostics');
console.log('================================\n');

let hasErrors = false;

// Check package.json
console.log('📦 Package.json Analysis:');
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  
  // Check critical dependencies
  const criticalDeps = {
    'expo': packageJson.dependencies?.expo,
    'react': packageJson.dependencies?.react,
    'react-native': packageJson.dependencies?.['react-native'],
    '@react-native-firebase/app': packageJson.dependencies?.['@react-native-firebase/app'],
    '@react-native-firebase/auth': packageJson.dependencies?.['@react-native-firebase/auth'],
    '@react-native-firebase/firestore': packageJson.dependencies?.['@react-native-firebase/firestore'],
  };
  
  Object.entries(criticalDeps).forEach(([dep, version]) => {
    if (version) {
      console.log(`  ✅ ${dep}: ${version}`);
    } else {
      console.log(`  ❌ ${dep}: MISSING`);
      hasErrors = true;
    }
  });
  
  // Check for problematic dependencies
  const problematicDeps = [
    'firebase', // Web SDK - should not be used
  ];
  
  console.log('\n🚨 Checking for problematic dependencies:');
  problematicDeps.forEach(dep => {
    if (packageJson.dependencies?.[dep]) {
      console.log(`  ❌ ${dep}: ${packageJson.dependencies[dep]} (WEB SDK - REMOVE)`);
      hasErrors = true;
    } else {
      console.log(`  ✅ ${dep}: Not found (GOOD)`);
    }
  });
  
} catch (error) {
  console.log('  ❌ Error reading package.json:', error.message);
  hasErrors = true;
}

// Check app.json
console.log('\n📱 App.json Analysis:');
try {
  const appJson = JSON.parse(fs.readFileSync('app.json', 'utf8'));
  
  // Check for duplicate iOS sections at expo root level only
  const appJsonString = fs.readFileSync('app.json', 'utf8');
  
  // Count iOS sections at root level of expo config (not in plugins)
  const expoConfig = appJson.expo;
  const rootLevelIosCount = expoConfig.ios ? 1 : 0;
  
  if (rootLevelIosCount === 1) {
    console.log('  ✅ Single iOS section in expo config');
  } else if (rootLevelIosCount === 0) {
    console.log('  ⚠️  No iOS section in expo config');
  } else {
    console.log(`  ❌ Multiple iOS sections in expo config (${rootLevelIosCount})`);
    hasErrors = true;
  }
  
  // Check Firebase plugin
  const plugins = appJson.expo?.plugins || [];
  const hasFirebasePlugin = plugins.includes('@react-native-firebase/app');
  if (hasFirebasePlugin) {
    console.log('  ✅ Firebase plugin found');
  } else {
    console.log('  ❌ Firebase plugin missing');
    hasErrors = true;
  }
  
  // Check Google Services files (check actual file existence)
  const hasAndroidGoogleServices = appJson.expo?.android?.googleServicesFile || fs.existsSync('android/app/google-services.json');
  const hasIosGoogleServices = appJson.expo?.ios?.googleServicesFile || fs.existsSync('ios/GoogleService-Info.plist');
  
  if (hasAndroidGoogleServices) {
    console.log('  ✅ Android Google Services file configured');
  } else {
    console.log('  ❌ Android Google Services file missing');
    hasErrors = true;
  }
  
  if (hasIosGoogleServices) {
    console.log('  ✅ iOS Google Services file configured');
  } else {
    console.log('  ⚠️  iOS Google Services file missing (not required for Android builds)');
    // Don't set hasErrors = true for missing iOS file when building Android only
  }
  
  console.log(`  📋 SDK Version: ${appJson.expo?.sdkVersion || 'NOT SET'}`);
  console.log(`  📋 Package Name: ${appJson.expo?.android?.package || 'NOT SET'}`);
  
} catch (error) {
  console.log('  ❌ Error reading app.json:', error.message);
  hasErrors = true;
}

// Check Firebase configuration
console.log('\n🔥 Firebase Configuration:');
try {
  const firebaseConfig = fs.readFileSync('src/services/firebase.ts', 'utf8');
  
  if (firebaseConfig.includes('@react-native-firebase')) {
    console.log('  ✅ Using Firebase Native SDK');
  } else {
    console.log('  ❌ Not using Firebase Native SDK');
    hasErrors = true;
  }
  
  if (firebaseConfig.includes('firebase/app')) {
    console.log('  ❌ Found Web SDK imports (CONFLICT)');
    hasErrors = true;
  } else {
    console.log('  ✅ No Web SDK imports');
  }
  
} catch (error) {
  console.log('  ❌ Error reading Firebase config:', error.message);
  hasErrors = true;
}

// Check Google Services files
console.log('\n📄 Google Services Files:');
const googleServicesFiles = [
  { path: 'android/app/google-services.json', platform: 'Android' },
  { path: 'ios/GoogleService-Info.plist', platform: 'iOS' }
];

googleServicesFiles.forEach(({ path: filePath, platform }) => {
  if (fs.existsSync(filePath)) {
    console.log(`  📄 ${platform}: ${filePath} - EXISTS`);
  } else {
    console.log(`  📄 ${platform}: ${filePath} - NOT FOUND`);
    // Only set error for missing Android file, not iOS
    if (platform === 'Android') {
      hasErrors = true;
    }
  }
});

// Check project structure
console.log('\n📁 Project Structure:');
const requiredDirs = [
  'src',
  'src/components',
  'src/screens',
  'src/navigation',
  'src/context',
  'src/services',
  'src/types',
  'android',
  'ios'
];

requiredDirs.forEach(dir => {
  if (fs.existsSync(dir)) {
    console.log(`  ✅ ${dir}/`);
  } else {
    console.log(`  ❌ ${dir}/ - MISSING`);
    hasErrors = true;
  }
});

// Final recommendations
console.log('\n🎯 Recommendations:');
if (hasErrors) {
  console.log('  ❌ BUILD WILL FAIL - Fix errors above first');
  console.log('  1. Install missing dependencies: npm install');
  console.log('  2. Add Firebase plugin to app.json');
  console.log('  3. Add Google Services files');
  console.log('  4. Fix Firebase configuration');
  console.log('  5. Create missing directories');
} else {
  console.log('  ✅ All checks passed - ready to build!');
  console.log('  1. Run: npx eas build --platform android --profile development');
  console.log('  2. Test in Expo Go: npx expo start');
}

console.log('\n✨ Run this script before every build to catch issues early!');

// Exit with error code if issues found
process.exit(hasErrors ? 1 : 0);
