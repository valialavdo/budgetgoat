import React, { Component, ReactNode, ErrorInfo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { errorLogger } from '../services/errorLogger';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string;
  retryCount: number;
  lastErrorTime: number;
}

interface AppErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo, errorId: string) => void;
  maxRetries?: number;
  retryDelay?: number;
  enableLogging?: boolean;
}

/**
 * Comprehensive app-level error boundary with retry logic, logging, and recovery
 * Provides multiple recovery strategies and detailed error reporting
 */
export class AppErrorBoundary extends Component<AppErrorBoundaryProps, ErrorBoundaryState> {
  private retryTimeoutId: NodeJS.Timeout | null = null;
  private errorLog: Array<{
    errorId: string;
    error: Error;
    errorInfo: ErrorInfo;
    timestamp: number;
    retryCount: number;
  }> = [];

  constructor(props: AppErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: '',
      retryCount: 0,
      lastErrorTime: 0,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    const errorId = `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    return {
      hasError: true,
      error,
      errorId,
      lastErrorTime: Date.now(),
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const { errorId, retryCount } = this.state;
    
    // Log error using errorLogger service
    errorLogger.logError('AppErrorBoundary', error, errorInfo, {
      errorId,
      retryCount,
    });
    
    // Log error details locally
    const errorLogEntry = {
      errorId,
      error,
      errorInfo,
      timestamp: Date.now(),
      retryCount,
    };
    
    this.errorLog.push(errorLogEntry);
    
    // Keep only last 10 errors to prevent memory leaks
    if (this.errorLog.length > 10) {
      this.errorLog = this.errorLog.slice(-10);
    }

    // Log to console in development
    if (__DEV__ || this.props.enableLogging) {
      console.error('AppErrorBoundary caught an error:', {
        errorId,
        error: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        retryCount,
        timestamp: new Date().toISOString(),
      });
    }

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo, errorId);
    }

    // Update state with error info
    this.setState({
      error,
      errorInfo,
    });
  }

  componentWillUnmount() {
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId);
    }
  }

  handleRetry = () => {
    const { maxRetries = 3, retryDelay = 1000 } = this.props;
    const { retryCount } = this.state;

    if (retryCount >= maxRetries) {
      Alert.alert(
        'Maximum Retries Reached',
        'The app has reached the maximum number of retry attempts. Please restart the app.',
        [{ text: 'OK' }]
      );
      return;
    }

    // Clear any existing timeout
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId);
    }

    // Show retry countdown
    this.showRetryCountdown(retryDelay);

    // Retry after delay
    this.retryTimeoutId = setTimeout(() => {
      this.setState(prevState => ({
        hasError: false,
        error: null,
        errorInfo: null,
        retryCount: prevState.retryCount + 1,
      }));
    }, retryDelay);
  };

  showRetryCountdown = (delay: number) => {
    let remaining = delay / 1000;
    const countdownInterval = setInterval(() => {
      remaining -= 1;
      if (remaining <= 0) {
        clearInterval(countdownInterval);
      }
    }, 1000);
  };

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0,
    });
  };

  handleReportError = () => {
    const { error, errorId, retryCount } = this.state;
    const errorReport = {
      errorId,
      message: error?.message || 'Unknown error',
      stack: error?.stack || 'No stack trace',
      retryCount,
      timestamp: new Date().toISOString(),
      userAgent: 'React Native App',
      version: '1.0.0', // You can get this from package.json
    };

    // In a real app, you would send this to your error reporting service
    console.log('Error Report:', errorReport);
    
    Alert.alert(
      'Error Reported',
      `Error ID: ${errorId}\n\nThis error has been logged for investigation.`,
      [{ text: 'OK' }]
    );
  };

  getErrorSeverity = (): 'low' | 'medium' | 'high' | 'critical' => {
    const { retryCount, error } = this.state;
    const timeSinceLastError = Date.now() - this.state.lastErrorTime;
    
    // Critical: Multiple retries in short time
    if (retryCount >= 3 && timeSinceLastError < 30000) {
      return 'critical';
    }
    
    // High: Multiple retries
    if (retryCount >= 2) {
      return 'high';
    }
    
    // Medium: Network or async errors
    if (error?.message.includes('Network') || error?.message.includes('fetch')) {
      return 'medium';
    }
    
    // Low: Single occurrence
    return 'low';
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const { error, errorId, retryCount } = this.state;
      const { maxRetries = 3 } = this.props;
      const severity = this.getErrorSeverity();
      const canRetry = retryCount < maxRetries;

      return (
        <View style={styles.container}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.errorContainer}>
              <Text style={styles.errorTitle}>
                {severity === 'critical' ? '🚨 Critical Error' : 
                 severity === 'high' ? '⚠️ High Priority Error' :
                 severity === 'medium' ? '⚠️ Error' : '❌ Something went wrong'}
              </Text>
              
              <Text style={styles.errorMessage}>
                The app encountered an unexpected error. {canRetry ? 'You can try again or report this issue.' : 'Please restart the app.'}
              </Text>

              <View style={styles.errorDetails}>
                <Text style={styles.errorId}>Error ID: {errorId}</Text>
                <Text style={styles.retryCount}>Retry Attempt: {retryCount}/{maxRetries}</Text>
                <Text style={styles.severity}>Severity: {severity.toUpperCase()}</Text>
              </View>

              <View style={styles.buttonContainer}>
                {canRetry && (
                  <TouchableOpacity
                    style={[styles.button, styles.retryButton]}
                    onPress={this.handleRetry}
                  >
                    <Text style={styles.buttonText}>
                      Try Again ({retryCount + 1}/{maxRetries})
                    </Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  style={[styles.button, styles.resetButton]}
                  onPress={this.handleReset}
                >
                  <Text style={styles.buttonText}>Reset App</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.button, styles.reportButton]}
                  onPress={this.handleReportError}
                >
                  <Text style={styles.buttonText}>Report Error</Text>
                </TouchableOpacity>
              </View>

              {__DEV__ && error && (
                <View style={styles.debugContainer}>
                  <Text style={styles.debugTitle}>Debug Information:</Text>
                  <Text style={styles.debugText}>
                    {error.toString()}
                  </Text>
                  {this.state.errorInfo && (
                    <Text style={styles.debugText}>
                      {this.state.errorInfo.componentStack}
                    </Text>
                  )}
                  
                  {this.errorLog.length > 0 && (
                    <View style={styles.errorHistoryContainer}>
                      <Text style={styles.debugTitle}>Recent Errors:</Text>
                      {this.errorLog.slice(-3).map((log, index) => (
                        <Text key={index} style={styles.debugText}>
                          {log.errorId}: {log.error.message} (Retry: {log.retryCount})
                        </Text>
                      ))}
                    </View>
                  )}
                </View>
              )}
            </View>
          </ScrollView>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  errorContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#e74c3c',
    marginBottom: 12,
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  errorDetails: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    width: '100%',
  },
  errorId: {
    fontSize: 12,
    color: '#495057',
    fontFamily: 'monospace',
    marginBottom: 4,
  },
  retryCount: {
    fontSize: 12,
    color: '#495057',
    marginBottom: 4,
  },
  severity: {
    fontSize: 12,
    color: '#495057',
    fontWeight: 'bold',
  },
  buttonContainer: {
    width: '100%',
    gap: 12,
  },
  button: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  retryButton: {
    backgroundColor: '#007bff',
  },
  resetButton: {
    backgroundColor: '#6c757d',
  },
  reportButton: {
    backgroundColor: '#17a2b8',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  debugContainer: {
    width: '100%',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 16,
    marginTop: 20,
  },
  debugTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#495057',
    marginBottom: 8,
  },
  debugText: {
    fontSize: 12,
    color: '#6c757d',
    fontFamily: 'monospace',
    lineHeight: 16,
    marginBottom: 4,
  },
  errorHistoryContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#dee2e6',
  },
});