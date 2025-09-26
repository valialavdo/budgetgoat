import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import SecondaryHeader from '../components/SecondaryHeader';
import { Plus } from 'phosphor-react-native';

export default function NewPocketScreen() {
  const theme = useTheme();
  const navigation = useNavigation();
  const scrollY = useRef(new Animated.Value(0)).current;
  const handleBack = () => {
    navigation.goBack();
  };

  const handleSave = () => {
    // Save pocket logic
    console.log('Save pocket');
  };

  const styles = getStyles(theme);

  return (
    <View style={styles.container}>
      <SecondaryHeader 
        title="New Pocket" 
        onBackPress={handleBack}
        rightIcon={<Plus size={20} color={theme.colors.trustBlue} />}
        onRightPress={handleSave}
        scrollY={scrollY}
        scrollThreshold={10}
      />
      
      <Animated.ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        <View style={styles.content}>
          <Text style={styles.placeholderText}>
            Pocket form will be implemented here
          </Text>
        </View>
      </Animated.ScrollView>
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
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.screenPadding,
      paddingBottom: 100, // Add bottom padding so content is visible above nav menu
    },
    placeholderText: {
      ...theme.typography.bodyLarge,
      color: theme.colors.textMuted,
      textAlign: 'center',
    },
  });
}
