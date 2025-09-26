import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Info } from 'phosphor-react-native';
import BaseBottomSheet from './BaseBottomSheet';

interface InfoBottomSheetProps {
  isVisible: boolean;
  onClose: () => void;
  title: string;
  content: string;
}

export default function InfoBottomSheet({ 
  isVisible, 
  onClose, 
  title,
  content
}: InfoBottomSheetProps) {
  const theme = useTheme();
  const styles = getStyles(theme);
  
  return (
    <BaseBottomSheet
      visible={isVisible}
      onClose={onClose}
      title={title}
      showActionButtons={true}
      actionButtonText="Close"
      onActionButtonPress={onClose}
    >
      <Text style={styles.contentText}>{content}</Text>
    </BaseBottomSheet>
  );
}

function getStyles(theme: any) {
  return StyleSheet.create({
    contentText: {
      ...theme.typography.bodyLarge,
      color: theme.colors.text,
      lineHeight: 24,
    },
  });
}
