import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { ArrowUp, ArrowDown, Minus, Plus } from 'phosphor-react-native';

interface AmountInputProps {
  value: number;
  type: 'income' | 'expense';
  onChange: (amount: number, type: 'income' | 'expense') => void;
  onFocus?: () => void;
  onBlur?: () => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
}

export default function AmountInput({
  value,
  type,
  onChange,
  onFocus,
  onBlur,
  placeholder = "0.00",
  disabled = false,
  error,
}: AmountInputProps) {
  const theme = useTheme();
  const styles = getStyles(theme);
  const [displayValue, setDisplayValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  // Format value for display
  useEffect(() => {
    if (value === 0 && !isFocused) {
      setDisplayValue('');
    } else {
      setDisplayValue(Math.abs(value).toString());
    }
  }, [value, isFocused]);

  const handleTextChange = (text: string) => {
    // Remove non-numeric characters except decimal point
    const cleanText = text.replace(/[^0-9.]/g, '');
    
    // Ensure only one decimal point
    const parts = cleanText.split('.');
    const formattedText = parts.length > 2 
      ? parts[0] + '.' + parts.slice(1).join('')
      : cleanText;
    
    setDisplayValue(formattedText);
    
    // Convert to number and apply type
    const numValue = parseFloat(formattedText) || 0;
    const finalAmount = type === 'expense' ? -numValue : numValue;
    onChange(finalAmount, type);
  };

  const handleFocus = () => {
    setIsFocused(true);
    onFocus?.();
  };

  const handleBlur = () => {
    setIsFocused(false);
    onBlur?.();
  };

  const toggleType = () => {
    const newType = type === 'income' ? 'expense' : 'income';
    const newAmount = type === 'income' ? -Math.abs(value) : Math.abs(value);
    onChange(newAmount, newType);
  };

  const getAmountColor = () => {
    return type === 'income' ? theme.colors.goatGreen : theme.colors.alertRed;
  };

  const getTypeIcon = () => {
    return type === 'income' ? (
      <ArrowUp size={20} color={getAmountColor()} weight="bold" />
    ) : (
      <ArrowDown size={20} color={getAmountColor()} weight="bold" />
    );
  };

  return (
    <View style={styles.container}>
      <View style={[styles.inputContainer, error && styles.errorContainer, isFocused && styles.focusedContainer]}>
        <View style={styles.currencyContainer}>
          <Text style={[styles.currencySymbol, { color: getAmountColor() }]}>€</Text>
        </View>
        
        <TextInput
          style={[styles.input, { color: getAmountColor() }]}
          value={displayValue}
          onChangeText={handleTextChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.textLight}
          keyboardType="numeric"
          editable={!disabled}
          selectTextOnFocus
        />
        
        <TouchableOpacity
          style={[styles.typeToggle, { backgroundColor: getAmountColor() + '15' }]}
          onPress={toggleType}
          disabled={disabled}
          activeOpacity={0.7}
        >
          {getTypeIcon()}
        </TouchableOpacity>
      </View>
      
      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}
      
      <View style={styles.typeIndicator}>
        <Text style={[styles.typeText, { color: getAmountColor() }]}>
          {type === 'income' ? 'Income' : 'Expense'}
        </Text>
      </View>
    </View>
  );
}

function getStyles(theme: any) {
  return StyleSheet.create({
    container: {
      marginBottom: theme.spacing.md,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radius.lg,
      borderWidth: 2,
      borderColor: theme.colors.border,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      minHeight: 56,
    },
    focusedContainer: {
      borderColor: theme.colors.trustBlue,
      backgroundColor: theme.colors.background,
    },
    errorContainer: {
      borderColor: theme.colors.alertRed,
    },
    currencyContainer: {
      marginRight: theme.spacing.sm,
    },
    currencySymbol: {
      ...theme.typography.h3,
      fontWeight: '600',
    },
    input: {
      flex: 1,
      ...theme.typography.h3,
      fontWeight: '600',
      textAlign: 'left',
      paddingVertical: 0,
    },
    typeToggle: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: theme.spacing.sm,
    },
    typeIndicator: {
      alignItems: 'center',
      marginTop: theme.spacing.xs,
    },
    typeText: {
      ...theme.typography.bodySmall,
      fontWeight: '500',
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    errorText: {
      ...theme.typography.bodySmall,
      color: theme.colors.alertRed,
      marginTop: theme.spacing.xs,
      marginLeft: theme.spacing.sm,
    },
  });
}
