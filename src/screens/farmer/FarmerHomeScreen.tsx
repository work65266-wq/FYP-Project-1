import React from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, typography, spacing, radius, shadows } from '../../theme';
import { Avatar, Badge, Card, SectionHeader, StarRating, MandiRateTag } from '../../components';
import { useAuthStore } from '../../store/authStore';
import {
  mockMandiRates,
  mockListings,
  mockConversations,
  formatPKR,
  currentFarmer,
} from '../../data/mockData';

export const FarmerHomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const user = useAuthStore((s) => s.user) || currentFarmer;
  const myListings = mockListings.filter((l) => l.seller.id === user.id).slice(0, 3);

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
          <TouchableOpacity
            style={styles.bellButton}
            accessibilityLabel="Notifications"
          >
            <MaterialCommunityIcons name="bell-outline" size={24} color={colors.textInverse} />
            <View style={styles.bellBadge}>
              <Text style={styles.bellBadgeText}>3</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {user.kycStatus === 'pending' && (
        <View style={styles.kycBanner}>
          <MaterialCommunityIcons name="alert" size={20} color={colors.warning} />
          <Text style={styles.kycBannerText}>
            Your identity is under review — you can browse but not list until approved
          </Text>
        </View>
      )}

      <View style={styles.section}>
        <SectionHeader title="Live Mandi Rates" />
        <Text style={styles.updatedText}>Updated 12 min ago</Text>
        <FlatList
          data={mockMandiRates.slice(0, 6)}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.ratesListContent}
          renderItem={({ item }) => {
            const diff = item.rate - item.previousRate;
            const isUp = diff > 0;
            return (
              <Card style={styles.rateCard} elevated>
                <Text style={styles.rateCrop}>{item.crop}</Text>
                <Text style={styles.ratePrice}>{formatPKR(item.rate)}</Text>
                <Text style={styles.rateUnit}>per {item.unit}</Text>
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
          ListFooterComponent={
            <TouchableOpacity style={styles.viewAllRates}>
              <Text style={styles.viewAllText}>View All Rates</Text>
              <MaterialCommunityIcons name="chevron-right" size={16} color={colors.primary} />
            </TouchableOpacity>
          }
        />
      </View>

      <View style={styles.section}>
        <SectionHeader
          title="My Listings"
          actionLabel="Add New"
          onAction={() => navigation.navigate('CreateListing')}
        />
        {myListings.map((listing) => (
          <Card
            key={listing.id}
            style={styles.listingCard}
            onPress={() => navigation.navigate('ListingDetail', { listing })}
            elevated
          >
            <View style={styles.listingRow}>
              <View style={styles.listingPhoto}>
                <MaterialCommunityIcons name="image" size={32} color={colors.textTertiary} />
              </View>
              <View style={styles.listingInfo}>
                <View style={styles.listingHeader}>
                  <Text style={styles.listingCrop}>{listing.cropType}</Text>
                  <Badge
                    label={listing.status.charAt(0).toUpperCase() + listing.status.slice(1)}
                    variant={listing.status === 'active' ? 'success' : listing.status === 'sold' ? 'info' : 'warning'}
                  />
                </View>
                <Text style={styles.listingDetail}>
                  {listing.quantity} {listing.unit} · {formatPKR(listing.pricePerUnit)}/{listing.unit}
                </Text>
                <View style={styles.listingFooter}>
                  <Text style={styles.enquiriesText}>{listing.enquiriesCount} enquiries</Text>
                  <Text style={styles.expiryText}>
                    Expires: {new Date(listing.expiresAt).toLocaleDateString()}
                  </Text>
                </View>
              </View>
            </View>
          </Card>
        ))}
        <TouchableOpacity style={styles.viewAllLink}>
          <Text style={styles.viewAllLinkText}>View All Listings</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <SectionHeader title="Recent Enquiries" />
        {mockConversations.slice(0, 3).map((conv) => (
          <TouchableOpacity
            key={conv.id}
            style={[styles.enquiryItem, conv.unreadCount > 0 && styles.enquiryUnread]}
          >
            <Avatar name={conv.otherParty.name} size="sm" />
            <View style={styles.enquiryContent}>
              <View style={styles.enquiryHeader}>
                <Text style={styles.enquiryName}>{conv.otherParty.name}</Text>
                <Text style={styles.enquiryTime}>{conv.lastMessageTime}</Text>
              </View>
              <Text style={styles.enquiryCrop}>{conv.listing.cropType}</Text>
              <Text style={styles.enquiryMessage} numberOfLines={1}>
                {conv.lastMessage}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.section}>
        <View style={styles.statsRow}>
          <Card style={styles.statCard} elevated>
            <Text style={styles.statValue}>{formatPKR(845000)}</Text>
            <Text style={styles.statLabel}>Total Earnings</Text>
          </Card>
          <Card style={styles.statCard} elevated>
            <Text style={styles.statValue}>23</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </Card>
          <Card style={styles.statCard} elevated>
            <View style={styles.statRating}>
              <MaterialCommunityIcons name="star" size={16} color={colors.accent} />
              <Text style={styles.statValue}> 4.5</Text>
            </View>
            <Text style={styles.statLabel}>Avg Rating</Text>
          </Card>
        </View>
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
  kycBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.warningLight,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
  },
  kycBannerText: {
    ...typography.bodySmall,
    color: colors.warning,
    marginStart: spacing.sm,
    flex: 1,
  },
  section: {
    paddingTop: spacing.lg,
  },
  updatedText: {
    ...typography.caption,
    color: colors.textTertiary,
    paddingHorizontal: spacing.base,
    marginBottom: spacing.sm,
  },
  ratesListContent: {
    paddingHorizontal: spacing.base,
  },
  rateCard: {
    width: 140,
    marginEnd: spacing.md,
    padding: spacing.md,
  },
  rateCrop: {
    ...typography.label,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  ratePrice: {
    ...typography.h3,
    color: colors.primary,
  },
  rateUnit: {
    ...typography.caption,
    color: colors.textTertiary,
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
  viewAllRates: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
    paddingVertical: spacing.xl,
  },
  viewAllText: {
    ...typography.label,
    color: colors.primary,
  },
  listingCard: {
    marginHorizontal: spacing.base,
    marginBottom: spacing.md,
  },
  listingRow: {
    flexDirection: 'row',
  },
  listingPhoto: {
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
  listingCrop: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  listingDetail: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  listingFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  enquiriesText: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '500',
  },
  expiryText: {
    ...typography.caption,
    color: colors.textTertiary,
  },
  viewAllLink: {
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  viewAllLinkText: {
    ...typography.label,
    color: colors.primary,
  },
  enquiryItem: {
    flexDirection: 'row',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  enquiryUnread: {
    borderStartWidth: 3,
    borderStartColor: colors.primary,
    backgroundColor: colors.primarySurface,
  },
  enquiryContent: {
    flex: 1,
    marginStart: spacing.md,
  },
  enquiryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  enquiryName: {
    ...typography.label,
    color: colors.textPrimary,
  },
  enquiryTime: {
    ...typography.caption,
    color: colors.textTertiary,
  },
  enquiryCrop: {
    ...typography.caption,
    color: colors.primary,
  },
  enquiryMessage: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.base,
    gap: spacing.sm,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: spacing.md,
  },
  statValue: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  statLabel: {
    ...typography.caption,
    color: colors.textTertiary,
    marginTop: spacing.xs,
  },
  statRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bottomPadding: {
    height: 100,
  },
});
