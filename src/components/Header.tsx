import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { Colors, Spacing, Typography, Layout, Shadows } from '../theme';

interface HeaderProps {
  title: string;
  rightIcon?: React.ReactNode;
  onRightPress?: () => void;
  showBackButton?: boolean;
  onBackPress?: () => void;
}

export default function Header({ 
  title, 
  rightIcon, 
  onRightPress, 
  showBackButton = false,
  onBackPress 
}: HeaderProps) {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
      <View style={styles.header}>
        {showBackButton && (
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={onBackPress}
            accessibilityLabel="Go back"
            accessibilityRole="button"
          >
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>
        )}
        
        <Text style={styles.title} accessibilityRole="header">
          {title}
        </Text>
        
        {rightIcon && (
          <TouchableOpacity 
            style={styles.rightButton} 
            onPress={onRightPress}
            accessibilityRole="button"
          >
            {rightIcon}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    paddingTop: Spacing.statusBarHeight,
    zIndex: 1000,
  },
  header: {
    height: Layout.headerHeight,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.screenPadding,
    paddingVertical: Spacing.lg,
    backgroundColor: Colors.background,
  },
  backButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
    borderRadius: 16,
    backgroundColor: Colors.surfaceElevated,
  },
  backText: {
    fontSize: 24,
    color: Colors.trustBlue,
    fontWeight: '600',
  },
  title: {
    flex: 1,
    ...Typography.h4,
    color: Colors.text,
    textAlign: 'left',
    fontWeight: '600',
  },
  rightButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    backgroundColor: Colors.surfaceElevated,
  },
});
