import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, ScrollView, Dimensions, KeyboardAvoidingView, Platform } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from '../i18n';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { X } from 'phosphor-react-native';
import IconButton from './IconButton';
import ActionButton from './ActionButton';
import ActionRow from './ActionRow';
import KeyboardAwareBottomSheet from './KeyboardAwareBottomSheet';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface BaseBottomSheetProps {
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

export default function BaseBottomSheet({
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
}: BaseBottomSheetProps) {
  // Delegate to KeyboardAwareBottomSheet for enhanced keyboard handling
  return (
    <KeyboardAwareBottomSheet
      visible={visible}
      onClose={onClose}
      title={title}
      headerRightIcon={headerRightIcon}
      onHeaderRightPress={onHeaderRightPress}
      actionButtons={actionButtons}
      showActionButtons={showActionButtons}
      actionButtonText={actionButtonText}
      actionButtonDisabled={actionButtonDisabled}
      onActionButtonPress={onActionButtonPress}
      cancelButtonText={cancelButtonText}
      onCancelButtonPress={onCancelButtonPress}
    >
      {children}
    </KeyboardAwareBottomSheet>
  );
}

function getStyles(theme: any, insets: any) {
  return StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'flex-end',
    },
    bottomSheet: {
      backgroundColor: theme.colors.background,
      borderTopLeftRadius: theme.radius.xl,
      borderTopRightRadius: theme.radius.xl,
      maxHeight: SCREEN_HEIGHT * 0.9, // 90% of screen height
      minHeight: 200, // Ensure minimum height
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
      flexGrow: 1, // Allow content to grow but not exceed container
    },
    scrollContent: {
      flexGrow: 1,
      paddingHorizontal: theme.spacing.screenPadding, // 20px padding
      paddingVertical: theme.spacing.md,
      paddingBottom: Math.max(insets.bottom + 100, theme.spacing.xl), // Extra padding for keyboard and safe area
    },
    actionButtons: {
      paddingHorizontal: theme.spacing.screenPadding,
      paddingVertical: theme.spacing.md,
      paddingBottom: Math.max(insets.bottom, theme.spacing.md), // Safe bottom padding
      borderTopWidth: 1,
      borderTopColor: theme.colors.borderLight,
      backgroundColor: theme.colors.background,
    },
  });
}
