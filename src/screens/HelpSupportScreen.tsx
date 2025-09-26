import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import SecondaryHeader from '../components/SecondaryHeader';
import { 
  Question, 
  CaretRight, 
  Envelope, 
  ChatCircle, 
  Bug, 
  Book, 
  Phone,
  CaretDown,
  CaretUp 
} from 'phosphor-react-native';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

interface SupportOption {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  action: () => void;
}

const FAQ_DATA: FAQItem[] = [
  {
    id: '1',
    question: 'How do I create my first budget?',
    answer: 'To create your first budget, go to the Pockets screen and tap the "+" button. Set up your income and create budget categories for different expenses. The app will help you track your spending against these categories.'
  },
  {
    id: '2',
    question: 'Can I sync my data across multiple devices?',
    answer: 'Yes! BudgetGOAT automatically syncs your data across all your devices when you sign in with the same account. Your budgets, transactions, and settings will be available everywhere.'
  },
  {
    id: '3',
    question: 'How do I add transactions?',
    answer: 'You can add transactions by tapping the "+" button on the Home screen or going to the Transactions tab. Choose between income and expense, select the appropriate pocket, and enter the amount and details.'
  },
  {
    id: '4',
    question: 'What are AI Insights?',
    answer: 'AI Insights provide personalized recommendations based on your spending patterns. They help you identify opportunities to save money, optimize your budget, and achieve your financial goals faster.'
  },
  {
    id: '5',
    question: 'How do I export my data?',
    answer: 'Go to Account > Export Data to download your financial data. You can choose the date range, data types, and file format (CSV or PDF). The export will be saved to your device.'
  },
  {
    id: '6',
    question: 'Is my financial data secure?',
    answer: 'Absolutely! We use bank-level encryption to protect your data. All information is encrypted both in transit and at rest. We never share your personal financial data with third parties.'
  },
  {
    id: '7',
    question: 'Can I set up recurring transactions?',
    answer: 'Yes, you can set up recurring transactions for regular expenses like rent, utilities, or salary. This helps automate your budget tracking and ensures you don\'t miss important transactions.'
  },
  {
    id: '8',
    question: 'How do I change my currency?',
    answer: 'Go to Account > Currency Settings to change your preferred currency. This will update all monetary displays throughout the app to your chosen currency.'
  }
];

export default function HelpSupportScreen() {
  const theme = useTheme();
  const navigation = useNavigation();
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const styles = getStyles(theme);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleFAQToggle = (faqId: string) => {
    setExpandedFAQ(expandedFAQ === faqId ? null : faqId);
  };

  const handleEmailSupport = () => {
    const subject = encodeURIComponent('BudgetGOAT Support Request');
    const body = encodeURIComponent('Please describe your issue or question:\n\n');
    const url = `mailto:support@budgetgoat.com?subject=${subject}&body=${body}`;
    
    Linking.openURL(url).catch(() => {
      Alert.alert('Error', 'Unable to open email client. Please email us directly at support@budgetgoat.com');
    });
  };

  const handleLiveChat = () => {
    Alert.alert(
      'Live Chat',
      'Live chat is available Monday-Friday, 9 AM - 6 PM EST. Would you like to start a chat session?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Start Chat', onPress: () => {
          // TODO: Implement live chat functionality
          Alert.alert('Coming Soon', 'Live chat feature will be available in a future update.');
        }}
      ]
    );
  };

  const handleReportBug = () => {
    const subject = encodeURIComponent('BudgetGOAT Bug Report');
    const body = encodeURIComponent(`Please describe the bug you encountered:

Steps to reproduce:
1. 
2. 
3. 

Expected behavior:

Actual behavior:

Device: [Your device model]
App Version: [Current version]
OS Version: [Your OS version]

Additional notes:`);
    const url = `mailto:bugs@budgetgoat.com?subject=${subject}&body=${body}`;
    
    Linking.openURL(url).catch(() => {
      Alert.alert('Error', 'Unable to open email client. Please email us directly at bugs@budgetgoat.com');
    });
  };

  const handleUserGuide = () => {
    Alert.alert(
      'User Guide',
      'The comprehensive user guide is available on our website. Would you like to open it in your browser?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Open Guide', onPress: () => {
          Linking.openURL('https://budgetgoat.com/guide').catch(() => {
            Alert.alert('Error', 'Unable to open browser. Please visit budgetgoat.com/guide manually.');
          });
        }}
      ]
    );
  };

  const supportOptions: SupportOption[] = [
    {
      id: 'email',
      title: 'Email Support',
      description: 'Get help via email within 24 hours',
      icon: Envelope,
      action: handleEmailSupport
    },
    {
      id: 'chat',
      title: 'Live Chat',
      description: 'Chat with our support team in real-time',
      icon: ChatCircle,
      action: handleLiveChat
    },
    {
      id: 'bug',
      title: 'Report a Bug',
      description: 'Help us improve by reporting issues',
      icon: Bug,
      action: handleReportBug
    },
    {
      id: 'guide',
      title: 'User Guide',
      description: 'Comprehensive guide and tutorials',
      icon: Book,
      action: handleUserGuide
    }
  ];

  return (
    <View style={styles.container}>
      <SecondaryHeader
        title="Help & Support"
        onBackPress={handleBack}
      />
      
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Quick Help */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Help</Text>
          <View style={styles.quickHelpContainer}>
            <Question size={24} color={theme.colors.trustBlue} weight="light" />
            <View style={styles.quickHelpText}>
              <Text style={styles.quickHelpTitle}>Need immediate assistance?</Text>
              <Text style={styles.quickHelpDescription}>
                Check our FAQ below or contact our support team for personalized help.
              </Text>
            </View>
          </View>
        </View>

        {/* Contact Support */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Support</Text>
          <View style={styles.supportOptionsList}>
            {supportOptions.map((option) => {
              const IconComponent = option.icon;
              return (
                <TouchableOpacity
                  key={option.id}
                  style={styles.supportOption}
                  onPress={option.action}
                  accessible={true}
                  accessibilityRole="button"
                  accessibilityLabel={option.title}
                  accessibilityHint={option.description}
                >
                  <View style={styles.supportOptionInfo}>
                    <IconComponent 
                      size={24} 
                      color={theme.colors.trustBlue} 
                      weight="light" 
                    />
                    <View style={styles.supportOptionDetails}>
                      <Text style={styles.supportOptionTitle}>{option.title}</Text>
                      <Text style={styles.supportOptionDescription}>{option.description}</Text>
                    </View>
                  </View>
                  <CaretRight 
                    size={20} 
                    color={theme.colors.textMuted} 
                    weight="light" 
                  />
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* FAQ Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          <View style={styles.faqList}>
            {FAQ_DATA.map((faq) => {
              const isExpanded = expandedFAQ === faq.id;
              return (
                <View key={faq.id} style={styles.faqItem}>
                  <TouchableOpacity
                    style={styles.faqQuestion}
                    onPress={() => handleFAQToggle(faq.id)}
                    accessible={true}
                    accessibilityRole="button"
                    accessibilityLabel={faq.question}
                    accessibilityHint={isExpanded ? "Tap to collapse answer" : "Tap to expand answer"}
                  >
                    <Text style={styles.faqQuestionText}>{faq.question}</Text>
                    {isExpanded ? (
                      <CaretUp size={20} color={theme.colors.trustBlue} weight="light" />
                    ) : (
                      <CaretDown size={20} color={theme.colors.textMuted} weight="light" />
                    )}
                  </TouchableOpacity>
                  
                  {isExpanded && (
                    <View style={styles.faqAnswer}>
                      <Text style={styles.faqAnswerText}>{faq.answer}</Text>
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        </View>

        {/* Additional Resources */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Additional Resources</Text>
          <View style={styles.resourcesContainer}>
            <Text style={styles.resourceText}>
              • Visit our website: budgetgoat.com
            </Text>
            <Text style={styles.resourceText}>
              • Follow us on social media for tips and updates
            </Text>
            <Text style={styles.resourceText}>
              • Join our community forum for user discussions
            </Text>
            <Text style={styles.resourceText}>
              • Check our blog for budgeting tips and financial advice
            </Text>
          </View>
        </View>

        {/* Emergency Contact */}
        <View style={styles.section}>
          <View style={styles.emergencyContainer}>
            <Phone size={24} color={theme.colors.alertRed} weight="light" />
            <View style={styles.emergencyText}>
              <Text style={styles.emergencyTitle}>Emergency Support</Text>
              <Text style={styles.emergencyDescription}>
                For urgent issues affecting your account security or data integrity, 
                contact us immediately at security@budgetgoat.com
              </Text>
            </View>
          </View>
        </View>

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
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    ...theme.typography.bodyMedium,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    fontWeight: '600',
  },
  quickHelpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.trustBlue,
    gap: theme.spacing.md,
  },
  quickHelpText: {
    flex: 1,
  },
  quickHelpTitle: {
    ...theme.typography.bodyLarge,
    color: theme.colors.text,
    fontWeight: '600',
    marginBottom: 4,
  },
  quickHelpDescription: {
    ...theme.typography.bodyMedium,
    color: theme.colors.textMuted,
  },
  supportOptionsList: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
    overflow: 'hidden',
  },
  supportOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
    minHeight: 64,
  },
  supportOptionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: theme.spacing.md,
  },
  supportOptionDetails: {
    flex: 1,
  },
  supportOptionTitle: {
    ...theme.typography.bodyLarge,
    color: theme.colors.text,
    fontWeight: '600',
  },
  supportOptionDescription: {
    ...theme.typography.bodyMedium,
    color: theme.colors.textMuted,
    marginTop: 2,
  },
  faqList: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
    overflow: 'hidden',
  },
  faqItem: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
  },
  faqQuestion: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    minHeight: 56,
  },
  faqQuestionText: {
    ...theme.typography.bodyLarge,
    color: theme.colors.text,
    fontWeight: '600',
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  faqAnswer: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
    backgroundColor: theme.colors.background,
  },
  faqAnswerText: {
    ...theme.typography.bodyMedium,
    color: theme.colors.text,
    lineHeight: 22,
  },
  resourcesContainer: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.goatGreen,
  },
  resourceText: {
    ...theme.typography.bodyMedium,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  emergencyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.alertRed,
    gap: theme.spacing.md,
  },
  emergencyText: {
    flex: 1,
  },
  emergencyTitle: {
    ...theme.typography.bodyLarge,
    color: theme.colors.alertRed,
    fontWeight: '600',
    marginBottom: 4,
  },
  emergencyDescription: {
    ...theme.typography.bodyMedium,
    color: theme.colors.text,
    lineHeight: 20,
  },
  bottomSpacing: {
    height: theme.spacing.xl,
  },
});