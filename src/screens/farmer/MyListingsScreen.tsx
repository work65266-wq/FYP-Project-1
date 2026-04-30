import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, typography, spacing, radius, shadows } from '../../theme';
import { Card, Badge, Button, EmptyState } from '../../components';
import { mockListings, formatPKR } from '../../data/mockData';
import { useAuthStore } from '../../store/authStore';

type FilterTab = 'all' | 'active' | 'sold' | 'expired';

export const MyListingsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const user = useAuthStore((s) => s.user);

  const myListings = mockListings.filter((l) => l.seller.id === (user?.id || 'f1'));
  const filteredListings =
    activeTab === 'all'
      ? myListings
      : myListings.filter((l) => l.status === activeTab);

  const tabs: { key: FilterTab; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'active', label: 'Active' },
    { key: 'sold', label: 'Sold' },
    { key: 'expired', label: 'Expired' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.tabsContainer}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, activeTab === tab.key && styles.tabActive]}
            onPress={() => setActiveTab(tab.key)}
            accessibilityLabel={tab.label}
          >
            <Text style={[styles.tabText, activeTab === tab.key && styles.tabTextActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredListings}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <EmptyState
            icon="package-variant"
            title="No listings found"
            subtitle={`You don't have any ${activeTab !== 'all' ? activeTab : ''} listings yet.`}
            actionLabel="Create Listing"
            onAction={() => navigation.navigate('CreateListing')}
          />
        }
        renderItem={({ item }) => (
          <Card style={styles.listingCard} elevated>
            <TouchableOpacity
              onPress={() => setExpandedId(expandedId === item.id ? null : item.id)}
              activeOpacity={0.7}
            >
              <View style={styles.listingRow}>
                <View style={styles.photoPlaceholder}>
                  <MaterialCommunityIcons name="image" size={28} color={colors.textTertiary} />
                </View>
                <View style={styles.listingInfo}>
                  <View style={styles.listingHeader}>
                    <Text style={styles.cropName}>{item.cropType}</Text>
                    <Badge
                      label={item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                      variant={
                        item.status === 'active'
                          ? 'success'
                          : item.status === 'sold'
                          ? 'info'
                          : 'warning'
                      }
                    />
                  </View>
                  <Text style={styles.detailText}>
                    {item.quantity} {item.unit} · {formatPKR(item.pricePerUnit)}/{item.unit}
                  </Text>
                  <View style={styles.metaRow}>
                    <View style={styles.enquiriesChip}>
                      <MaterialCommunityIcons name="message-outline" size={12} color={colors.primary} />
                      <Text style={styles.enquiriesText}>{item.enquiriesCount} enquiries</Text>
                    </View>
                    <Text style={styles.expiryText}>
                      {item.status === 'active'
                        ? `Expires ${new Date(item.expiresAt).toLocaleDateString()}`
                        : item.status === 'sold'
                        ? 'Sold'
                        : 'Expired'}
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>

            {expandedId === item.id && (
              <View style={styles.actionsRow}>
                <Button
                  variant="outline"
                  label="Edit"
                  size="sm"
                  onPress={() => {}}
                  iconLeft="pencil"
                />
                <Button
                  variant="secondary"
                  label="Mark as Sold"
                  size="sm"
                  onPress={() => {}}
                />
                <Button
                  variant="ghost"
                  label="Extend"
                  size="sm"
                  onPress={() => {}}
                />
                <Button
                  variant="danger"
                  label="Delete"
                  size="sm"
                  onPress={() => {}}
                />
              </View>
            )}
          </Card>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.base,
    paddingTop: spacing.sm,
    ...shadows.sm,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.md,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: colors.primary,
  },
  tabText: {
    ...typography.label,
    color: colors.textTertiary,
  },
  tabTextActive: {
    color: colors.primary,
    fontWeight: '600',
  },
  listContent: {
    padding: spacing.base,
    paddingBottom: 100,
  },
  listingCard: {
    marginBottom: spacing.md,
  },
  listingRow: {
    flexDirection: 'row',
  },
  photoPlaceholder: {
    width: 72,
    height: 72,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
    marginEnd: spacing.md,
  },
  listingInfo: {
    flex: 1,
  },
  listingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  cropName: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  detailText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  enquiriesChip: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  enquiriesText: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '500',
    marginStart: spacing.xs,
  },
  expiryText: {
    ...typography.caption,
    color: colors.textTertiary,
  },
  actionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});
