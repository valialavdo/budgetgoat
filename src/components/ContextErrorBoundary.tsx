import React, { Component, ReactNode, ErrorInfo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { errorLogger } from '../services/errorLogger';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string;
  retryCount: number;
}

interface ContextErrorBoundaryProps {
  children: ReactNode;
  contextName: string;
  fallback?: ReactNode;
  onError?: (contextName: string, error: Error, errorInfo: ErrorInfo) => void;
  maxRetries?: number;
  enableLogging?: boolean;
}

/**
 * Context-specific error boundary for individual context providers
 * Provides granular error handling and recovery for specific contexts
 */
export class ContextErrorBoundary extends Component<ContextErrorBoundaryProps, ErrorBoundaryState> {
  private retryTimeoutId: NodeJS.Timeout | null = null;

  constructor(props: ContextErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: '',
      retryCount: 0,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    const errorId = `ctx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    return {
      hasError: true,
      error,
      errorId,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const { contextName, onError, enableLogging } = this.props;
    const { errorId, retryCount } = this.state;

    // Log context-specific error using errorLogger service
    errorLogger.logError(`ContextErrorBoundary-${contextName}`, error, errorInfo, {
      contextName,
      retryCount,
    });

    // Log context-specific error
    if (__DEV__ || enableLogging) {
      console.error(`ContextErrorBoundary caught error in ${contextName}:`, {
        errorId,
        contextName,
        error: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        retryCount,
        timestamp: new Date().toISOString(),
      });
    }

    // Call custom error handler if provided
    if (onError) {
      onError(contextName, error, errorInfo);
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
    const { maxRetries = 2 } = this.props;
    const { retryCount } = this.state;

    if (retryCount >= maxRetries) {
      // If max retries reached, reset to initial state
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null,
        retryCount: 0,
      });
      return;
    }

    // Clear any existing timeout
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId);
    }

    // Retry after a short delay
    this.retryTimeoutId = setTimeout(() => {
      this.setState(prevState => ({
        hasError: false,
        error: null,
        errorInfo: null,
        retryCount: prevState.retryCount + 1,
      }));
    }, 500);
  };

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0,
    });
  };

  getContextIcon = (): string => {
    const { contextName } = this.props;
    switch (contextName.toLowerCase()) {
      case 'theme':
        return '🎨';
      case 'onboarding':
        return '🚀';
      case 'toast':
        return '📢';
      case 'firebase':
        return '🔥';
      case 'budget':
        return '💰';
      default:
        return '⚙️';
    }
  };

  getContextColor = (): string => {
    const { contextName } = this.props;
    switch (contextName.toLowerCase()) {
      case 'theme':
        return '#9b59b6';
      case 'onboarding':
        return '#3498db';
      case 'toast':
        return '#f39c12';
      case 'firebase':
        return '#e74c3c';
      case 'budget':
        return '#27ae60';
      default:
        return '#95a5a6';
    }
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const { contextName } = this.props;
      const { error, retryCount } = this.state;
      const { maxRetries = 2 } = this.props;
      const canRetry = retryCount < maxRetries;
      const contextColor = this.getContextColor();
      const contextIcon = this.getContextIcon();

      return (
        <View style={[styles.container, { borderLeftColor: contextColor }]}>
          <View style={styles.header}>
            <Text style={styles.icon}>{contextIcon}</Text>
            <Text style={[styles.contextName, { color: contextColor }]}>
              {contextName} Context Error
            </Text>
          </View>
          
          <Text style={styles.errorMessage}>
            The {contextName} context encountered an error and couldn't load properly.
          </Text>

          <View style={styles.errorDetails}>
            <Text style={styles.errorText}>
              {error?.message || 'Unknown error occurred'}
            </Text>
            <Text style={styles.retryInfo}>
              Retry attempt: {retryCount}/{maxRetries}
            </Text>
          </View>

          <View style={styles.buttonContainer}>
            {canRetry && (
              <TouchableOpacity
                style={[styles.button, styles.retryButton, { backgroundColor: contextColor }]}
                onPress={this.handleRetry}
              >
                <Text style={styles.buttonText}>Retry {contextName}</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[styles.button, styles.resetButton]}
              onPress={this.handleReset}
            >
              <Text style={styles.buttonText}>Reset Context</Text>
            </TouchableOpacity>
          </View>

          {__DEV__ && error && (
            <View style={styles.debugContainer}>
              <Text style={styles.debugTitle}>Debug Info:</Text>
              <Text style={styles.debugText}>
                {error.toString()}
              </Text>
            </View>
          )}
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    margin: 8,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  icon: {
    fontSize: 20,
    marginRight: 8,
  },
  contextName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorMessage: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 12,
    lineHeight: 20,
  },
  errorDetails: {
    backgroundColor: '#f8f9fa',
    borderRadius: 6,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 12,
    color: '#e74c3c',
    fontFamily: 'monospace',
    marginBottom: 4,
  },
  retryInfo: {
    fontSize: 12,
    color: '#6c757d',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  button: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
  },
  retryButton: {
    // backgroundColor set dynamically
  },
  resetButton: {
    backgroundColor: '#6c757d',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  debugContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#dee2e6',
  },
  debugTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#495057',
    marginBottom: 4,
  },
  debugText: {
    fontSize: 10,
    color: '#6c757d',
    fontFamily: 'monospace',
    lineHeight: 14,
  },
});