import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { 
  Star, 
  Wallet, 
  TrendDown, 
  User 
} from 'phosphor-react-native';
import { Colors, Spacing, Typography } from '../theme';

// Types
interface UserData {
  name: string;
  profilePicture?: string;
  joinDate: Date;
  netWorth: number;
  monthlySpend: number;
  monthlySpendChange: number;
}

interface ProfileHeaderProps {
  userData: UserData;
  onProfileEdit?: () => void;
  onStatsPress?: (statType: 'streak' | 'networth' | 'spending') => void;
}

// Simple formatting functions
const formatCurrency = (amount: number): string => {
  return `$${amount.toLocaleString()}`;
};

const formatPercentageChange = (change: number): string => {
  const sign = change >= 0 ? '+' : '';
  return `${sign}${change}%`;
};

export default function ProfileHeader({
  userData,
  onProfileEdit,
  onStatsPress,
}: ProfileHeaderProps) {
  // Simple calculation for days budgeting
  const daysBudgeting = 147; // Static value for now

  // Handle profile picture edit
  const handleProfileEdit = () => {
    Alert.alert(
      'Edit Profile Picture',
      'This feature will be available soon!',
      [{ text: 'OK' }]
    );
    onProfileEdit?.();
  };

  const handleStatPress = (statType: 'streak' | 'networth' | 'spending') => {
    onStatsPress?.(statType);
  };

  return (
    <View style={styles.container}>
      {/* Profile Picture Section */}
      <View style={styles.profileSection}>
        <TouchableOpacity
          style={styles.profilePictureContainer}
          onPress={handleProfileEdit}
          accessibilityLabel="Profile picture"
          accessibilityHint="Tap to edit your profile picture"
          accessibilityRole="button"
        >
          <View style={styles.profileImage}>
            <Text style={styles.profileInitial}>
              {userData.name.split(' ').map(n => n[0]).join('')}
            </Text>
          </View>
          
          {/* Edit overlay */}
          <View style={styles.editOverlay}>
            <User weight="light" size={12} color={Colors.background} />
          </View>
        </TouchableOpacity>

        {/* User Name */}
        <Text style={styles.userName} accessibilityRole="header">
          {userData.name}
        </Text>
      </View>

      {/* Stats Section */}
      <View style={styles.statsSection}>
        {/* Days of Budgeting - Primary Stat */}
        <TouchableOpacity
          style={styles.primaryStat}
          onPress={() => handleStatPress('streak')}
          accessibilityLabel={`${daysBudgeting} days budgeting streak`}
          accessibilityHint="Tap to view detailed streak information"
          accessibilityRole="button"
        >
          <View style={styles.statIconContainer}>
            <Star weight="light" size={20} color={Colors.trustBlue} />
          </View>
          <Text style={styles.primaryStatText}>
            {daysBudgeting} Days Budgeting Strong
          </Text>
        </TouchableOpacity>

        {/* Secondary Stats Row */}
        <View style={styles.secondaryStatsRow}>
          {/* Net Worth */}
          <TouchableOpacity
            style={styles.secondaryStat}
            onPress={() => handleStatPress('networth')}
            accessibilityLabel={`Net worth ${formatCurrency(userData.netWorth)}`}
            accessibilityHint="Tap to view detailed net worth information"
            accessibilityRole="button"
          >
            <View style={styles.statIconContainer}>
              <Wallet weight="light" size={16} color={Colors.income} />
            </View>
            <Text style={styles.secondaryStatLabel}>Net Worth</Text>
            <Text style={styles.secondaryStatValue}>
              {formatCurrency(userData.netWorth)}
            </Text>
          </TouchableOpacity>

          {/* Monthly Spending */}
          <TouchableOpacity
            style={styles.secondaryStat}
            onPress={() => handleStatPress('spending')}
            accessibilityLabel={`This month's spending ${formatCurrency(userData.monthlySpend)}, ${formatPercentageChange(userData.monthlySpendChange)} change`}
            accessibilityHint="Tap to view detailed spending information"
            accessibilityRole="button"
          >
            <View style={styles.statIconContainer}>
              <TrendDown weight="light" size={16} color={Colors.expense} />
            </View>
            <Text style={styles.secondaryStatLabel}>This Month's Spend</Text>
            <Text style={styles.secondaryStatValue}>
              {formatCurrency(userData.monthlySpend)} ({formatPercentageChange(userData.monthlySpendChange)})
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  
  // Profile Section
  profileSection: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  profilePictureContainer: {
    position: 'relative',
    marginBottom: Spacing.sm,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.trustBlue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInitial: {
    ...Typography.h3,
    color: Colors.background,
    fontWeight: '600',
  },
  editOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.trustBlue,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.background,
  },
  userName: {
    ...Typography.h4,
    color: Colors.text,
    fontWeight: '600',
    textAlign: 'center',
  },

  // Stats Section
  statsSection: {
    gap: Spacing.md,
  },
  primaryStat: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    padding: Spacing.md,
    borderRadius: 12,
    gap: Spacing.sm,
  },
  primaryStatText: {
    ...Typography.bodyRegular,
    color: Colors.text,
    fontWeight: '600',
    flex: 1,
  },
  secondaryStatsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  secondaryStat: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: Spacing.md,
    borderRadius: 12,
    alignItems: 'center',
    gap: Spacing.xs,
  },
  statIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryStatLabel: {
    ...Typography.caption,
    color: Colors.textMuted,
    textAlign: 'center',
  },
  secondaryStatValue: {
    ...Typography.bodySmall,
    color: Colors.text,
    fontWeight: '600',
    textAlign: 'center',
  },
});

// Example usage:
/*
import ProfileHeader from '../components/ProfileHeader';

const exampleUserData: UserData = {
  name: 'John Doe',
  joinDate: new Date('2024-01-15'),
  netWorth: 5234,
  monthlySpend: 1200,
  monthlySpendChange: -10,
};

<ProfileHeader
  userData={exampleUserData}
  onProfileEdit={() => console.log('Profile edited')}
  onStatsPress={(statType) => {
    console.log(`Stats pressed: ${statType}`);
    // Navigate to detailed views
  }}
/>
*/