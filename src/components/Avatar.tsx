import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, typography, radius } from '../theme';

type AvatarSize = 'sm' | 'md' | 'lg';

interface AvatarProps {
  uri?: string;
  name: string;
  size?: AvatarSize;
  verified?: boolean;
}

const sizeMap: Record<AvatarSize, number> = {
  sm: 32,
  md: 48,
  lg: 72,
};

const fontSizeMap: Record<AvatarSize, number> = {
  sm: 12,
  md: 18,
  lg: 28,
};

const getInitials = (name: string): string => {
  const parts = name.trim().split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

const getColorFromName = (name: string): string => {
  const bgColors = [colors.primary, colors.trust, colors.accent, colors.warning, '#7B1FA2', '#00695C'];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return bgColors[Math.abs(hash) % bgColors.length];
};

export const Avatar: React.FC<AvatarProps> = ({ uri, name, size = 'md', verified = false }) => {
  const dimension = sizeMap[size];

  return (
    <View style={styles.container} accessibilityLabel={`Avatar for ${name}`}>
      {uri ? (
        <Image
          source={{ uri }}
          style={[styles.image, { width: dimension, height: dimension, borderRadius: dimension / 2 }]}
        />
      ) : (
        <View
          style={[
            styles.initialsContainer,
            {
              width: dimension,
              height: dimension,
              borderRadius: dimension / 2,
              backgroundColor: getColorFromName(name),
            },
          ]}
        >
          <Text style={[styles.initials, { fontSize: fontSizeMap[size] }]}>
            {getInitials(name)}
          </Text>
        </View>
      )}
      {verified && (
        <View style={[styles.verifiedBadge, { right: -2, bottom: -2 }]}>
          <MaterialCommunityIcons name="check-decagram" size={size === 'lg' ? 22 : 16} color={colors.primary} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  image: {
    resizeMode: 'cover',
  },
  initialsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    color: colors.textInverse,
    fontWeight: '700',
  },
  verifiedBadge: {
    position: 'absolute',
    backgroundColor: colors.surface,
    borderRadius: radius.full,
  },
});
