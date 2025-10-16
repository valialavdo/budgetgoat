import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

interface DashedDividerProps {
  color?: string;
  thickness?: number;
  dashLength?: number;
  gapLength?: number;
  style?: any;
}

export default function DashedDivider({
  color,
  thickness = 1,
  dashLength = 4,
  gapLength = 4,
  style,
}: DashedDividerProps) {
  const theme = useTheme();
  const dividerColor = color || theme.colors.border;

  // Create dashed line using multiple small views
  const renderDashedLine = () => {
    const dashes = [];
    const totalWidth = 400; // Increased width to fill container
    const dashCount = Math.floor(totalWidth / (dashLength + gapLength));
    
    for (let i = 0; i < dashCount; i++) {
      dashes.push(
        <View
          key={i}
          style={[
            styles.dash,
            {
              backgroundColor: dividerColor,
              height: thickness,
              width: dashLength,
              marginRight: i < dashCount - 1 ? gapLength : 0,
            },
          ]}
        />
      );
    }
    
    return dashes;
  };

  return (
    <View style={[styles.container, style]}>
      <View style={styles.dashedLine}>
        {renderDashedLine()}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 1,
    overflow: 'hidden',
  },
  dashedLine: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 1,
  },
  dash: {
    height: 1,
  },
});
