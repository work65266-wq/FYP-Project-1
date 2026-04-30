import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { colors, spacing, radius } from '../theme';

type SkeletonVariant = 'card' | 'listItem' | 'profile';

interface SkeletonLoaderProps {
  variant?: SkeletonVariant;
  count?: number;
}

const SkeletonBlock: React.FC<{ width: number | string; height: number; style?: object }> = ({
  width,
  height,
  style,
}) => {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.7, duration: 800, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.3, duration: 800, useNativeDriver: true }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        styles.block,
        { width: width as number, height, opacity },
        style,
      ]}
    />
  );
};

const CardSkeleton = () => (
  <View style={styles.card}>
    <SkeletonBlock width="100%" height={120} style={{ borderRadius: radius.md }} />
    <SkeletonBlock width="70%" height={16} style={{ marginTop: spacing.md }} />
    <SkeletonBlock width="40%" height={14} style={{ marginTop: spacing.sm }} />
    <SkeletonBlock width="50%" height={14} style={{ marginTop: spacing.sm }} />
  </View>
);

const ListItemSkeleton = () => (
  <View style={styles.listItem}>
    <SkeletonBlock width={48} height={48} style={{ borderRadius: 24 }} />
    <View style={styles.listContent}>
      <SkeletonBlock width="60%" height={14} />
      <SkeletonBlock width="80%" height={12} style={{ marginTop: spacing.sm }} />
    </View>
  </View>
);

const ProfileSkeleton = () => (
  <View style={styles.profile}>
    <SkeletonBlock width={72} height={72} style={{ borderRadius: 36 }} />
    <SkeletonBlock width="50%" height={18} style={{ marginTop: spacing.md }} />
    <SkeletonBlock width="30%" height={14} style={{ marginTop: spacing.sm }} />
    <View style={styles.statsRow}>
      <SkeletonBlock width="30%" height={60} style={{ borderRadius: radius.md }} />
      <SkeletonBlock width="30%" height={60} style={{ borderRadius: radius.md }} />
      <SkeletonBlock width="30%" height={60} style={{ borderRadius: radius.md }} />
    </View>
  </View>
);

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ variant = 'card', count = 1 }) => {
  const items = Array.from({ length: count }, (_, i) => i);

  return (
    <View>
      {items.map((i) => {
        switch (variant) {
          case 'card':
            return <CardSkeleton key={i} />;
          case 'listItem':
            return <ListItemSkeleton key={i} />;
          case 'profile':
            return <ProfileSkeleton key={i} />;
        }
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  block: {
    backgroundColor: colors.border,
    borderRadius: radius.sm,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.base,
    marginBottom: spacing.md,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  listContent: {
    flex: 1,
    marginStart: spacing.md,
  },
  profile: {
    alignItems: 'center',
    padding: spacing.xl,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: spacing.lg,
    gap: spacing.md,
  },
});
