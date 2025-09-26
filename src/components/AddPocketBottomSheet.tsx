import React, { useState } from 'react';
import { Alert } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useMicroInteractions } from '../context/MicroInteractionsContext';
import AddItemBottomSheet from './AddItemBottomSheet';

export interface AddPocketBottomSheetProps {
  /**
   * Whether the bottom sheet is visible
   */
  visible: boolean;
  
  /**
   * Callback when the bottom sheet should be closed
   */
  onClose: () => void;
  
  /**
   * Callback when a new pocket is created
   */
  onPocketAdded?: (pocketName: string) => void;
}

/**
 * AddPocketBottomSheet component for creating new pockets
 * 
 * Features:
 * - Mimics the design from the reference image
 * - Pocket name validation
 * - Microinteractions with haptic feedback
 * - Success/error feedback
 * - Dark/light mode support
 * 
 * Usage:
 * ```tsx
 * <AddPocketBottomSheet
 *   visible={showAddPocket}
 *   onClose={() => setShowAddPocket(false)}
 *   onPocketAdded={(name) => console.log('Pocket added:', name)}
 * />
 * ```
 */
export default function AddPocketBottomSheet({
  visible,
  onClose,
  onPocketAdded,
}: AddPocketBottomSheetProps) {
  const theme = useTheme();
  const { triggerHaptic } = useMicroInteractions();

  const handleSave = async (pocketName: string) => {
    try {
      // Simulate API call to create pocket
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Here you would typically call your API or update state
      console.log('Creating pocket:', pocketName);
      
      if (onPocketAdded) {
        onPocketAdded(pocketName);
      }
      
      triggerHaptic('success');
    } catch (error) {
      console.error('Failed to create pocket:', error);
      throw error;
    }
  };

  const validatePocketName = (name: string): string | null => {
    if (name.length < 2) {
      return 'Pocket name must be at least 2 characters';
    }
    if (name.length > 50) {
      return 'Pocket name must be less than 50 characters';
    }
    if (!/^[a-zA-Z0-9\s\-_]+$/.test(name)) {
      return 'Pocket name can only contain letters, numbers, spaces, hyphens, and underscores';
    }
    return null;
  };

  return (
    <AddItemBottomSheet
      visible={visible}
      onClose={onClose}
      title="Create New Pocket"
      inputLabel="Pocket Name"
      inputPlaceholder="Enter pocket name"
      instructionText="Pocket names help you organize your savings goals"
      buttonText="Create Pocket"
      onSave={handleSave}
      validateInput={validatePocketName}
      maxLength={50}
    />
  );
}
