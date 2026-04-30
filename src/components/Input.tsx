import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, typography, spacing, radius } from '../theme';

interface InputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: keyof typeof MaterialCommunityIcons.glyphMap;
  rightIcon?: keyof typeof MaterialCommunityIcons.glyphMap;
  disabled?: boolean;
  maxLength?: number;
}

export const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  error,
  hint,
  secureTextEntry,
  keyboardType,
  multiline,
  maxLength,
  leftIcon,
  rightIcon,
  disabled,
  ...rest
}) => {
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.container}>
      {label && (
        <Text style={styles.label}>
          {label}
          {rest.accessibilityLabel?.includes('required') && (
            <Text style={styles.required}> *</Text>
          )}
        </Text>
      )}
      <View
        style={[
          styles.inputContainer,
          focused && styles.focused,
          error ? styles.errorBorder : null,
          disabled && styles.disabled,
        ]}
      >
        {leftIcon && (
          <MaterialCommunityIcons
            name={leftIcon}
            size={20}
            color={colors.textTertiary}
            style={styles.leftIcon}
          />
        )}
        <TextInput
          style={[
            styles.input,
            multiline && styles.multiline,
            disabled && styles.disabledText,
          ]}
          placeholder={placeholder}
          placeholderTextColor={colors.textTertiary}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          multiline={multiline}
          maxLength={maxLength}
          editable={!disabled}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          accessibilityLabel={label || placeholder}
          {...rest}
        />
        {rightIcon && (
          <MaterialCommunityIcons
            name={rightIcon}
            size={20}
            color={colors.textTertiary}
            style={styles.rightIcon}
          />
        )}
      </View>
      <View style={styles.footer}>
        {error ? (
          <Text style={styles.error}>{error}</Text>
        ) : hint ? (
          <Text style={styles.hint}>{hint}</Text>
        ) : null}
        {maxLength && value ? (
          <Text style={styles.counter}>
            {value.length}/{maxLength}
          </Text>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.base,
  },
  label: {
    ...typography.label,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  required: {
    color: colors.error,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    minHeight: 48,
  },
  focused: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  errorBorder: {
    borderColor: colors.error,
  },
  disabled: {
    backgroundColor: colors.surfaceElevated,
    opacity: 0.6,
  },
  disabledText: {
    color: colors.textTertiary,
  },
  input: {
    flex: 1,
    ...typography.bodyMedium,
    color: colors.textPrimary,
    paddingVertical: spacing.md,
  },
  multiline: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  leftIcon: {
    marginEnd: spacing.sm,
  },
  rightIcon: {
    marginStart: spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
  },
  error: {
    ...typography.caption,
    color: colors.error,
    flex: 1,
  },
  hint: {
    ...typography.caption,
    color: colors.textTertiary,
    flex: 1,
  },
  counter: {
    ...typography.caption,
    color: colors.textTertiary,
  },
});
