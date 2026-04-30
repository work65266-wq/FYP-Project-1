import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, typography, spacing, radius, shadows } from '../../theme';
import { Input, Card, Button, Badge, Avatar, StarRating, MandiRateTag, EmptyState } from '../../components';
import { useListingStore } from '../../store/listingStore';
import { mockMandiRates, cropTypes, provinces, districtsByProvince, formatPKR } from '../../data/mockData';

export const MarketplaceScreen: React.FC<{ navigation: any; route: any }> = ({
  navigation,
  route,
}) => {
  const {
    searchQuery,
    setSearchQuery,
    viewMode,
    setViewMode,
    filters,
    setFilters,
    resetFilters,
    getFilteredListings,
  } = useListingStore();

  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<string>('recent');
  const listings = getFilteredListings();

  const sortOptions = [
    { value: 'recent', label: 'Recently Added' },
    { value: 'price_low', label: 'Price: Low to High' },
    { value: 'price_high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Seller Rating' },
  ];

  const activeFilterCount = [
    filters.cropType.length > 0,
    filters.province !== '',
    filters.minRating > 0,
    filters.priceRange[0] > 0 || filters.priceRange[1] < 100000,
  ].filter(Boolean).length;

  const renderListItem = ({ item }: { item: any }) => {
    const mandiRate = mockMandiRates.find((r) => r.crop === item.cropType)?.rate || item.pricePerUnit;

    if (viewMode === 'grid') {
      return (
        <Card
          style={styles.gridCard}
          onPress={() => navigation.navigate('ListingDetail', { listing: item })}
          elevated
        >
          <View style={styles.gridPhoto}>
            <MaterialCommunityIcons name="image" size={32} color={colors.textTertiary} />
          </View>
          <View style={styles.gridContent}>
            <Text style={styles.gridCrop}>{item.cropType}</Text>
            <Text style={styles.gridPrice}>{formatPKR(item.pricePerUnit)}</Text>
            <MandiRateTag cropPrice={item.pricePerUnit} mandiRate={mandiRate} />
            <Text style={styles.gridDistrict}>{item.location.district}</Text>
          </View>
        </Card>
      );
    }

    return (
      <Card
        style={styles.listCard}
        onPress={() => navigation.navigate('ListingDetail', { listing: item })}
        elevated
      >
        <View style={styles.listRow}>
          <View style={styles.listPhoto}>
            <MaterialCommunityIcons name="image" size={28} color={colors.textTertiary} />
          </View>
          <View style={styles.listContent}>
            <Text style={styles.listCrop}>{item.cropType}</Text>
            <MandiRateTag cropPrice={item.pricePerUnit} mandiRate={mandiRate} />
            <Text style={styles.listQuantity}>
              {item.quantity} {item.unit} available
            </Text>
            <Text style={styles.listLocation}>
              {item.location.district}, {item.location.province}
            </Text>
            <View style={styles.sellerRow}>
              <Avatar name={item.seller.name} size="sm" />
              <Text style={styles.sellerName}>{item.seller.name}</Text>
              <StarRating rating={item.seller.rating} size={14} />
            </View>
          </View>
        </View>
        <View style={styles.listFooter}>
          <Text style={styles.listPrice}>{formatPKR(item.pricePerUnit)}/{item.unit}</Text>
          <Button variant="outline" label="View" size="sm" onPress={() => navigation.navigate('ListingDetail', { listing: item })} />
        </View>
      </Card>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.searchRow}>
          <View style={styles.searchInput}>
            <Input
              placeholder="Search crops, regions..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              leftIcon="magnify"
            />
          </View>
        </View>
        <View style={styles.filterRow}>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setShowFilters(true)}
          >
            <MaterialCommunityIcons name="filter-variant" size={18} color={colors.primary} />
            <Text style={styles.filterButtonText}>Filters</Text>
            {activeFilterCount > 0 && (
              <View style={styles.filterBadge}>
                <Text style={styles.filterBadgeText}>{activeFilterCount}</Text>
              </View>
            )}
          </TouchableOpacity>

          <View style={styles.sortContainer}>
            {sortOptions.map((opt) => (
              <TouchableOpacity
                key={opt.value}
                onPress={() => {
                  setSortBy(opt.value);
                  setFilters({ sortBy: opt.value as any });
                }}
                style={[styles.sortChip, sortBy === opt.value && styles.sortChipActive]}
              >
                <Text style={[styles.sortChipText, sortBy === opt.value && styles.sortChipTextActive]}>
                  {opt.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.viewToggle}>
            <TouchableOpacity
              onPress={() => setViewMode('list')}
              style={[styles.viewBtn, viewMode === 'list' && styles.viewBtnActive]}
            >
              <MaterialCommunityIcons name="view-list" size={20} color={viewMode === 'list' ? colors.primary : colors.textTertiary} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setViewMode('grid')}
              style={[styles.viewBtn, viewMode === 'grid' && styles.viewBtnActive]}
            >
              <MaterialCommunityIcons name="view-grid" size={20} color={viewMode === 'grid' ? colors.primary : colors.textTertiary} />
            </TouchableOpacity>
          </View>
        </View>
        <Text style={styles.resultsCount}>{listings.length} listings found</Text>
      </View>

      <FlatList
        data={listings}
        keyExtractor={(item) => item.id}
        renderItem={renderListItem}
        numColumns={viewMode === 'grid' ? 2 : 1}
        key={viewMode}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <EmptyState
            icon="magnify"
            title="No listings found"
            subtitle="Try adjusting your filters or search terms"
            actionLabel="Clear Filters"
            onAction={resetFilters}
          />
        }
      />

      <Modal visible={showFilters} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filters</Text>
              <TouchableOpacity onPress={() => setShowFilters(false)}>
                <MaterialCommunityIcons name="close" size={24} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <Text style={styles.filterLabel}>Crop Type</Text>
              <View style={styles.chipGrid}>
                {cropTypes.map((crop) => (
                  <TouchableOpacity
                    key={crop}
                    style={[
                      styles.filterChip,
                      filters.cropType.includes(crop) && styles.filterChipActive,
                    ]}
                    onPress={() => {
                      const updated = filters.cropType.includes(crop)
                        ? filters.cropType.filter((c) => c !== crop)
                        : [...filters.cropType, crop];
                      setFilters({ cropType: updated });
                    }}
                  >
                    <Text
                      style={[
                        styles.filterChipText,
                        filters.cropType.includes(crop) && styles.filterChipTextActive,
                      ]}
                    >
                      {crop}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.filterLabel}>Province</Text>
              <View style={styles.chipGrid}>
                {provinces.map((p) => (
                  <TouchableOpacity
                    key={p}
                    style={[
                      styles.filterChip,
                      filters.province === p && styles.filterChipActive,
                    ]}
                    onPress={() => setFilters({ province: filters.province === p ? '' : p })}
                  >
                    <Text
                      style={[
                        styles.filterChipText,
                        filters.province === p && styles.filterChipTextActive,
                      ]}
                    >
                      {p}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.filterLabel}>Minimum Seller Rating</Text>
              <View style={styles.chipGrid}>
                {[1, 2, 3, 4, 5].map((r) => (
                  <TouchableOpacity
                    key={r}
                    style={[
                      styles.filterChip,
                      filters.minRating === r && styles.filterChipActive,
                    ]}
                    onPress={() => setFilters({ minRating: filters.minRating === r ? 0 : r })}
                  >
                    <Text
                      style={[
                        styles.filterChipText,
                        filters.minRating === r && styles.filterChipTextActive,
                      ]}
                    >
                      {r}+ stars
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <Button variant="ghost" label="Clear All" onPress={() => { resetFilters(); setShowFilters(false); }} />
              <Button variant="primary" label="Apply Filters" onPress={() => setShowFilters(false)} />
            </View>
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
  searchContainer: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.base,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
    ...shadows.sm,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primarySurface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
  },
  filterButtonText: {
    ...typography.label,
    color: colors.primary,
    marginStart: spacing.xs,
  },
  filterBadge: {
    backgroundColor: colors.primary,
    borderRadius: radius.full,
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginStart: spacing.xs,
  },
  filterBadgeText: {
    ...typography.caption,
    color: colors.textInverse,
    fontSize: 10,
    fontWeight: '700',
  },
  sortContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    flex: 1,
  },
  sortChip: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceElevated,
  },
  sortChipActive: {
    backgroundColor: colors.primarySurface,
  },
  sortChipText: {
    ...typography.caption,
    color: colors.textTertiary,
  },
  sortChipTextActive: {
    color: colors.primary,
    fontWeight: '600',
  },
  viewToggle: {
    flexDirection: 'row',
    borderRadius: radius.sm,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  viewBtn: {
    padding: spacing.sm,
  },
  viewBtnActive: {
    backgroundColor: colors.primarySurface,
  },
  resultsCount: {
    ...typography.caption,
    color: colors.textTertiary,
    marginTop: spacing.xs,
  },
  listContainer: {
    padding: spacing.base,
    paddingBottom: 100,
  },
  listCard: {
    marginBottom: spacing.md,
  },
  listRow: {
    flexDirection: 'row',
  },
  listPhoto: {
    width: 80,
    height: 80,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
    marginEnd: spacing.md,
  },
  listContent: {
    flex: 1,
  },
  listCrop: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  listQuantity: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  listLocation: {
    ...typography.caption,
    color: colors.textTertiary,
  },
  sellerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
    gap: spacing.xs,
  },
  sellerName: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  listFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  listPrice: {
    ...typography.price,
  },
  gridCard: {
    flex: 1,
    margin: spacing.xs,
    padding: 0,
    overflow: 'hidden',
  },
  gridPhoto: {
    height: 100,
    backgroundColor: colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridContent: {
    padding: spacing.sm,
  },
  gridCrop: {
    ...typography.label,
    color: colors.textPrimary,
  },
  gridPrice: {
    ...typography.price,
    fontSize: 16,
    marginVertical: spacing.xs,
  },
  gridDistrict: {
    ...typography.caption,
    color: colors.textTertiary,
    marginTop: spacing.xs,
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
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    ...typography.h2,
    color: colors.textPrimary,
  },
  modalBody: {
    padding: spacing.xl,
  },
  filterLabel: {
    ...typography.label,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    marginTop: spacing.base,
  },
  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  filterChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  filterChipActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primarySurface,
  },
  filterChipText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  filterChipTextActive: {
    color: colors.primary,
    fontWeight: '600',
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: spacing.xl,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});
