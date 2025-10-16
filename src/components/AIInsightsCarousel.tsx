import React, { useRef, useState } from 'react';
import { View, ScrollView, Dimensions, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import AICardInsight from './AICardInsight';

interface Insight {
  id: string;
  title: string;
  description: string;
  illustration?: React.ReactNode;
}

interface AIInsightsCarouselProps {
  insights: Insight[];
  onDismiss: (id: string) => void;
  onPress?: (id: string) => void;
}

const { width: screenWidth } = Dimensions.get('window');
const CARD_WIDTH = 340; // Fixed width for carousel cards
const CARD_SPACING = 12;

export default function AIInsightsCarousel({ insights, onDismiss, onPress }: AIInsightsCarouselProps) {
  const theme = useTheme();
  const scrollViewRef = useRef<ScrollView>(null);
  const styles = getStyles(theme);

  // If only one insight, display it full width
  if (insights.length === 1) {
    return (
      <View style={styles.singleCardContainer}>
        <AICardInsight
          key={insights[0].id}
          id={insights[0].id}
          title={insights[0].title}
          description={insights[0].description}
          illustration={insights[0].illustration}
          onDismiss={onDismiss}
          onPress={() => onPress?.(insights[0].id)}
          isSingleCard={true}
        />
      </View>
    );
  }

  // Multiple insights - show as carousel
  return (
    <View style={styles.carouselWrapper}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        snapToInterval={CARD_WIDTH + CARD_SPACING}
        snapToAlignment="start"
        contentContainerStyle={styles.carouselContainer}
        style={styles.scrollView}
      >
        {insights.map((insight, index) => (
          <AICardInsight
            key={insight.id}
            id={insight.id}
            title={insight.title}
            description={insight.description}
            illustration={insight.illustration}
            onDismiss={onDismiss}
            onPress={() => onPress?.(insight.id)}
            isFirst={index === 0}
            isCarousel={true}
          />
        ))}
      </ScrollView>
    </View>
  );
}

function getStyles(theme: any) {
  return StyleSheet.create({
    singleCardContainer: {
      paddingHorizontal: 20, // 20px left and right padding
    },
    carouselWrapper: {
      marginHorizontal: -20, // Negative margin to extend beyond screen padding
    },
    carouselContainer: {
      paddingLeft: 20, // 20px left padding for first card
      paddingRight: 20, // 20px right padding for last card
    },
    scrollView: {
      // No additional styles needed
    },
  });
}
