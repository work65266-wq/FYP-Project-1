import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, typography, spacing, radius, shadows } from '../../theme';
import { Button, Input, Card } from '../../components';
import { formatPKR } from '../../data/mockData';

const disputeReasons = [
  "Quality doesn't match listing",
  'Quantity received is short',
  'Produce not delivered',
];

export const DisputeScreen: React.FC<{ navigation: any; route: any }> = ({
  navigation,
  route,
}) => {
  const order = route.params?.order;
  const [selectedReason, setSelectedReason] = useState('');
  const [description, setDescription] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleAddPhoto = () => {
    if (photos.length < 5) {
      setPhotos([...photos, `dispute_photo_${photos.length + 1}`]);
    }
  };

  const handleSubmit = () => {
    setShowConfirmation(true);
  };

  const confirmSubmit = () => {
    setShowConfirmation(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <View style={styles.submittedContainer}>
        <MaterialCommunityIcons name="alert-circle" size={80} color={colors.warning} />
        <Text style={styles.submittedTitle}>Dispute Under Review</Text>
        <Card style={styles.frozenCard} elevated>
          <MaterialCommunityIcons name="snowflake" size={20} color={colors.trust} />
          <Text style={styles.frozenText}>
            {formatPKR(order?.totalAmount || 45000)} is frozen until resolved
          </Text>
        </Card>
        <Text style={styles.resolutionText}>
          Admin will review within 7 days
        </Text>
        <Button
          variant="primary"
          label="View Dispute Status"
          onPress={() => navigation.goBack()}
          fullWidth
        />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton} accessibilityLabel="Go back">
        <MaterialCommunityIcons name="arrow-left" size={24} color={colors.textPrimary} />
      </TouchableOpacity>

      <Text style={styles.title}>Raise a Dispute</Text>

      <View style={styles.warningBanner}>
        <MaterialCommunityIcons name="clock-alert" size={16} color={colors.error} />
        <Text style={styles.warningText}>
          You have 6 hours left to raise a dispute.
        </Text>
      </View>

      <Text style={styles.sectionTitle}>Dispute Reason *</Text>
      {disputeReasons.map((reason) => (
        <TouchableOpacity
          key={reason}
          style={[styles.reasonCard, selectedReason === reason && styles.reasonSelected]}
          onPress={() => setSelectedReason(reason)}
        >
          <View style={[styles.radio, selectedReason === reason && styles.radioSelected]} />
          <Text style={styles.reasonText}>{reason}</Text>
        </TouchableOpacity>
      ))}

      <Text style={styles.sectionTitle}>Evidence Photos (up to 5)</Text>
      <View style={styles.photoGrid}>
        {photos.map((_, index) => (
          <View key={index} style={styles.photoSlot}>
            <MaterialCommunityIcons name="image" size={24} color={colors.textTertiary} />
            <TouchableOpacity
              style={styles.removePhoto}
              onPress={() => setPhotos(photos.filter((__, i) => i !== index))}
            >
              <MaterialCommunityIcons name="close-circle" size={16} color={colors.error} />
            </TouchableOpacity>
          </View>
        ))}
        {photos.length < 5 && (
          <TouchableOpacity style={styles.addPhotoSlot} onPress={handleAddPhoto}>
            <MaterialCommunityIcons name="camera-plus" size={24} color={colors.primary} />
          </TouchableOpacity>
        )}
      </View>

      <Input
        label="Description *"
        placeholder="Describe the issue in detail..."
        value={description}
        onChangeText={setDescription}
        multiline
        maxLength={500}
      />

      <Card style={styles.autoEvidence}>
        <MaterialCommunityIcons name="information" size={16} color={colors.textTertiary} />
        <Text style={styles.autoEvidenceText}>
          Your messages and the original listing details are automatically included.
        </Text>
      </Card>

      <Button
        variant="danger"
        label="Submit Dispute"
        onPress={handleSubmit}
        disabled={!selectedReason || !description}
        fullWidth
        size="lg"
      />

      <Modal visible={showConfirmation} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirm Dispute</Text>
            <Text style={styles.modalBody}>
              Are you sure you want to submit this dispute? This action will freeze the escrow funds until resolution.
            </Text>
            <View style={styles.modalActions}>
              <Button variant="ghost" label="Cancel" onPress={() => setShowConfirmation(false)} />
              <Button variant="danger" label="Confirm" onPress={confirmSubmit} />
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: spacing.base,
    paddingTop: spacing.xxxl,
    paddingBottom: spacing.xxl,
  },
  backButton: {
    marginBottom: spacing.lg,
    width: 48,
    height: 48,
    justifyContent: 'center',
  },
  title: {
    ...typography.h1,
    color: colors.textPrimary,
    marginBottom: spacing.base,
  },
  warningBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.errorLight,
    padding: spacing.md,
    borderRadius: radius.md,
    marginBottom: spacing.lg,
  },
  warningText: {
    ...typography.bodySmall,
    color: colors.error,
    marginStart: spacing.sm,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing.md,
    marginTop: spacing.lg,
  },
  reasonCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.base,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    marginBottom: spacing.sm,
  },
  reasonSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primarySurface,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.border,
    marginEnd: spacing.md,
  },
  radioSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  reasonText: {
    ...typography.bodyMedium,
    color: colors.textPrimary,
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.base,
  },
  photoSlot: {
    width: 70,
    height: 70,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  removePhoto: {
    position: 'absolute',
    top: -4,
    right: -4,
  },
  addPhotoSlot: {
    width: 70,
    height: 70,
    borderRadius: radius.md,
    borderWidth: 2,
    borderColor: colors.primary,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  autoEvidence: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceElevated,
    marginBottom: spacing.xl,
  },
  autoEvidenceText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginStart: spacing.sm,
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xxl,
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.xl,
    width: '100%',
  },
  modalTitle: {
    ...typography.h2,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  modalBody: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.md,
  },
  submittedContainer: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.xl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submittedTitle: {
    ...typography.h1,
    color: colors.warning,
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
  },
  frozenCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.trustLight,
    width: '100%',
    marginBottom: spacing.lg,
  },
  frozenText: {
    ...typography.label,
    color: colors.trust,
    marginStart: spacing.md,
  },
  resolutionText: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
    marginBottom: spacing.xxl,
  },
});
