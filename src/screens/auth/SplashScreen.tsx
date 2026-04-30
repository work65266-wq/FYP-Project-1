import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, typography, spacing } from '../../theme';
import { useAuthStore } from '../../store/authStore';

export const SplashScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const { isAuthenticated, isOnboarded } = useAuthStore();

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: false,
    }).start();

    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        if (isAuthenticated) {
          navigation.replace('Main');
        } else if (isOnboarded) {
          navigation.replace('RoleSelection');
        } else {
          navigation.replace('Onboarding');
        }
      });
    }, 2000);

    return () => clearTimeout(timer);
  }, [isAuthenticated, isOnboarded, navigation, fadeAnim, progressAnim]);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={styles.content}>
        <MaterialCommunityIcons name="grain" size={80} color={colors.textInverse} />
        <Text style={styles.appName}>AgriConnect</Text>
        <Text style={styles.tagline}>{'\u06A9\u0627\u0634\u062A\u06A9\u0627\u0631 \u0633\u06D2 \u0628\u0627\u0632\u0627\u0631 \u062A\u06A9'}</Text>
        <Text style={styles.taglineEn}>From Farmer to Market</Text>
      </View>
      <View style={styles.progressContainer}>
        <Animated.View style={[styles.progressBar, { width: progressWidth }]} />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  appName: {
    ...typography.displayLarge,
    color: colors.textInverse,
    marginTop: spacing.lg,
  },
  tagline: {
    ...typography.h2,
    color: colors.primaryMuted,
    marginTop: spacing.md,
  },
  taglineEn: {
    ...typography.bodyMedium,
    color: colors.primaryMuted,
    marginTop: spacing.xs,
  },
  progressContainer: {
    height: 3,
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.2)',
    position: 'absolute',
    bottom: 0,
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.primaryMuted,
  },
});
