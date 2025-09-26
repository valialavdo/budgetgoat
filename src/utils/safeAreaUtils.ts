import { Platform, Dimensions } from 'react-native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

/**
 * Safe Area Utilities for Different Mobile Devices
 * 
 * This utility provides consistent safe area calculations across different
 * mobile devices and platforms, ensuring proper spacing from system UI elements
 * like home indicators, navigation bars, and status bars.
 */

export interface SafeAreaValues {
  bottom: number;
  top: number;
  left: number;
  right: number;
}

/**
 * Device Detection Utilities
 */
export const DeviceUtils = {
  /**
   * Check if device has a home indicator (iPhone X and later)
   */
  hasHomeIndicator: (): boolean => {
    if (Platform.OS !== 'ios') return false;
    
    // iPhone X and later have taller screens
    return SCREEN_HEIGHT >= 812;
  },

  /**
   * Check if device is Android
   */
  isAndroid: (): boolean => Platform.OS === 'android',

  /**
   * Check if device is iOS
   */
  isIOS: (): boolean => Platform.OS === 'ios',

  /**
   * Get device type for safe area calculations
   */
  getDeviceType: (): 'iphone-with-indicator' | 'iphone-with-button' | 'android' => {
    if (Platform.OS === 'android') return 'android';
    if (DeviceUtils.hasHomeIndicator()) return 'iphone-with-indicator';
    return 'iphone-with-button';
  },
};

/**
 * Safe Area Calculation Utilities
 */
export const SafeAreaUtils = {
  /**
   * Get recommended bottom safe area for different contexts
   */
  getBottomSafeArea: (context: 'button' | 'sheet' | 'content' = 'button'): number => {
    const deviceType = DeviceUtils.getDeviceType();
    
    switch (context) {
      case 'button':
        // Buttons need more space for comfortable tapping
        switch (deviceType) {
          case 'iphone-with-indicator':
            return 34 + 16; // Home indicator + comfortable padding
          case 'iphone-with-button':
            return 20 + 16; // Home button area + comfortable padding
          case 'android':
            return 24 + 16; // Navigation bar + comfortable padding
          default:
            return 32; // Fallback
        }
        
      case 'sheet':
        // Bottom sheets need less space but still safe
        switch (deviceType) {
          case 'iphone-with-indicator':
            return 34 + 8; // Home indicator + minimal padding
          case 'iphone-with-button':
            return 20 + 8; // Home button area + minimal padding
          case 'android':
            return 24 + 8; // Navigation bar + minimal padding
          default:
            return 24; // Fallback
        }
        
      case 'content':
        // Content can be closer to edges
        switch (deviceType) {
          case 'iphone-with-indicator':
            return 34 + 4; // Home indicator + minimal padding
          case 'iphone-with-button':
            return 20 + 4; // Home button area + minimal padding
          case 'android':
            return 24 + 4; // Navigation bar + minimal padding
          default:
            return 20; // Fallback
        }
        
      default:
        return 32;
    }
  },

  /**
   * Get top safe area (status bar height)
   */
  getTopSafeArea: (): number => {
    if (Platform.OS === 'ios') {
      // iOS status bar height varies by device
      return SCREEN_HEIGHT >= 812 ? 44 : 20;
    }
    // Android status bar height
    return 24;
  },

  /**
   * Get horizontal safe areas (notches, etc.)
   */
  getHorizontalSafeAreas: (): { left: number; right: number } => {
    if (Platform.OS === 'ios' && SCREEN_HEIGHT >= 812) {
      // iPhone X and later have notches
      return { left: 44, right: 44 };
    }
    return { left: 0, right: 0 };
  },

  /**
   * Get complete safe area values
   */
  getSafeAreaValues: (): SafeAreaValues => {
    const horizontal = SafeAreaUtils.getHorizontalSafeAreas();
    
    return {
      top: SafeAreaUtils.getTopSafeArea(),
      bottom: SafeAreaUtils.getBottomSafeArea('content'),
      left: horizontal.left,
      right: horizontal.right,
    };
  },
};

/**
 * Context-specific safe area helpers
 */
export const SafeAreaContexts = {
  /**
   * Safe area for button containers (like bottom action buttons)
   */
  buttonContainer: (): number => SafeAreaUtils.getBottomSafeArea('button'),
  
  /**
   * Safe area for bottom sheets
   */
  bottomSheet: (): number => SafeAreaUtils.getBottomSafeArea('sheet'),
  
  /**
   * Safe area for scrollable content
   */
  scrollContent: (): number => SafeAreaUtils.getBottomSafeArea('content'),
  
  /**
   * Safe area for modal overlays
   */
  modal: (): number => SafeAreaUtils.getBottomSafeArea('sheet'),
};

/**
 * Predefined safe area styles for common use cases
 */
export const SafeAreaStyles = {
  /**
   * Style for bottom button containers
   */
  bottomButtonContainer: {
    paddingBottom: SafeAreaContexts.buttonContainer(),
  },
  
  /**
   * Style for bottom sheets
   */
  bottomSheet: {
    marginBottom: SafeAreaContexts.bottomSheet(),
  },
  
  /**
   * Style for scrollable content
   */
  scrollContent: {
    paddingBottom: SafeAreaContexts.scrollContent(),
  },
  
  /**
   * Style for modal content
   */
  modalContent: {
    paddingBottom: SafeAreaContexts.modal(),
  },
};

export default SafeAreaUtils;
