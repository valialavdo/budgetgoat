import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import BaseBottomSheet from './BaseBottomSheet';

interface ProjectionBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  projectionData: any[];
}

const { width: screenWidth } = Dimensions.get('window');

export default function ProjectionBottomSheet({ 
  visible, 
  onClose, 
  projectionData = []
}: ProjectionBottomSheetProps) {
  const theme = useTheme();
  const styles = getStyles(theme);
  
  // Add safety check for empty data
  if (!projectionData || projectionData.length === 0) {
    return (
      <BaseBottomSheet
        visible={visible}
        onClose={onClose}
        title="6-Month Projection"
      >
        <View style={styles.chartSection}>
          <Text style={styles.chartTitle}>No projection data available</Text>
        </View>
      </BaseBottomSheet>
    );
  }

  // Calculate chart dimensions
  const chartWidth = screenWidth - (theme.spacing.screenPadding * 2);
  const chartHeight = 200;
  const maxValue = Math.max(...projectionData.map(d => d.totalBalance || 0));
  const minValue = Math.min(...projectionData.map(d => d.totalBalance || 0));
  const valueRange = Math.max(maxValue - minValue, 1); // Ensure valueRange is at least 1
  
  // Generate chart points
  const chartPoints = projectionData.map((data, index) => {
    const x = (index / (projectionData.length - 1)) * chartWidth;
    const y = chartHeight - ((data.totalBalance - minValue) / valueRange) * chartHeight;
    return { x, y, month: data.month, balance: data.totalBalance };
  });

  // Create line segments for the chart
  const createLineSegments = () => {
    if (chartPoints.length < 2) return [];
    
    const segments = [];
    for (let i = 0; i < chartPoints.length - 1; i++) {
      const current = chartPoints[i];
      const next = chartPoints[i + 1];
      
      const length = Math.sqrt(Math.pow(next.x - current.x, 2) + Math.pow(next.y - current.y, 2));
      const angle = Math.atan2(next.y - current.y, next.x - current.x);
      
      segments.push({
        width: length,
        height: 4,
        left: current.x,
        top: current.y + 2,
        transform: [{ rotate: `${angle}rad` }],
      });
    }
    return segments;
  };

  return (
    <BaseBottomSheet
      visible={visible}
      onClose={onClose}
      title="6-Month Projection"
    >

      {/* Chart Section */}
      <View style={styles.chartSection}>
        <Text style={styles.chartTitle}>Total Portfolio Balance</Text>
        
        <View style={styles.chartContainer}>
          {/* Y-axis labels */}
          <View style={styles.yAxis}>
            <Text style={styles.yAxisLabel}>€{maxValue.toLocaleString('de-DE')}</Text>
            <Text style={styles.yAxisLabel}>€{Math.round((maxValue + minValue) / 2).toLocaleString('de-DE')}</Text>
            <Text style={styles.yAxisLabel}>€{minValue.toLocaleString('de-DE')}</Text>
          </View>
          
          {/* Chart */}
          <View style={styles.chart}>
            {/* Grid lines */}
            <View style={styles.gridLine} />
            <View style={[styles.gridLine, { top: chartHeight / 2 }]} />
            <View style={[styles.gridLine, { top: chartHeight }]} />
            
            {/* Line Chart */}
            <View style={styles.lineChart}>
              {createLineSegments().map((segment, index) => (
                <View
                  key={index}
                  style={[
                    styles.lineSegment,
                    {
                      width: segment.width,
                      height: segment.height,
                      left: segment.left,
                      top: segment.top,
                      transform: segment.transform,
                    },
                  ]}
                />
              ))}
            </View>
            
            {/* Data Points */}
            {chartPoints.map((point, index) => (
              <View
                key={index}
                style={[
                  styles.dataPoint,
                  { left: point.x - 4, top: point.y - 4 }
                ]}
              />
            ))}
          </View>
        </View>
        
        {/* X-axis labels */}
        <View style={styles.xAxis}>
          {chartPoints.map((point, index) => (
            <Text key={index} style={styles.xAxisLabel}>
              {point.month}
            </Text>
          ))}
        </View>
      </View>

      {/* Summary Stats */}
      <View style={styles.summarySection}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Current Balance:</Text>
          <Text style={styles.summaryValue}>
            €{(projectionData[0]?.totalBalance || 0).toLocaleString('de-DE')}
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Projected Growth:</Text>
          <Text style={styles.summaryValue}>
            €{((projectionData[projectionData.length - 1]?.totalBalance || 0) - (projectionData[0]?.totalBalance || 0)).toLocaleString('de-DE')}
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Growth Rate:</Text>
          <Text style={styles.summaryValue}>
            {Math.round((((projectionData[projectionData.length - 1]?.totalBalance || 0) / (projectionData[0]?.totalBalance || 1)) - 1) * 100)}%
          </Text>
        </View>
      </View>
    </BaseBottomSheet>
  );
}

function getStyles(theme: any) {
  return StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  bottomSheet: {
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: theme.radius.lg,
    borderTopRightRadius: theme.radius.lg,
    paddingTop: theme.spacing.lg,
    paddingHorizontal: theme.spacing.screenPadding,
    paddingBottom: theme.spacing.xl,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  title: {
    ...theme.typography.h3,
    color: theme.colors.text,
  },
  closeButton: {
    padding: theme.spacing.xs,
  },
  chartSection: {
    marginBottom: theme.spacing.lg,
  },
  chartTitle: {
    ...theme.typography.bodyMedium,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  chartContainer: {
    flexDirection: 'row',
    height: 200,
    marginBottom: theme.spacing.sm,
  },
  yAxis: {
    width: 60,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginRight: theme.spacing.sm,
  },
  yAxisLabel: {
    ...theme.typography.caption,
    color: theme.colors.textMuted,
  },
  chart: {
    flex: 1,
    position: 'relative',
  },
  gridLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: theme.colors.borderLight,
  },
  lineChart: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  lineSegment: {
    position: 'absolute',
    backgroundColor: theme.colors.trustBlue,
    borderRadius: 2,
  },
  dataPoint: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.trustBlue,
    borderWidth: 2,
    borderColor: theme.colors.background,
  },
  xAxis: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 60, // Account for y-axis width
  },
  xAxisLabel: {
    ...theme.typography.caption,
    color: theme.colors.textMuted,
    textAlign: 'center',
  },
  summarySection: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingTop: theme.spacing.md,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  summaryLabel: {
    ...theme.typography.bodyMedium,
    color: theme.colors.textMuted,
  },
  summaryValue: {
    ...theme.typography.bodyMedium,
    color: theme.colors.text,
    fontWeight: '600',
  },
  });
}
