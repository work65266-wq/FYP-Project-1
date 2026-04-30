import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, typography, spacing, radius } from '../../theme';
import { Button } from '../../components';

export const OTPVerificationScreen: React.FC<{ navigation: any; route: any }> = ({
  navigation,
  route,
}) => {
  const phone = route.params?.phone || '+92 3XX XXXXXXX';
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(45);
  const [attempts, setAttempts] = useState(0);
  const [locked, setLocked] = useState(false);
  const inputRefs = useRef<TextInput[]>([]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleChange = (text: string, index: number) => {
    if (locked) return;

    const newOtp = [...otp];

    if (text.length > 1) {
      const chars = text.split('').slice(0, 6);
      chars.forEach((char, i) => {
        if (index + i < 6) newOtp[index + i] = char;
      });
      setOtp(newOtp);
      const lastIndex = Math.min(index + chars.length, 5);
      inputRefs.current[lastIndex]?.focus();
    } else {
      newOtp[index] = text;
      setOtp(newOtp);
      if (text && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }

    setError('');

    if (newOtp.every((d) => d !== '')) {
      handleVerify(newOtp.join(''));
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = (code?: string) => {
    const otpCode = code || otp.join('');
    if (otpCode.length !== 6) {
      setError('Please enter the complete 6-digit code');
      return;
    }

    if (otpCode === '123456') {
      navigation.navigate('KYCUpload');
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      if (newAttempts >= 3) {
        setLocked(true);
        setError('Too many attempts. Try again in 10 minutes.');
      } else {
        setError('Invalid OTP. Please try again.');
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    }
  };

  const handleResend = () => {
    setCountdown(45);
    setOtp(['', '', '', '', '', '']);
    setError('');
    setAttempts(0);
    setLocked(false);
    inputRefs.current[0]?.focus();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verify your number</Text>
      <View style={styles.phoneRow}>
        <Text style={styles.subtitle}>Code sent to {phone}</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.editLink}>Edit</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => {
              if (ref) inputRefs.current[index] = ref;
            }}
            style={[
              styles.otpBox,
              digit && styles.otpBoxFilled,
              error && styles.otpBoxError,
            ]}
            value={digit}
            onChangeText={(text) => handleChange(text, index)}
            onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
            keyboardType="number-pad"
            maxLength={6}
            editable={!locked}
            accessibilityLabel={`OTP digit ${index + 1}`}
          />
        ))}
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <View style={styles.resendRow}>
        {countdown > 0 ? (
          <Text style={styles.countdown}>
            Resend OTP in 0:{countdown.toString().padStart(2, '0')}
          </Text>
        ) : (
          <TouchableOpacity onPress={handleResend}>
            <Text style={styles.resendLink}>Resend OTP</Text>
          </TouchableOpacity>
        )}
      </View>

      <Button
        variant="primary"
        label="Verify"
        onPress={() => handleVerify()}
        disabled={otp.some((d) => !d) || locked}
        fullWidth
      />
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
  title: {
    ...typography.h1,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  subtitle: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
  },
  editLink: {
    ...typography.label,
    color: colors.primary,
    marginStart: spacing.sm,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.base,
  },
  otpBox: {
    width: 48,
    height: 56,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '700',
    color: colors.textPrimary,
    backgroundColor: colors.surface,
  },
  otpBoxFilled: {
    borderColor: colors.primary,
  },
  otpBoxError: {
    borderColor: colors.error,
  },
  error: {
    ...typography.bodySmall,
    color: colors.error,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  resendRow: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  countdown: {
    ...typography.bodyMedium,
    color: colors.textTertiary,
  },
  resendLink: {
    ...typography.label,
    color: colors.primary,
  },
});
