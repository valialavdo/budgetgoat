/**
 * Accessibility Utilities
 * Provides standardized accessibility labels and helpers
 */

export interface AccessibilityProps {
  accessibilityLabel?: string;
  accessibilityHint?: string;
  accessibilityRole?: string;
  accessibilityState?: {
    disabled?: boolean;
    selected?: boolean;
    checked?: boolean;
    busy?: boolean;
    expanded?: boolean;
  };
  accessibilityValue?: {
    min?: number;
    max?: number;
    now?: number;
    text?: string;
  };
}

/**
 * Accessibility helper class
 */
export class AccessibilityHelper {
  /**
   * Generate accessibility label for transaction items
   */
  static getTransactionLabel(transaction: {
    description: string;
    amount: number;
    type: 'income' | 'expense';
    date?: string;
    category?: string;
  }): string {
    const amountText = transaction.type === 'income' 
      ? `Income of ${Math.abs(transaction.amount).toFixed(2)}`
      : `Expense of ${Math.abs(transaction.amount).toFixed(2)}`;
    
    const dateText = transaction.date ? ` on ${transaction.date}` : '';
    const categoryText = transaction.category ? ` in ${transaction.category}` : '';
    
    return `${transaction.description}, ${amountText}${dateText}${categoryText}`;
  }

  /**
   * Generate accessibility hint for transaction items
   */
  static getTransactionHint(transaction: {
    description: string;
    amount: number;
    type: 'income' | 'expense';
  }): string {
    return `Double tap to view details and edit ${transaction.description}`;
  }

  /**
   * Generate accessibility label for pocket items
   */
  static getPocketLabel(pocket: {
    name: string;
    currentBalance: number;
    targetAmount?: number;
    type: 'standard' | 'goal';
  }): string {
    const balanceText = `Current balance ${pocket.currentBalance.toFixed(2)}`;
    const targetText = pocket.targetAmount 
      ? ` out of ${pocket.targetAmount.toFixed(2)} target`
      : '';
    const typeText = pocket.type === 'goal' ? ' goal pocket' : ' pocket';
    
    return `${pocket.name}${typeText}, ${balanceText}${targetText}`;
  }

  /**
   * Generate accessibility hint for pocket items
   */
  static getPocketHint(pocket: {
    name: string;
    type: 'standard' | 'goal';
  }): string {
    return `Double tap to view details and edit ${pocket.name} ${pocket.type} pocket`;
  }

  /**
   * Generate accessibility label for quick action buttons
   */
  static getQuickActionLabel(action: {
    title: string;
    icon?: React.ReactNode;
  }): string {
    return `Quick action: ${action.title}`;
  }

  /**
   * Generate accessibility hint for quick action buttons
   */
  static getQuickActionHint(action: {
    title: string;
  }): string {
    return `Double tap to ${action.title.toLowerCase()}`;
  }

  /**
   * Generate accessibility label for section headers
   */
  static getSectionHeaderLabel(section: {
    title: string;
    hasViewAll?: boolean;
  }): string {
    const viewAllText = section.hasViewAll ? ', has view all option' : '';
    return `Section: ${section.title}${viewAllText}`;
  }

  /**
   * Generate accessibility hint for section headers
   */
  static getSectionHeaderHint(section: {
    title: string;
    hasViewAll?: boolean;
  }): string {
    if (section.hasViewAll) {
      return `Double tap view all to see all ${section.title.toLowerCase()}`;
    }
    return `Section containing ${section.title.toLowerCase()}`;
  }

  /**
   * Generate accessibility label for AI insight cards
   */
  static getAIInsightLabel(insight: {
    title: string;
    description: string;
    type: string;
  }): string {
    return `AI Insight: ${insight.title}, ${insight.description}`;
  }

  /**
   * Generate accessibility hint for AI insight cards
   */
  static getAIInsightHint(insight: {
    title: string;
  }): string {
    return `Double tap to view details about ${insight.title}`;
  }

  /**
   * Generate accessibility label for bottom sheet headers
   */
  static getBottomSheetHeaderLabel(sheet: {
    title: string;
    hasEdit?: boolean;
    hasDelete?: boolean;
  }): string {
    let actions = '';
    if (sheet.hasEdit) actions += ', has edit option';
    if (sheet.hasDelete) actions += ', has delete option';
    
    return `Bottom sheet: ${sheet.title}${actions}`;
  }

  /**
   * Generate accessibility hint for bottom sheet headers
   */
  static getBottomSheetHeaderHint(sheet: {
    title: string;
    hasEdit?: boolean;
  }): string {
    const editHint = sheet.hasEdit ? 'Double tap edit to modify' : 'Double tap close to dismiss';
    return `${editHint} ${sheet.title}`;
  }

  /**
   * Generate accessibility label for navigation buttons
   */
  static getNavigationButtonLabel(button: {
    label: string;
    icon?: React.ReactNode;
    showArrow?: boolean;
  }): string {
    const arrowText = button.showArrow ? ', navigates to another screen' : '';
    return `Navigation: ${button.label}${arrowText}`;
  }

  /**
   * Generate accessibility hint for navigation buttons
   */
  static getNavigationButtonHint(button: {
    label: string;
  }): string {
    return `Double tap to ${button.label.toLowerCase()}`;
  }

  /**
   * Generate accessibility label for form inputs
   */
  static getFormInputLabel(input: {
    label: string;
    placeholder?: string;
    value?: string;
    required?: boolean;
  }): string {
    const requiredText = input.required ? ', required field' : '';
    const valueText = input.value ? `, current value: ${input.value}` : '';
    return `${input.label}${requiredText}${valueText}`;
  }

  /**
   * Generate accessibility hint for form inputs
   */
  static getFormInputHint(input: {
    label: string;
    placeholder?: string;
  }): string {
    const placeholderText = input.placeholder ? `Enter ${input.placeholder}` : `Enter ${input.label.toLowerCase()}`;
    return placeholderText;
  }

  /**
   * Generate accessibility label for toggle switches
   */
  static getToggleLabel(toggle: {
    label: string;
    value: boolean;
  }): string {
    const stateText = toggle.value ? 'enabled' : 'disabled';
    return `${toggle.label}, ${stateText}`;
  }

  /**
   * Generate accessibility hint for toggle switches
   */
  static getToggleHint(toggle: {
    label: string;
  }): string {
    return `Double tap to toggle ${toggle.label.toLowerCase()}`;
  }

  /**
   * Generate accessibility label for progress bars
   */
  static getProgressBarLabel(progress: {
    label: string;
    current: number;
    max: number;
    unit?: string;
  }): string {
    const percentage = Math.round((progress.current / progress.max) * 100);
    const unitText = progress.unit ? ` ${progress.unit}` : '';
    return `${progress.label}, ${progress.current}${unitText} of ${progress.max}${unitText}, ${percentage}% complete`;
  }

  /**
   * Generate accessibility hint for progress bars
   */
  static getProgressBarHint(progress: {
    label: string;
  }): string {
    return `Progress indicator for ${progress.label.toLowerCase()}`;
  }

  /**
   * Generate accessibility label for loading states
   */
  static getLoadingLabel(loading: {
    item: string;
  }): string {
    return `Loading ${loading.item}`;
  }

  /**
   * Generate accessibility hint for loading states
   */
  static getLoadingHint(loading: {
    item: string;
  }): string {
    return `Please wait while ${loading.item} is being loaded`;
  }

  /**
   * Generate accessibility label for error states
   */
  static getErrorLabel(error: {
    message: string;
    retryable?: boolean;
  }): string {
    const retryText = error.retryable ? ', tap to retry' : '';
    return `Error: ${error.message}${retryText}`;
  }

  /**
   * Generate accessibility hint for error states
   */
  static getErrorHint(error: {
    retryable?: boolean;
  }): string {
    return error.retryable 
      ? 'Double tap to retry the operation'
      : 'An error occurred, please check your connection';
  }
}

/**
 * Accessibility constants
 */
export const AccessibilityConstants = {
  ROLES: {
    BUTTON: 'button',
    LINK: 'link',
    IMAGE: 'image',
    TEXT: 'text',
    HEADER: 'header',
    SUMMARY: 'summary',
    LIST: 'list',
    LISTITEM: 'listitem',
    TAB: 'tab',
    TABLIST: 'tablist',
    MENU: 'menu',
    MENUITEM: 'menuitem',
    SWITCH: 'switch',
    CHECKBOX: 'checkbox',
    RADIO: 'radio',
    SLIDER: 'slider',
    PROGRESSBAR: 'progressbar',
    SEARCH: 'search',
    TEXTBOX: 'textbox',
    COMBOBOX: 'combobox',
    SPINBUTTON: 'spinbutton',
    SCROLLBAR: 'scrollbar',
    TOOLBAR: 'toolbar',
    STATUS: 'status',
    ALERT: 'alert',
    DIALOG: 'dialog',
    LOG: 'log',
    MARQUEE: 'marquee',
    TIMER: 'timer',
    TABPANEL: 'tabpanel',
    GROUP: 'group',
    REGION: 'region',
    PRESENTATION: 'presentation',
    NONE: 'none',
  },

  STATES: {
    DISABLED: 'disabled',
    SELECTED: 'selected',
    CHECKED: 'checked',
    BUSY: 'busy',
    EXPANDED: 'expanded',
    COLLAPSED: 'collapsed',
  },

  HINTS: {
    DOUBLE_TAP: 'Double tap to activate',
    SWIPE: 'Swipe to navigate',
    LONG_PRESS: 'Long press for more options',
    VOICE_OVER: 'VoiceOver enabled',
  },
};

export default AccessibilityHelper;
