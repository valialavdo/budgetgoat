import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
  Image,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import SecondaryHeader from '../components/SecondaryHeader';
import { 
  Star, 
  ShareNetwork, 
  ChatCircle, 
  Gift,
  AppleLogo,
  GooglePlayLogo,
  Heart
} from 'phosphor-react-native';

export default function RateUsScreen() {
  const theme = useTheme();
  const navigation = useNavigation();
  const [selectedRating, setSelectedRating] = useState(0);
  const [hasRated, setHasRated] = useState(false);
  const styles = getStyles(theme);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleRatingSelect = (rating: number) => {
    setSelectedRating(rating);
  };

  const handleRateOnStore = (platform: 'ios' | 'android') => {
    if (selectedRating < 4) {
      Alert.alert(
        'We\'d Love Your Feedback',
        'It looks like you\'re not completely satisfied with BudgetGOAT. We\'d love to hear how we can improve! Would you like to share your feedback instead?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Share Feedback', onPress: () => handleShareFeedback() }
        ]
      );
      return;
    }

    const storeUrl = platform === 'ios' 
      ? 'https://apps.apple.com/app/budgetgoat/id123456789' // Replace with actual App Store URL
      : 'https://play.google.com/store/apps/details?id=com.budgetgoat.app'; // Replace with actual Play Store URL

    Linking.openURL(storeUrl).catch(() => {
      Alert.alert('Error', 'Unable to open the app store. Please try again later.');
    });
  };

  const handleShareFeedback = () => {
    const subject = encodeURIComponent('BudgetGOAT Feedback');
    const body = encodeURIComponent(`Hi BudgetGOAT Team,

I'd like to share some feedback about the app:

Rating: ${selectedRating}/5 stars

Feedback:
[Please share your thoughts here]

Thanks!`);
    const url = `mailto:feedback@budgetgoat.com?subject=${subject}&body=${body}`;
    
    Linking.openURL(url).catch(() => {
      Alert.alert('Error', 'Unable to open email client. Please email us directly at feedback@budgetgoat.com');
    });
  };

  const handleShareApp = () => {
    Alert.alert(
      'Share BudgetGOAT',
      'Help your friends take control of their finances! Share BudgetGOAT with others.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Share', onPress: () => {
          // TODO: Implement native sharing functionality
          Alert.alert('Coming Soon', 'Share functionality will be available in a future update.');
        }}
      ]
    );
  };


  const renderStars = () => {
    return Array.from({ length: 5 }, (_, index) => {
      const starNumber = index + 1;
      const isSelected = starNumber <= selectedRating;
      
      return (
        <TouchableOpacity
          key={index}
          onPress={() => handleRatingSelect(starNumber)}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel={`Rate ${starNumber} star${starNumber !== 1 ? 's' : ''}`}
        >
          <Star
            size={24}
            color={isSelected ? theme.colors.warningOrange : theme.colors.textLight}
            weight={isSelected ? "fill" : "light"}
          />
        </TouchableOpacity>
      );
    });
  };

  const getRatingText = () => {
    switch (selectedRating) {
      case 1: return "We're sorry to hear that";
      case 2: return "We appreciate your feedback";
      case 3: return "Thanks for the feedback";
      case 4: return "Great to hear!";
      case 5: return "Amazing! Thank you!";
      default: return "How would you rate BudgetGOAT?";
    }
  };

  const getRatingDescription = () => {
    switch (selectedRating) {
      case 1: return "We'd love to know how we can improve your experience.";
      case 2: return "Your feedback helps us make BudgetGOAT better.";
      case 3: return "We're always working to improve the app.";
      case 4: return "We're glad you're enjoying BudgetGOAT!";
      case 5: return "Your support means the world to us!";
      default: return "Your rating helps other users discover BudgetGOAT.";
    }
  };

  return (
    <View style={styles.container}>
      <SecondaryHeader
        title="Rate Us"
        onBackPress={handleBack}
      />
      
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={styles.headerSection}>
          <View style={styles.appIcon}>
            <Heart 
              size={24} 
              color={theme.colors.background} 
              weight="fill" 
            />
          </View>
          <Text style={styles.headerTitle}>Love BudgetGOAT?</Text>
          <Text style={styles.headerDescription}>
            Your feedback helps us improve and helps other users discover our app.
          </Text>
        </View>

        {/* Rating Section */}
        <View style={styles.section}>
          <Text style={styles.ratingTitle}>{getRatingText()}</Text>
          <Text style={styles.ratingDescription}>{getRatingDescription()}</Text>
          
          <View style={styles.starsContainer}>
            {renderStars()}
          </View>
        </View>

        {/* Action Buttons */}
        {selectedRating > 0 && (
          <View style={styles.section}>
            {selectedRating >= 4 ? (
              <View style={styles.positiveActions}>
                <TouchableOpacity
                  style={[
                    styles.actionButton,
                    styles.primaryAction,
                    { backgroundColor: theme.colors.goatGreen }
                  ]}
                  onPress={() => handleRateOnStore('ios')}
                  accessible={true}
                  accessibilityRole="button"
                  accessibilityLabel="Rate on App Store"
                >
                  <AppleLogo size={24} color={theme.colors.background} weight="light" />
                  <Text style={styles.actionButtonText}>Rate on App Store</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.actionButton,
                    styles.secondaryAction,
                    { backgroundColor: theme.colors.surface }
                  ]}
                  onPress={() => handleRateOnStore('android')}
                  accessible={true}
                  accessibilityRole="button"
                  accessibilityLabel="Rate on Google Play"
                >
                  <GooglePlayLogo size={24} color={theme.colors.text} weight="light" />
                  <Text style={[styles.actionButtonText, { color: theme.colors.text }]}>
                    Rate on Google Play
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={[
                  styles.actionButton,
                  styles.primaryAction,
                  { backgroundColor: theme.colors.trustBlue }
                ]}
                onPress={handleShareFeedback}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel="Share feedback"
              >
                <ChatCircle size={24} color={theme.colors.background} weight="light" />
                <Text style={styles.actionButtonText}>Share Feedback</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Additional Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>More Ways to Support Us</Text>
          
          <TouchableOpacity
            style={styles.supportAction}
            onPress={handleShareApp}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Share BudgetGOAT with friends"
          >
            <ShareNetwork size={24} color={theme.colors.trustBlue} weight="light" />
            <View style={styles.supportActionDetails}>
              <Text style={styles.supportActionTitle}>Share with Friends</Text>
              <Text style={styles.supportActionDescription}>
                Help your friends take control of their finances
              </Text>
            </View>
          </TouchableOpacity>

        </View>

        {/* Thank You Message */}
        {hasRated && (
          <View style={styles.thankYouSection}>
            <Gift size={24} color={theme.colors.goatGreen} weight="light" />
            <Text style={styles.thankYouTitle}>Thank You!</Text>
            <Text style={styles.thankYouDescription}>
              Your support helps us continue improving BudgetGOAT for everyone.
            </Text>
          </View>
        )}

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
}

const getStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
  },
  headerSection: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
    marginBottom: theme.spacing.lg,
  },
  appIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.trustBlue,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.lg,
  },
  headerTitle: {
    ...theme.typography.h3,
    color: theme.colors.text,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  headerDescription: {
    ...theme.typography.bodyLarge,
    color: theme.colors.textMuted,
    textAlign: 'center',
    lineHeight: 24,
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    ...theme.typography.bodyMedium,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    fontWeight: '600',
  },
  ratingTitle: {
    ...theme.typography.bodyLarge,
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
    fontWeight: '500',
  },
  ratingDescription: {
    ...theme.typography.bodyLarge,
    color: theme.colors.textMuted,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
    lineHeight: 24,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.xl,
  },
  positiveActions: {
    gap: theme.spacing.md,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radius.lg,
    paddingVertical: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  primaryAction: {
    // Primary action button styles
  },
  secondaryAction: {
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
  },
  actionButtonText: {
    ...theme.typography.bodyLarge,
    color: theme.colors.background,
    fontWeight: '600',
  },
  supportAction: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
    gap: theme.spacing.md,
  },
  supportActionDetails: {
    flex: 1,
  },
  supportActionTitle: {
    ...theme.typography.bodyLarge,
    color: theme.colors.text,
    fontWeight: '600',
    marginBottom: 4,
  },
  supportActionDescription: {
    ...theme.typography.bodyMedium,
    color: theme.colors.textMuted,
  },
  thankYouSection: {
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.xl,
    marginTop: theme.spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.goatGreen,
  },
  thankYouTitle: {
    ...theme.typography.h3,
    color: theme.colors.text,
    fontWeight: '600',
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  thankYouDescription: {
    ...theme.typography.bodyLarge,
    color: theme.colors.text,
    textAlign: 'center',
    lineHeight: 24,
  },
  bottomSpacing: {
    height: theme.spacing.xl,
  },
});
