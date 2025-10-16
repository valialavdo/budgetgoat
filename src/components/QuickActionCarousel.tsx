import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { useTheme } from '../context/ThemeContext';

interface QuickActionItem {
  id: string;
  icon: React.ReactNode;
  title: string;
  onPress: () => void;
}

interface QuickActionCarouselProps {
  items: QuickActionItem[];
}

const { width: screenWidth } = Dimensions.get('window');
const CARD_WIDTH = 120; // Width for each quick action card
const CARD_SPACING = 12;

export default function QuickActionCarousel({ items }: QuickActionCarouselProps) {
  const theme = useTheme();
  const scrollViewRef = useRef<ScrollView>(null);
  const styles = getStyles(theme);

  return (
    <View style={styles.carouselWrapper}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.carouselContainer}
        snapToInterval={CARD_WIDTH + CARD_SPACING}
        snapToAlignment="start"
        decelerationRate="fast"
      >
        {items.map((item, index) => (
          <TouchableOpacity
            key={item.id}
            style={styles.card}
            activeOpacity={0.8}
            onPress={item.onPress}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel={item.title}
            accessibilityHint={`Tap to ${item.title.toLowerCase()}`}
          >
            <View style={styles.iconContainer}>
              {item.icon}
            </View>
            <Text style={styles.title}>{item.title}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

function getStyles(theme: any) {
  return StyleSheet.create({
    carouselWrapper: {
      marginHorizontal: -20, // Extend beyond screen padding
    },
    carouselContainer: {
      paddingLeft: 20, // 20px left padding for screen edge
      paddingRight: 20, // 20px right padding for screen edge
    },
    card: {
      width: CARD_WIDTH,
      height: 120,
      backgroundColor: theme.colors.surface,
      borderRadius: 16,
      paddingVertical: 16,
      paddingHorizontal: 12,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: CARD_SPACING,
    },
    iconContainer: {
      marginBottom: 8,
      alignItems: 'center',
      justifyContent: 'center',
    },
    title: {
      fontSize: 12,
      color: theme.colors.text,
      textAlign: 'center',
      fontWeight: '500',
      lineHeight: 16,
    },
  });
}
