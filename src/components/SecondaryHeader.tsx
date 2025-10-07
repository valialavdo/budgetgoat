import React, { useState, useEffect } from 'react';
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
  scrollThreshold = 20
}: SecondaryHeaderProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const styles = getStyles(theme);
  
  // Animation for header scaling based on scroll - matching Header component
  const [headerScaleAnim] = useState(new Animated.Value(1));
  
  useEffect(() => {
    if (scrollY) {
      const listener = scrollY.addListener(({ value }) => {
        const scrollProgress = Math.min(value / scrollThreshold, 1);
        const scale = 1 - (scrollProgress * 0.3); // Scale from 1.0 to 0.7
        
        // Immediate response for scrolling down, smooth spring for scrolling back up
        if (value <= 5) {
          // When near top, use spring animation for smooth return
          Animated.spring(headerScaleAnim, {
            toValue: scale,
            useNativeDriver: false,
            tension: 100,
            friction: 8,
          }).start();
        } else {
          // Immediate response for scrolling
          headerScaleAnim.setValue(scale);
        }
      });
      
      return () => {
        scrollY.removeListener(listener);
      };
    }
  }, [scrollY, scrollThreshold, headerScaleAnim]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Animated.View style={[
        styles.header,
        {
          minHeight: headerScaleAnim.interpolate({
            inputRange: [0.7, 1],
            outputRange: [theme.layout.headerHeight * 0.7, theme.layout.headerHeight],
          }),
          paddingVertical: headerScaleAnim.interpolate({
            inputRange: [0.7, 1],
            outputRange: [theme.spacing.sm, theme.spacing.md],
          }),
        }
      ]}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={onBackPress}
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          <ArrowLeft size={24} color={theme.colors.trustBlue} weight="light" />
        </TouchableOpacity>
        
        <Animated.Text 
          style={[
            styles.title,
            {
              fontSize: headerScaleAnim.interpolate({
                inputRange: [0.7, 1],
                outputRange: [theme.typography.h4.fontSize * 0.85, theme.typography.h4.fontSize],
              }),
            }
          ]} 
          accessibilityRole="header"
        >
          {title}
        </Animated.Text>
        
        <View style={styles.rightButton}>
          {rightIcon && (
            <TouchableOpacity 
              style={styles.rightButtonContent} 
              onPress={onRightPress}
              accessibilityRole="button"
            >
              {rightIcon}
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>
    </View>
  );
}

function getStyles(theme: any) {
  return StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background,
      marginBottom: theme.spacing.md,
      zIndex: 1000,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.screenPadding,
      backgroundColor: theme.colors.background,
    },
    backButton: {
      width: 44,
      height: 44,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: theme.spacing.sm,
      borderRadius: 22,
      backgroundColor: theme.colors.surface,
    },
    title: {
      flex: 1,
      ...theme.typography.h4,
      color: theme.colors.text,
      textAlign: 'left',
      fontWeight: '600',
    },
    rightButton: {
      width: 44,
      height: 44,
      justifyContent: 'center',
      alignItems: 'center',
    },
    rightButtonContent: {
      width: 44,
      height: 44,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 22,
      backgroundColor: theme.colors.surface,
    },
  });
}