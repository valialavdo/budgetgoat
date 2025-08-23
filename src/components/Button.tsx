import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Colors, Spacing, Radius, Typography, Layout } from '../theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
}

export default function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  icon,
  style,
  textStyle,
  fullWidth = false,
}: ButtonProps) {
  const buttonStyle = [
    styles.base,
    styles[variant],
    styles[size],
    fullWidth && styles.fullWidth,
    disabled && styles.disabled,
    style,
  ];

  const buttonTextStyle = [
    styles.text,
    styles[`${variant}Text`],
    styles[`${size}Text`],
    disabled && styles.disabledText,
    textStyle,
  ];

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel={title}
    >
      {icon && <>{icon}</>}
      <Text style={buttonTextStyle}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.md,
    minHeight: Layout.minTapArea,
  },
  
  // Variants
  primary: {
    backgroundColor: Colors.goatGreen,
  },
  secondary: {
    backgroundColor: Colors.trustBlue,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  
  // Sizes
  small: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    minHeight: 36,
  },
  medium: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    minHeight: 44,
  },
  large: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    minHeight: 52,
  },
  
  // States
  disabled: {
    opacity: 0.5,
  },
  fullWidth: {
    width: '100%',
  },
  
  // Text styles
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },
  primaryText: {
    color: Colors.background,
  },
  secondaryText: {
    color: Colors.background,
  },
  outlineText: {
    color: Colors.text,
  },
  ghostText: {
    color: Colors.text,
  },
  
  smallText: {
    ...Typography.caption,
  },
  mediumText: {
    ...Typography.bodyMedium,
  },
  largeText: {
    ...Typography.h4,
  },
  
  disabledText: {
    color: Colors.textMuted,
  },
});
