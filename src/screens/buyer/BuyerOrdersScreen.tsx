import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, typography, spacing, radius, shadows } from '../../theme';
import { Card, Badge, Button, Avatar, EmptyState } from '../../components';
import { mockOrders, formatPKR } from '../../data/mockData';

type OrderTab = 'pending_payment' | 'in_progress' | 'completed' | 'disputed';

const steps = ['Confirmed', 'Dispatched', 'Delivered', 'Released'];

export const BuyerOrdersScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState<OrderTab>('in_progress');

  const getFilteredOrders = () => {
    switch (activeTab) {
      case 'pending_payment':
        return mockOrders.filter((o) => o.status === 'pending_payment');
      case 'in_progress':
        return mockOrders.filter((o) => ['confirmed', 'dispatched', 'delivered'].includes(o.status));
      case 'completed':
        return mockOrders.filter((o) => o.status === 'completed');
      case 'disputed':
        return mockOrders.filter((o) => o.status === 'disputed');
    }
  };

  const getStepIndex = (status: string) => {
    switch (status) {
      case 'confirmed': return 0;
      case 'dispatched': return 1;
      case 'delivered': return 2;
      case 'completed': return 3;
      default: return 0;
    }
  };

  const tabs: { key: OrderTab; label: string }[] = [
    { key: 'pending_payment', label: 'Pending Payment' },
    { key: 'in_progress', label: 'In Progress' },
    { key: 'completed', label: 'Completed' },
    { key: 'disputed', label: 'Disputed' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.tabsContainer}>
        <FlatList
          data={tabs}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.key}
          renderItem={({ item: tab }) => (
            <TouchableOpacity
              style={[styles.tab, activeTab === tab.key && styles.tabActive]}
              onPress={() => setActiveTab(tab.key)}
            >
              <Text style={[styles.tabText, activeTab === tab.key && styles.tabTextActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      <FlatList
        data={getFilteredOrders()}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <EmptyState
            icon="package-variant-closed"
            title="No orders"
            subtitle={`No ${activeTab.replace('_', ' ')} orders.`}
          />
        }
        renderItem={({ item }) => {
          const stepIndex = getStepIndex(item.status);
          return (
            <Card style={styles.orderCard} elevated>
              <View style={styles.orderHeader}>
                <View style={styles.sellerInfo}>
                  <Avatar name={item.seller.name} size="sm" />
                  <View style={styles.sellerDetails}>
                    <Text style={styles.sellerName}>{item.seller.name}</Text>
                    <Text style={styles.cropText}>
                      {item.listing.cropType} · {item.quantity} {item.listing.unit}
                    </Text>
                  </View>
                </View>
                <Text style={styles.totalAmount}>{formatPKR(item.totalAmount)}</Text>
              </View>

              {item.status === 'pending_payment' && (
                <>
                  <Text style={styles.deadline}>Pay within 2h 34m or order auto-cancels</Text>
                  <View style={styles.actionRow}>
                    <Button
                      variant="secondary"
                      label={`Complete Payment`}
                      onPress={() => navigation.navigate('Payment', { order: item })}
                      size="sm"
                    />
                    <Button variant="ghost" label="Cancel" onPress={() => {}} size="sm" />
                  </View>
                </>
              )}

              {['confirmed', 'dispatched', 'delivered'].includes(item.status) && (
                <>
                  {item.escrowStatus === 'locked' && (
                    <View style={styles.escrowBanner}>
                      <MaterialCommunityIcons name="shield-lock" size={16} color={colors.trust} />
                      <Text style={styles.escrowText}>
                        {formatPKR(item.totalAmount)} held securely
                      </Text>
                    </View>
                  )}

                  <View style={styles.stepper}>
                    {steps.map((step, index) => (
                      <View key={step} style={styles.stepItem}>
                        <View
                          style={[
                            styles.stepDot,
                            index <= stepIndex && styles.stepDotActive,
                          ]}
                        >
                          {index <= stepIndex && (
                            <MaterialCommunityIcons name="check" size={12} color={colors.textInverse} />
                          )}
                        </View>
                        <Text
                          style={[
                            styles.stepLabel,
                            index <= stepIndex && styles.stepLabelActive,
                          ]}
                        >
                          {step}
                        </Text>
                      </View>
                    ))}
                  </View>

                  {item.status === 'dispatched' && (
                    <View style={styles.actionRow}>
                      <Button
                        variant="primary"
                        label="Confirm Receipt"
                        onPress={() => {}}
                        size="sm"
                      />
                      <Button
                        variant="ghost"
                        label="Raise Dispute"
                        onPress={() => navigation.navigate('Dispute', { order: item })}
                        size="sm"
                      />
                    </View>
                  )}
                </>
              )}

              {item.status === 'completed' && (
                <Button
                  variant="outline"
                  label="Rate Seller"
                  onPress={() => navigation.navigate('Rating', { order: item })}
                  size="sm"
                  fullWidth
                />
              )}
            </Card>
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
  tabsContainer: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.base,
    paddingTop: spacing.sm,
    ...shadows.sm,
  },
  tab: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.base,
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
  listContent: {
    padding: spacing.base,
    paddingBottom: 100,
  },
  orderCard: {
    marginBottom: spacing.md,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  sellerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  sellerDetails: {
    marginStart: spacing.md,
  },
  sellerName: {
    ...typography.label,
    color: colors.textPrimary,
  },
  cropText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  totalAmount: {
    ...typography.price,
  },
  deadline: {
    ...typography.bodySmall,
    color: colors.warning,
    marginBottom: spacing.md,
  },
  escrowBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.trustLight,
    padding: spacing.md,
    borderRadius: radius.md,
    marginBottom: spacing.md,
  },
  escrowText: {
    ...typography.label,
    color: colors.trust,
    marginStart: spacing.sm,
  },
  stepper: {
    flexDirection: 'row',
    marginVertical: spacing.base,
  },
  stepItem: {
    flex: 1,
    alignItems: 'center',
  },
  stepDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepDotActive: {
    backgroundColor: colors.primary,
  },
  stepLabel: {
    ...typography.caption,
    color: colors.textTertiary,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  stepLabelActive: {
    color: colors.primary,
    fontWeight: '500',
  },
  actionRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
});
