import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, typography, spacing, radius, shadows } from '../../theme';
import { Avatar, Badge, Card, StarRating, SectionHeader } from '../../components';
import { useAuthStore } from '../../store/authStore';
import { formatPKR } from '../../data/mockData';

const mockReviews = [
  { id: 'r1', reviewer: 'Ahmed Khan', rating: 5, text: 'Excellent wheat quality. Delivered on time.', date: '2026-04-15' },
  { id: 'r2', reviewer: 'Tariq Mehmood', rating: 4, text: 'Good produce, fair pricing.', date: '2026-03-28' },
  { id: 'r3', reviewer: 'Imran Ali', rating: 5, text: 'Very reliable farmer. Will order again.', date: '2026-03-10' },
];

interface SettingItem {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  label: string;
  danger?: boolean;
}

const settingsItems: SettingItem[] = [
  { icon: 'account-edit', label: 'Edit Profile' },
  { icon: 'bell-cog', label: 'Notification Preferences' },
  { icon: 'translate', label: 'Language: English / Urdu' },
  { icon: 'card-account-details', label: 'KYC Documents' },
  { icon: 'credit-card', label: 'Payment Methods' },
  { icon: 'help-circle', label: 'Help & Support' },
  { icon: 'file-document', label: 'Terms of Service' },
  { icon: 'logout', label: 'Logout', danger: true },
];

export const ProfileScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { user, logout } = useAuthStore();
  const isFarmer = user?.role === 'farmer';

  const handleSettingPress = (label: string) => {
    if (label === 'Logout') {
      logout();
      navigation.reset({ index: 0, routes: [{ name: 'Splash' }] });
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.profileHeader}>
        <TouchableOpacity accessibilityLabel="Change profile photo">
          <Avatar name={user?.name || 'User'} size="lg" verified={user?.verified} />
        </TouchableOpacity>
        <Text style={styles.name}>{user?.name || 'User'}</Text>
        <Badge
          label={isFarmer ? 'Farmer' : 'Buyer/Trader'}
          variant={isFarmer ? 'success' : 'info'}
        />
        {(user?.transactionCount || 0) >= 3 ? (
          <View style={styles.ratingRow}>
            <StarRating rating={user?.rating || 0} count={user?.transactionCount} size={18} />
          </View>
        ) : (
          <Text style={styles.newMember}>New Member</Text>
        )}
      </View>

      <View style={styles.statsRow}>
        {isFarmer ? (
          <>
            <Card style={styles.statCard} elevated>
              <Text style={styles.statValue}>12</Text>
              <Text style={styles.statLabel}>Crops Listed</Text>
            </Card>
            <Card style={styles.statCard} elevated>
              <Text style={styles.statValue}>23</Text>
              <Text style={styles.statLabel}>Total Sold</Text>
            </Card>
            <Card style={styles.statCard} elevated>
              <Text style={styles.statValue}>{formatPKR(845000)}</Text>
              <Text style={styles.statLabel}>Earnings</Text>
            </Card>
          </>
        ) : (
          <>
            <Card style={styles.statCard} elevated>
              <Text style={styles.statValue}>45</Text>
              <Text style={styles.statLabel}>Total Orders</Text>
            </Card>
            <Card style={styles.statCard} elevated>
              <Text style={styles.statValue}>{formatPKR(2100000)}</Text>
              <Text style={styles.statLabel}>Total Spent</Text>
            </Card>
            <Card style={styles.statCard} elevated>
              <Text style={styles.statValue}>8</Text>
              <Text style={styles.statLabel}>Crops</Text>
            </Card>
          </>
        )}
      </View>

      <Card style={styles.aboutCard} elevated>
        <Text style={styles.aboutTitle}>About</Text>
        <View style={styles.aboutRow}>
          <MaterialCommunityIcons name="map-marker" size={16} color={colors.textTertiary} />
          <Text style={styles.aboutText}>
            {user?.location?.district}, {user?.location?.province}
          </Text>
        </View>
        <View style={styles.aboutRow}>
          <MaterialCommunityIcons name="calendar" size={16} color={colors.textTertiary} />
          <Text style={styles.aboutText}>Member since {user?.memberSince}</Text>
        </View>
        {isFarmer && (
          <View style={styles.cropChips}>
            {['Wheat', 'Mango', 'Rice'].map((crop) => (
              <View key={crop} style={styles.cropChip}>
                <Text style={styles.cropChipText}>{crop}</Text>
              </View>
            ))}
          </View>
        )}
      </Card>

      <View style={styles.section}>
        <SectionHeader title="Reviews" />
        {mockReviews.map((review) => (
          <Card key={review.id} style={styles.reviewCard}>
            <View style={styles.reviewHeader}>
              <Avatar name={review.reviewer} size="sm" />
              <View style={styles.reviewInfo}>
                <Text style={styles.reviewerName}>{review.reviewer}</Text>
                <StarRating rating={review.rating} size={12} />
              </View>
              <Text style={styles.reviewDate}>{review.date}</Text>
            </View>
            <Text style={styles.reviewText}>{review.text}</Text>
          </Card>
        ))}
      </View>

      <View style={styles.settingsList}>
        {settingsItems.map((item) => (
          <TouchableOpacity
            key={item.label}
            style={styles.settingsItem}
            onPress={() => handleSettingPress(item.label)}
            accessibilityLabel={item.label}
          >
            <MaterialCommunityIcons
              name={item.icon}
              size={22}
              color={item.danger ? colors.error : colors.textSecondary}
            />
            <Text style={[styles.settingsLabel, item.danger && styles.settingsDanger]}>
              {item.label}
            </Text>
            <MaterialCommunityIcons name="chevron-right" size={20} color={colors.textTertiary} />
          </TouchableOpacity>
        ))}
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
  profileHeader: {
    alignItems: 'center',
    paddingTop: spacing.xxxl,
    paddingBottom: spacing.lg,
    backgroundColor: colors.surface,
  },
  name: {
    ...typography.h1,
    color: colors.textPrimary,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  ratingRow: {
    marginTop: spacing.sm,
  },
  newMember: {
    ...typography.label,
    color: colors.accent,
    marginTop: spacing.sm,
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.base,
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
    textAlign: 'center',
  },
  aboutCard: {
    marginHorizontal: spacing.base,
    marginBottom: spacing.base,
  },
  aboutTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  aboutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  aboutText: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
    marginStart: spacing.sm,
  },
  cropChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  cropChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    backgroundColor: colors.primarySurface,
  },
  cropChipText: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '500',
  },
  section: {
    paddingTop: spacing.base,
  },
  reviewCard: {
    marginHorizontal: spacing.base,
    marginBottom: spacing.sm,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  reviewInfo: {
    flex: 1,
    marginStart: spacing.sm,
  },
  reviewerName: {
    ...typography.label,
    color: colors.textPrimary,
  },
  reviewDate: {
    ...typography.caption,
    color: colors.textTertiary,
  },
  reviewText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  settingsList: {
    marginTop: spacing.lg,
    backgroundColor: colors.surface,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  settingsLabel: {
    ...typography.bodyMedium,
    color: colors.textPrimary,
    flex: 1,
    marginStart: spacing.md,
  },
  settingsDanger: {
    color: colors.error,
  },
  bottomPadding: {
    height: 100,
  },
});
