import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import SecondaryHeader from '../components/SecondaryHeader';
import { ArrowLeft, Sun, Moon, Monitor, RadioButton } from 'phosphor-react-native';
import MicroInteractionWrapper from '../components/MicroInteractionWrapper';

type ThemeMode = 'light' | 'dark' | 'system';

export default function AppearanceScreen() {
  const navigation = useNavigation();
  const theme = useTheme();
  const styles = getStyles(theme);
  const [selectedTheme, setSelectedTheme] = useState<ThemeMode>(theme.themeMode);
  const [scrollY] = useState(new Animated.Value(0));

  // Update selected theme when theme context changes
  useEffect(() => {
    setSelectedTheme(theme.themeMode);
  }, [theme.themeMode]);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleThemeChange = (themeMode: ThemeMode) => {
    setSelectedTheme(themeMode);
    
    // Update the actual theme context
    theme.setThemeMode(themeMode);
    
    console.log('Theme changed to:', themeMode);
  };

  const themeOptions = [
    {
      id: 'light' as ThemeMode,
      title: 'Light',
      subtitle: 'Always use light appearance',
      icon: Sun,
      color: '#FFA726', // Orange for sun
    },
    {
      id: 'dark' as ThemeMode,
      title: 'Dark',
      subtitle: 'Always use dark appearance',
      icon: Moon,
      color: '#42A5F5', // Blue for moon
    },
    {
      id: 'system' as ThemeMode,
      title: 'System Default',
      subtitle: 'Match your device settings',
      icon: Monitor,
      color: '#66BB6A', // Green for system
    },
  ];

  return (
    <View style={styles.container}>
      <SecondaryHeader 
        title="Appearance" 
        onBackPress={handleBack}
        scrollY={scrollY}
      />
      
      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        <View style={styles.content}>
          {/* Theme Selection Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Choose Appearance</Text>
            <Text style={styles.sectionSubtitle}>
              Select how BudgetGOAT should appear across all screens
            </Text>
            
            {themeOptions.map((option) => {
              const IconComponent = option.icon;
              const isSelected = selectedTheme === option.id;
              
              return (
                <MicroInteractionWrapper
                  key={option.id}
                  onPress={() => handleThemeChange(option.id)}
                  hapticType="light"
                  animationType="scale"
                  pressScale={0.98}
                  accessible={true}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: isSelected }}
                  accessibilityLabel={`Select ${option.title} theme`}
                  accessibilityHint={`Changes app appearance to ${option.title.toLowerCase()}`}
                >
                  <View style={[
                    styles.themeOption,
                    isSelected && styles.themeOptionSelected,
                    { borderColor: theme.colors.borderLight }
                  ]}>
                    <View style={styles.themeOptionLeft}>
                      <View style={[
                        styles.themeIconContainer,
                        { backgroundColor: option.color + '15' }
                      ]}>
                        <IconComponent 
                          size={24} 
                          color={option.color} 
                          weight={isSelected ? "fill" : "light"} 
                        />
                      </View>
                      <View style={styles.themeOptionText}>
                        <Text style={[
                          styles.themeOptionTitle,
                          { color: theme.colors.text }
                        ]}>
                          {option.title}
                        </Text>
                        <Text style={[
                          styles.themeOptionSubtitle,
                          { color: theme.colors.textMuted }
                        ]}>
                          {option.subtitle}
                        </Text>
                      </View>
                    </View>
                    <RadioButton 
                      size={28} 
                      weight="light"
                      color={isSelected ? theme.colors.trustBlue : theme.colors.borderLight}
                    />
                  </View>
                </MicroInteractionWrapper>
              );
            })}
          </View>

        </View>
      </ScrollView>
    </View>
  );
}

function getStyles(theme: any) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollView: {
      flex: 1,
    },
    content: {
      paddingHorizontal: theme.spacing.lg,
    },
    section: {
      marginBottom: theme.spacing.xl,
    },
    sectionTitle: {
      ...theme.typography.h4,
      color: theme.colors.text,
      fontWeight: '600',
      marginBottom: theme.spacing.sm,
    },
    sectionSubtitle: {
      ...theme.typography.bodyMedium,
      color: theme.colors.textMuted,
      marginBottom: theme.spacing.lg,
      lineHeight: 20,
    },
    themeOption: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.md,
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radius.md,
      borderWidth: 1,
      marginBottom: theme.spacing.sm,
    },
    themeOptionSelected: {
      borderColor: theme.colors.trustBlue,
      backgroundColor: theme.colors.trustBlue + '08',
    },
    themeOptionLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    themeIconContainer: {
      width: 48,
      height: 48,
      borderRadius: 24,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: theme.spacing.md,
    },
    themeOptionText: {
      flex: 1,
    },
    themeOptionTitle: {
      ...theme.typography.bodyLarge,
      fontWeight: '600',
      marginBottom: theme.spacing.xs,
    },
    themeOptionSubtitle: {
      ...theme.typography.bodySmall,
      lineHeight: 16,
    },
  });
}
