import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft } from 'phosphor-react-native';

interface SecondaryHeaderProps {
  title: string;
  rightIcon?: React.ReactNode;
  onRightPress?: () => void;
  onBackPress?: () => void;
  scrollY?: Animated.Value;
  scrollThreshold?: number;
}

export default function SecondaryHeader({ 
  title, 
  rightIcon, 
  onRightPress, 
  onBackPress,
  scrollY,
  scrollThreshold = 50
}: SecondaryHeaderProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  
  // Animation values
  const headerHeight = scrollY ? scrollY.interpolate({
    inputRange: [0, scrollThreshold],
    outputRange: [theme.layout.headerHeight, theme.layout.headerHeight * 0.7],
    extrapolate: 'clamp',
  }) : theme.layout.headerHeight;

  const titleFontSize = scrollY ? scrollY.interpolate({
    inputRange: [0, scrollThreshold],
    outputRange: [theme.typography.h4.fontSize, theme.typography.h4.fontSize * 0.9],
    extrapolate: 'clamp',
  }) : theme.typography.h4.fontSize;

  const styles = getStyles(theme);
  
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Animated.View style={[styles.header, { minHeight: headerHeight }]}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={onBackPress}
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          <ArrowLeft size={24} color={theme.colors.trustBlue} weight="light" />
        </TouchableOpacity>
        
        <Animated.Text style={[styles.title, { fontSize: titleFontSize }]} accessibilityRole="header">
          {title}
        </Animated.Text>
        
        {rightIcon && (
          <TouchableOpacity 
            style={styles.rightButton} 
            onPress={onRightPress}
            accessibilityRole="button"
          >
            {rightIcon}
          </TouchableOpacity>
        )}
      </Animated.View>
    </View>
  );
}

function getStyles(theme: any) {
  return StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background,
      zIndex: 1000,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.screenPadding,
      paddingVertical: theme.spacing.md,
      backgroundColor: theme.colors.background,
    },
    backButton: {
      width: theme.layout.minTouchTarget,
      height: theme.layout.minTouchTarget,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12, // 12px gap as specified
      borderRadius: theme.radius.lg,
    },
    title: {
      flex: 1,
      ...theme.typography.h4,
      color: theme.colors.text,
      textAlign: 'left',
    },
    rightButton: {
      width: theme.layout.minTouchTarget,
      height: theme.layout.minTouchTarget,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: theme.radius.lg,
      backgroundColor: theme.colors.surface,
    },
  });
}