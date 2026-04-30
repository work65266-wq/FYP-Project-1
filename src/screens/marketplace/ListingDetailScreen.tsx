import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, typography, spacing, radius, shadows } from '../../theme';
import { Button, Card, Avatar, StarRating, MandiRateTag, Input } from '../../components';
import { mockMandiRates, formatPKR } from '../../data/mockData';

export const ListingDetailScreen: React.FC<{ navigation: any; route: any }> = ({
  navigation,
  route,
}) => {
  const listing = route.params?.listing;
  const [showEnquiry, setShowEnquiry] = useState(false);
  const [enquiryMessage, setEnquiryMessage] = useState('');
  const [enquiryQuantity, setEnquiryQuantity] = useState('');

  if (!listing) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Listing not found</Text>
      </View>
    );
  }

  const mandiRate = mockMandiRates.find((r) => r.crop === listing.cropType)?.rate || listing.pricePerUnit;

  const quickMessages = [
    "I'm interested",
    'Can you reduce price?',
    "What's minimum order?",
    'When will produce be available?',
  ];

  const detailItems = [
    { label: 'Quantity Available', value: `${listing.quantity} ${listing.unit}` },
    { label: 'Minimum Order', value: listing.minOrder ? `${listing.minOrder} ${listing.unit}` : 'None' },
    { label: 'Grade', value: listing.grade },
    { label: 'Harvest Date', value: listing.harvestDate },
    { label: 'Location', value: `${listing.location.district}, ${listing.location.province}` },
    { label: 'Listing Expires', value: listing.expiresAt },
  ];

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.gallery}>
          <View style={styles.galleryPlaceholder}>
            <MaterialCommunityIcons name="image-multiple" size={48} color={colors.textTertiary} />
            <Text style={styles.galleryText}>Photo Gallery</Text>
          </View>
          <TouchableOpacity
            style={styles.backOverlay}
            onPress={() => navigation.goBack()}
            accessibilityLabel="Go back"
          >
            <MaterialCommunityIcons name="arrow-left" size={24} color={colors.textInverse} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.shareOverlay} accessibilityLabel="Share listing">
            <MaterialCommunityIcons name="share-variant" size={22} color={colors.textInverse} />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <Text style={styles.cropName}>{listing.cropType}</Text>
          <Text style={styles.priceDisplay}>
            {formatPKR(listing.pricePerUnit)} / {listing.unit}
          </Text>
          <MandiRateTag cropPrice={listing.pricePerUnit} mandiRate={mandiRate} unit={listing.unit} />
          <Text style={styles.mandiRef}>
            Current mandi rate: {formatPKR(mandiRate)}/{listing.unit} (updated 18 min ago)
          </Text>

          <View style={styles.detailsGrid}>
            {detailItems.map((item, i) => (
              <View key={i} style={styles.detailItem}>
                <Text style={styles.detailLabel}>{item.label}</Text>
                <Text style={styles.detailValue}>{item.value}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{listing.description}</Text>

          <TouchableOpacity style={styles.sellerCard} activeOpacity={0.7}>
            <Avatar name={listing.seller.name} size="md" verified={listing.seller.verified} />
            <View style={styles.sellerInfo}>
              <Text style={styles.sellerName}>{listing.seller.name}</Text>
              <View style={styles.sellerRating}>
                <StarRating rating={listing.seller.rating} count={listing.seller.transactionCount} size={14} />
              </View>
              <Text style={styles.memberSince}>Member since {listing.seller.memberSince}</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={24} color={colors.textTertiary} />
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.ctaBar}>
        <Text style={styles.ctaPrice}>{formatPKR(listing.pricePerUnit)}/{listing.unit}</Text>
        <Button
          variant="primary"
          label="Send Enquiry"
          onPress={() => setShowEnquiry(true)}
          size="lg"
        />
      </View>

      <Modal visible={showEnquiry} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Send Enquiry</Text>
              <TouchableOpacity onPress={() => setShowEnquiry(false)}>
                <MaterialCommunityIcons name="close" size={24} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.quickChips}>
              {quickMessages.map((msg, i) => (
                <TouchableOpacity
                  key={i}
                  style={styles.quickChip}
                  onPress={() => setEnquiryMessage(msg)}
                >
                  <Text style={styles.quickChipText}>{msg}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Input
              label="Your message"
              placeholder="Write your message..."
              value={enquiryMessage}
              onChangeText={setEnquiryMessage}
              multiline
              maxLength={300}
            />

            <Input
              label={`How many ${listing.unit} do you need?`}
              placeholder="Enter quantity"
              value={enquiryQuantity}
              onChangeText={setEnquiryQuantity}
              keyboardType="numeric"
            />

            <Button
              variant="primary"
              label="Send Enquiry"
              onPress={() => {
                setShowEnquiry(false);
                setEnquiryMessage('');
                setEnquiryQuantity('');
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    ...typography.h2,
    color: colors.textSecondary,
  },
  gallery: {
    height: 250,
    backgroundColor: colors.surfaceElevated,
    position: 'relative',
  },
  galleryPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  galleryText: {
    ...typography.bodySmall,
    color: colors.textTertiary,
    marginTop: spacing.sm,
  },
  backOverlay: {
    position: 'absolute',
    top: spacing.xxxl,
    left: spacing.base,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareOverlay: {
    position: 'absolute',
    top: spacing.xxxl,
    right: spacing.base,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: spacing.base,
  },
  cropName: {
    ...typography.h1,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  priceDisplay: {
    ...typography.displayMedium,
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  mandiRef: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.lg,
  },
  detailItem: {
    width: '50%',
    paddingVertical: spacing.sm,
  },
  detailLabel: {
    ...typography.caption,
    color: colors.textTertiary,
  },
  detailValue: {
    ...typography.label,
    color: colors.textPrimary,
    marginTop: 2,
  },
  sectionTitle: {
    ...typography.h2,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  description: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: spacing.lg,
  },
  sellerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.base,
    ...shadows.sm,
    marginBottom: spacing.xxl,
  },
  sellerInfo: {
    flex: 1,
    marginStart: spacing.md,
  },
  sellerName: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  sellerRating: {
    marginVertical: spacing.xs,
  },
  memberSince: {
    ...typography.caption,
    color: colors.textTertiary,
  },
  ctaBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    ...shadows.lg,
  },
  ctaPrice: {
    ...typography.price,
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
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.base,
  },
  modalTitle: {
    ...typography.h2,
    color: colors.textPrimary,
  },
  quickChips: {
    marginBottom: spacing.base,
  },
  quickChip: {
    backgroundColor: colors.primarySurface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    marginEnd: spacing.sm,
  },
  quickChipText: {
    ...typography.bodySmall,
    color: colors.primary,
  },
});
