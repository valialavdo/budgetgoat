/**
 * Analytics Service
 * Provides tracking for user actions and navigation events
 */

export interface AnalyticsEvent {
  event: string;
  properties?: Record<string, any>;
  timestamp?: number;
}

class AnalyticsService {
  private events: AnalyticsEvent[] = [];
  private isEnabled = true;

  /**
   * Track a user action or event
   */
  track(event: string, properties?: Record<string, any>) {
    if (!this.isEnabled) return;

    const analyticsEvent: AnalyticsEvent = {
      event,
      properties: {
        ...properties,
        timestamp: Date.now(),
        platform: 'mobile',
      },
      timestamp: Date.now(),
    };

    this.events.push(analyticsEvent);
    
    // Log to console for development
    console.log('Analytics Event:', analyticsEvent);
    
    // TODO: Send to analytics service (Firebase Analytics, Mixpanel, etc.)
    this.sendToService(analyticsEvent);
  }

  /**
   * Track navigation events
   */
  trackNavigation(from: string, to: string, method?: string) {
    this.track('navigation', {
      from,
      to,
      method: method || 'tap',
    });
  }

  /**
   * Track button clicks
   */
  trackButtonClick(buttonName: string, screen: string, properties?: Record<string, any>) {
    this.track('button_click', {
      button_name: buttonName,
      screen,
      ...properties,
    });
  }

  /**
   * Track screen views
   */
  trackScreenView(screenName: string, properties?: Record<string, any>) {
    this.track('screen_view', {
      screen_name: screenName,
      ...properties,
    });
  }

  /**
   * Track form interactions
   */
  trackFormInteraction(formName: string, action: string, properties?: Record<string, any>) {
    this.track('form_interaction', {
      form_name: formName,
      action, // 'submit', 'cancel', 'field_change', etc.
      ...properties,
    });
  }

  /**
   * Track bottom sheet interactions
   */
  trackBottomSheetInteraction(sheetName: string, action: string, properties?: Record<string, any>) {
    this.track('bottom_sheet_interaction', {
      sheet_name: sheetName,
      action, // 'open', 'close', 'save', 'cancel', etc.
      ...properties,
    });
  }

  /**
   * Track quick action usage
   */
  trackQuickAction(actionName: string, properties?: Record<string, any>) {
    this.track('quick_action', {
      action_name: actionName,
      ...properties,
    });
  }

  /**
   * Track AI insight interactions
   */
  trackAIInsightInteraction(insightId: string, action: string, properties?: Record<string, any>) {
    this.track('ai_insight_interaction', {
      insight_id: insightId,
      action, // 'view', 'dismiss', 'press', etc.
      ...properties,
    });
  }

  /**
   * Send event to analytics service
   */
  private sendToService(event: AnalyticsEvent) {
    // TODO: Implement actual analytics service integration
    // Examples:
    // - Firebase Analytics: firebase.analytics().logEvent(event.event, event.properties);
    // - Mixpanel: mixpanel.track(event.event, event.properties);
    // - Custom API endpoint
    
    // For now, we'll just store locally
    this.storeLocally(event);
  }

  /**
   * Store events locally for debugging
   */
  private storeLocally(event: AnalyticsEvent) {
    // Keep only last 100 events to prevent memory issues
    if (this.events.length > 100) {
      this.events = this.events.slice(-100);
    }
  }

  /**
   * Get all tracked events (for debugging)
   */
  getEvents(): AnalyticsEvent[] {
    return [...this.events];
  }

  /**
   * Clear all events
   */
  clearEvents() {
    this.events = [];
  }

  /**
   * Enable/disable analytics
   */
  setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
  }

  /**
   * Check if analytics is enabled
   */
  isAnalyticsEnabled(): boolean {
    return this.isEnabled;
  }
}

// Export singleton instance
export const analytics = new AnalyticsService();

// Export convenience functions
export const trackEvent = (event: string, properties?: Record<string, any>) => 
  analytics.track(event, properties);

export const trackNavigation = (from: string, to: string, method?: string) => 
  analytics.trackNavigation(from, to, method);

export const trackButtonClick = (buttonName: string, screen: string, properties?: Record<string, any>) => 
  analytics.trackButtonClick(buttonName, screen, properties);

export const trackScreenView = (screenName: string, properties?: Record<string, any>) => 
  analytics.trackScreenView(screenName, properties);

export const trackFormInteraction = (formName: string, action: string, properties?: Record<string, any>) => 
  analytics.trackFormInteraction(formName, action, properties);

export const trackBottomSheetInteraction = (sheetName: string, action: string, properties?: Record<string, any>) => 
  analytics.trackBottomSheetInteraction(sheetName, action, properties);

export const trackQuickAction = (actionName: string, properties?: Record<string, any>) => 
  analytics.trackQuickAction(actionName, properties);

export const trackAIInsightInteraction = (insightId: string, action: string, properties?: Record<string, any>) => 
  analytics.trackAIInsightInteraction(insightId, action, properties);

export default analytics;
