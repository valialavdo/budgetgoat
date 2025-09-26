import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { Camera, Image as ImageIcon, X } from 'phosphor-react-native';
import { useTheme } from '../context/ThemeContext';
import MicroInteractionWrapper from './MicroInteractionWrapper';

export interface ImagePickerProps {
  /**
   * Current image URI
   */
  value?: string;
  
  /**
   * Callback when image is selected/changed
   */
  onImageChange: (uri: string | null) => void;
  
  /**
   * Size of the image picker
   * @default 100
   */
  size?: number;
  
  /**
   * Whether to show remove button when image is selected
   * @default true
   */
  showRemoveButton?: boolean;
  
  /**
   * Custom styles for the container
   */
  style?: any;
}

/**
 * Reusable ImagePicker component for profile pictures and image selection
 * 
 * Features:
 * - Camera and gallery selection
 * - Circular image display
 * - Remove image functionality
 * - Placeholder states
 * - Accessibility compliance
 * - Dark mode support
 * - Microinteractions
 * 
 * Usage:
 * ```tsx
 * <ImagePicker
 *   value={profileImage}
 *   onImageChange={setProfileImage}
 *   size={120}
 * />
 * ```
 */
export default function ImagePicker({
  value,
  onImageChange,
  size = 100,
  showRemoveButton = true,
  style,
}: ImagePickerProps) {
  const theme = useTheme();

  const handleImageSelection = () => {
    Alert.alert(
      "Select Image",
      "Choose how you'd like to add a profile picture",
      [
        {
          text: "Camera",
          onPress: () => selectFromCamera(),
        },
        {
          text: "Gallery",
          onPress: () => selectFromGallery(),
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ],
      { cancelable: true }
    );
  };

  const selectFromCamera = () => {
    // TODO: Implement camera selection with expo-image-picker
    // For now, simulate selection
    console.log("Camera selection - implement with expo-image-picker");
    // Example implementation:
    // const result = await ImagePicker.launchCameraAsync({
    //   mediaTypes: ImagePicker.MediaTypeOptions.Images,
    //   allowsEditing: true,
    //   aspect: [1, 1],
    //   quality: 0.8,
    // });
    // if (!result.canceled) {
    //   onImageChange(result.assets[0].uri);
    // }
  };

  const selectFromGallery = () => {
    // TODO: Implement gallery selection with expo-image-picker
    // For now, simulate selection
    console.log("Gallery selection - implement with expo-image-picker");
    // Example implementation:
    // const result = await ImagePicker.launchImageLibraryAsync({
    //   mediaTypes: ImagePicker.MediaTypeOptions.Images,
    //   allowsEditing: true,
    //   aspect: [1, 1],
    //   quality: 0.8,
    // });
    // if (!result.canceled) {
    //   onImageChange(result.assets[0].uri);
    // }
  };

  const handleRemoveImage = () => {
    Alert.alert(
      "Remove Image",
      "Are you sure you want to remove this image?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => onImageChange(null),
        },
      ]
    );
  };

  const styles = getStyles(theme, size);

  return (
    <View style={[styles.container, style]}>
      {value ? (
        <View style={styles.imageContainer}>
          <Image source={{ uri: value }} style={styles.image} />
          {showRemoveButton && (
            <MicroInteractionWrapper
              style={styles.removeButton}
              onPress={handleRemoveImage}
              hapticType="light"
              animationType="scale"
              pressScale={0.9}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Remove image"
              accessibilityHint="Removes the current profile picture"
            >
              <X 
                weight="light" 
                size={24} 
                color={theme.colors.background} 
              />
            </MicroInteractionWrapper>
          )}
        </View>
      ) : (
        <MicroInteractionWrapper
          style={styles.placeholderContainer}
          onPress={handleImageSelection}
          hapticType="light"
          animationType="scale"
          pressScale={0.95}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Add profile picture"
          accessibilityHint="Opens options to select image from camera or gallery"
        >
          <ImageIcon 
            weight="light" 
            size={size * 0.4} 
            color={theme.colors.textMuted} 
          />
          <Text style={styles.placeholderText}>Add Photo</Text>
        </MicroInteractionWrapper>
      )}
    </View>
  );
}

function getStyles(theme: any, size: number) {
  return StyleSheet.create({
    container: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    imageContainer: {
      position: 'relative',
    },
    image: {
      width: size,
      height: size,
      borderRadius: size / 2,
      backgroundColor: theme.colors.surface,
    },
    removeButton: {
      position: 'absolute',
      top: -4,
      right: -4,
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: theme.colors.alertRed,
      alignItems: 'center',
      justifyContent: 'center',
      ...theme.shadows.small,
    },
    placeholderContainer: {
      width: size,
      height: size,
      borderRadius: size / 2,
      backgroundColor: theme.colors.surface,
      borderWidth: 2,
      borderColor: theme.colors.border,
      borderStyle: 'dashed',
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing.xs,
    },
    placeholderText: {
      ...theme.typography.caption,
      color: theme.colors.textMuted,
      fontSize: 12,
    },
  });
}
