import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { CheckCircle, XCircle, WarningCircle, Info, X } from 'phosphor-react-native';

export interface ToastData {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

interface SafeToastProps {
  toast: ToastData;
  onDismiss: (id: string) => void;
}

const { width: screenWidth } = Dimensions.get('window');

/**
 * Safe toast component with smooth animations
 * Provides user feedback without relying on external libraries
 */
export function SafeToast({ toast, onDismiss }: SafeToastProps) {
  const slideAnim = useRef(new Animated.Value(-100)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animate in
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

    // Auto dismiss after duration
    const timer = setTimeout(() => {
      dismissToast();
    }, toast.duration || 3000);

    return () => clearTimeout(timer);
  }, []);

  const dismissToast = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onDismiss(toast.id);
    });
  };

  const getToastStyle = () => {
    switch (toast.type) {
      case 'success':
        return styles.successToast;
      case 'error':
        return styles.errorToast;
      case 'warning':
        return styles.warningToast;
      case 'info':
      default:
        return styles.infoToast;
    }
  };

  const getIcon = () => {
    const iconColor = toast.type === 'success' ? '#10B981' : '#fff';
    const iconProps = { size: 24, color: iconColor, weight: 'medium' }; // Increased size to 24
    switch (toast.type) {
      case 'success':
        return <CheckCircle {...iconProps} />;
      case 'error':
        return <XCircle {...iconProps} />;
      case 'warning':
        return <WarningCircle {...iconProps} />;
      case 'info':
      default:
        return <Info {...iconProps} />;
    }
  };

  return (
    <Animated.View
      style={[
        styles.toastContainer,
        getToastStyle(),
        {
          transform: [{ translateY: slideAnim }],
          opacity: opacityAnim,
        },
      ]}
    >
      <TouchableOpacity
        style={styles.toastContent}
        onPress={dismissToast}
        activeOpacity={0.8}
      >
        <View style={styles.iconContainer}>
          {getIcon()}
        </View>
        <Text style={[styles.message, toast.type === 'success' && styles.successMessage]}>{toast.message}</Text>
        <TouchableOpacity
          style={[styles.dismissButton, toast.type === 'success' && styles.successDismissButton]}
          onPress={dismissToast}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <X size={16} color={toast.type === 'success' ? '#10B981' : '#fff'} weight="medium" />
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    top: 60,
    left: 16,
    right: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 1000,
  },
  toastContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    minHeight: 56,
  },
  iconContainer: {
    width: 24,
    height: 24,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  message: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#fff',
    lineHeight: 20,
  },
  dismissButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  successMessage: {
    color: '#10B981', // Green text for success toast
  },
  successDismissButton: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)', // Light green background for success dismiss button
  },
  successToast: {
    backgroundColor: '#FFFFFF', // White background for success
    borderWidth: 1,
    borderColor: '#10B981', // Green border
  },
  errorToast: {
    backgroundColor: '#EF4444', // Red-500
  },
  warningToast: {
    backgroundColor: '#F59E0B', // Amber-500
  },
  infoToast: {
    backgroundColor: '#3B82F6', // Blue-500
  },
});