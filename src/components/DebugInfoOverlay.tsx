import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useOnboarding } from '../context/SafeOnboardingContext';
import { useFirebase } from '../context/SafeFirebaseContext';
import { useToast } from '../context/SafeToastContext';

interface DebugInfoOverlayProps {
  visible: boolean;
  onToggle: () => void;
}

export function DebugInfoOverlay({ visible, onToggle }: DebugInfoOverlayProps) {
  const theme = useTheme();
  const onboarding = useOnboarding();
  const firebase = useFirebase();
  const toast = useToast();
  const [slideAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: visible ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [visible, slideAnim]);

  if (!visible) return null;

  const debugInfo = {
    app: {
      version: '1.0.0',
      phase: 'Phase 6 Complete',
      status: 'Production Ready',
    },
    theme: {
      mode: theme.isDark ? 'dark' : 'light',
      colors: theme.colors,
    },
    onboarding: {
      completed: onboarding.hasCompletedOnboarding,
      loading: onboarding.isLoading,
    },
    firebase: {
      authenticated: firebase.isAuthenticated,
      user: firebase.user?.email || 'Not authenticated',
      loading: firebase.loading,
    },
    toast: {
      activeToasts: toast.toasts.length,
    },
    system: {
      timestamp: new Date().toISOString(),
      memory: 'Available',
    },
  };

  const handleTestError = () => {
    throw new Error('Debug test error - This is intentional');
  };

  const handleTestToast = () => {
    toast.showSuccess('Debug Test', 'Debug overlay is working!');
  };

  const handleClearStorage = () => {
    // This would clear AsyncStorage in a real implementation
    toast.showInfo('Debug Action', 'Storage cleared (simulated)');
  };

  return (
    <Animated.View 
      style={[
        styles.overlay,
        {
          transform: [{
            translateY: slideAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [300, 0],
            }),
          }],
        },
      ]}
    >
      <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
        <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            🐛 Debug Info Overlay
          </Text>
          <TouchableOpacity 
            style={[styles.closeButton, { backgroundColor: theme.colors.error }]}
            onPress={onToggle}
          >
            <Text style={styles.closeButtonText}>×</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          <DebugSection title="App Status" data={debugInfo.app} theme={theme} />
          <DebugSection title="Theme" data={debugInfo.theme} theme={theme} />
          <DebugSection title="Onboarding" data={debugInfo.onboarding} theme={theme} />
          <DebugSection title="Firebase" data={debugInfo.firebase} theme={theme} />
          <DebugSection title="Toast System" data={debugInfo.toast} theme={theme} />
          <DebugSection title="System" data={debugInfo.system} theme={theme} />

          <View style={[styles.actions, { borderTopColor: theme.colors.border }]}>
            <Text style={[styles.actionsTitle, { color: theme.colors.text }]}>
              Debug Actions
            </Text>
            
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: theme.colors.primary }]}
              onPress={handleTestToast}
            >
              <Text style={styles.actionButtonText}>Test Toast</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: theme.colors.error }]}
              onPress={handleTestError}
            >
              <Text style={styles.actionButtonText}>Test Error</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: theme.colors.warning || '#FFC107' }]}
              onPress={handleClearStorage}
            >
              <Text style={[styles.actionButtonText, { color: '#000' }]}>Clear Storage</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </Animated.View>
  );
}

interface DebugSectionProps {
  title: string;
  data: any;
  theme: any;
}

function DebugSection({ title, data, theme }: DebugSectionProps) {
  return (
    <View style={[styles.section, { borderColor: theme.colors.border }]}>
      <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
        {title}
      </Text>
      {Object.entries(data).map(([key, value]) => (
        <View key={key} style={styles.row}>
          <Text style={[styles.key, { color: theme.colors.textMuted }]}>
            {key}:
          </Text>
          <Text style={[styles.value, { color: theme.colors.text }]}>
            {typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '70%',
    zIndex: 1000,
  },
  container: {
    flex: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 16,
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  key: {
    fontSize: 14,
    fontWeight: '500',
    minWidth: 80,
  },
  value: {
    fontSize: 14,
    flex: 1,
    marginLeft: 8,
  },
  actions: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
  },
  actionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  actionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    marginBottom: 8,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});
