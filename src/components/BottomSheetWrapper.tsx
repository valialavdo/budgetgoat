import React, { useCallback, useMemo, useRef, useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Dimensions,
  Animated,
} from 'react-native';
import { X } from 'phosphor-react-native';
import BottomSheet, { BottomSheetScrollView, BottomSheetView } from '@gorhom/bottom-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { useNavigationContext } from '../context/NavigationContext';
import MicroInteractionWrapper from './MicroInteractionWrapper';

export interface BottomSheetWrapperProps {
  /**
   * Whether the bottom sheet is visible
   */
  visible: boolean;
  
  /**
   * Callback when the bottom sheet should be closed
   */
  onClose: () => void;
  
  /**
   * Title to display in the bottom sheet header
   * Can be dynamic - updates will be reflected in real-time
   */
  title?: string;
  
  /**
   * Content to display in the bottom sheet body
   */
  children: React.ReactNode;
  
  /**
   * Snap points for the bottom sheet (percentage of screen height)
   * @default ['60%', '90%']
   */
  snapPoints?: string[];
  
  /**
   * Whether to show the close button in header
   * @default true
   */
  showCloseButton?: boolean;
  
  /**
   * Whether content should be scrollable
   * @default true
   */
  scrollable?: boolean;
  
  /**
   * Custom styles for the container
   */
  style?: any;
  
  /**
   * Whether to show the drag handle
   * @default true
   */
  showHandle?: boolean;
  
  /**
   * Enable backdrop dismissal
   * @default true
   */
  enableBackdropDismiss?: boolean;
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

/**
 * Enhanced BottomSheetWrapper component using @gorhom/bottom-sheet
 * 
 * Features:
 * - Dynamic snap points based on content
 * - Smooth gestures and animations
 * - Dynamic title updates in real-time
 * - Standardized close button with haptic feedback
 * - Safe area integration
 * - Internal scrolling for long content
 * - Full accessibility compliance (WCAG AA)
 * - Dark mode support
 * - Microinteractions
 * 
 * Usage:
 * ```tsx
 * <BottomSheetWrapper
 *   visible={isVisible}
 *   onClose={handleClose}
 *   title="Create Pocket" // Can be dynamic
 *   snapPoints={['60%', '90%']}
 *   scrollable={true}
 * >
 *   <PocketForm />
 * </BottomSheetWrapper>
 * ```
 */
export default function BottomSheetWrapper({
  visible,
  onClose,
  title,
  children,
  snapPoints = ['auto', '70%'],
  showCloseButton = true,
  scrollable = true,
  style,
  showHandle = true,
  enableBackdropDismiss = true,
}: BottomSheetWrapperProps) {
  const theme = useTheme();
  const { setHideTabBar } = useNavigationContext();
  const insets = useSafeAreaInsets();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [isOpen, setIsOpen] = useState(false);

  // Hide tab bar when bottom sheet is visible
  useEffect(() => {
    setHideTabBar(visible);
    
    // Cleanup: show tab bar when component unmounts
    return () => {
      setHideTabBar(false);
    };
  }, [visible, setHideTabBar]);

  // Handle bottom sheet visibility
  useEffect(() => {
    if (visible) {
      bottomSheetRef.current?.snapToIndex(0);
      setIsOpen(true);
    } else {
      bottomSheetRef.current?.close();
      setIsOpen(false);
    }
  }, [visible]);

  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) {
      setIsOpen(false);
      onClose();
    }
  }, [onClose]);

  const handleClose = useCallback(() => {
    bottomSheetRef.current?.close();
  }, []);

  const renderHeader = useCallback(() => {
    if (!title) return null;

    return (
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
        </View>
        
        {showCloseButton && (
          <MicroInteractionWrapper
            style={styles.closeButton}
            onPress={handleClose}
            hapticType="light"
            animationType="scale"
            pressScale={0.9}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Close bottom sheet"
            accessibilityHint="Closes the bottom sheet"
          >
            <X 
              weight="light" 
              size={24} 
              color={theme.colors.text} 
            />
          </MicroInteractionWrapper>
        )}
      </View>
    );
  }, [title, showCloseButton, handleClose, theme.colors.text]);

  const renderContent = useCallback(() => {
    const content = (
      <View style={[styles.content, { paddingBottom: insets.bottom }]}>
        {children}
      </View>
    );

    if (scrollable) {
      return (
        <BottomSheetScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {content}
        </BottomSheetScrollView>
      );
    }

    return (
      <BottomSheetView style={styles.viewContent}>
        {content}
      </BottomSheetView>
    );
  }, [children, scrollable, insets.bottom]);

  const styles = getStyles(theme, insets);

  if (!visible && !isOpen) return null;

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={visible ? 0 : -1}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      enablePanDownToClose={enableBackdropDismiss}
      handleIndicatorStyle={showHandle ? styles.handleIndicator : { display: 'none' }}
      backgroundStyle={styles.background}
      style={style}
      accessible={true}
      accessibilityRole="none"
      accessibilityLabel={title || "Bottom sheet content"}
    >
      {renderHeader()}
      {renderContent()}
    </BottomSheet>
  );
}

function getStyles(theme: any, insets: any) {
  return StyleSheet.create({
    background: {
      backgroundColor: theme.colors.background,
      borderTopLeftRadius: theme.radius.xl,
      borderTopRightRadius: theme.radius.xl,
      ...theme.shadows.large,
    },
    handleIndicator: {
      backgroundColor: theme.colors.border,
      width: 40,
      height: 4,
      borderRadius: 2,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: theme.spacing.screenPadding,
      paddingVertical: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
      minHeight: 56, // Ensure consistent header height
    },
    titleContainer: {
      flex: 1,
      marginRight: theme.spacing.md,
    },
    title: {
      ...theme.typography.h4,
      color: theme.colors.text,
      fontWeight: '600',
      textAlign: 'center',
    },
    closeButton: {
      width: 40,
      height: 40,
      borderRadius: theme.radius.round,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.surface,
      ...theme.shadows.small,
    },
    content: {
      paddingHorizontal: theme.spacing.screenPadding,
      paddingTop: theme.spacing.md,
    },
    scrollContent: {
      flexGrow: 1,
    },
    viewContent: {
      flex: 1,
    },
  });
}
