import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { X, WarningCircle } from 'phosphor-react-native';

interface AICardInsightProps {
  id: string;
  title: string;
  description: string;
  illustration?: React.ReactNode;
  onDismiss: (id: string) => void;
  onPress?: () => void;
  isFirst?: boolean;
  isSingleCard?: boolean;
  isCarousel?: boolean;
}

export default function AICardInsight({ 
  id,
  title, 
  description,
  illustration,
  onDismiss,
  onPress,
  isFirst = false,
  isSingleCard = false,
  isCarousel = false
}: AICardInsightProps) {
  const theme = useTheme();
  const styles = getStyles(theme, isSingleCard, isCarousel);
  
  // Determine container style based on props
  const getContainerStyle = () => {
    if (isSingleCard) return styles.singleCardContainer;
    if (isFirst) return styles.firstContainer;
    return styles.container;
  };

  return (
    <View style={getContainerStyle()}>
      <TouchableOpacity 
        style={styles.card}
        onPress={onPress}
        activeOpacity={onPress ? 0.7 : 1}
      >
        <TouchableOpacity 
          style={styles.dismissButton}
          onPress={() => onDismiss(id)}
          activeOpacity={0.7}
        >
          <X weight="light" size={16} color={theme.colors.textMuted} />
        </TouchableOpacity>
        
        <View style={styles.content}>
          <View style={styles.textContent}>
            <View style={styles.titleContainer}>
              <WarningCircle size={24} color={theme.colors.trustBlue} weight="regular" />
              <Text style={styles.title}>{title}</Text>
            </View>
            <Text style={styles.description}>{description}</Text>
          </View>
          
          {illustration && (
            <View style={styles.illustrationContainer}>
              {illustration}
            </View>
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
}

function getStyles(theme: any, isSingleCard?: boolean, isCarousel?: boolean) {
  const cardWidth = isSingleCard ? undefined : 340; // Full width for single card, fixed width for carousel
  
  return StyleSheet.create({
    container: {
      marginRight: 12, // Spacing between cards
    },
    firstContainer: {
      marginRight: 12, // Spacing between cards
    },
    singleCardContainer: {
      // No margins for single card - handled by parent container
    },
    card: {
      width: cardWidth,
      height: 120, // Fixed height for all cards
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radius.lg,
      padding: theme.spacing.md,
      position: 'relative',
    },
    dismissButton: {
      position: 'absolute',
      top: theme.spacing.sm,
      right: theme.spacing.sm,
      width: 24,
      height: 24,
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1,
    },
    content: {
      marginTop: theme.spacing.sm,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      flex: 1,
    },
    textContent: {
      flex: 1,
      marginRight: theme.spacing.md,
      justifyContent: 'center',
    },
    titleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.sm,
    },
    title: {
      ...theme.typography.bodyMedium,
      color: theme.colors.text,
      marginLeft: theme.spacing.xs,
      flex: 1,
    },
    description: {
      ...theme.typography.caption,
      color: theme.colors.textMuted,
    },
    illustrationContainer: {
      width: 80,
      height: 80,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
}
