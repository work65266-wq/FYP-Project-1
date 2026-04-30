import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions, ViewToken } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, typography, spacing, radius } from '../../theme';
import { Button } from '../../components';
import { useAuthStore } from '../../store/authStore';

const { width } = Dimensions.get('window');

interface Slide {
  id: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  title: string;
  body: string;
}

const slides: Slide[] = [
  {
    id: '1',
    icon: 'sprout',
    title: 'Direct from Farm',
    body: 'Farmers list their crops, buyers discover them directly. No middlemen taking your profits.',
  },
  {
    id: '2',
    icon: 'chart-line',
    title: 'Fair Prices, Live Rates',
    body: 'See real mandi rates. Know you\'re getting a fair deal on every transaction.',
  },
  {
    id: '3',
    icon: 'shield-check',
    title: 'Secure Payments',
    body: 'Money held safely in escrow until you\'re satisfied. Full protection for buyers and sellers.',
  },
];

export const OnboardingScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const setOnboarded = useAuthStore((s) => s.setOnboarded);

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index !== null) {
        setCurrentIndex(viewableItems[0].index);
      }
    }
  ).current;

  const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const goNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1, animated: true });
    } else {
      setOnboarded();
      navigation.replace('RoleSelection');
    }
  };

  const skip = () => {
    setOnboarded();
    navigation.replace('RoleSelection');
  };

  const renderSlide = ({ item }: { item: Slide }) => (
    <View style={styles.slide}>
      <View style={styles.illustrationArea}>
        <View style={styles.iconCircle}>
          <MaterialCommunityIcons name={item.icon} size={80} color={colors.primary} />
        </View>
      </View>
      <View style={styles.textArea}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.body}>{item.body}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.dotsContainer}>
        {slides.map((_, i) => (
          <View
            key={i}
            style={[styles.dot, i === currentIndex && styles.dotActive]}
          />
        ))}
      </View>

      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderSlide}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
      />

      <View style={styles.footer}>
        {currentIndex < slides.length - 1 && (
          <Button variant="ghost" label="Skip" onPress={skip} />
        )}
        <View style={styles.spacer} />
        <Button
          variant="primary"
          label={currentIndex === slides.length - 1 ? 'Get Started' : 'Next'}
          onPress={goNext}
          iconRight={currentIndex < slides.length - 1 ? 'arrow-right' : undefined}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: spacing.xxxl,
    paddingBottom: spacing.lg,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.border,
    marginHorizontal: spacing.xs,
  },
  dotActive: {
    backgroundColor: colors.primary,
    width: 24,
  },
  slide: {
    width,
    flex: 1,
    paddingHorizontal: spacing.xl,
  },
  illustrationArea: {
    flex: 0.55,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: colors.primarySurface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textArea: {
    flex: 0.45,
    paddingTop: spacing.xl,
  },
  title: {
    ...typography.h1,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  body: {
    ...typography.bodyLarge,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 26,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  spacer: {
    flex: 1,
  },
});
