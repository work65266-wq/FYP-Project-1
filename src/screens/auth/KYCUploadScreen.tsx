import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, typography, spacing, radius, shadows } from '../../theme';
import { Button, Input } from '../../components';
import { useAuthStore } from '../../store/authStore';

export const KYCUploadScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [frontUploaded, setFrontUploaded] = useState(false);
  const [backUploaded, setBackUploaded] = useState(false);
  const [ntn, setNtn] = useState('');
  const [tipsExpanded, setTipsExpanded] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { role, login } = useAuthStore();

  const canSubmit = frontUploaded && backUploaded;

  const handleUpload = (side: 'front' | 'back') => {
    if (side === 'front') setFrontUploaded(true);
    else setBackUploaded(true);
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const handleContinue = () => {
    if (role) {
      login(role);
      navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
    }
  };

  if (submitted) {
    return (
      <View style={styles.successContainer}>
        <View style={styles.successIcon}>
          <MaterialCommunityIcons name="clock-check-outline" size={80} color={colors.primary} />
        </View>
        <Text style={styles.successTitle}>Documents Submitted!</Text>
        <Text style={styles.successSubtitle}>
          We'll review your documents and notify you within 24 hours. You can browse the app in the meantime.
        </Text>
        <Button
          variant="primary"
          label="Continue to App"
          onPress={handleContinue}
          fullWidth
        />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: '66%' }]} />
        </View>
        <Text style={styles.progressText}>Step 2 of 3</Text>
      </View>

      <Text style={styles.title}>Verify your identity</Text>
      <Text style={styles.subtitle}>
        Upload your CNIC (Computerized National Identity Card) for verification. This helps us keep the platform secure and trustworthy. Review typically takes 24 hours.
      </Text>

      <Text style={styles.sectionLabel}>Front of CNIC</Text>
      <TouchableOpacity
        style={[styles.uploadZone, frontUploaded && styles.uploadZoneDone]}
        onPress={() => handleUpload('front')}
        accessibilityLabel="Upload front of CNIC"
      >
        {frontUploaded ? (
          <View style={styles.uploadedContent}>
            <MaterialCommunityIcons name="check-circle" size={32} color={colors.success} />
            <Text style={styles.uploadedText}>Front uploaded</Text>
            <TouchableOpacity onPress={() => setFrontUploaded(false)}>
              <Text style={styles.removeText}>Remove</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.uploadPlaceholder}>
            <MaterialCommunityIcons name="camera" size={32} color={colors.textTertiary} />
            <Text style={styles.uploadText}>Tap to upload front of CNIC</Text>
          </View>
        )}
      </TouchableOpacity>

      <Text style={styles.sectionLabel}>Back of CNIC</Text>
      <TouchableOpacity
        style={[styles.uploadZone, backUploaded && styles.uploadZoneDone]}
        onPress={() => handleUpload('back')}
        accessibilityLabel="Upload back of CNIC"
      >
        {backUploaded ? (
          <View style={styles.uploadedContent}>
            <MaterialCommunityIcons name="check-circle" size={32} color={colors.success} />
            <Text style={styles.uploadedText}>Back uploaded</Text>
            <TouchableOpacity onPress={() => setBackUploaded(false)}>
              <Text style={styles.removeText}>Remove</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.uploadPlaceholder}>
            <MaterialCommunityIcons name="camera" size={32} color={colors.textTertiary} />
            <Text style={styles.uploadText}>Tap to upload back of CNIC</Text>
          </View>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.tipsHeader}
        onPress={() => setTipsExpanded(!tipsExpanded)}
      >
        <Text style={styles.tipsTitle}>Photo quality tips</Text>
        <MaterialCommunityIcons
          name={tipsExpanded ? 'chevron-up' : 'chevron-down'}
          size={20}
          color={colors.textSecondary}
        />
      </TouchableOpacity>
      {tipsExpanded && (
        <View style={styles.tipsContent}>
          <Text style={styles.tipItem}>• Ensure all 4 corners are visible</Text>
          <Text style={styles.tipItem}>• Good lighting, no shadows</Text>
          <Text style={styles.tipItem}>• No glare or reflections</Text>
          <Text style={styles.tipItem}>• Place on a flat, dark surface</Text>
        </View>
      )}

      {role === 'buyer' && (
        <Input
          label="NTN Number (optional)"
          placeholder="Enter your NTN number"
          value={ntn}
          onChangeText={setNtn}
          hint="Required before your first purchase"
        />
      )}

      <Button
        variant="primary"
        label="Submit for Review"
        onPress={handleSubmit}
        disabled={!canSubmit}
        fullWidth
      />

      <Text style={styles.disclaimer}>
        Your documents are encrypted and reviewed only by AgriConnect admin
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxxl,
    paddingBottom: spacing.xxl,
  },
  progressContainer: {
    marginBottom: spacing.xl,
  },
  progressBar: {
    height: 4,
    backgroundColor: colors.border,
    borderRadius: radius.full,
    marginBottom: spacing.sm,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: radius.full,
  },
  progressText: {
    ...typography.caption,
    color: colors.textTertiary,
  },
  title: {
    ...typography.h1,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
    lineHeight: 22,
  },
  sectionLabel: {
    ...typography.label,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  uploadZone: {
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
    borderRadius: radius.md,
    padding: spacing.xl,
    marginBottom: spacing.base,
    alignItems: 'center',
    justifyContent: 'center',
    aspectRatio: 85 / 54,
    maxHeight: 180,
  },
  uploadZoneDone: {
    borderColor: colors.success,
    borderStyle: 'solid',
    backgroundColor: colors.successLight,
  },
  uploadPlaceholder: {
    alignItems: 'center',
  },
  uploadText: {
    ...typography.bodyMedium,
    color: colors.textTertiary,
    marginTop: spacing.sm,
  },
  uploadedContent: {
    alignItems: 'center',
  },
  uploadedText: {
    ...typography.label,
    color: colors.success,
    marginTop: spacing.sm,
  },
  removeText: {
    ...typography.caption,
    color: colors.error,
    marginTop: spacing.sm,
  },
  tipsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    marginBottom: spacing.sm,
  },
  tipsTitle: {
    ...typography.label,
    color: colors.textSecondary,
  },
  tipsContent: {
    backgroundColor: colors.surfaceElevated,
    padding: spacing.md,
    borderRadius: radius.md,
    marginBottom: spacing.base,
  },
  tipItem: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  disclaimer: {
    ...typography.caption,
    color: colors.textTertiary,
    textAlign: 'center',
    marginTop: spacing.base,
  },
  successContainer: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.xl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  successIcon: {
    marginBottom: spacing.xl,
  },
  successTitle: {
    ...typography.h1,
    color: colors.textPrimary,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  successSubtitle: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xxl,
    lineHeight: 22,
  },
});
