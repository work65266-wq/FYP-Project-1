import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing, radius } from '../theme';

type BadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'neutral';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
}

const getVariantColors = (variant: BadgeVariant) => {
  switch (variant) {
    case 'success':
      return { bg: colors.successLight, text: colors.success };
    case 'warning':
      return { bg: colors.warningLight, text: colors.warning };
    case 'error':
      return { bg: colors.errorLight, text: colors.error };
    case 'info':
      return { bg: colors.trustLight, text: colors.trust };
    case 'neutral':
      return { bg: colors.surfaceElevated, text: colors.textSecondary };
  }
};

export const Badge: React.FC<BadgeProps> = ({ label, variant = 'neutral' }) => {
  const variantColors = getVariantColors(variant);

  return (
    <View style={[styles.badge, { backgroundColor: variantColors.bg }]}>
      <Text style={[styles.label, { color: variantColors.text }]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    alignSelf: 'flex-start',
  },
  label: {
    ...typography.caption,
    fontWeight: '600',
  },
});
