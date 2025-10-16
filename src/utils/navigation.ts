/**
 * Navigation Utilities
 * Provides standardized navigation patterns and helpers
 */

import { NavigationProp } from '@react-navigation/native';
import { trackNavigation } from '../services/analytics';

export interface NavigationParams {
  [key: string]: any;
}

export interface NavigationOptions {
  trackAnalytics?: boolean;
  replace?: boolean;
  reset?: boolean;
}

/**
 * Standardized navigation helper
 */
export class NavigationHelper {
  private navigation: NavigationProp<any>;
  private currentScreen: string;

  constructor(navigation: NavigationProp<any>, currentScreen: string) {
    this.navigation = navigation;
    this.currentScreen = currentScreen;
  }

  /**
   * Navigate to a screen with standardized patterns
   */
  navigate(
    screenName: string, 
    params?: NavigationParams, 
    options?: NavigationOptions
  ) {
    const { trackAnalytics = true, replace = false, reset = false } = options || {};

    // Track analytics if enabled
    if (trackAnalytics) {
      trackNavigation(this.currentScreen, screenName, 'tap');
    }

    // Perform navigation based on options
    if (reset) {
      this.navigation.reset({
        index: 0,
        routes: [{ name: screenName, params }],
      });
    } else if (replace) {
      (this.navigation as any).replace(screenName, params);
    } else {
      this.navigation.navigate(screenName, params);
    }
  }

  /**
   * Navigate back with analytics tracking
   */
  goBack(options?: { trackAnalytics?: boolean }) {
    const { trackAnalytics = true } = options || {};

    if (trackAnalytics) {
      trackNavigation(this.currentScreen, 'previous_screen', 'back');
    }

    this.navigation.goBack();
  }

  /**
   * Navigate to home screen
   */
  goHome(options?: NavigationOptions) {
    this.navigate('Home', undefined, options);
  }

  /**
   * Navigate to account screen
   */
  goToAccount(options?: NavigationOptions) {
    this.navigate('Account', undefined, options);
  }

  /**
   * Navigate to transactions screen
   */
  goToTransactions(options?: NavigationOptions) {
    this.navigate('TransactionsList', undefined, options);
  }

  /**
   * Navigate to pockets screen
   */
  goToPockets(options?: NavigationOptions) {
    this.navigate('Pockets', undefined, options);
  }

  /**
   * Navigate to AI insights screen
   */
  goToAIInsights(options?: NavigationOptions) {
    this.navigate('AIInsights', undefined, options);
  }

  /**
   * Navigate to export data screen
   */
  goToExportData(options?: NavigationOptions) {
    this.navigate('ExportData', undefined, options);
  }

  /**
   * Navigate to appearance settings
   */
  goToAppearance(options?: NavigationOptions) {
    this.navigate('Appearance', undefined, options);
  }

  /**
   * Navigate to currency settings
   */
  goToCurrency(options?: NavigationOptions) {
    this.navigate('Currency', undefined, options);
  }

  /**
   * Navigate to help and support
   */
  goToHelpSupport(options?: NavigationOptions) {
    this.navigate('HelpSupport', undefined, options);
  }

  /**
   * Navigate to privacy policy
   */
  goToPrivacyPolicy(options?: NavigationOptions) {
    this.navigate('PrivacyPolicy', undefined, options);
  }

  /**
   * Navigate to about app
   */
  goToAboutApp(options?: NavigationOptions) {
    this.navigate('AboutApp', undefined, options);
  }

  /**
   * Navigate to rate us
   */
  goToRateUs(options?: NavigationOptions) {
    this.navigate('RateUs', undefined, options);
  }

  /**
   * Navigate to edit profile
   */
  goToEditProfile(options?: NavigationOptions) {
    this.navigate('EditProfile', undefined, options);
  }

  /**
   * Navigate to projection details
   */
  goToProjectionDetails(params?: NavigationParams, options?: NavigationOptions) {
    this.navigate('ProjectionDetails', params, options);
  }

  /**
   * Navigate to send to email
   */
  goToSendToEmail(params?: NavigationParams, options?: NavigationOptions) {
    this.navigate('SendToEmail', params, options);
  }
}

/**
 * Hook to get navigation helper
 */
export function useNavigationHelper(
  navigation: NavigationProp<any>, 
  currentScreen: string
): NavigationHelper {
  return new NavigationHelper(navigation, currentScreen);
}

/**
 * Standardized navigation patterns
 */
export const NavigationPatterns = {
  /**
   * Quick action navigation pattern
   */
  quickAction: (navigation: NavigationProp<any>, currentScreen: string, action: string, targetScreen: string) => {
    const helper = new NavigationHelper(navigation, currentScreen);
    helper.navigate(targetScreen, undefined, { trackAnalytics: true });
  },

  /**
   * Section header "View All" navigation pattern
   */
  viewAll: (navigation: NavigationProp<any>, currentScreen: string, section: string, targetScreen: string) => {
    const helper = new NavigationHelper(navigation, currentScreen);
    helper.navigate(targetScreen, undefined, { trackAnalytics: true });
  },

  /**
   * Bottom sheet navigation pattern
   */
  bottomSheet: (navigation: NavigationProp<any>, currentScreen: string, sheetName: string, action: string) => {
    const helper = new NavigationHelper(navigation, currentScreen);
    // Bottom sheets typically don't navigate to new screens
    // This is for tracking purposes
    trackNavigation(currentScreen, `${sheetName}_${action}`, 'bottom_sheet');
  },

  /**
   * Form submission navigation pattern
   */
  formSubmission: (navigation: NavigationProp<any>, currentScreen: string, formName: string, targetScreen?: string) => {
    const helper = new NavigationHelper(navigation, currentScreen);
    if (targetScreen) {
      helper.navigate(targetScreen, undefined, { trackAnalytics: true });
    } else {
      helper.goBack({ trackAnalytics: true });
    }
  },

  /**
   * Error handling navigation pattern
   */
  errorHandling: (navigation: NavigationProp<any>, currentScreen: string, errorType: string, fallbackScreen?: string) => {
    const helper = new NavigationHelper(navigation, currentScreen);
    const targetScreen = fallbackScreen || 'Home';
    helper.navigate(targetScreen, { error: errorType }, { trackAnalytics: true });
  },
};

/**
 * Navigation constants
 */
export const NavigationConstants = {
  SCREENS: {
    HOME: 'Home',
    ACCOUNT: 'Account',
    TRANSACTIONS: 'TransactionsList',
    POCKETS: 'Pockets',
    AI_INSIGHTS: 'AIInsights',
    EXPORT_DATA: 'ExportData',
    APPEARANCE: 'Appearance',
    CURRENCY: 'Currency',
    HELP_SUPPORT: 'HelpSupport',
    PRIVACY_POLICY: 'PrivacyPolicy',
    ABOUT_APP: 'AboutApp',
    RATE_US: 'RateUs',
    EDIT_PROFILE: 'EditProfile',
    PROJECTION_DETAILS: 'ProjectionDetails',
    SEND_TO_EMAIL: 'SendToEmail',
  },
  
  ACTIONS: {
    NAVIGATE: 'navigate',
    BACK: 'back',
    REPLACE: 'replace',
    RESET: 'reset',
  },

  METHODS: {
    TAP: 'tap',
    SWIPE: 'swipe',
    VOICE: 'voice',
    GESTURE: 'gesture',
  },
};

export default NavigationHelper;
