# BudgetGOAT Build and Integration Rules

## Pre-Build Verification Checklist

Before generating any build or integration code, **ALWAYS** verify the following:

### 1. Native Module Compatibility Check
- ✅ Verify if the app uses any native modules incompatible with Expo Go
- ❌ **Examples of incompatible modules:**
  - Firebase native SDK (`@react-native-firebase/*`)
  - Custom native modules
  - Third-party libraries requiring native compilation
- ✅ **Expo Go compatible alternatives:**
  - Firebase Web SDK (`firebase/app`)
  - Pure JavaScript libraries
  - Expo-managed modules

### 2. Build Strategy Decision Tree
```
IF (native modules exist) THEN:
  → Use EAS Build or Bare Workflow
  → Generate development client
  → Provide device installation instructions
ELSE:
  → Use Expo Go for development
  → Standard Expo workflow
```

### 3. EAS Build Requirements
When using EAS Build:
- ✅ Confirm build commands specify correct target (dev, production)
- ✅ Validate platform flags (--platform ios/android)
- ✅ Update app.json/app.config.js for native dependencies
- ✅ Add environment variables for different build types
- ✅ Verify dependency versions are compatible

### 4. Configuration Management
- ✅ Maintain separate configs for different environments
- ✅ Use environment variables for API keys and secrets
- ✅ Document configuration differences between dev/prod

### 5. Testing Strategy
- ✅ **Expo Go**: UI/UX testing, basic functionality
- ✅ **Development Client**: Native module testing
- ✅ **Physical Devices**: Real-world performance testing
- ✅ **Simulators**: iOS/Android platform testing

### 6. Troubleshooting Guidelines
Common issues and solutions:
- **SDK Version Mismatch**: Update project or Expo Go version
- **TurboModule Errors**: Disable new architecture or use compatible SDK
- **Native Module Errors**: Switch to EAS Build workflow
- **Build Failures**: Check dependency compatibility and platform requirements

### 7. Dependency Management
- ✅ Always use `--legacy-peer-deps` for complex dependency trees
- ✅ Pin versions for critical dependencies
- ✅ Regular dependency audits and updates
- ✅ Document any version-specific workarounds

## Current Project Status

**BudgetGOAT Configuration:**
- ✅ **Current Setup**: Mock Firebase (Expo Go compatible)
- ✅ **Native Modules**: None (all Expo-managed)
- ✅ **Build Target**: Expo Go development
- ✅ **SDK Version**: 54.0.0 (with TurboModule fixes)

**Next Steps for Production:**
1. Firebase Web SDK integration (Expo Go compatible)
2. EAS Build for production APK/IPA
3. Physical device testing
4. Google Play Store preparation
