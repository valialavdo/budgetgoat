import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, ScrollView, Dimensions } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from '../i18n';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { X } from 'phosphor-react-native';
import IconButton from './IconButton';
import ActionButton from './ActionButton';
import ActionRow from './ActionRow';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface BaseBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  // Header right icon (like delete/trash icon)
  headerRightIcon?: React.ReactNode;
  onHeaderRightPress?: () => void;
  // Action buttons at bottom
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
  showActionButtons = false,
  actionButtonText = 'Save',
  actionButtonDisabled = false,
  onActionButtonPress,
  cancelButtonText = 'Cancel',
  onCancelButtonPress
}: BaseBottomSheetProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const styles = getStyles(theme, insets);

  const handleCancel = () => {
    if (onCancelButtonPress) {
      onCancelButtonPress();
    } else {
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
      presentationStyle="overFullScreen"
    >
      <View style={styles.overlay}>
        <View style={styles.bottomSheet}>
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
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {children}
          </ScrollView>

          {/* Action Buttons */}
          {showActionButtons && (
            <View style={styles.actionButtons}>
              <ActionRow
                actions={[
                  {
                    title: cancelButtonText || t('common.cancel'),
                    onPress: handleCancel,
                    variant: 'ghost',
                  },
                  {
                    title: actionButtonText || t('common.save'),
                    onPress: onActionButtonPress || (() => {}),
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
    bottomSheet: {
      backgroundColor: theme.colors.background,
      borderTopLeftRadius: theme.radius.xl,
      borderTopRightRadius: theme.radius.xl,
      maxHeight: SCREEN_HEIGHT * 0.7, // 70% of screen height
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
      paddingHorizontal: theme.spacing.screenPadding,
      paddingVertical: theme.spacing.md,
      flexGrow: 1, // Allow content to grow but not exceed container
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
