import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { X, Info } from 'phosphor-react-native';
import { Colors, Spacing, Radius, Typography, Layout, Shadows } from '../theme';

interface InfoBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  content: React.ReactNode;
  icon?: React.ReactNode;
}

export default function InfoBottomSheet({ 
  visible, 
  onClose, 
  title, 
  content,
  icon = <Info weight="regular" size={24} color={Colors.trustBlue} />
}: InfoBottomSheetProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} onPress={onClose} />
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.titleContainer}>
              {icon}
              <Text style={styles.title}>{title}</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color={Colors.text} />
            </TouchableOpacity>
          </View>
          
          {/* Content */}
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {content}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
    paddingTop: 48, // 48px from top
  },
  backdrop: {
    flex: 1,
  },
  container: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: Radius.lg,
    borderTopRightRadius: Radius.lg,
    maxHeight: '85%', // Increased from 80% to 85%
    minHeight: '60%', // Added minimum height
    ...Shadows.large,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  title: {
    ...Typography.h4,
    color: Colors.text,
    marginLeft: Spacing.sm,
  },
  closeButton: {
    width: Layout.minTapArea,
    height: Layout.minTapArea,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: Spacing.lg,
  },
});
