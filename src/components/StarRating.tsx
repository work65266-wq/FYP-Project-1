import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, typography, spacing } from '../theme';

interface StarRatingProps {
  rating: number;
  count?: number;
  size?: number;
  interactive?: boolean;
  onRate?: (rating: number) => void;
}

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  count,
  size = 18,
  interactive = false,
  onRate,
}) => {
  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      const iconName = i <= Math.floor(rating)
        ? 'star'
        : i - 0.5 <= rating
        ? 'star-half-full'
        : 'star-outline';

      const star = (
        <TouchableOpacity
          key={i}
          disabled={!interactive}
          onPress={() => onRate?.(i)}
          accessibilityLabel={`${i} star${i > 1 ? 's' : ''}`}
        >
          <MaterialCommunityIcons
            name={iconName}
            size={size}
            color={colors.accent}
            style={styles.star}
          />
        </TouchableOpacity>
      );
      stars.push(star);
    }
    return stars;
  };

  return (
    <View style={styles.container}>
      <View style={styles.starsRow}>{renderStars()}</View>
      {count !== undefined && count < 3 ? (
        <Text style={styles.newText}>New</Text>
      ) : count !== undefined ? (
        <Text style={styles.count}>({count})</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starsRow: {
    flexDirection: 'row',
  },
  star: {
    marginEnd: 1,
  },
  count: {
    ...typography.caption,
    color: colors.textTertiary,
    marginStart: spacing.xs,
  },
  newText: {
    ...typography.caption,
    color: colors.accent,
    fontWeight: '600',
    marginStart: spacing.xs,
  },
});
