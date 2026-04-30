import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, typography, spacing, radius } from '../theme';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  iconLeft?: keyof typeof MaterialCommunityIcons.glyphMap;
  iconRight?: keyof typeof MaterialCommunityIcons.glyphMap;
  fullWidth?: boolean;
}

const getVariantStyles = (variant: ButtonVariant): { container: ViewStyle; text: TextStyle; iconColor: string } => {
  switch (variant) {
    case 'primary':
      return {
        container: { backgroundColor: colors.primary },
        text: { color: colors.textInverse },
        iconColor: colors.textInverse,
      };
    case 'secondary':
      return {
        container: { backgroundColor: colors.accent },
        text: { color: colors.textPrimary },
        iconColor: colors.textPrimary,
      };
    case 'outline':
      return {
        container: { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: colors.primary },
        text: { color: colors.primary },
        iconColor: colors.primary,
      };
    case 'ghost':
      return {
        container: { backgroundColor: 'transparent' },
        text: { color: colors.primary },
        iconColor: colors.primary,
      };
    case 'danger':
      return {
        container: { backgroundColor: colors.error },
        text: { color: colors.textInverse },
        iconColor: colors.textInverse,
      };
  }
};

const getSizeStyles = (size: ButtonSize): { container: ViewStyle; text: TextStyle; iconSize: number } => {
  switch (size) {
    case 'sm':
      return {
        container: { paddingVertical: spacing.sm, paddingHorizontal: spacing.base, minHeight: 36 },
        text: { fontSize: 13 },
        iconSize: 16,
      };
    case 'md':
      return {
        container: { paddingVertical: spacing.md, paddingHorizontal: spacing.lg, minHeight: 48 },
        text: { fontSize: 15 },
        iconSize: 18,
      };
    case 'lg':
      return {
        container: { paddingVertical: spacing.base, paddingHorizontal: spacing.xl, minHeight: 56 },
        text: { fontSize: 17 },
        iconSize: 20,
      };
  }
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  label,
  onPress,
  loading = false,
  disabled = false,
  iconLeft,
  iconRight,
  fullWidth = false,
}) => {
  const variantStyles = getVariantStyles(variant);
  const sizeStyles = getSizeStyles(size);

  return (
    <TouchableOpacity
      style={[
        styles.base,
        variantStyles.container,
        sizeStyles.container,
        fullWidth && styles.fullWidth,
        disabled && styles.disabled,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      accessibilityLabel={label}
      accessibilityRole="button"
    >
      {loading ? (
        <ActivityIndicator color={variantStyles.iconColor} size="small" />
      ) : (
        <>
          {iconLeft && (
            <MaterialCommunityIcons
              name={iconLeft}
              size={sizeStyles.iconSize}
              color={variantStyles.iconColor}
              style={styles.iconLeft}
            />
          )}
          <Text style={[styles.label, variantStyles.text, sizeStyles.text]}>{label}</Text>
          {iconRight && (
            <MaterialCommunityIcons
              name={iconRight}
              size={sizeStyles.iconSize}
              color={variantStyles.iconColor}
              style={styles.iconRight}
            />
          )}
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
    minHeight: 48,
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
  label: {
    ...typography.label,
    fontWeight: '600',
  },
  iconLeft: {
    marginEnd: spacing.sm,
  },
  iconRight: {
    marginStart: spacing.sm,
  },
});
