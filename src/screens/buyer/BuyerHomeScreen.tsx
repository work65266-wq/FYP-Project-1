import React from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, typography, spacing, radius, shadows } from '../../theme';
import { Avatar, Card, SectionHeader, StarRating, MandiRateTag, Badge } from '../../components';
import { useAuthStore } from '../../store/authStore';
import {
  mockMandiRates,
  mockListings,
  mockOrders,
  cropTypes,
  formatPKR,
  currentBuyer,
} from '../../data/mockData';

const cropIcons: Record<string, keyof typeof MaterialCommunityIcons.glyphMap> = {
  Wheat: 'grain',
  Rice: 'rice',
  Cotton: 'flower',
  Sugarcane: 'grass',
  Maize: 'corn',
  Onion: 'food-variant',
  Potato: 'food-apple',
  Mango: 'fruit-cherries',
  Citrus: 'fruit-citrus',
  Tomato: 'food-apple',
};

export const BuyerHomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const user = useAuthStore((s) => s.user) || currentBuyer;
  const activeListings = mockListings.filter((l) => l.status === 'active');
  const recentOrders = mockOrders.filter((o) => o.buyer.id === user.id).slice(0, 3);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <Avatar name={user.name} size="md" verified={user.verified} />
            <View style={styles.greeting}>
              <Text style={styles.greetingText}>Assalamu Alaikum,</Text>
              <Text style={styles.userName}>{user.name}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.bellButton} accessibilityLabel="Notifications">
            <MaterialCommunityIcons name="bell-outline" size={24} color={colors.textInverse} />
            <View style={styles.bellBadge}>
              <Text style={styles.bellBadgeText}>5</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity
        style={styles.searchBar}
        onPress={() => navigation.navigate('Marketplace')}
        accessibilityLabel="Search crops, regions"
      >
        <MaterialCommunityIcons name="magnify" size={22} color={colors.textTertiary} />
        <Text style={styles.searchPlaceholder}>Search crops, regions...</Text>
      </TouchableOpacity>

      <View style={styles.section}>
        <SectionHeader title="Fresh Listings Near You" actionLabel="See All" onAction={() => navigation.navigate('Marketplace')} />
        <FlatList
          data={activeListings.slice(0, 5)}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.horizontalListContent}
          renderItem={({ item }) => (
            <Card
              style={styles.featuredCard}
              onPress={() => navigation.navigate('ListingDetail', { listing: item })}
              elevated
            >
              <View style={styles.featuredImageArea}>
                <MaterialCommunityIcons
                  name={cropIcons[item.cropType] || 'leaf'}
                  size={40}
                  color={colors.primary}
                />
              </View>
              <View style={styles.featuredOverlay}>
                <Text style={styles.featuredCrop}>{item.cropType}</Text>
                <Text style={styles.featuredQuantity}>{item.quantity} {item.unit}</Text>
                <Text style={styles.featuredPrice}>{formatPKR(item.pricePerUnit)}/{item.unit}</Text>
                <MandiRateTag
                  cropPrice={item.pricePerUnit}
                  mandiRate={mockMandiRates.find((r) => r.crop === item.cropType)?.rate || item.pricePerUnit}
                />
                <View style={styles.featuredSeller}>
                  <StarRating rating={item.seller.rating} size={12} />
                  <Text style={styles.featuredDistrict}>{item.location.district}</Text>
                </View>
              </View>
            </Card>
          )}
        />
      </View>

      <View style={styles.section}>
        <SectionHeader title="Browse by Crop" />
        <View style={styles.cropGrid}>
          {cropTypes.map((crop) => {
            const listingCount = activeListings.filter((l) => l.cropType === crop).length;
            return (
              <TouchableOpacity
                key={crop}
                style={styles.cropTile}
                onPress={() => navigation.navigate('Marketplace', { crop })}
                accessibilityLabel={`${crop}, ${listingCount} listings`}
              >
                <MaterialCommunityIcons
                  name={cropIcons[crop] || 'leaf'}
                  size={32}
                  color={colors.primary}
                />
                <Text style={styles.cropName}>{crop}</Text>
                <Text style={styles.cropCount}>{listingCount} listings</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View style={styles.section}>
        <SectionHeader title="Your Recent Orders" actionLabel="View All" onAction={() => {}} />
        {recentOrders.map((order) => (
          <Card key={order.id} style={styles.orderCard} elevated>
            <View style={styles.orderRow}>
              <View style={styles.orderInfo}>
                <Text style={styles.orderCrop}>{order.listing.cropType}</Text>
                <Text style={styles.orderDetail}>
                  {order.quantity} {order.listing.unit} · {order.seller.name}
                </Text>
              </View>
              <Badge
                label={order.status.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                variant={
                  order.status === 'completed'
                    ? 'success'
                    : order.status === 'disputed'
                    ? 'error'
                    : 'info'
                }
              />
            </View>
          </Card>
        ))}
      </View>

      <View style={styles.section}>
        <SectionHeader title="Live Mandi Rates" />
        <FlatList
          data={mockMandiRates.slice(0, 6)}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.horizontalListContent}
          renderItem={({ item }) => {
            const diff = item.rate - item.previousRate;
            const isUp = diff > 0;
            return (
              <Card style={styles.rateCard} elevated>
                <Text style={styles.rateCrop}>{item.crop}</Text>
                <Text style={styles.ratePrice}>{formatPKR(item.rate)}</Text>
                <View style={styles.rateChange}>
                  <MaterialCommunityIcons
                    name={isUp ? 'arrow-up' : 'arrow-down'}
                    size={14}
                    color={isUp ? colors.success : colors.error}
                  />
                  <Text style={[styles.rateChangeText, { color: isUp ? colors.success : colors.error }]}>
                    {formatPKR(Math.abs(diff))}
                  </Text>
                </View>
              </Card>
            );
          }}
        />
      </View>

      <View style={styles.bottomPadding} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.primary,
    paddingTop: spacing.xxxl,
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.base,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  greeting: {
    marginStart: spacing.md,
  },
  greetingText: {
    ...typography.bodySmall,
    color: colors.primaryMuted,
  },
  userName: {
    ...typography.h3,
    color: colors.textInverse,
  },
  bellButton: {
    position: 'relative',
    padding: spacing.sm,
  },
  bellBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: colors.error,
    borderRadius: radius.full,
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bellBadgeText: {
    ...typography.caption,
    color: colors.textInverse,
    fontSize: 10,
    fontWeight: '700',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    marginHorizontal: spacing.base,
    marginTop: -spacing.md,
    marginBottom: spacing.base,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    ...shadows.md,
  },
  searchPlaceholder: {
    ...typography.bodyMedium,
    color: colors.textTertiary,
    marginStart: spacing.sm,
  },
  section: {
    paddingTop: spacing.lg,
  },
  horizontalListContent: {
    paddingHorizontal: spacing.base,
  },
  featuredCard: {
    width: 200,
    marginEnd: spacing.md,
    padding: 0,
    overflow: 'hidden',
  },
  featuredImageArea: {
    height: 100,
    backgroundColor: colors.primarySurface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featuredOverlay: {
    padding: spacing.md,
  },
  featuredCrop: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  featuredQuantity: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  featuredPrice: {
    ...typography.price,
    marginVertical: spacing.xs,
  },
  featuredSeller: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
  },
  featuredDistrict: {
    ...typography.caption,
    color: colors.textTertiary,
  },
  cropGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.base,
    gap: spacing.sm,
  },
  cropTile: {
    width: '48%',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.base,
    alignItems: 'center',
    ...shadows.sm,
    marginBottom: spacing.sm,
  },
  cropName: {
    ...typography.label,
    color: colors.textPrimary,
    marginTop: spacing.sm,
  },
  cropCount: {
    ...typography.caption,
    color: colors.textTertiary,
  },
  orderCard: {
    marginHorizontal: spacing.base,
    marginBottom: spacing.sm,
  },
  orderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderInfo: {
    flex: 1,
  },
  orderCrop: {
    ...typography.label,
    color: colors.textPrimary,
  },
  orderDetail: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  rateCard: {
    width: 130,
    marginEnd: spacing.md,
    padding: spacing.md,
  },
  rateCrop: {
    ...typography.label,
    color: colors.textPrimary,
  },
  ratePrice: {
    ...typography.h3,
    color: colors.primary,
  },
  rateChange: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  rateChangeText: {
    ...typography.caption,
    fontWeight: '600',
    marginStart: 2,
  },
  bottomPadding: {
    height: 100,
  },
});
