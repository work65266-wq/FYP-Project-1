import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, typography, spacing, radius } from '../theme';

interface MandiRateTagProps {
  cropPrice: number;
  mandiRate: number;
  unit?: string;
}

export const MandiRateTag: React.FC<MandiRateTagProps> = ({
  cropPrice,
  mandiRate,
  unit = 'maund',
}) => {
  const diff = ((cropPrice - mandiRate) / mandiRate) * 100;
  const absDiff = Math.abs(Math.round(diff));

  let bgColor: string;
  let textColor: string;
  let label: string;
  let icon: keyof typeof MaterialCommunityIcons.glyphMap;

  if (diff <= 0) {
    bgColor = colors.successLight;
    textColor = colors.success;
    label = diff === 0 ? 'At mandi rate' : `${absDiff}% below mandi`;
    icon = diff === 0 ? 'minus' : 'arrow-down';
  } else if (diff <= 20) {
    bgColor = colors.warningLight;
    textColor = colors.warning;
    label = `${absDiff}% above mandi`;
    icon = 'arrow-up';
  } else {
    bgColor = colors.errorLight;
    textColor = colors.error;
    label = `${absDiff}% above mandi`;
    icon = 'arrow-up';
  }

  return (
    <View style={[styles.tag, { backgroundColor: bgColor }]} accessibilityLabel={label}>
      <MaterialCommunityIcons name={icon} size={12} color={textColor} />
      <Text style={[styles.label, { color: textColor }]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    alignSelf: 'flex-start',
  },
  label: {
    ...typography.caption,
    fontWeight: '600',
    marginStart: spacing.xs,
  },
});
