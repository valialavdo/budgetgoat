#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 BudgetGOAT Build Diagnostics');
console.log('================================\n');

// Check package.json
console.log('📦 Package.json Analysis:');
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  
  // Check critical dependencies
  const criticalDeps = {
    'expo': packageJson.dependencies?.expo,
    'react': packageJson.dependencies?.react,
    'react-native': packageJson.dependencies?.['react-native'],
    'react-dom': packageJson.dependencies?.['react-dom'],
    'firebase': packageJson.dependencies?.firebase
  };
  
  Object.entries(criticalDeps).forEach(([dep, version]) => {
    if (version) {
      console.log(`  ✅ ${dep}: ${version}`);
    } else {
      console.log(`  ❌ ${dep}: MISSING`);
    }
  });
  
  // Check for problematic dependencies
  const problematicDeps = [
    '@react-native-firebase/app',
    '@react-native-firebase/auth',
    '@react-native-firebase/firestore'
  ];
  
  console.log('\n🚨 Checking for problematic dependencies:');
  problematicDeps.forEach(dep => {
    if (packageJson.dependencies?.[dep]) {
      console.log(`  ❌ ${dep}: ${packageJson.dependencies[dep]} (CONFLICTS WITH WEB SDK)`);
    } else {
      console.log(`  ✅ ${dep}: Not found (GOOD)`);
    }
  });
  
} catch (error) {
  console.log('  ❌ Error reading package.json:', error.message);
}

// Check app.json
console.log('\n📱 App.json Analysis:');
try {
  const appJson = JSON.parse(fs.readFileSync('app.json', 'utf8'));
  
  // Check for duplicate iOS sections (at root level only)
  const appJsonString = fs.readFileSync('app.json', 'utf8');
  const lines = appJsonString.split('\n');
  let rootLevelIosCount = 0;
  let inRootLevel = true;
  let braceDepth = 0;
  
  lines.forEach(line => {
    const trimmed = line.trim();
    if (trimmed.includes('"expo":')) {
      braceDepth++;
      inRootLevel = braceDepth === 1;
    } else if (trimmed.includes('{')) {
      braceDepth++;
      if (braceDepth > 2) inRootLevel = false;
    } else if (trimmed.includes('}')) {
      braceDepth--;
      if (braceDepth <= 1) inRootLevel = true;
    } else if (trimmed.includes('"ios":') && inRootLevel) {
      rootLevelIosCount++;
    }
  });
  
  if (rootLevelIosCount > 1) {
    console.log(`  ❌ Found ${rootLevelIosCount} root-level iOS sections (DUPLICATE)`);
  } else {
    console.log('  ✅ Single root-level iOS section found');
  }
  
  // Check Google Services file references
  if (appJsonString.includes('google-services.json')) {
    console.log('  ❌ Found google-services.json reference (CONFLICTS WITH WEB SDK)');
  } else {
    console.log('  ✅ No google-services.json references');
  }
  
  // Check SDK version
  console.log(`  📋 SDK Version: ${appJson.expo?.sdkVersion || 'NOT SET'}`);
  console.log(`  📋 Package Name: ${appJson.expo?.android?.package || 'NOT SET'}`);
  
} catch (error) {
  console.log('  ❌ Error reading app.json:', error.message);
}

// Check Firebase config
console.log('\n🔥 Firebase Configuration:');
try {
  const firebaseConfig = fs.readFileSync('src/config/firebase.ts', 'utf8');
  
  if (firebaseConfig.includes('firebase/app')) {
    console.log('  ✅ Using Firebase Web SDK');
  } else {
    console.log('  ❌ Not using Firebase Web SDK');
  }
  
  if (firebaseConfig.includes('@react-native-firebase')) {
    console.log('  ❌ Found native Firebase imports (CONFLICT)');
  } else {
    console.log('  ✅ No native Firebase imports');
  }
  
} catch (error) {
  console.log('  ❌ Error reading Firebase config:', error.message);
}

// Check for Google Services files
console.log('\n📄 Google Services Files:');
const googleServicesFiles = [
  'google-services.json',
  'GoogleService-Info.plist'
];

googleServicesFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`  📄 ${file}: EXISTS`);
  } else {
    console.log(`  📄 ${file}: NOT FOUND`);
  }
});

console.log('\n🎯 Recommendations:');
console.log('  1. Ensure all dependencies are compatible with Expo SDK 51');
console.log('  2. Use Firebase Web SDK instead of native SDKs');
console.log('  3. Remove google-services.json references for web SDK');
console.log('  4. Check for duplicate configurations in app.json');
console.log('  5. Verify React Native version compatibility');

console.log('\n✨ Run this script before every build to catch issues early!');
