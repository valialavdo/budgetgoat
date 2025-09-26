import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import SecondaryHeader from '../components/SecondaryHeader';
import { useTranslation } from '../i18n';


export default function AboutAppScreen() {
  const theme = useTheme();
  const navigation = useNavigation();
  const { t } = useTranslation();
  const styles = getStyles(theme);

  const handleBack = () => {
    navigation.goBack();
  };


  return (
    <View style={styles.container}>
      <SecondaryHeader
        title={t('about.title')}
        onBackPress={handleBack}
      />
      
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Main Logo Icon */}
        <View style={styles.logoContainer}>
          <Image 
            source={require('../../assets/icon.png')} 
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        {/* Main Heading */}
        <Text style={styles.mainHeading}>
          {t('about.heroText')}
        </Text>

        {/* Main Description */}
        <Text style={styles.mainDescription}>
          {t('about.bodyText')}
        </Text>

        {/* Legal Links */}
        <View style={styles.legalLinks}>
          <TouchableOpacity onPress={() => {/* Navigate to Terms */}}>
            <Text style={styles.legalLink}>{t('account.termsOfService')}</Text>
          </TouchableOpacity>
          <Text style={styles.legalSeparator}>•</Text>
          <TouchableOpacity onPress={() => {/* Navigate to Privacy */}}>
            <Text style={styles.legalLink}>{t('account.privacyPolicy')}</Text>
          </TouchableOpacity>
        </View>

        {/* Version and Copyright */}
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>{t('about.version')}</Text>
          <Text style={styles.copyrightText}>{t('about.copyright')}</Text>
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
  logoContainer: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
    marginBottom: theme.spacing.lg,
  },
  logo: {
    width: 120,
    height: 120,
  },
  mainHeading: {
    ...theme.typography.h2,
    color: theme.colors.text,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
    lineHeight: 32,
  },
  mainDescription: {
    ...theme.typography.bodyLarge,
    color: theme.colors.textMuted,
    lineHeight: 24,
    marginBottom: theme.spacing.xl,
    textAlign: 'center',
  },
  legalLinks: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  legalLink: {
    ...theme.typography.bodyMedium,
    color: theme.colors.trustBlue,
    fontWeight: '500',
  },
  legalSeparator: {
    ...theme.typography.bodyMedium,
    color: theme.colors.text,
    fontWeight: '500',
  },
  versionContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  versionText: {
    ...theme.typography.bodySmall,
    color: theme.colors.textMuted,
    marginBottom: theme.spacing.xs,
  },
  copyrightText: {
    ...theme.typography.bodySmall,
    color: theme.colors.textMuted,
  },
  bottomSpacing: {
    height: theme.spacing.xl,
  },
});