import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Image, Animated } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { BudgetContext } from '../context/BudgetContext';
import { useNavigation } from '@react-navigation/native';
import SecondaryHeader from '../components/SecondaryHeader';
import ChangePasswordBottomSheet from '../components/ChangePasswordBottomSheet';
import Input from '../components/Input';
import { ArrowLeft, Check, PencilSimple, Plus, User, CaretRight } from 'phosphor-react-native';
import MicroInteractionWrapper from '../components/MicroInteractionWrapper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';

export default function EditProfileScreen() {
  const theme = useTheme();
  const { state } = useContext(BudgetContext);
  const navigation = useNavigation();
  const styles = getStyles(theme);
  const [scrollY] = useState(new Animated.Value(0));
  
  const [profileData, setProfileData] = useState({
    name: 'Alex Smith',
    email: 'alex.smith@email.com',
    joinDate: '147 Days Budgeting Strong'
  });
  
  const [hasChanges, setHasChanges] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);

  const handleBack = () => {
    if (hasChanges) {
      Alert.alert(
        'Unsaved Changes',
        'You have unsaved changes. Do you want to save them?',
        [
          { text: 'Discard', style: 'destructive', onPress: () => navigation.goBack() },
          { text: 'Save', onPress: handleSave }
        ]
      );
    } else {
      navigation.goBack();
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    
    try {
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(profileData.email)) {
        Alert.alert('Invalid Email', 'Please enter a valid email address.');
        setIsLoading(false);
        return;
      }
      
      // Validate name
      if (profileData.name.trim().length < 2) {
        Alert.alert('Invalid Name', 'Name must be at least 2 characters long.');
        setIsLoading(false);
        return;
      }
      
      // Save profile data to AsyncStorage
      await AsyncStorage.setItem('userProfile', JSON.stringify({
        name: profileData.name.trim(),
        email: profileData.email.trim(),
        lastUpdated: new Date().toISOString()
      }));
      
      setHasChanges(false);
      Alert.alert('Success', 'Profile updated successfully', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert('Error', 'Failed to save profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFieldChange = (field: string, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleChangePassword = () => {
    setShowChangePasswordModal(true);
  };

  const handlePhotoChange = () => {
    Alert.alert(
      'Profile Picture',
      'Choose an option',
      [
        { text: 'Camera', onPress: () => openCamera() },
        { text: 'Photo Library', onPress: () => openImageLibrary() },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const openCamera = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Camera permission is needed to take photos.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setProfileImage(result.assets[0].uri);
        setHasChanges(true);
      }
    } catch (error) {
      console.error('Error opening camera:', error);
      Alert.alert('Error', 'Failed to open camera. Please try again.');
    }
  };

  const openImageLibrary = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Photo library permission is needed to select photos.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setProfileImage(result.assets[0].uri);
        setHasChanges(true);
      }
    } catch (error) {
      console.error('Error opening image library:', error);
      Alert.alert('Error', 'Failed to open photo library. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <SecondaryHeader 
        title="Edit Profile" 
        onBackPress={handleBack}
        rightIcon={hasChanges ? <Check size={24} color={theme.colors.trustBlue} /> : undefined}
        onRightPress={hasChanges ? handleSave : undefined}
        scrollY={scrollY}
      />
      
      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        <View style={styles.content}>
          {/* Profile Picture Section */}
          <View style={styles.profilePictureSection}>
            <Text style={styles.sectionTitle}>Profile Picture</Text>
            <View style={styles.profilePictureContainer}>
              <MicroInteractionWrapper 
                style={styles.profilePicture} 
                onPress={handlePhotoChange}
                hapticType="medium"
                animationType="scale"
                pressScale={0.95}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel="Change profile picture"
                accessibilityHint="Opens profile picture selection"
              >
                <View style={[styles.profilePicture, { backgroundColor: theme.colors.trustBlue }]}>
                  <Text style={[styles.profileInitial, { color: theme.colors.background }]}>AS</Text>
                </View>
                <View style={[styles.profileEditIcon, { backgroundColor: theme.colors.trustBlue, borderColor: theme.colors.surface }]}>
                  <Plus size={10} color={theme.colors.background} weight="bold" />
                </View>
              </MicroInteractionWrapper>
            </View>
          </View>

          {/* Personal Information Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Personal Information</Text>
            
            <Input
              label="Full Name"
              type="text"
              value={profileData.name}
              onChangeText={(text) => handleFieldChange('name', text)}
              placeholder="Enter your full name"
            />

            <Input
              label="Email Address"
              type="text"
              value={profileData.email}
              onChangeText={(text) => handleFieldChange('email', text)}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Member Since</Text>
              <View style={styles.previewField}>
                <Text style={styles.previewText}>{profileData.joinDate}</Text>
              </View>
            </View>
          </View>

          {/* Privacy Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Privacy & Security</Text>
            
            <TouchableOpacity 
              style={styles.navigationItem}
              onPress={handleChangePassword}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Change Password"
              accessibilityHint="Opens change password form"
            >
              <View style={styles.navigationItemLeft}>
                <View style={styles.iconContainer}>
                  <User size={24} color={theme.colors.trustBlue} weight="light" />
                </View>
                <Text style={styles.navigationLabel}>Change Password</Text>
              </View>
              <CaretRight size={24} color={theme.colors.trustBlue} weight="light" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      
      {/* Change Password Bottom Sheet */}
      <ChangePasswordBottomSheet
        visible={showChangePasswordModal}
        onClose={() => setShowChangePasswordModal(false)}
        onPasswordChanged={() => {
          Alert.alert('Success', 'Your password has been changed successfully.');
        }}
      />
    </View>
  );
}

function getStyles(theme: any) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollView: {
      flex: 1,
    },
    content: {
      paddingHorizontal: theme.spacing.lg,
      paddingBottom: theme.spacing.md,
    },
    profilePictureSection: {
      alignItems: 'center',
      marginBottom: theme.spacing.xl,
    },
    sectionTitle: {
      ...theme.typography.h4,
      color: theme.colors.text,
      fontWeight: '600',
      marginBottom: theme.spacing.md,
    },
    profilePictureContainer: {
      position: 'relative',
    },
    profilePicture: {
      width: 80,
      height: 80,
      borderRadius: 40,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: theme.spacing.sm,
    },
    profileInitial: {
      ...theme.typography.h3,
      fontWeight: '700',
    },
    profileEditIcon: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      width: 24,
      height: 24,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
    },
    section: {
      marginBottom: theme.spacing.xl,
    },
    inputGroup: {
      marginBottom: theme.spacing.md,
    },
    previewField: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radius.md,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderWidth: 1,
      borderColor: theme.colors.borderLight,
      opacity: 0.7,
    },
    previewText: {
      ...theme.typography.bodyLarge,
      color: theme.colors.textMuted,
      fontWeight: '500',
    },
    navigationItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.md,
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radius.md,
      borderWidth: 1,
      borderColor: theme.colors.borderLight,
    },
    navigationItemLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    iconContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.trustBlue + '15',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: theme.spacing.md,
    },
    navigationLabel: {
      ...theme.typography.bodyLarge,
      color: theme.colors.text,
      fontWeight: '500',
    },
  });
}