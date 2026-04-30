import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, typography, spacing, radius, shadows } from '../../theme';
import { Button } from '../../components';
import { useAuthStore } from '../../store/authStore';

type Role = 'farmer' | 'buyer';

export const RoleSelectionScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const setRole = useAuthStore((s) => s.setRole);

  const handleContinue = () => {
    if (selectedRole) {
      setRole(selectedRole);
      navigation.navigate('PhoneInput');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>AgriConnect</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Who are you?</Text>

        <TouchableOpacity
          style={[styles.card, selectedRole === 'farmer' && styles.cardSelected]}
          onPress={() => setSelectedRole('farmer')}
          activeOpacity={0.7}
          accessibilityLabel="I am a Farmer"
        >
          <MaterialCommunityIcons
            name="tractor"
            size={48}
            color={selectedRole === 'farmer' ? colors.primary : colors.textTertiary}
          />
          <Text style={styles.cardTitle}>I am a Farmer</Text>
          <Text style={styles.cardSubtitle}>
            I grow crops and want to sell them at fair prices
          </Text>
          {selectedRole === 'farmer' && (
            <View style={styles.checkmark}>
              <MaterialCommunityIcons name="check-circle" size={24} color={colors.primary} />
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.card, selectedRole === 'buyer' && styles.cardSelected]}
          onPress={() => setSelectedRole('buyer')}
          activeOpacity={0.7}
          accessibilityLabel="I am a Buyer / Trader"
        >
          <MaterialCommunityIcons
            name="store"
            size={48}
            color={selectedRole === 'buyer' ? colors.accent : colors.textTertiary}
          />
          <Text style={styles.cardTitle}>I am a Buyer / Trader</Text>
          <Text style={styles.cardSubtitle}>
            I want to source quality produce directly from farmers
          </Text>
          {selectedRole === 'buyer' && (
            <View style={styles.checkmark}>
              <MaterialCommunityIcons name="check-circle" size={24} color={colors.primary} />
            </View>
          )}
        </TouchableOpacity>

        <View style={styles.footer}>
          <Button
            variant="primary"
            label="Continue"
            onPress={handleContinue}
            disabled={!selectedRole}
            fullWidth
          />
          <Text style={styles.note}>
            You cannot change this later without admin approval
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.base,
    alignItems: 'center',
  },
  headerTitle: {
    ...typography.h2,
    color: colors.textInverse,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxl,
  },
  title: {
    ...typography.h1,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.xxl,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.xl,
    marginBottom: spacing.base,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border,
    position: 'relative',
    ...shadows.sm,
  },
  cardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primarySurface,
  },
  cardTitle: {
    ...typography.h2,
    color: colors.textPrimary,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  cardSubtitle: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  checkmark: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
  },
  footer: {
    marginTop: 'auto',
    paddingBottom: spacing.xxl,
  },
  note: {
    ...typography.caption,
    color: colors.textTertiary,
    textAlign: 'center',
    marginTop: spacing.md,
  },
});
