import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useTheme } from '../context/ThemeContext';

interface UnifiedButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  style?: any;
}

export default function UnifiedButton({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  fullWidth = false,
  icon,
  iconPosition = 'left',
  style,
}: UnifiedButtonProps) {
  const theme = useTheme();
  const styles = getStyles(theme);

  const getButtonStyle = () => {
    const baseStyle: any[] = [styles.button, styles[`button${size.charAt(0).toUpperCase() + size.slice(1)}` as keyof typeof styles]];
    
    if (fullWidth) {
      baseStyle.push(styles.buttonFullWidth);
    }
    
    if (disabled || loading) {
      baseStyle.push(styles.buttonDisabled);
    } else {
      baseStyle.push(styles[`button${variant.charAt(0).toUpperCase() + variant.slice(1)}` as keyof typeof styles]);
    }
    
    if (style) {
      baseStyle.push(style);
    }
    
    return baseStyle;
  };

  const getTextStyle = () => {
    const baseStyle: any[] = [styles.text, styles[`text${size.charAt(0).toUpperCase() + size.slice(1)}` as keyof typeof styles]];
    
    if (disabled || loading) {
      baseStyle.push(styles.textDisabled);
    } else {
      baseStyle.push(styles[`text${variant.charAt(0).toUpperCase() + variant.slice(1)}` as keyof typeof styles]);
    }
    
    return baseStyle;
  };

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.content}>
          <ActivityIndicator 
            size="small" 
            color={variant === 'primary' ? theme.colors.background : theme.colors.trustBlue} 
          />
          <Text style={[getTextStyle(), { marginLeft: theme.spacing.sm }]}>
            Loading...
          </Text>
        </View>
      );
    }

    if (icon) {
      return (
        <View style={styles.content}>
          {iconPosition === 'left' && (
            <View style={styles.iconLeft}>
              {icon}
            </View>
          )}
          <Text style={getTextStyle()}>{title}</Text>
          {iconPosition === 'right' && (
            <View style={styles.iconRight}>
              {icon}
            </View>
          )}
        </View>
      );
    }

    return <Text style={getTextStyle()}>{title}</Text>;
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {renderContent()}
    </TouchableOpacity>
  );
}

function getStyles(theme: any) {
  return StyleSheet.create({
    button: {
      borderRadius: theme.radius.lg,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      minHeight: 48,
    },
    
    // Sizes
    buttonSmall: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      minHeight: 40,
    },
    buttonMedium: {
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      minHeight: 48,
    },
    buttonLarge: {
      paddingHorizontal: theme.spacing.xl,
      paddingVertical: theme.spacing.lg,
      minHeight: 56,
    },
    
    // Variants
    buttonPrimary: {
      backgroundColor: theme.colors.trustBlue,
    },
    buttonSecondary: {
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    buttonOutline: {
      backgroundColor: 'transparent',
      borderWidth: 2,
      borderColor: theme.colors.trustBlue,
    },
    buttonGhost: {
      backgroundColor: 'transparent',
    },
    buttonDanger: {
      backgroundColor: theme.colors.alertRed,
    },
    
    // States
    buttonDisabled: {
      backgroundColor: theme.colors.borderLight,
      borderColor: theme.colors.borderLight,
    },
    buttonFullWidth: {
      width: '100%',
    },
    
    // Text styles
    text: {
      ...theme.typography.button, // 16px - ENFORCED
      fontWeight: '500',
      textAlign: 'center',
    },
    textSmall: {
      ...theme.typography.bodySmall, // 14px
    },
    textMedium: {
      ...theme.typography.button, // 16px
    },
    textLarge: {
      ...theme.typography.body1, // 17px - ENFORCED BASE SIZE
    },
    
    // Text variants
    textPrimary: {
      color: theme.colors.background,
    },
    textSecondary: {
      color: theme.colors.text,
    },
    textOutline: {
      color: theme.colors.trustBlue,
    },
    textGhost: {
      color: theme.colors.trustBlue,
    },
    textDanger: {
      color: theme.colors.background,
    },
    textDisabled: {
      color: theme.colors.textLight,
    },
    
    // Content layout
    content: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    iconLeft: {
      marginRight: theme.spacing.sm,
    },
    iconRight: {
      marginLeft: theme.spacing.sm,
    },
  });
}
