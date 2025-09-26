import { format, parseISO, isValid } from 'date-fns';

/**
 * Utility functions for consistent data formatting across the app
 * These functions ensure all currency, date, and number formatting
 * is centralized and consistent with the design system.
 */

/**
 * Formats a number as currency with proper locale support
 * @param amount - The amount to format
 * @param currency - Currency code (default: 'USD')
 * @param showSign - Whether to show + or - sign
 * @returns Formatted currency string
 */
export function formatCurrency(
  amount: number,
  currency: string = 'USD',
  showSign: boolean = false
): string {
  const sign = showSign ? (amount >= 0 ? '+' : '') : '';
  const absoluteAmount = Math.abs(amount);
  
  return `${sign}${currency === 'USD' ? '$' : currency}${absoluteAmount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/**
 * Formats a number as compact currency (e.g., $1.2K, $5.4M)
 * @param amount - The amount to format
 * @param currency - Currency code (default: 'USD')
 * @returns Formatted compact currency string
 */
export function formatCompactCurrency(
  amount: number,
  currency: string = 'USD'
): string {
  const currencySymbol = currency === 'USD' ? '$' : currency;
  const absAmount = Math.abs(amount);
  
  if (absAmount >= 1000000) {
    return `${currencySymbol}${(absAmount / 1000000).toFixed(1)}M`;
  } else if (absAmount >= 1000) {
    return `${currencySymbol}${(absAmount / 1000).toFixed(1)}K`;
  } else {
    return formatCurrency(amount, currency);
  }
}

/**
 * Formats a date string or Date object for display
 * @param date - Date string, Date object, or timestamp
 * @param formatString - Date format string (default: 'MMM dd, yyyy')
 * @returns Formatted date string
 */
export function formatDate(
  date: string | Date | number,
  formatString: string = 'MMM dd, yyyy'
): string {
  try {
    let dateObj: Date;
    
    if (typeof date === 'string') {
      // Handle ISO strings and other formats
      dateObj = parseISO(date);
    } else if (typeof date === 'number') {
      // Handle timestamps
      dateObj = new Date(date);
    } else {
      dateObj = date;
    }
    
    if (!isValid(dateObj)) {
      return 'Invalid Date';
    }
    
    return format(dateObj, formatString);
  } catch (error) {
    console.warn('Date formatting error:', error);
    return 'Invalid Date';
  }
}

/**
 * Formats a date for relative display (e.g., "2 days ago", "Today")
 * @param date - Date string, Date object, or timestamp
 * @returns Relative date string
 */
export function formatRelativeDate(date: string | Date | number): string {
  try {
    let dateObj: Date;
    
    if (typeof date === 'string') {
      dateObj = parseISO(date);
    } else if (typeof date === 'number') {
      dateObj = new Date(date);
    } else {
      dateObj = date;
    }
    
    if (!isValid(dateObj)) {
      return 'Invalid Date';
    }
    
    const now = new Date();
    const diffInMs = now.getTime() - dateObj.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) {
      return 'Today';
    } else if (diffInDays === 1) {
      return 'Yesterday';
    } else if (diffInDays < 7) {
      return `${diffInDays} days ago`;
    } else if (diffInDays < 30) {
      const weeks = Math.floor(diffInDays / 7);
      return weeks === 1 ? '1 week ago' : `${weeks} weeks ago`;
    } else if (diffInDays < 365) {
      const months = Math.floor(diffInDays / 30);
      return months === 1 ? '1 month ago' : `${months} months ago`;
    } else {
      const years = Math.floor(diffInDays / 365);
      return years === 1 ? '1 year ago' : `${years} years ago`;
    }
  } catch (error) {
    console.warn('Relative date formatting error:', error);
    return 'Invalid Date';
  }
}

/**
 * Formats a number with proper locale formatting
 * @param number - The number to format
 * @param decimals - Number of decimal places (default: 0)
 * @returns Formatted number string
 */
export function formatNumber(number: number, decimals: number = 0): string {
  return number.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/**
 * Formats a percentage value
 * @param value - The percentage value (0-100)
 * @param decimals - Number of decimal places (default: 1)
 * @returns Formatted percentage string
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Formats a transaction amount with proper sign and color indication
 * @param amount - The transaction amount
 * @param type - Transaction type ('income' | 'expense')
 * @param currency - Currency code (default: 'USD')
 * @returns Object with formatted amount and color info
 */
export function formatTransactionAmount(
  amount: number,
  type: 'income' | 'expense',
  currency: string = 'USD'
): {
  formatted: string;
  isPositive: boolean;
  displayAmount: number;
} {
  const displayAmount = type === 'income' ? Math.abs(amount) : -Math.abs(amount);
  const formatted = formatCurrency(displayAmount, currency, true);
  const isPositive = displayAmount >= 0;
  
  return {
    formatted,
    isPositive,
    displayAmount,
  };
}

/**
 * Formats a file size in bytes to human readable format
 * @param bytes - File size in bytes
 * @returns Formatted file size string
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Truncates text to a specified length with ellipsis
 * @param text - The text to truncate
 * @param maxLength - Maximum length before truncation
 * @returns Truncated text with ellipsis if needed
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
}

/**
 * Formats a phone number for display
 * @param phoneNumber - Raw phone number string
 * @returns Formatted phone number
 */
export function formatPhoneNumber(phoneNumber: string): string {
  const cleaned = phoneNumber.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  
  return phoneNumber;
}
