import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Pocket } from '../services/firestoreService';

interface BudgetChartProps {
  pockets: Pocket[];
  theme?: 'light' | 'dark';
  type?: 'pie' | 'bar' | 'progress';
}

const { width } = Dimensions.get('window');
const CHART_WIDTH = width - 40;

export function BudgetChart({ 
  pockets, 
  theme = 'light', 
  type = 'pie' 
}: BudgetChartProps) {
  const totalBalance = pockets.reduce((sum, pocket) => sum + (pocket.currentBalance || 0), 0);
  const totalTarget = pockets.reduce((sum, pocket) => sum + (pocket.targetAmount || 0), 0);

  const getPocketColor = (index: number) => {
    const colors = [
      '#3498db', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6',
      '#1abc9c', '#e67e22', '#34495e', '#e91e63', '#00bcd4'
    ];
    return colors[index % colors.length];
  };

  const renderPieChart = () => {
    if (pockets.length === 0) {
      return (
        <View style={styles.emptyChart}>
          <Text style={[styles.emptyText, { color: theme === 'dark' ? '#ccc' : '#7f8c8d' }]}>
            No pockets to display
          </Text>
        </View>
      );
    }

    let currentAngle = 0;
    const radius = 80;
    const centerX = CHART_WIDTH / 2;
    const centerY = 100;

    return (
      <View style={styles.pieChartContainer}>
        <View style={styles.pieChart}>
          {pockets.map((pocket, index) => {
            const currentBalance = pocket.currentBalance || 0;
            const percentage = totalBalance > 0 ? (currentBalance / totalBalance) * 100 : 0;
            const angle = (percentage / 100) * 360;
            const color = getPocketColor(index);
            
            const startAngle = currentAngle;
            const endAngle = currentAngle + angle;
            currentAngle += angle;

            return (
              <View key={pocket.id} style={styles.pieSlice}>
                <View 
                  style={[
                    styles.pieSegment,
                    {
                      backgroundColor: color,
                      transform: [{ rotate: `${startAngle}deg` }],
                    }
                  ]}
                />
              </View>
            );
          })}
        </View>
        
        <View style={styles.legend}>
          {pockets.map((pocket, index) => {
            const currentBalance = pocket.currentBalance || 0;
            return (
              <View key={pocket.id} style={styles.legendItem}>
                <View 
                  style={[
                    styles.legendColor, 
                    { backgroundColor: getPocketColor(index) }
                  ]} 
                />
                <Text style={[styles.legendText, { color: theme === 'dark' ? '#fff' : '#2c3e50' }]}>
                  {pocket.name}
                </Text>
                <Text style={[styles.legendAmount, { color: theme === 'dark' ? '#ccc' : '#7f8c8d' }]}>
                  ${currentBalance.toFixed(2)}
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  const renderBarChart = () => {
    if (pockets.length === 0) {
      return (
        <View style={styles.emptyChart}>
          <Text style={[styles.emptyText, { color: theme === 'dark' ? '#ccc' : '#7f8c8d' }]}>
            No pockets to display
          </Text>
        </View>
      );
    }

    const maxAmount = Math.max(...pockets.map(p => p.currentBalance || 0));

    return (
      <View style={styles.barChartContainer}>
        {pockets.map((pocket, index) => {
          const currentBalance = pocket.currentBalance || 0;
          const height = maxAmount > 0 ? (currentBalance / maxAmount) * 120 : 0;
          const color = getPocketColor(index);
          
          return (
            <View key={pocket.id} style={styles.barItem}>
              <View style={styles.barContainer}>
                <View 
                  style={[
                    styles.bar,
                    {
                      height,
                      backgroundColor: color,
                    }
                  ]}
                />
              </View>
              <Text style={[styles.barLabel, { color: theme === 'dark' ? '#fff' : '#2c3e50' }]}>
                {pocket.name}
              </Text>
              <Text style={[styles.barAmount, { color: theme === 'dark' ? '#ccc' : '#7f8c8d' }]}>
                ${currentBalance.toFixed(0)}
              </Text>
            </View>
          );
        })}
      </View>
    );
  };

  const renderProgressChart = () => {
    if (pockets.length === 0) {
      return (
        <View style={styles.emptyChart}>
          <Text style={[styles.emptyText, { color: theme === 'dark' ? '#ccc' : '#7f8c8d' }]}>
            No pockets to display
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.progressChartContainer}>
        <View style={styles.progressHeader}>
          <Text style={[styles.progressTitle, { color: theme === 'dark' ? '#fff' : '#2c3e50' }]}>
            Progress to Goals
          </Text>
          <Text style={[styles.progressSubtitle, { color: theme === 'dark' ? '#ccc' : '#7f8c8d' }]}>
            ${totalBalance.toFixed(2)} of ${totalTarget.toFixed(2)}
          </Text>
        </View>
        
        {pockets.map((pocket, index) => {
          const currentBalance = pocket.currentBalance || 0;
          const progress = pocket.targetAmount ? (currentBalance / pocket.targetAmount) * 100 : 0;
          const color = getPocketColor(index);
          
          return (
            <View key={pocket.id} style={styles.progressItem}>
              <View style={styles.progressItemHeader}>
                <Text style={[styles.progressItemName, { color: theme === 'dark' ? '#fff' : '#2c3e50' }]}>
                  {pocket.name}
                </Text>
                <Text style={[styles.progressItemAmount, { color: theme === 'dark' ? '#ccc' : '#7f8c8d' }]}>
                  ${currentBalance.toFixed(2)} / ${(pocket.targetAmount || 0).toFixed(2)}
                </Text>
              </View>
              
              <View style={styles.progressBarContainer}>
                <View style={styles.progressBar}>
                  <View 
                    style={[
                      styles.progressBarFill,
                      {
                        width: `${Math.min(progress, 100)}%`,
                        backgroundColor: color,
                      }
                    ]}
                  />
                </View>
                <Text style={[styles.progressPercentage, { color }]}>
                  {progress.toFixed(0)}%
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    );
  };

  const renderChart = () => {
    switch (type) {
      case 'pie':
        return renderPieChart();
      case 'bar':
        return renderBarChart();
      case 'progress':
        return renderProgressChart();
      default:
        return renderPieChart();
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme === 'dark' ? '#2d2d2d' : '#fff' }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme === 'dark' ? '#fff' : '#2c3e50' }]}>
          Budget Overview
        </Text>
        <Text style={[styles.subtitle, { color: theme === 'dark' ? '#ccc' : '#7f8c8d' }]}>
          Total Balance: ${totalBalance.toFixed(2)}
        </Text>
      </View>
      
      {renderChart()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
  },
  emptyChart: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
  },
  pieChartContainer: {
    alignItems: 'center',
  },
  pieChart: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#ecf0f1',
    marginBottom: 20,
    position: 'relative',
  },
  pieSlice: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
  },
  pieSegment: {
    width: 80,
    height: 160,
    borderTopLeftRadius: 80,
    borderBottomLeftRadius: 80,
    transformOrigin: '80px 80px',
  },
  legend: {
    width: '100%',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  legendText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
  },
  legendAmount: {
    fontSize: 14,
    fontWeight: '600',
  },
  barChartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 160,
  },
  barItem: {
    alignItems: 'center',
    flex: 1,
  },
  barContainer: {
    height: 120,
    justifyContent: 'flex-end',
    marginBottom: 8,
  },
  bar: {
    width: 30,
    borderRadius: 4,
    minHeight: 4,
  },
  barLabel: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 4,
  },
  barAmount: {
    fontSize: 10,
    textAlign: 'center',
  },
  progressChartContainer: {
    width: '100%',
  },
  progressHeader: {
    marginBottom: 20,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  progressSubtitle: {
    fontSize: 14,
  },
  progressItem: {
    marginBottom: 16,
  },
  progressItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressItemName: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  progressItemAmount: {
    fontSize: 12,
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#ecf0f1',
    borderRadius: 4,
    marginRight: 8,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressPercentage: {
    fontSize: 12,
    fontWeight: '600',
    minWidth: 40,
    textAlign: 'right',
  },
});