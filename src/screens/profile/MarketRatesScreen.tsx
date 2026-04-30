import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, typography, spacing, radius, shadows } from '../../theme';
import { Input } from '../../components';
import { mockMandiRates, provinces, formatPKR } from '../../data/mockData';

export const MarketRatesScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('');

  let filteredRates = mockMandiRates;

  if (searchQuery) {
    filteredRates = filteredRates.filter((r) =>
      r.crop.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  if (selectedProvince) {
    filteredRates = filteredRates.filter((r) => r.province === selectedProvince);
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Input
          placeholder="Search by crop name..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          leftIcon="magnify"
        />
      </View>

      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, !selectedProvince && styles.tabActive]}
          onPress={() => setSelectedProvince('')}
        >
          <Text style={[styles.tabText, !selectedProvince && styles.tabTextActive]}>All</Text>
        </TouchableOpacity>
        {provinces.map((p) => (
          <TouchableOpacity
            key={p}
            style={[styles.tab, selectedProvince === p && styles.tabActive]}
            onPress={() => setSelectedProvince(selectedProvince === p ? '' : p)}
          >
            <Text style={[styles.tabText, selectedProvince === p && styles.tabTextActive]}>
              {p}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.updatedBanner}>
        <MaterialCommunityIcons name="clock-outline" size={14} color={colors.textTertiary} />
        <Text style={styles.updatedText}>Last updated 12 min ago</Text>
      </View>

      <FlatList
        data={filteredRates}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => {
          const diff = item.rate - item.previousRate;
          const isUp = diff > 0;
          const isUnchanged = diff === 0;

          return (
            <View style={styles.rateRow}>
              <View style={styles.rateInfo}>
                <Text style={styles.rateCrop}>{item.crop}</Text>
                <Text style={styles.rateMandi}>{item.mandi}</Text>
              </View>
              <View style={styles.rateValues}>
                <Text style={styles.ratePrice}>{formatPKR(item.rate)}</Text>
                <Text style={styles.rateUnit}>per {item.unit}</Text>
              </View>
              <View style={styles.rateChange}>
                {isUnchanged ? (
                  <Text style={styles.unchangedText}>—</Text>
                ) : (
                  <>
                    <MaterialCommunityIcons
                      name={isUp ? 'arrow-up' : 'arrow-down'}
                      size={16}
                      color={isUp ? colors.success : colors.error}
                    />
                    <Text style={[styles.changeText, { color: isUp ? colors.success : colors.error }]}>
                      {formatPKR(Math.abs(diff))}
                    </Text>
                  </>
                )}
              </View>
            </View>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.base,
    paddingTop: spacing.xxxl,
    backgroundColor: colors.surface,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.sm,
    ...shadows.sm,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.md,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: colors.primary,
  },
  tabText: {
    ...typography.caption,
    color: colors.textTertiary,
  },
  tabTextActive: {
    color: colors.primary,
    fontWeight: '600',
  },
  updatedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surfaceElevated,
  },
  updatedText: {
    ...typography.caption,
    color: colors.textTertiary,
    marginStart: spacing.xs,
  },
  listContent: {
    paddingBottom: 100,
  },
  rateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
  },
  rateInfo: {
    flex: 1,
  },
  rateCrop: {
    ...typography.label,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  rateMandi: {
    ...typography.caption,
    color: colors.textTertiary,
  },
  rateValues: {
    alignItems: 'flex-end',
    marginEnd: spacing.base,
  },
  ratePrice: {
    ...typography.h3,
    color: colors.primary,
  },
  rateUnit: {
    ...typography.caption,
    color: colors.textTertiary,
  },
  rateChange: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 80,
    justifyContent: 'flex-end',
  },
  changeText: {
    ...typography.label,
    marginStart: spacing.xs,
  },
  unchangedText: {
    ...typography.label,
    color: colors.textTertiary,
  },
});
