import React from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';
import { Colors, Spacing, Typography } from '../theme';
import Svg, { Path } from 'react-native-svg';

interface CashflowChartProps {
  incomeData: number[];
  expenseData: number[];
  timeLabels: string[];
}

const { width: screenWidth } = Dimensions.get('window');

export default function CashflowChart({ incomeData, expenseData, timeLabels }: CashflowChartProps) {
  const chartWidth = screenWidth - 40; // Full width minus 20px padding on each side
  const chartHeight = 100; // Chart area height (SVG)
  
  // Calculate data range
  const allData = [...incomeData, ...expenseData];
  const maxValue = Math.max(...allData, 0);
  const minValue = 0;
  const valueRange = maxValue - minValue || 1;
  
  // Generate smooth chart points with padding
  const padding = 10;
  const pointRadius = 4; // Radius of data point circles
  const availableHeight = chartHeight - (padding * 2);
  const availableWidth = chartWidth - (pointRadius * 2); // Account for circle radius on edges
  
  const incomePoints = incomeData.map((value, index) => {
    const x = pointRadius + (index / (incomeData.length - 1)) * availableWidth;
    const y = padding + availableHeight - ((value - minValue) / valueRange) * availableHeight;
    return { x, y };
  });

  const expensePoints = expenseData.map((value, index) => {
    const x = pointRadius + (index / (expenseData.length - 1)) * availableWidth;
    const y = padding + availableHeight - ((value - minValue) / valueRange) * availableHeight;
    return { x, y };
  });

  // Create smooth SVG path
  const createSmoothPath = (points: Array<{x: number, y: number}>, isClosed = false) => {
    if (points.length < 2) return '';
    
    let path = `M ${points[0].x} ${points[0].y}`;
    
    for (let i = 1; i < points.length; i++) {
      const current = points[i];
      const previous = points[i - 1];
      
      // Create smooth curves using quadratic bezier curves
      const cp1x = previous.x + (current.x - previous.x) / 3;
      const cp1y = previous.y;
      const cp2x = current.x - (current.x - previous.x) / 3;
      const cp2y = current.y;
      
      path += ` Q ${cp1x} ${cp1y} ${(cp1x + cp2x) / 2} ${(cp1y + cp2y) / 2}`;
      path += ` Q ${cp2x} ${cp2y} ${current.x} ${current.y}`;
    }
    
    if (isClosed) {
      // Close the path for area fill
      path += ` L ${points[points.length - 1].x} ${chartHeight - padding}`;
      path += ` L ${points[0].x} ${chartHeight - padding}`;
      path += ' Z';
    }
    
    return path;
  };

  return (
    <View style={styles.container}>
      <View style={styles.chartContainer}>
        {/* Clean SVG Chart - No Y-axis labels */}
        <View style={styles.chartArea}>
          <Svg width={chartWidth} height={chartHeight} style={styles.svg}>
              {/* Income line - solid color only */}
              <Path
                d={createSmoothPath(incomePoints)}
                stroke="#10B981"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              
              {/* Expense line - solid color only */}
              <Path
                d={createSmoothPath(expensePoints)}
                stroke="#EF4444"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              
              {/* Data points - solid colors only */}
              {incomePoints.map((point, index) => (
                <Path
                  key={`income-point-${index}`}
                  d={`M ${point.x - 4} ${point.y} A 4 4 0 1 0 ${point.x + 4} ${point.y} A 4 4 0 1 0 ${point.x - 4} ${point.y}`}
                  fill="#10B981"
                />
              ))}
              
              {expensePoints.map((point, index) => (
                <Path
                  key={`expense-point-${index}`}
                  d={`M ${point.x - 4} ${point.y} A 4 4 0 1 0 ${point.x + 4} ${point.y} A 4 4 0 1 0 ${point.x - 4} ${point.y}`}
                  fill="#EF4444"
                />
              ))}
            </Svg>

            {/* Time labels at bottom */}
            <View style={styles.timeLabels}>
              {timeLabels.map((label, index) => (
                <Text key={index} style={styles.timeLabel}>
                  {label}
                </Text>
              ))}
            </View>
          </View>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 20, // 20px padding on left and right
    overflow: 'hidden', // Prevent overflow beyond screen bounds
  },
  chartContainer: {
    width: '100%',
    height: 140, // Increased height to accommodate time labels
    backgroundColor: 'transparent',
    padding: 0,
    overflow: 'visible', // Allow time labels to be visible
  },
  chartArea: {
    width: '100%',
    height: '100%',
    position: 'relative',
    justifyContent: 'center',
    overflow: 'visible', // Allow time labels to be visible
  },
  svg: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
  },
  timeLabels: {
    position: 'absolute',
    bottom: 8, // Position within container bounds
    left: 0, // No extra padding needed since container has 20px padding
    right: 0, // No extra padding needed since container has 20px padding
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeLabel: {
    ...Typography.caption,
    color: Colors.textMuted,
    textAlign: 'center',
    fontSize: 11,
    fontWeight: '500',
  },
});
