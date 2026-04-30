import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, typography, spacing, radius, shadows } from '../../theme';
import { Button, Input, Card, MandiRateTag } from '../../components';
import { cropTypes, provinces, districtsByProvince, mockMandiRates, formatPKR } from '../../data/mockData';

const grades = ['Grade A', 'Grade B', 'Grade C', 'Custom'];
const units = ['kg', 'maund', 'quintal', 'ton'];

export const CreateListingScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [cropType, setCropType] = useState('');
  const [grade, setGrade] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('maund');
  const [minOrder, setMinOrder] = useState('');
  const [price, setPrice] = useState('');
  const [province, setProvince] = useState('');
  const [district, setDistrict] = useState('');
  const [tehsil, setTehsil] = useState('');
  const [harvestDate, setHarvestDate] = useState('');
  const [description, setDescription] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showCropPicker, setShowCropPicker] = useState(false);

  const mandiRate = mockMandiRates.find((r) => r.crop === cropType);
  const priceNum = parseFloat(price) || 0;
  const priceDiff = mandiRate ? ((priceNum - mandiRate.rate) / mandiRate.rate) * 100 : 0;

  const isValid = cropType && quantity && price && district && harvestDate;

  const handleAddPhoto = () => {
    if (photos.length < 5) {
      setPhotos([...photos, `photo_${photos.length + 1}`]);
    }
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    setShowSuccess(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} accessibilityLabel="Go back">
          <MaterialCommunityIcons name="arrow-left" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Listing</Text>
        <TouchableOpacity>
          <Text style={styles.saveDraft}>Save Draft</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>Crop Details</Text>

        <TouchableOpacity
          style={styles.pickerButton}
          onPress={() => setShowCropPicker(true)}
        >
          <Text style={[styles.pickerText, !cropType && styles.pickerPlaceholder]}>
            {cropType || 'Select Crop Type *'}
          </Text>
          <MaterialCommunityIcons name="chevron-down" size={20} color={colors.textTertiary} />
        </TouchableOpacity>

        <Text style={styles.fieldLabel}>Grade</Text>
        <View style={styles.chipRow}>
          {grades.map((g) => (
            <TouchableOpacity
              key={g}
              style={[styles.chip, grade === g && styles.chipSelected]}
              onPress={() => setGrade(g)}
            >
              <Text style={[styles.chipText, grade === g && styles.chipTextSelected]}>{g}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.row}>
          <View style={styles.flex2}>
            <Input
              label="Quantity *"
              placeholder="Enter quantity"
              value={quantity}
              onChangeText={setQuantity}
              keyboardType="numeric"
            />
          </View>
          <View style={styles.flex1}>
            <Text style={styles.fieldLabel}>Unit</Text>
            <View style={styles.chipRow}>
              {units.slice(0, 2).map((u) => (
                <TouchableOpacity
                  key={u}
                  style={[styles.chipSmall, unit === u && styles.chipSelected]}
                  onPress={() => setUnit(u)}
                >
                  <Text style={[styles.chipText, unit === u && styles.chipTextSelected]}>{u}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        <Input
          label="Minimum Order (optional)"
          placeholder="Min order quantity"
          value={minOrder}
          onChangeText={setMinOrder}
          keyboardType="numeric"
        />

        <Text style={styles.sectionTitle}>Pricing</Text>

        <Input
          label="Price per unit (PKR) *"
          placeholder="Enter price"
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
          leftIcon="currency-inr"
        />

        {mandiRate && priceNum > 0 && (
          <View style={styles.mandiComparison}>
            <MandiRateTag cropPrice={priceNum} mandiRate={mandiRate.rate} unit={unit} />
            <Text style={styles.mandiRefText}>
              Current mandi rate: {formatPKR(mandiRate.rate)}/{unit}
            </Text>
            {priceDiff > 50 && (
              <View style={styles.warningBanner}>
                <MaterialCommunityIcons name="alert" size={16} color={colors.warning} />
                <Text style={styles.warningText}>
                  This price is significantly above market rate. Buyers will see this comparison.
                </Text>
              </View>
            )}
          </View>
        )}

        <Text style={styles.sectionTitle}>Location & Timing</Text>

        <TouchableOpacity
          style={styles.pickerButton}
          onPress={() => {
            const nextProvince = provinces[(provinces.indexOf(province) + 1) % provinces.length];
            setProvince(nextProvince);
            setDistrict('');
          }}
        >
          <Text style={[styles.pickerText, !province && styles.pickerPlaceholder]}>
            {province || 'Select Province *'}
          </Text>
          <MaterialCommunityIcons name="chevron-down" size={20} color={colors.textTertiary} />
        </TouchableOpacity>

        {province ? (
          <TouchableOpacity
            style={styles.pickerButton}
            onPress={() => {
              const districts = districtsByProvince[province] || [];
              const nextDistrict = districts[(districts.indexOf(district) + 1) % districts.length];
              setDistrict(nextDistrict);
            }}
          >
            <Text style={[styles.pickerText, !district && styles.pickerPlaceholder]}>
              {district || 'Select District *'}
            </Text>
            <MaterialCommunityIcons name="chevron-down" size={20} color={colors.textTertiary} />
          </TouchableOpacity>
        ) : null}

        <Input
          label="Tehsil"
          placeholder="Enter tehsil name"
          value={tehsil}
          onChangeText={setTehsil}
        />

        <Input
          label="Harvest Date *"
          placeholder="YYYY-MM-DD"
          value={harvestDate}
          onChangeText={setHarvestDate}
          leftIcon="calendar"
        />

        <Text style={styles.sectionTitle}>Description & Photos</Text>

        <Input
          label="Description"
          placeholder="Describe your produce (quality, storage, etc.)"
          value={description}
          onChangeText={setDescription}
          multiline
          maxLength={500}
        />

        <Text style={styles.fieldLabel}>Photos (up to 5)</Text>
        <View style={styles.photoGrid}>
          {photos.map((_, index) => (
            <View key={index} style={styles.photoSlot}>
              <MaterialCommunityIcons name="image" size={24} color={colors.textTertiary} />
              <TouchableOpacity
                style={styles.removePhoto}
                onPress={() => handleRemovePhoto(index)}
              >
                <MaterialCommunityIcons name="close-circle" size={18} color={colors.error} />
              </TouchableOpacity>
            </View>
          ))}
          {photos.length < 5 && (
            <TouchableOpacity style={styles.addPhotoSlot} onPress={handleAddPhoto}>
              <MaterialCommunityIcons name="camera-plus" size={24} color={colors.primary} />
              <Text style={styles.addPhotoText}>
                {photos.length === 0 ? 'Add Main Photo' : 'Add Photo'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      <View style={styles.submitBar}>
        <Button
          variant="primary"
          label="Post Listing"
          onPress={handleSubmit}
          disabled={!isValid}
          fullWidth
        />
      </View>

      <Modal visible={showCropPicker} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Crop</Text>
            <ScrollView>
              {cropTypes.map((crop) => (
                <TouchableOpacity
                  key={crop}
                  style={styles.modalItem}
                  onPress={() => {
                    setCropType(crop);
                    setShowCropPicker(false);
                  }}
                >
                  <Text style={[styles.modalItemText, cropType === crop && styles.modalItemSelected]}>
                    {crop}
                  </Text>
                  {cropType === crop && (
                    <MaterialCommunityIcons name="check" size={20} color={colors.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
            <Button variant="ghost" label="Cancel" onPress={() => setShowCropPicker(false)} />
          </View>
        </View>
      </Modal>

      <Modal visible={showSuccess} transparent animationType="fade">
        <View style={styles.successOverlay}>
          <View style={styles.successContent}>
            <MaterialCommunityIcons name="check-circle" size={72} color={colors.success} />
            <Text style={styles.successTitle}>Your listing is live!</Text>
            <Button
              variant="primary"
              label="View Listing"
              onPress={() => {
                setShowSuccess(false);
                navigation.goBack();
              }}
              fullWidth
            />
            <View style={styles.successSpacer} />
            <Button
              variant="outline"
              label="Create Another"
              onPress={() => {
                setShowSuccess(false);
                setCropType('');
                setGrade('');
                setQuantity('');
                setPrice('');
                setProvince('');
                setDistrict('');
                setTehsil('');
                setHarvestDate('');
                setDescription('');
                setPhotos([]);
              }}
              fullWidth
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.base,
    paddingTop: spacing.xxxl,
    paddingBottom: spacing.md,
    backgroundColor: colors.surface,
    ...shadows.sm,
  },
  headerTitle: {
    ...typography.h2,
    color: colors.textPrimary,
  },
  saveDraft: {
    ...typography.label,
    color: colors.primary,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: spacing.base,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxxl,
  },
  sectionTitle: {
    ...typography.h2,
    color: colors.textPrimary,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  fieldLabel: {
    ...typography.label,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  pickerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    backgroundColor: colors.surface,
    marginBottom: spacing.base,
    minHeight: 48,
  },
  pickerText: {
    ...typography.bodyMedium,
    color: colors.textPrimary,
  },
  pickerPlaceholder: {
    color: colors.textTertiary,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.base,
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  chipSmall: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  chipSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primarySurface,
  },
  chipText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  chipTextSelected: {
    color: colors.primary,
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  flex1: {
    flex: 1,
  },
  flex2: {
    flex: 2,
  },
  mandiComparison: {
    backgroundColor: colors.surfaceElevated,
    padding: spacing.md,
    borderRadius: radius.md,
    marginBottom: spacing.base,
  },
  mandiRefText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: spacing.sm,
  },
  warningBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.warningLight,
    padding: spacing.md,
    borderRadius: radius.md,
    marginTop: spacing.sm,
  },
  warningText: {
    ...typography.bodySmall,
    color: colors.warning,
    marginStart: spacing.sm,
    flex: 1,
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  photoSlot: {
    width: 80,
    height: 80,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  removePhoto: {
    position: 'absolute',
    top: -6,
    right: -6,
  },
  addPhotoSlot: {
    width: 80,
    height: 80,
    borderRadius: radius.md,
    borderWidth: 2,
    borderColor: colors.primary,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addPhotoText: {
    ...typography.caption,
    color: colors.primary,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  submitBar: {
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    ...shadows.md,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    padding: spacing.xl,
    maxHeight: '70%',
  },
  modalTitle: {
    ...typography.h2,
    color: colors.textPrimary,
    marginBottom: spacing.base,
  },
  modalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalItemText: {
    ...typography.bodyLarge,
    color: colors.textPrimary,
  },
  modalItemSelected: {
    color: colors.primary,
    fontWeight: '600',
  },
  successOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xxl,
  },
  successContent: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.xxl,
    alignItems: 'center',
    width: '100%',
  },
  successTitle: {
    ...typography.h1,
    color: colors.textPrimary,
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
  },
  successSpacer: {
    height: spacing.md,
  },
});
