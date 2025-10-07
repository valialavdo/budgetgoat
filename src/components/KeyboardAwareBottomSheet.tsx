import React, { useCallback, useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from '../i18n';
import { X } from 'phosphor-react-native';
import IconButton from './IconButton';
import ActionRow from './ActionRow';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface KeyboardAwareBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  // Header right icon (like delete/trash icon)
  headerRightIcon?: React.ReactNode;
  onHeaderRightPress?: () => void;
  // Action buttons at bottom - new pattern
  actionButtons?: Array<{
    title: string;
    variant?: 'primary' | 'secondary' | 'ghost';
    onPress: () => void;
    disabled?: boolean;
  }>;
  // Legacy action buttons pattern (deprecated)
  showActionButtons?: boolean;
  actionButtonText?: string;
  actionButtonDisabled?: boolean;
  onActionButtonPress?: () => void;
  cancelButtonText?: string;
  onCancelButtonPress?: () => void;
}

/**
 * Enhanced KeyboardAwareBottomSheet with robust cross-platform keyboard handling
 * 
 * Features:
 * - 32px minimum offset above keyboard for all inputs
 * - Platform-specific keyboard behavior optimization
 * - Dynamic height adjustment based on keyboard state
 * - Smooth animations and transitions
 * - Accessibility compliance (WCAG AA)
 * - Dark mode support
 * - Safe area integration
 * 
 * Platform-specific handling:
 * - iOS: Uses 'padding' behavior with automatic insets
 * - Android: Uses 'height' behavior with manual offset calculation
 */
export default function KeyboardAwareBottomSheet({
  visible,
  onClose,
  title,
  children,
  headerRightIcon,
  onHeaderRightPress,
  actionButtons,
  // Legacy props
  showActionButtons = false,
  actionButtonText = 'Save',
  actionButtonDisabled = false,
  onActionButtonPress,
  cancelButtonText = 'Cancel',
  onCancelButtonPress
}: KeyboardAwareBottomSheetProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const styles = getStyles(theme, insets);
  
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  // Keyboard event listeners
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (event) => {
        setKeyboardHeight(event.endCoordinates.height);
        setIsKeyboardVisible(true);
        
        // Scroll to show active input with proper offset
        setTimeout(() => {
          // Scroll to end to ensure the focused input is visible
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }, Platform.OS === 'ios' ? 300 : 150);
      }
    );

    const keyboardDidHideListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        setKeyboardHeight(0);
        setIsKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const handleCancel = () => {
    if (onCancelButtonPress) {
      onCancelButtonPress();
    } else {
      onClose();
    }
  };


  // Calculate dynamic bottom sheet height based on keyboard state
  const getBottomSheetHeight = () => {
    if (isKeyboardVisible) {
      // Reserve 32px above keyboard + safe area
      const availableHeight = SCREEN_HEIGHT - keyboardHeight - 32 - insets.bottom;
      return Math.max(availableHeight, 300); // Minimum 300px height
    }
    return SCREEN_HEIGHT * 0.9; // 90% of screen height when keyboard is hidden
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
      presentationStyle="overFullScreen"
      statusBarTranslucent={false}
    >
      <View style={styles.overlay}>
        <KeyboardAvoidingView 
          style={styles.keyboardAvoidingView}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
          <View style={[
            styles.bottomSheet,
            { 
              height: getBottomSheetHeight(),
              paddingBottom: insets.bottom, // Add safe area bottom padding
            }
          ]}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.headerTitle}>{title}</Text>
              <View style={styles.headerRight}>
                {headerRightIcon && onHeaderRightPress && (
                  <IconButton
                    icon={headerRightIcon}
                    onPress={onHeaderRightPress}
                    variant="ghost"
                    size="small"
                    accessibilityLabel="Action"
                  />
                )}
                <IconButton
                  icon={<X size={24} color={theme.colors.text} weight="light" />}
                  onPress={onClose}
                  variant="ghost"
                  size="small"
                  accessibilityLabel="Close"
                />
              </View>
            </View>

            {/* Content */}
            <ScrollView 
              ref={scrollViewRef}
              style={styles.content} 
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={[
                styles.scrollContent,
                isKeyboardVisible && styles.scrollContentWithKeyboard
              ]}
              automaticallyAdjustKeyboardInsets={false}
              keyboardDismissMode="interactive"
              nestedScrollEnabled={true}
              scrollEventThrottle={16}
            >
              {children}
            </ScrollView>

            {/* Action Buttons */}
            {(actionButtons || showActionButtons) && (
              <View style={[
                styles.actionButtons,
                isKeyboardVisible && styles.actionButtonsWithKeyboard
              ]}>
                <ActionRow
                  actions={actionButtons || [
                    {
                      title: cancelButtonText || t('common.cancel'),
                      onPress: handleCancel,
                      variant: 'ghost',
                    },
                    {
                      title: actionButtonText || t('common.save'),
                      onPress: onActionButtonPress || onClose,
                      variant: 'primary',
                      disabled: actionButtonDisabled,
                    },
                  ]}
                  direction="horizontal"
                  fullWidth
                />
              </View>
            )}
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

function getStyles(theme: any, insets: any) {
  return StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'flex-end',
    },
    keyboardAvoidingView: {
      flex: 1,
      justifyContent: 'flex-end',
    },
    bottomSheet: {
      backgroundColor: theme.colors.background,
      borderTopLeftRadius: theme.radius.xl,
      borderTopRightRadius: theme.radius.xl,
      minHeight: 200,
      // Height is set dynamically in component
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: theme.spacing.screenPadding,
      paddingVertical: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.borderLight,
    },
    headerTitle: {
      ...theme.typography.h4,
      color: theme.colors.text,
      fontWeight: '600',
    },
    headerRight: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xs,
    },
    content: {
      flexGrow: 1,
    },
    scrollContent: {
      flexGrow: 1,
      paddingHorizontal: theme.spacing.screenPadding,
      paddingVertical: theme.spacing.md,
      paddingBottom: theme.spacing.lg, // Remove double safe area padding
    },
    scrollContentWithKeyboard: {
      paddingBottom: theme.spacing.xl + 60, // Extra padding when keyboard is visible (60px for keyboard offset)
    },
    actionButtons: {
      paddingHorizontal: theme.spacing.screenPadding,
      paddingVertical: theme.spacing.md,
      paddingBottom: theme.spacing.md, // Remove double safe area padding since it's now on container
      borderTopWidth: 1,
      borderTopColor: theme.colors.borderLight,
      backgroundColor: theme.colors.background,
    },
    actionButtonsWithKeyboard: {
      paddingBottom: theme.spacing.md, // Keep consistent padding
    },
  });
}
