# Technical Specifications - BudgetGOAT

## Architecture Overview

### Technology Stack
- **Framework**: React Native 0.72.x
- **Language**: TypeScript
- **Platform**: iOS & Android
- **State Management**: React Context API
- **Navigation**: React Navigation 6.x
- **UI Components**: Custom components with Phosphor icons
- **Backend**: Firebase (partially implemented)

### App Architecture

```
┌─────────────────────────────────────────┐
│                 App.tsx                 │
│  ┌─────────────────────────────────────┐ │
│  │         RootNavigator               │ │
│  │  ┌─────────────────────────────────┐│ │
│  │  │      Bottom Tab Navigator      ││ │
│  │  │  ┌─────────┐ ┌─────────┐      ││ │
│  │  │  │  Home   │ │Pockets  │      ││ │
│  │  │  │ Screen  │ │ Screen  │      ││ │
│  │  │  └─────────┘ └─────────┘      ││ │
│  │  │  ┌─────────┐ ┌─────────┐      ││ │
│  │  │  │Transactions│ Account │      ││ │
│  │  │  │ Screen  │ │ Screen  │      ││ │
│  │  │  └─────────┘ └─────────┘      ││ │
│  │  └─────────────────────────────────┘│ │
│  └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

## State Management Strategy

### Context Providers Hierarchy
```typescript
<SafeFirebaseContext>
  <SafeOnboardingContext>
    <SafeToastContext>
      <MicroInteractionsProvider>
        <NavigationProvider>
          <ThemeContext>
            <SafeBudgetContext>
              <App />
            </SafeBudgetContext>
          </ThemeContext>
        </NavigationProvider>
      </MicroInteractionsProvider>
    </SafeToastContext>
  </SafeOnboardingContext>
</SafeFirebaseContext>
```

### Context Responsibilities

#### 1. SafeFirebaseContext
- **Purpose**: Authentication and user management
- **State**: `user`, `userProfile`, `loading`
- **Methods**: `signIn()`, `signOut()`, `signUp()`
- **Status**: Mock implementation for development

#### 2. ThemeContext
- **Purpose**: Theme management and styling
- **State**: `theme`, `isDark`
- **Methods**: `toggleTheme()`
- **Features**: Light/dark mode, color palette, typography

#### 3. SafeBudgetContext
- **Purpose**: Financial data management
- **State**: `pockets`, `transactions`, `goals`, `insights`
- **Methods**: CRUD operations for financial data
- **Status**: Mock implementation with real interfaces

#### 4. SafeToastContext
- **Purpose**: User notifications
- **State**: `toasts` array
- **Methods**: `showSuccess()`, `showError()`, `showWarning()`, `showInfo()`

#### 5. NavigationProvider
- **Purpose**: Tab bar visibility control
- **State**: `isTabBarVisible`
- **Methods**: `hideTabBar()`, `showTabBar()`

## Data Models

### Core Interfaces

#### Pocket Interface
```typescript
interface Pocket {
  id: string;
  userId: string;
  name: string;
  description: string;
  amount: number;
  currentBalance: number;
  targetAmount?: number;
  category: string;
  color: string;
  type: 'standard' | 'goal';
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}
```

#### Transaction Interface
```typescript
interface Transaction {
  id: string;
  userId: string;
  amount: number;
  type: 'income' | 'expense';
  description: string;
  category: string;
  tags: string[];
  pocketId?: string;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

#### BudgetGoal Interface
```typescript
interface BudgetGoal {
  id: string;
  userId: string;
  name: string;
  description: string;
  targetAmount: number;
  currentAmount: number;
  deadline: Date;
  category: string;
  priority: 'low' | 'medium' | 'high';
  isCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

#### Insight Interface
```typescript
interface Insight {
  id: string;
  userId: string;
  title: string;
  description: string;
  type: 'budget_alert' | 'savings_milestone' | 'spending_trend';
  data: Record<string, any>;
  priority: 'low' | 'medium' | 'high';
  isRead: boolean;
  createdAt: Date;
}
```

## File Structure

```
src/
├── components/           # Reusable UI components
│   ├── BaseBottomSheet.tsx
│   ├── Card.tsx
│   ├── Header.tsx
│   ├── LabelPill.tsx
│   ├── PocketCard.tsx
│   ├── PocketListItem.tsx
│   ├── PocketSummaryCard.tsx
│   ├── QuickActionButton.tsx
│   ├── SectionTitle.tsx
│   ├── TransactionBottomSheet.tsx
│   └── ...
├── context/             # React Context providers
│   ├── SafeBudgetContext.tsx
│   ├── SafeFirebaseContext.tsx
│   ├── SafeOnboardingContext.tsx
│   ├── SafeToastContext.tsx
│   ├── ThemeContext.tsx
│   └── ...
├── screens/             # Main application screens
│   ├── HomeScreen.tsx
│   ├── PocketsScreen.tsx
│   ├── TransactionsScreen.tsx
│   ├── AccountScreen.tsx
│   └── ...
├── navigation/          # Navigation configuration
│   └── RootNavigator.tsx
├── services/            # External service integrations
│   └── firestoreService.ts
├── data/               # Mock data and constants
│   └── mockData.ts
├── types/              # TypeScript type definitions
│   └── index.ts
├── utils/              # Utility functions
│   └── ...
└── theme.ts            # Theme configuration
```

## Dependencies

### Core Dependencies
```json
{
  "react": "18.2.0",
  "react-native": "0.72.6",
  "typescript": "5.0.4"
}
```

### Navigation
```json
{
  "@react-navigation/native": "^6.1.7",
  "@react-navigation/bottom-tabs": "^6.5.8",
  "@react-navigation/stack": "^6.3.17"
}
```

### UI & Icons
```json
{
  "phosphor-react-native": "^1.4.1",
  "react-native-vector-icons": "^10.0.0"
}
```

### State Management
```json
{
  "@react-native-async-storage/async-storage": "^1.19.3"
}
```

### Firebase (Development)
```json
{
  "@react-native-firebase/app": "^18.3.0",
  "@react-native-firebase/auth": "^18.3.0",
  "@react-native-firebase/firestore": "^18.3.0"
}
```

### Development Tools
```json
{
  "@babel/core": "^7.20.0",
  "@types/react": "^18.0.24",
  "@types/react-native": "^0.72.2",
  "metro-react-native-babel-preset": "0.76.8"
}
```

## Component Architecture

### Component Hierarchy
```
App
├── RootNavigator
│   ├── BottomTabNavigator
│   │   ├── HomeScreen
│   │   │   ├── Header
│   │   │   ├── Overview
│   │   │   ├── PocketCard[]
│   │   │   ├── TransactionHome[]
│   │   │   ├── QuickActionCarousel
│   │   │   └── AIInsightsCarousel
│   │   ├── PocketsScreen
│   │   │   ├── PocketSummaryCards
│   │   │   └── PocketListItem[]
│   │   ├── TransactionsScreen
│   │   │   └── TransactionHome[]
│   │   └── AccountScreen
│   └── StackNavigator
│       └── [Secondary Screens]
├── BottomSheet Components
│   ├── NewPocketBottomSheet
│   ├── NewTransactionBottomSheet
│   ├── PocketBottomSheet
│   └── TransactionBottomSheet
└── Context Providers
    ├── ThemeContext
    ├── SafeBudgetContext
    ├── SafeFirebaseContext
    └── SafeToastContext
```

### Component Patterns

#### 1. Screen Components
- **Purpose**: Main application screens
- **Pattern**: Functional component with hooks
- **State**: Local state + context consumption
- **Props**: Navigation props from React Navigation

#### 2. Reusable Components
- **Purpose**: Shared UI elements
- **Pattern**: Functional component with TypeScript interfaces
- **Props**: Well-defined prop interfaces
- **Styling**: Theme-aware styling functions

#### 3. Context Components
- **Purpose**: State management and data flow
- **Pattern**: Provider/Consumer pattern
- **State**: Global application state
- **Methods**: Actions and state updates

## Data Flow

### 1. User Interaction Flow
```
User Action → Component Event Handler → Context Method → State Update → UI Re-render
```

### 2. Data Fetching Flow
```
Component Mount → Context Effect → Mock Data Service → State Update → UI Render
```

### 3. Navigation Flow
```
User Tap → Navigation Action → Screen Change → Component Mount → Data Load
```

## Performance Considerations

### 1. Rendering Optimization
- **React.memo**: Used for expensive components
- **useMemo**: For expensive calculations
- **useCallback**: For event handlers passed to children

### 2. Memory Management
- **Context Splitting**: Separate contexts for different concerns
- **Lazy Loading**: Components loaded on demand
- **Cleanup**: Proper cleanup in useEffect

### 3. Bundle Size
- **Tree Shaking**: Unused code elimination
- **Code Splitting**: Lazy loading of screens
- **Icon Optimization**: Only import needed icons

## Security Implementation

### 1. Data Validation
- **TypeScript**: Compile-time type checking
- **Runtime Validation**: Input sanitization
- **Error Boundaries**: Graceful error handling

### 2. Authentication (Mock)
- **Demo Mode**: Bypass for development
- **User Context**: Centralized user state
- **Session Management**: Basic session handling

### 3. Data Protection
- **Input Sanitization**: Prevent XSS attacks
- **Error Handling**: Secure error messages
- **State Isolation**: Context-based state management

## Testing Strategy

### 1. Unit Testing (Not Implemented)
- **Component Testing**: Individual component tests
- **Hook Testing**: Custom hook testing
- **Utility Testing**: Helper function tests

### 2. Integration Testing (Not Implemented)
- **Context Testing**: Provider/Consumer testing
- **Navigation Testing**: Screen transition testing
- **API Testing**: Mock service testing

### 3. E2E Testing (Not Implemented)
- **User Flow Testing**: Complete user journeys
- **Cross-Platform Testing**: iOS/Android compatibility
- **Performance Testing**: Load and stress testing

## Build Configuration

### 1. Metro Configuration
```javascript
module.exports = {
  resolver: {
    alias: {
      '@': './src',
    },
  },
  transformer: {
    babelTransformerPath: require.resolve('metro-react-native-babel-preset'),
  },
};
```

### 2. TypeScript Configuration
```json
{
  "compilerOptions": {
    "target": "esnext",
    "lib": ["es2017"],
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx"
  }
}
```

### 3. Babel Configuration
```javascript
module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    ['module-resolver', {
      root: ['./src'],
      alias: {
        '@': './src',
      },
    }],
  ],
};
```

## Deployment Considerations

### 1. iOS Deployment
- **Xcode Configuration**: Proper bundle identifier
- **App Store**: Metadata and screenshots
- **Code Signing**: Distribution certificates

### 2. Android Deployment
- **Gradle Configuration**: Build variants
- **Play Store**: Store listing and assets
- **Signing**: APK/AAB signing

### 3. Environment Configuration
- **Development**: Mock data and debug features
- **Staging**: Real data with test environment
- **Production**: Live data with optimizations

## Future Architecture Improvements

### 1. State Management
- **Redux Toolkit**: More robust state management
- **RTK Query**: Data fetching and caching
- **Zustand**: Lightweight alternative to Redux

### 2. Data Layer
- **React Query**: Server state management
- **Offline Support**: Local data persistence
- **Real-time Updates**: WebSocket integration

### 3. Performance
- **React Native Reanimated**: Smooth animations
- **Flipper Integration**: Debugging tools
- **Hermes Engine**: JavaScript engine optimization
