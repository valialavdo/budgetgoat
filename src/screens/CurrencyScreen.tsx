import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  Animated,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import SecondaryHeader from '../components/SecondaryHeader';
import { CurrencyDollar, Check, MagnifyingGlass, RadioButton } from 'phosphor-react-native';

interface Currency {
  code: string;
  name: string;
  symbol: string;
}

const CURRENCIES: Currency[] = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$' },
  { code: 'MXN', name: 'Mexican Peso', symbol: '$' },
  { code: 'KRW', name: 'South Korean Won', symbol: '₩' },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$' },
  { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$' },
  { code: 'SEK', name: 'Swedish Krona', symbol: 'kr' },
  { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr' },
  { code: 'DKK', name: 'Danish Krone', symbol: 'kr' },
  { code: 'PLN', name: 'Polish Zloty', symbol: 'zł' },
  { code: 'CZK', name: 'Czech Koruna', symbol: 'Kč' },
  { code: 'HUF', name: 'Hungarian Forint', symbol: 'Ft' },
  { code: 'RUB', name: 'Russian Ruble', symbol: '₽' },
  { code: 'TRY', name: 'Turkish Lira', symbol: '₺' },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R' },
  { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ' },
  { code: 'SAR', name: 'Saudi Riyal', symbol: '﷼' },
];

export default function CurrencyScreen() {
  const theme = useTheme();
  const navigation = useNavigation();
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [searchQuery, setSearchQuery] = useState('');
  const [scrollY] = useState(new Animated.Value(0));
  const styles = getStyles(theme);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleCurrencySelect = (currencyCode: string) => {
    setSelectedCurrency(currencyCode);
    // Auto-save the selection
    Alert.alert(
      'Currency Updated',
      `Your default currency has been set to ${currencyCode}`,
      [{ text: 'OK' }]
    );
  };

  const isCurrencySelected = (currencyCode: string) => {
    return selectedCurrency === currencyCode;
  };

  const filteredCurrencies = CURRENCIES.filter(currency =>
    currency.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    currency.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <SecondaryHeader
        title="Currency"
        onBackPress={handleBack}
      />
      
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Current Selection Preview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Selected Currency</Text>
          <View style={styles.previewContainer}>
            <View style={styles.previewIcon}>
              <CurrencyDollar 
                size={24} 
                color={theme.colors.trustBlue} 
                weight="light" 
              />
            </View>
            <View style={styles.previewInfo}>
              <Text style={styles.previewCode}>{selectedCurrency}</Text>
              <Text style={styles.previewName}>
                {CURRENCIES.find(c => c.code === selectedCurrency)?.name}
              </Text>
            </View>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchSection}>
          <View style={styles.searchContainer}>
            <MagnifyingGlass 
              size={20} 
              color={theme.colors.textMuted} 
              weight="light" 
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Search currencies..."
              placeholderTextColor={theme.colors.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
              accessible={true}
              accessibilityLabel="Search currencies"
            />
          </View>
        </View>

        {/* Currency List */}
        <View style={styles.section}>
          <View style={styles.currencyList}>
            {filteredCurrencies.map((currency) => (
              <TouchableOpacity
                key={currency.code}
                style={[
                  styles.currencyItem,
                  isCurrencySelected(currency.code) && styles.currencyItemSelected
                ]}
                onPress={() => handleCurrencySelect(currency.code)}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel={`Select ${currency.name}`}
                accessibilityHint={`Currently ${isCurrencySelected(currency.code) ? 'selected' : 'not selected'}`}
              >
                <View style={styles.currencyIcon}>
                  <CurrencyDollar 
                    size={16} 
                    color={isCurrencySelected(currency.code) ? theme.colors.trustBlue : theme.colors.textMuted} 
                    weight="light" 
                  />
                </View>
                <View style={styles.currencyDetails}>
                  <Text style={[
                    styles.currencyCode,
                    isCurrencySelected(currency.code) && styles.currencyCodeSelected
                  ]}>
                    {currency.code}
                  </Text>
                  <Text style={[
                    styles.currencyName,
                    isCurrencySelected(currency.code) && styles.currencyNameSelected
                  ]}>
                    {currency.name}
                  </Text>
                </View>
                
            <RadioButton 
              size={20} 
              color={isCurrencySelected(currency.code) ? theme.colors.trustBlue : theme.colors.borderLight} 
              weight={isCurrencySelected(currency.code) ? "fill" : "light"} 
            />
              </TouchableOpacity>
            ))}
          </View>
        </View>

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
    ...theme.typography.bodyLarge,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    fontWeight: '600',
  },
  previewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
    gap: theme.spacing.md,
  },
  previewIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.trustBlue + '10',
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewInfo: {
    flex: 1,
  },
  previewCode: {
    ...theme.typography.bodyLarge,
    color: theme.colors.text,
    fontWeight: '600',
  },
  previewName: {
    ...theme.typography.bodySmall,
    color: theme.colors.textMuted,
    marginTop: 2,
  },
  searchSection: {
    marginBottom: theme.spacing.md,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
    gap: theme.spacing.sm,
  },
  searchInput: {
    flex: 1,
    ...theme.typography.bodyMedium,
    color: theme.colors.text,
  },
  currencyList: {
    // Removed background as requested - keep only selected item backgrounds
  },
  currencyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    minHeight: 48,
  },
  currencyItemSelected: {
    backgroundColor: theme.colors.trustBlue + '10',
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.trustBlue,
  },
  currencyIcon: {
    width: 24,
    alignItems: 'center',
    marginRight: theme.spacing.sm,
  },
  currencyDetails: {
    flex: 1,
  },
  currencyCode: {
    ...theme.typography.bodyMedium,
    color: theme.colors.text,
    fontWeight: '600',
  },
  currencyCodeSelected: {
    color: theme.colors.trustBlue,
    fontWeight: '700',
  },
  currencyName: {
    ...theme.typography.bodySmall,
    color: theme.colors.textMuted,
    marginTop: 2,
  },
  currencyNameSelected: {
    color: theme.colors.trustBlue,
  },
});