import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Insight } from '../services/firestoreService';

interface InsightCardProps {
  insight: Insight;
  onPress?: (insight: Insight) => void;
  onDismiss?: (insight: Insight) => void;
  theme?: 'light' | 'dark';
}

export function InsightCard({ 
  insight, 
  onPress, 
  onDismiss, 
  theme = 'light' 
}: InsightCardProps) {
  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'spending_pattern':
        return '📊';
      case 'saving_trend':
        return '💰';
      case 'budget_alert':
        return '⚠️';
      case 'goal_progress':
        return '🎯';
      default:
        return '💡';
    }
  };

  const getPriorityColor = (priority: 'low' | 'medium' | 'high') => {
    switch (priority) {
      case 'high':
        return '#e74c3c';
      case 'medium':
        return '#f39c12';
      case 'low':
        return '#27ae60';
      default:
        return '#95a5a6';
    }
  };

  const getPriorityText = (priority: 'low' | 'medium' | 'high') => {
    switch (priority) {
      case 'high':
        return 'High Priority';
      case 'medium':
        return 'Medium Priority';
      case 'low':
        return 'Low Priority';
      default:
        return 'Normal';
    }
  };

  const formatInsightData = (data: any) => {
    if (typeof data === 'object' && data !== null) {
      return JSON.stringify(data, null, 2);
    }
    return String(data);
  };

  const handlePress = () => {
    if (onPress) {
      onPress(insight);
    }
  };

  const handleDismiss = () => {
    if (onDismiss) {
      onDismiss(insight);
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { 
          backgroundColor: theme === 'dark' ? '#2d2d2d' : '#fff',
          borderLeftColor: getPriorityColor(insight.priority),
        }
      ]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.icon}>
            {getInsightIcon(insight.type)}
          </Text>
          <View style={styles.titleTextContainer}>
            <Text style={[styles.title, { color: theme === 'dark' ? '#fff' : '#2c3e50' }]}>
              {insight.title}
            </Text>
            <Text style={[styles.type, { color: theme === 'dark' ? '#ccc' : '#7f8c8d' }]}>
              {insight.type.replace('_', ' ').toUpperCase()}
            </Text>
          </View>
        </View>
        
        <View style={styles.priorityContainer}>
          <View 
            style={[
              styles.priorityBadge,
              { backgroundColor: getPriorityColor(insight.priority) }
            ]}
          >
            <Text style={styles.priorityText}>
              {getPriorityText(insight.priority)}
            </Text>
          </View>
        </View>
      </View>

      <Text style={[styles.description, { color: theme === 'dark' ? '#ccc' : '#7f8c8d' }]}>
        {insight.description}
      </Text>

      {insight.data && (
        <View style={styles.dataContainer}>
          <Text style={[styles.dataLabel, { color: theme === 'dark' ? '#ccc' : '#7f8c8d' }]}>
            Data:
          </Text>
          <Text style={[styles.dataText, { color: theme === 'dark' ? '#ccc' : '#7f8c8d' }]}>
            {formatInsightData(insight.data)}
          </Text>
        </View>
      )}

      <View style={styles.footer}>
        <Text style={[styles.date, { color: theme === 'dark' ? '#ccc' : '#7f8c8d' }]}>
          {insight.createdAt.toLocaleDateString()}
        </Text>
        
        <View style={styles.actions}>
          {insight.isRead && (
            <Text style={[styles.readStatus, { color: theme === 'dark' ? '#ccc' : '#7f8c8d' }]}>
              Read
            </Text>
          )}
          {onDismiss && (
            <TouchableOpacity 
              style={styles.dismissButton}
              onPress={handleDismiss}
            >
              <Text style={styles.dismissText}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  icon: {
    fontSize: 24,
    marginRight: 12,
  },
  titleTextContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  type: {
    fontSize: 12,
    fontWeight: '500',
  },
  priorityContainer: {
    alignItems: 'flex-end',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priorityText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  dataContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  dataLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  dataText: {
    fontSize: 12,
    fontFamily: 'monospace',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: {
    fontSize: 12,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  readStatus: {
    fontSize: 12,
    marginRight: 8,
  },
  dismissButton: {
    padding: 4,
  },
  dismissText: {
    fontSize: 16,
    color: '#e74c3c',
  },
});