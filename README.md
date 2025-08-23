# 🐐 BudgetGOAT - The Greatest Of All Time Budgeting Tool

**GOAT Ahead: Turn Everyday Budgets Into Epic Wins**

BudgetGOAT is a complete, production-ready React Native mobile app for iOS and Android that provides hassle-free future planning without bank links or external integrations. Built with Expo for easy setup and cross-platform builds.

## ✨ Features

### 🏠 **Home Dashboard**
- **Current Month Summary**: Widgets showing total income, pocket balances, expenses, and net balance
- **Pockets Summary Widget**: Persistent summary of all pockets with total balance and net change
- **Six-Month Projection Chart**: Unlimited months/years forecasts with "What-If" simulator
- **AI Insights**: Rule-based recommendations for budget adjustments and goal optimizations
- **Quick Actions**: Fast access to common tasks

### 🏦 **Pockets Management**
- **Standard Pockets**: Bank accounts, cash, custom storage with carryover options
- **Goal-Oriented Pockets**: Target amounts, timelines, and fancy progress bars
- **Smart AI Suggestions**: Recommendations for goal timelines and contribution amounts
- **Progress Tracking**: Visual indicators with motivational "GOAT!" messaging
- **Carryover Toggle**: Maintain balances between months

### 💰 **Transactions**
- **Income & Expenses**: Dedicated transaction management with pocket linking
- **Recurring Transactions**: Monthly, quarterly, yearly with custom durations
- **Smart Validation**: Pocket balance warnings and AI-powered insights
- **Tags & Organization**: Categorize transactions for better analysis
- **Month Grouping**: Organized by month with subtotals

### 🤖 **AI-Powered Features**
- **Budget Recommendations**: Based on spending trends and patterns
- **Goal Optimizations**: Smart suggestions for timeline adjustments
- **Predictive Projections**: 6-month+ forecasts with surplus predictions
- **Risk Alerts**: Warnings for large expenses or shortfalls
- **Motivational Insights**: Encouraging tips for financial success

### 🔐 **Security & Privacy**
- **Local Data Storage**: All data stored locally using Expo SQLite
- **No External APIs**: Complete offline functionality
- **Privacy First**: No data collection or tracking
- **Optional PIN Security**: App lock with biometric support

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ (LTS recommended)
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS development)
- Android Studio (for Android development)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/budgetgoat.git
cd budgetgoat
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Start development server**
```bash
# Start Expo development server
npx expo start

# iOS Simulator
npx expo start --ios

# Android Emulator
npx expo start --android

# Web (for testing)
npx expo start --web
```

4. **Install Expo Go app** on your device for live testing

## 🏗️ Build for Production

### iOS App Store Build
```bash
# Build for iOS
npx expo build:ios

# Or use EAS Build (recommended)
npx eas build --platform ios
```

### Android Google Play Build
```bash
# Build for Android
npx expo build:android

# Or use EAS Build (recommended)
npx eas build --platform android
```

### EAS Build (Recommended)
```bash
# Install EAS CLI
npm install -g @expo/eas-cli

# Login to Expo
eas login

# Configure build
eas build:configure

# Build for both platforms
eas build --platform all
```

## 📱 App Store Submission

### iOS App Store
1. **Apple Developer Enrollment** ($99/year)
2. **App Store Connect Setup**
   - Create app record
   - Configure app information
   - Upload screenshots and metadata
3. **Build Submission**
   - Use EAS Build or Expo build:ios
   - Upload via Xcode or Transporter
4. **Review Process** (typically 1-7 days)

### Google Play Store
1. **Google Play Console** ($25 one-time fee)
2. **App Setup**
   - Create app listing
   - Configure store listing
   - Upload APK/AAB files
3. **Build Submission**
   - Use EAS Build or Expo build:android
   - Upload via Play Console
4. **Review Process** (typically 1-3 days)

## 🎨 Design System

### Colors
- **Primary**: GOAT Green (#00D084) - Income, positives, CTAs
- **Secondary**: Trust Blue (#007BFF) - Pockets, navigation
- **Accent**: Alert Red (#FF4D4F) - Expenses, warnings
- **Neutral**: Light Gray (#F6F6F6) - Secondary backgrounds
- **Text**: Dark Gray (#0F172A) - Primary text

### Typography
- **Font Family**: Inter sans-serif
- **H1**: 32pt Bold
- **H2**: 24pt Bold  
- **H3**: 18pt Medium
- **Body**: 16pt Regular
- **Caption**: 14pt Regular
- **Button**: 16pt Medium Uppercase

### Components
- **Cards**: 8px radius, subtle elevation
- **Buttons**: 8px radius, GOAT Green background
- **Inputs**: Light Gray borders, Trust Blue focus
- **Shadows**: Subtle opacity (0.1) for depth

## 🏗️ Architecture

### Tech Stack
- **Framework**: React Native with Expo
- **Language**: TypeScript
- **Navigation**: React Navigation v7
- **State Management**: React Context API
- **Database**: Expo SQLite (local storage)
- **Charts**: react-native-chart-kit
- **Icons**: Phosphor Icons (Regular outlined)
- **Date Handling**: date-fns

### Project Structure
```
src/
├── components/          # Reusable UI components
├── screens/            # App screens
├── navigation/         # Navigation configuration
├── context/            # Global state management
├── utils/              # Utility functions
├── types/              # TypeScript type definitions
└── theme/              # Design system and styling
```

### Key Components
- **Header**: Sticky header with title and actions
- **FloatingActionButton**: FAB for adding new items
- **InfoBottomSheet**: Bottom sheet for information display
- **PocketForm**: Form for creating/editing pockets
- **TransactionForm**: Form for creating/editing transactions

## 🔧 Configuration

### app.json
```json
{
  "expo": {
    "name": "BudgetGOAT",
    "slug": "budgetgoat",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "ios": {
      "bundleIdentifier": "com.budgetgoat.app",
      "buildNumber": "1"
    },
    "android": {
      "package": "com.budgetgoat.app",
      "versionCode": 1
    }
  }
}
```

### Environment Variables
Create a `.env` file for environment-specific configuration:
```bash
EXPO_PUBLIC_APP_NAME=BudgetGOAT
EXPO_PUBLIC_APP_VERSION=1.0.0
```

## 📊 Data Models

### Pocket (Category)
```typescript
interface Category {
  id: string;
  name: string;
  type: 'bank' | 'cash' | 'custom';
  defaultAmount: number;
  isInflux: boolean;
  color: string;
  notes?: string;
  recurrence: RecurrenceInfo;
}
```

### Transaction
```typescript
interface Transaction {
  id: string;
  month: string;
  pocketCategoryId: string;
  type: 'income' | 'expense';
  amount: number;
  note: string;
  recurrence: RecurrenceInfo;
}
```

## 🧪 Testing

### Unit Tests
```bash
npm test
```

### E2E Tests
```bash
npm run test:e2e
```

### Manual Testing Checklist
- [ ] Pocket creation and editing
- [ ] Transaction management
- [ ] Goal tracking and progress bars
- [ ] AI recommendations
- [ ] Data persistence
- [ ] Navigation between tabs
- [ ] Form validation
- [ ] Error handling

## 🚀 Deployment

### Development
```bash
npx expo start
```

### Staging
```bash
npx eas build --profile staging
```

### Production
```bash
npx eas build --profile production
npx eas submit --platform ios
npx eas submit --platform android
```

## 📈 Performance

### Optimization Tips
- Use React.memo for expensive components
- Implement lazy loading for large lists
- Optimize images and assets
- Use FlatList for long lists
- Implement proper error boundaries

### Bundle Size
- **iOS**: ~15-20MB
- **Android**: ~12-18MB
- **Web**: ~2-3MB

## 🔒 Security

### Data Protection
- All data stored locally on device
- No external API calls
- Optional PIN/biometric authentication
- Secure storage for sensitive data

### Privacy Compliance
- GDPR compliant
- No data collection
- No tracking or analytics
- User controls all data

## 🌟 Brand Story

**"In a world where budgeting apps overwhelm with complexity, BudgetGOAT keeps it simple—plan income, pockets, and expenses with clarity and speed. We believe everyone deserves to feel like a GOAT (Greatest Of All Time) when it comes to their finances."**

### Taglines
- "GOAT Ahead: Turn Everyday Budgets Into Epic Wins"
- "Budget Like a GOAT"
- "Financial Planning Made Simple"

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

### Code Style
- Use TypeScript for all new code
- Follow existing naming conventions
- Add proper JSDoc comments
- Ensure accessibility compliance

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Documentation
- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [React Navigation Documentation](https://reactnavigation.org/)

### Community
- [Expo Discord](https://discord.gg/expo)
- [React Native Community](https://github.com/react-native-community)

### Issues
- Report bugs via GitHub Issues
- Request features via GitHub Discussions
- Security issues: security@budgetgoat.com

## 🎯 Roadmap

### v1.1 (Q1 2026)
- [ ] Multiple currency support
- [ ] Budget sharing with family
- [ ] Advanced goal tracking
- [ ] Export to PDF

### v1.2 (Q2 2026)
- [ ] Dark mode support
- [ ] Widget support
- [ ] Apple Watch app
- [ ] Advanced analytics

### v2.0 (Q3 2026)
- [ ] Cloud sync (optional)
- [ ] Multi-device support
- [ ] Advanced AI features
- [ ] Investment tracking

---

**Built with ❤️ by the BudgetGOAT Team**

*"GOAT Your Goals"* 🐐✨
