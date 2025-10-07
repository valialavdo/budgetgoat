# BudgetGOAT - Clean Project Structure

```
budget-planner/
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── ui/              # Basic UI elements
│   │   ├── forms/           # Form components
│   │   └── sheets/          # Bottom sheets
│   ├── screens/             # Screen components
│   ├── navigation/          # Navigation configuration
│   ├── context/             # React Context providers
│   ├── hooks/               # Custom React hooks
│   ├── services/            # Business logic & API calls
│   ├── utils/               # Utility functions
│   ├── types/               # TypeScript type definitions
│   └── constants/           # App constants
├── android/                 # Native Android configuration
│   ├── app/
│   │   ├── build.gradle     # App-level Gradle config
│   │   └── google-services.json
│   └── build.gradle         # Project-level Gradle config
├── ios/                     # Native iOS configuration
├── assets/                  # Images, fonts, etc.
├── app.json                 # Expo configuration
├── package.json             # Dependencies
├── eas.json                 # EAS build configuration
└── metro.config.js          # Metro bundler config
```
