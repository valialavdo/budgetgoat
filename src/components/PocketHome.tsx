import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Pocket } from '../services/firestoreService';
import DashedDivider from './DashedDivider';
import LabelPill from './LabelPill';
import { Tag, Target, Folder } from 'phosphor-react-native';

interface PocketHomeProps {
  pocket: Pocket;
  onPress: (pocket: Pocket) => void;
}

export default function PocketHome({ pocket, onPress }: PocketHomeProps) {
  const theme = useTheme();

  // Helper function to truncate text with + indicator
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + `+${text.length - maxLength}`;
  };

  return (
    <View>
      <TouchableOpacity
        style={styles.pocketItem}
        onPress={() => onPress(pocket)}
        activeOpacity={0.7}
      >
        <View style={styles.pocketLeft}>
          <View style={styles.pocketInfo}>
            <Text style={[styles.pocketName, { color: theme.colors.text }]}>
              {truncateText(pocket.name, 12)}
            </Text>
            <View style={styles.pocketTags}>
              <LabelPill
                icon={<Tag size={12} weight="bold" />}
                text="Standard"
                backgroundColor="#E0E7FF"
                textColor="#4338CA"
              />
              {pocket.targetAmount && pocket.targetAmount > 0 && (
                <LabelPill
                  icon={<Target size={12} weight="bold" />}
                  text={`${Math.round((pocket.currentBalance / pocket.targetAmount) * 100)}% complete`}
                  backgroundColor="#FFF3E0"
                  textColor="#E65100"
                />
              )}
              <LabelPill
                icon={<Folder size={12} weight="bold" />}
                text={truncateText(pocket.category, 8)}
                backgroundColor="#E0F2FE"
                textColor="#0277BD"
              />
            </View>
          </View>
        </View>
        <View style={styles.pocketRight}>
          <Text style={[styles.pocketBalance, { color: theme.colors.text }]}>
            €{(pocket.currentBalance || 0).toFixed(0)}
          </Text>
          {pocket.targetAmount && (
            <Text style={[styles.pocketTarget, { color: theme.colors.textMuted }]}>
              out of €{(pocket.targetAmount || 0).toFixed(0)}
            </Text>
          )}
        </View>
      </TouchableOpacity>
      <DashedDivider style={styles.divider} />
    </View>
  );
}

const styles = StyleSheet.create({
  pocketItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 0,
    marginBottom: 8,
  },
  pocketLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  pocketInfo: {
    flex: 1,
  },
  pocketName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  pocketTags: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  pocketRight: {
    alignItems: 'flex-end',
  },
  pocketBalance: {
    fontSize: 20,
    fontWeight: '500',
    marginBottom: 2,
  },
  pocketTarget: {
    fontSize: 12,
  },
  divider: {
    marginTop: 8,
  },
});
