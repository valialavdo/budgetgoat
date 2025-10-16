import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Dimensions } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { X, DotsThree } from 'phosphor-react-native';

const { height: screenHeight } = Dimensions.get('window');
const MAX_HEIGHT = screenHeight * 0.9;
const MIN_HEIGHT = screenHeight * 0.3;

interface BaseBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  headerRightIcon?: React.ReactNode;
  onHeaderRightPress?: () => void;
  height?: number;
  showDragHandle?: boolean;
  enablePanToClose?: boolean;
  backgroundColor?: string;
}

export default function BaseBottomSheet({
  visible,
  onClose,
  title,
  children,
  headerRightIcon,
  onHeaderRightPress,
  height = MAX_HEIGHT,
  showDragHandle = true,
  enablePanToClose = true,
  backgroundColor,
}: BaseBottomSheetProps) {
  const theme = useTheme();
  const styles = getStyles(theme);

  const handleOverlayPress = () => {
    if (enablePanToClose) {
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.overlayTouchable}
          activeOpacity={1}
          onPress={handleOverlayPress}
        />
        
        <View style={[styles.container, { height, backgroundColor }]}>
          <View style={styles.content}>
            {/* Drag Handle */}
            {showDragHandle && (
              <View style={styles.dragHandle}>
                <DotsThree size={24} color={theme.colors.textMuted} weight="regular" />
              </View>
            )}
            
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.headerLeft}>
                <Text style={styles.title}>{title}</Text>
              </View>
              
              <View style={styles.headerRight}>
                {headerRightIcon && (
                  <TouchableOpacity
                    onPress={onHeaderRightPress}
                    style={styles.headerButton}
                    activeOpacity={0.7}
                  >
                    {headerRightIcon}
                  </TouchableOpacity>
                )}
                
                <TouchableOpacity
                  onPress={onClose}
                  style={styles.closeButton}
                  activeOpacity={0.7}
                >
                  <X size={24} color={theme.colors.textMuted} weight="regular" />
                </TouchableOpacity>
              </View>
            </View>
            
            {/* Content */}
            <View style={styles.body}>
              {children}
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

function getStyles(theme: any) {
  return StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'flex-end',
    },
    overlayTouchable: {
      flex: 1,
    },
    container: {
      backgroundColor: theme.colors.background,
      borderTopLeftRadius: theme.radius.xl,
      borderTopRightRadius: theme.radius.xl,
      maxHeight: MAX_HEIGHT,
      minHeight: MIN_HEIGHT,
    },
    content: {
      flex: 1,
    },
    dragHandle: {
      alignItems: 'center',
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.screenPadding, // 20px - ENFORCED
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: theme.spacing.screenPadding, // 20px - ENFORCED
      paddingVertical: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.borderLight,
    },
    headerLeft: {
      flex: 1,
    },
    headerRight: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
    },
    title: {
      ...theme.typography.h4,
      color: theme.colors.text,
      fontWeight: '600',
    },
    headerButton: {
      padding: theme.spacing.xs,
    },
    closeButton: {
      padding: theme.spacing.xs,
    },
    body: {
      flex: 1,
      paddingHorizontal: theme.spacing.screenPadding, // 20px - ENFORCED
      paddingVertical: theme.spacing.md,
    },
  });
}
