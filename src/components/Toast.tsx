import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity, Dimensions } from 'react-native';
import { X, Check, XCircle, Info, Warning } from 'phosphor-react-native';
import { useTheme } from '../context/ThemeContext';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
  type: ToastType;
  title: string;
  message: string;
  visible: boolean;
  onClose: () => void;
  duration?: number;
}

const { width: screenWidth } = Dimensions.get('window');

export default function Toast({
  type,
  title,
  message,
  visible,
  onClose,
  duration = 4000
}: ToastProps) {
  const theme = useTheme();
  const styles = getStyles(theme);
  const slideAnim = useRef(new Animated.Value(-100)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Show animation
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto hide after duration
      const timer = setTimeout(() => {
        hideToast();
      }, duration);

      return () => clearTimeout(timer);
    } else {
      hideToast();
    }
  }, [visible, duration]);

  const hideToast = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose();
    });
  };

  const getToastConfig = () => {
    switch (type) {
      case 'success':
        return {
          icon: <Check size={16} color="#FFFFFF" weight="bold" />,
          borderColor: '#10B981', // Success green
          backgroundColor: '#10B981',
        };
      case 'error':
        return {
          icon: <XCircle size={16} color="#FFFFFF" weight="bold" />,
          borderColor: '#EF4444', // Error red
          backgroundColor: '#EF4444',
        };
      case 'info':
        return {
          icon: <Info size={16} color="#FFFFFF" weight="bold" />,
          borderColor: '#3B82F6', // Info blue
          backgroundColor: '#3B82F6',
        };
      case 'warning':
        return {
          icon: <Warning size={16} color="#FFFFFF" weight="bold" />,
          borderColor: '#F59E0B', // Warning orange
          backgroundColor: '#F59E0B',
        };
      default:
        return {
          icon: <Info size={16} color="#FFFFFF" weight="bold" />,
          borderColor: '#3B82F6',
          backgroundColor: '#3B82F6',
        };
    }
  };

  const toastConfig = getToastConfig();

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.toast,
        {
          transform: [{ translateY: slideAnim }],
          opacity: opacityAnim,
          borderLeftColor: toastConfig.borderColor,
        }
      ]}
    >
      <View style={styles.toastContent}>
        <View style={[styles.iconContainer, { backgroundColor: toastConfig.backgroundColor }]}>
          {toastConfig.icon}
        </View>
        
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
        </View>
        
        <TouchableOpacity
          style={styles.closeButton}
          onPress={hideToast}
          accessible={true}
          accessibilityLabel="Close notification"
          accessibilityRole="button"
        >
          <X size={16} color={theme.colors.textLight} weight="light" />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

function getStyles(theme: any) {
  return StyleSheet.create({
    toast: {
      position: 'absolute',
      top: 60, // Safe area from status bar
      left: theme.spacing.screenPadding,
      right: theme.spacing.screenPadding,
      backgroundColor: '#FFFFFF', // Clean white background
      borderRadius: 8, // Slightly rounded corners
      borderLeftWidth: 4,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
      zIndex: 1000,
    },
    toastContent: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 16,
      paddingHorizontal: 16,
    },
    iconContainer: {
      width: 24,
      height: 24,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    textContainer: {
      flex: 1,
    },
    title: {
      fontSize: 14,
      fontWeight: '700', // Bold title
      color: theme.colors.text, // Use theme text color
      marginBottom: 2,
      lineHeight: 18,
    },
    message: {
      fontSize: 13,
      fontWeight: '400',
      color: theme.colors.textMuted, // Use theme muted text color
      lineHeight: 16,
    },
    closeButton: {
      width: 20,
      height: 20,
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: 8,
    },
  });
}
