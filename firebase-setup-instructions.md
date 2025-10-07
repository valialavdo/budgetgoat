# Firebase Setup Instructions for BudgetGOAT

## 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter project name: `budget-goat-app`
4. Enable Google Analytics (optional)
5. Click "Create project"

## 2. Enable Authentication

1. In Firebase Console, go to "Authentication" > "Get started"
2. Go to "Sign-in method" tab
3. Enable "Email/Password" provider
4. Click "Save"

## 3. Create Firestore Database

1. In Firebase Console, go to "Firestore Database" > "Create database"
2. Choose "Start in test mode" (for development)
3. Select a location (choose closest to your users)
4. Click "Done"

## 4. Configure Security Rules (Development)

In Firestore Database > Rules, use these rules for development:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Transactions - users can only access their own
    match /transactions/{transactionId} {
      allow read, write: if request.auth != null && 
        resource.data.userId == request.auth.uid;
    }
    
    // Pockets - users can only access their own
    match /pockets/{pocketId} {
      allow read, write: if request.auth != null && 
        resource.data.userId == request.auth.uid;
    }
  }
}
```

## 5. Add Firebase to React Native Project

### For Expo Development Build:

1. Install Firebase packages:
```bash
npm install @react-native-firebase/app @react-native-firebase/auth @react-native-firebase/firestore @react-native-firebase/analytics
```

2. Add to `app.json`:
```json
{
  "expo": {
    "plugins": [
      "@react-native-firebase/app"
    ]
  }
}
```

3. Create `google-services.json` (Android) and `GoogleService-Info.plist` (iOS) files:
   - In Firebase Console, go to Project Settings > General
   - Add Android app: Package name `com.budgetgoat.app`
   - Add iOS app: Bundle ID `com.budgetgoat.app`
   - Download the config files and place them in the project root

4. For Expo development builds, you'll need to create a development build:
```bash
npx expo install expo-dev-client
npx expo run:android  # or npx expo run:ios
```

## 6. Environment Configuration

Create a `.env` file (optional for Firebase config):
```
FIREBASE_API_KEY=your_api_key
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id
```

## 7. Test the Integration

1. Run the app: `npx expo start`
2. Try creating an account
3. Try creating a pocket
4. Try creating a transaction
5. Check Firebase Console to see if data is being saved

## 8. Production Security Rules

For production, update Firestore rules to be more restrictive:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Transactions - users can only access their own
    match /transactions/{transactionId} {
      allow read, write, delete: if request.auth != null && 
        (resource.data.userId == request.auth.uid || 
         request.auth.uid == userId);
    }
    
    // Pockets - users can only access their own
    match /pockets/{pocketId} {
      allow read, write, delete: if request.auth != null && 
        (resource.data.userId == request.auth.uid || 
         request.auth.uid == userId);
    }
  }
}
```

## Troubleshooting

### Common Issues:

1. **"Native module not found"** - You need to create a development build, not use Expo Go
2. **"Permission denied"** - Check your Firestore security rules
3. **"Invalid API key"** - Make sure your config files are in the correct location
4. **Authentication not working** - Verify Email/Password is enabled in Firebase Console

### Development vs Production:

- **Development**: Use Expo development build with Firebase
- **Production**: Create standalone builds with proper Firebase configuration
- **Testing**: Use Firebase Emulator Suite for local testing

## Next Steps

1. Set up Firebase Analytics for user insights
2. Configure Firebase Crashlytics for error tracking
3. Set up Firebase Cloud Messaging for notifications
4. Implement offline support with Firestore offline persistence
5. Add data export/import functionality
6. Set up automated backups

## Support

For Firebase-specific issues:
- [Firebase Documentation](https://firebase.google.com/docs)
- [React Native Firebase](https://rnfirebase.io/)
- [Firebase Console](https://console.firebase.google.com/)