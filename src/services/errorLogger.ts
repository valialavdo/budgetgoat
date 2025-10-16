interface ErrorLogEntry {
  id: string;
  timestamp: number;
  level: 'error' | 'warning' | 'info';
  context: string;
  message: string;
  stack?: string;
  componentStack?: string;
  retryCount: number;
  userId?: string;
  sessionId: string;
  deviceInfo: {
    platform: string;
    version: string;
    model?: string;
  };
  metadata?: Record<string, any>;
}

interface ErrorLoggerConfig {
  enableConsoleLogging: boolean;
  enableRemoteLogging: boolean;
  maxLocalLogs: number;
  remoteEndpoint?: string;
  sessionId: string;
}

class ErrorLogger {
  private config: ErrorLoggerConfig;
  private localLogs: ErrorLogEntry[] = [];
  private sessionId: string;

  constructor(config: Partial<ErrorLoggerConfig> = {}) {
    this.sessionId = this.generateSessionId();
    this.config = {
      enableConsoleLogging: __DEV__,
      enableRemoteLogging: false,
      maxLocalLogs: 50,
      sessionId: this.sessionId,
      ...config,
    };
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateErrorId(): string {
    return `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private getDeviceInfo() {
    // In a real app, you would get this from device APIs
    return {
      platform: 'React Native',
      version: '1.0.0',
      model: 'Simulator/Emulator',
    };
  }

  logError(
    context: string,
    error: Error,
    errorInfo?: ErrorInfo,
    metadata?: Record<string, any>
  ): string {
    const errorId = this.generateErrorId();
    const logEntry: ErrorLogEntry = {
      id: errorId,
      timestamp: Date.now(),
      level: 'error',
      context,
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo?.componentStack,
      retryCount: 0,
      sessionId: this.sessionId,
      deviceInfo: this.getDeviceInfo(),
      metadata,
    };

    this.addToLocalLogs(logEntry);
    this.logToConsole(logEntry);
    this.logToRemote(logEntry);

    return errorId;
  }

  logWarning(
    context: string,
    message: string,
    metadata?: Record<string, any>
  ): string {
    const errorId = this.generateErrorId();
    const logEntry: ErrorLogEntry = {
      id: errorId,
      timestamp: Date.now(),
      level: 'warning',
      context,
      message,
      retryCount: 0,
      sessionId: this.sessionId,
      deviceInfo: this.getDeviceInfo(),
      metadata,
    };

    this.addToLocalLogs(logEntry);
    this.logToConsole(logEntry);
    this.logToRemote(logEntry);

    return errorId;
  }

  logInfo(
    context: string,
    message: string,
    metadata?: Record<string, any>
  ): string {
    const errorId = this.generateErrorId();
    const logEntry: ErrorLogEntry = {
      id: errorId,
      timestamp: Date.now(),
      level: 'info',
      context,
      message,
      retryCount: 0,
      sessionId: this.sessionId,
      deviceInfo: this.getDeviceInfo(),
      metadata,
    };

    this.addToLocalLogs(logEntry);
    this.logToConsole(logEntry);
    this.logToRemote(logEntry);

    return errorId;
  }

  updateRetryCount(errorId: string, retryCount: number): void {
    const logEntry = this.localLogs.find(log => log.id === errorId);
    if (logEntry) {
      logEntry.retryCount = retryCount;
    }
  }

  private addToLocalLogs(logEntry: ErrorLogEntry): void {
    this.localLogs.push(logEntry);
    
    // Keep only the most recent logs
    if (this.localLogs.length > this.config.maxLocalLogs) {
      this.localLogs = this.localLogs.slice(-this.config.maxLocalLogs);
    }
  }

  private logToConsole(logEntry: ErrorLogEntry): void {
    if (!this.config.enableConsoleLogging) return;

    const { level, context, message, id, timestamp } = logEntry;
    const timeStr = new Date(timestamp).toISOString();
    
    const logMessage = `[${timeStr}] ${level.toUpperCase()} [${context}] ${message} (ID: ${id})`;
    
    switch (level) {
      case 'error':
        console.error(logMessage, logEntry);
        break;
      case 'warning':
        console.warn(logMessage, logEntry);
        break;
      case 'info':
        console.info(logMessage, logEntry);
        break;
    }
  }

  private async logToRemote(logEntry: ErrorLogEntry): Promise<void> {
    if (!this.config.enableRemoteLogging || !this.config.remoteEndpoint) return;

    try {
      // In a real app, you would send this to your error reporting service
      // For now, we'll just simulate it
      console.log('Would send to remote logging service:', logEntry);
    } catch (error) {
      console.error('Failed to send error to remote logging service:', error);
    }
  }

  getLocalLogs(): ErrorLogEntry[] {
    return [...this.localLogs];
  }

  getLogsByContext(context: string): ErrorLogEntry[] {
    return this.localLogs.filter(log => log.context === context);
  }

  getLogsByLevel(level: 'error' | 'warning' | 'info'): ErrorLogEntry[] {
    return this.localLogs.filter(log => log.level === level);
  }

  getRecentLogs(count: number = 10): ErrorLogEntry[] {
    return this.localLogs.slice(-count);
  }

  clearLogs(): void {
    this.localLogs = [];
  }

  exportLogs(): string {
    return JSON.stringify({
      sessionId: this.sessionId,
      timestamp: Date.now(),
      logs: this.localLogs,
    }, null, 2);
  }

  getSessionId(): string {
    return this.sessionId;
  }

  updateConfig(newConfig: Partial<ErrorLoggerConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }
}

// Create a singleton instance
export const errorLogger = new ErrorLogger({
  enableConsoleLogging: __DEV__,
  enableRemoteLogging: false,
  maxLocalLogs: 50,
});

export default ErrorLogger;
