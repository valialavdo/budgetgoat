import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  Animated,
} from 'react-native';
import { Envelope, PaperPlaneTilt, Receipt, Wallet, Target } from 'phosphor-react-native';
import { useTheme } from '../context/ThemeContext';
import { useMicroInteractions } from '../context/MicroInteractionsContext';
import { useNavigation } from '@react-navigation/native';
import SecondaryHeader from '../components/SecondaryHeader';
import Input from '../components/Input';
import ActionButton from '../components/ActionButton';
import SelectionOption from '../components/SelectionOption';
import LoadingSpinner from '../components/LoadingSpinner';
import SuccessAnimation from '../components/SuccessAnimation';

interface EmailData {
  email: string;
  subject: string;
  message: string;
  includeTransactions: boolean;
  includePockets: boolean;
  includeReports: boolean;
}

/**
 * SendToEmailScreen - Full screen for sending data via email
 * 
 * Features:
 * - Email composition form
 * - Data type selection
 * - Email validation
 * - Integration with expo-mail-composer
 * - Progress indicators
 * - Success feedback
 * - Accessibility compliance (WCAG AA)
 * - Dark mode support
 * - Microinteractions
 * 
 * Usage: Navigate from AccountScreen Send Data to Email setting
 */
export default function SendToEmailScreen() {
  const theme = useTheme();
  const navigation = useNavigation();
  const { triggerHaptic } = useMicroInteractions();
  
  const [emailData, setEmailData] = useState<EmailData>({
    email: '',
    subject: 'My Budget Data Export',
    message: 'Please find my budget data attached. This includes my financial transactions and pocket information.',
    includeTransactions: true,
    includePockets: true,
    includeReports: false,
  });
  
  const [isSending, setIsSending] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [scrollY] = useState(new Animated.Value(0));
  const [errors, setErrors] = useState<Partial<EmailData>>({});

  const handleBack = () => {
    navigation.goBack();
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<EmailData> = {};
    
    if (!emailData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(emailData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!emailData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSend = async () => {
    if (!validateForm()) {
      triggerHaptic('error');
      return;
    }

    setIsSending(true);
    triggerHaptic('light');

    try {
      // TODO: Implement actual email sending with expo-mail-composer
      // const result = await MailComposer.composeAsync({
      //   recipients: [emailData.email],
      //   subject: emailData.subject,
      //   body: emailData.message,
      //   attachments: await generateDataAttachments(emailData),
      // });
      
      // Simulate email sending
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setShowSuccess(true);
      triggerHaptic('success');
      
      setTimeout(() => {
        setShowSuccess(false);
        // TODO: Navigate back or reset form
      }, 2000);
      
    } catch (error) {
      triggerHaptic('error');
      Alert.alert('Send Failed', 'Unable to send email. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  const updateEmailData = (field: keyof EmailData, value: string | boolean) => {
    setEmailData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const dataTypes = [
    { key: 'includeTransactions', label: 'Transactions', description: 'All transaction history', icon: Receipt },
    { key: 'includePockets', label: 'Pockets', description: 'Pocket balances and details', icon: Wallet },
    { key: 'includeReports', label: 'Reports', description: 'Spending analytics and insights', icon: Target },
  ];

  const styles = getStyles(theme);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <SecondaryHeader 
        title="Send to Email" 
        onBackPress={handleBack}
        scrollY={scrollY}
      />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {/* Email Form */}
        <View style={styles.section}>
          <Input
            label="Recipient Email"
            placeholder="Enter email address"
            value={emailData.email}
            onChangeText={(text) => updateEmailData('email', text)}
            type="text"
            error={errors.email}
          />

          <Input
            label="Subject"
            placeholder="Email subject"
            value={emailData.subject}
            onChangeText={(text) => updateEmailData('subject', text)}
            type="text"
            error={errors.subject}
          />

          <Input
            label="Message"
            placeholder="Email message"
            value={emailData.message}
            onChangeText={(text) => updateEmailData('message', text)}
            type="multiline"
            numberOfLines={4}
          />
        </View>

        {/* Data Types */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Include Data
          </Text>
          
          <View style={styles.optionsList}>
            {dataTypes.map((dataType) => (
              <SelectionOption
                key={dataType.key}
                title={dataType.label}
                subtitle={dataType.description}
                icon={<dataType.icon size={20} weight="light" />}
                selected={emailData[dataType.key as keyof EmailData]}
                onPress={() => updateEmailData(dataType.key as keyof EmailData, !emailData[dataType.key as keyof EmailData])}
              />
            ))}
          </View>
        </View>

        {/* Send Button */}
        <View style={styles.sendSection}>
          <ActionButton
            title={isSending ? "Sending..." : "Send Email"}
            variant="primary"
            size="medium"
            onPress={handleSend}
            disabled={isSending}
            loading={isSending}
            hapticType="medium"
            accessibilityLabel="Send email with selected data"
            accessibilityHint="Sends the email with the specified data attachments"
          />
        </View>
      </ScrollView>

      {/* Loading Overlay */}
      {isSending && (
        <View style={styles.loadingOverlay}>
          <LoadingSpinner size="large" visible={true} />
          <Text style={[styles.loadingText, { color: theme.colors.text }]}>
            Preparing your email...
          </Text>
        </View>
      )}

      {/* Success Animation */}
      {showSuccess && (
        <View style={styles.successOverlay}>
          <SuccessAnimation type="checkmark" visible={true} />
          <Text style={[styles.successText, { color: theme.colors.text }]}>
            Email sent successfully!
          </Text>
        </View>
      )}
    </View>
  );
}

function getStyles(theme: any) {
  return StyleSheet.create({
    container: {
      flex: 1,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      paddingHorizontal: theme.spacing.screenPadding,
      paddingBottom: theme.spacing.xxl,
    },
    section: {
      marginBottom: theme.spacing.lg,
    },
    sectionTitle: {
    ...theme.typography.bodyLarge,
    fontWeight: '600',
    marginBottom: theme.spacing.sm,
  },
  optionsList: {
    // No background as per ExportDataScreen pattern
  },
    dataTypeItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: theme.spacing.md,
      marginBottom: theme.spacing.xs,
      gap: theme.spacing.md,
    },
    checkbox: {
      width: 24,
      height: 24,
      borderRadius: 4,
      borderWidth: 2,
      borderColor: theme.colors.border,
      alignItems: 'center',
      justifyContent: 'center',
    },
    checkedCheckbox: {
      backgroundColor: theme.colors.trustBlue,
      borderColor: theme.colors.trustBlue,
    },
    checkmark: {
      color: theme.colors.background,
      fontSize: 14,
      fontWeight: 'bold',
    },
    dataTypeInfo: {
      flex: 1,
    },
    dataTypeLabel: {
      ...theme.typography.body1,
      fontWeight: '500',
      marginBottom: 2,
    },
    dataTypeDescription: {
      ...theme.typography.caption,
      fontSize: 13,
    },
    sendSection: {
      marginTop: theme.spacing.lg,
    },
    loadingOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: theme.colors.shadow,
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing.lg,
    },
    loadingText: {
      ...theme.typography.body1,
      textAlign: 'center',
    },
    successOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing.lg,
    },
    successText: {
      ...theme.typography.h4,
      fontWeight: '600',
      textAlign: 'center',
    },
  });
}
