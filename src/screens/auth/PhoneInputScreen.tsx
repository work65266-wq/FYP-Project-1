import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, typography, spacing, radius } from '../../theme';
import { Button, Input } from '../../components';

export const PhoneInputScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  const isValid = phone.replace(/\s/g, '').length === 10;

  const handleSendOTP = () => {
    if (!isValid) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }
    setError('');
    navigation.navigate('OTPVerification', { phone: `+92 ${phone}` });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
        accessibilityLabel="Go back"
      >
        <MaterialCommunityIcons name="arrow-left" size={24} color={colors.textPrimary} />
      </TouchableOpacity>

      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: '33%' }]} />
        </View>
        <Text style={styles.progressText}>Step 1 of 3</Text>
      </View>

      <Text style={styles.title}>Enter your mobile number</Text>
      <Text style={styles.subtitle}>
        We'll send you a one-time verification code via SMS
      </Text>

      <View style={styles.phoneRow}>
        <View style={styles.prefix}>
          <Text style={styles.flag}>🇵🇰</Text>
          <Text style={styles.prefixText}>+92</Text>
        </View>
        <View style={styles.phoneInputContainer}>
          <Input
            placeholder="3XX XXXXXXX"
            value={phone}
            onChangeText={(text) => {
              setPhone(text.replace(/[^0-9]/g, '').slice(0, 10));
              setError('');
            }}
            keyboardType="phone-pad"
            error={error}
          />
        </View>
      </View>

      <Button
        variant="primary"
        label="Send OTP"
        onPress={handleSendOTP}
        disabled={!isValid}
        fullWidth
      />

      <Text style={styles.terms}>
        By continuing, you agree to our{' '}
        <Text style={styles.link}>Terms of Service</Text> and{' '}
        <Text style={styles.link}>Privacy Policy</Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxxl,
  },
  backButton: {
    marginBottom: spacing.lg,
    width: 48,
    height: 48,
    justifyContent: 'center',
  },
  progressContainer: {
    marginBottom: spacing.xl,
  },
  progressBar: {
    height: 4,
    backgroundColor: colors.border,
    borderRadius: radius.full,
    marginBottom: spacing.sm,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: radius.full,
  },
  progressText: {
    ...typography.caption,
    color: colors.textTertiary,
  },
  title: {
    ...typography.h1,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
  },
  prefix: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceElevated,
    paddingHorizontal: spacing.md,
    height: 48,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginEnd: spacing.sm,
    marginTop: spacing.xl,
  },
  flag: {
    fontSize: 18,
    marginEnd: spacing.xs,
  },
  prefixText: {
    ...typography.bodyMedium,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  phoneInputContainer: {
    flex: 1,
  },
  terms: {
    ...typography.caption,
    color: colors.textTertiary,
    textAlign: 'center',
    marginTop: spacing.xl,
    lineHeight: 18,
  },
  link: {
    color: colors.primary,
    fontWeight: '500',
  },
});
