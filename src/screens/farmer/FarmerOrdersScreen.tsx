import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, typography, spacing, radius, shadows } from '../../theme';
import { Card, Badge, Button, Avatar, EmptyState } from '../../components';
import { mockOrders, formatPKR } from '../../data/mockData';

type OrderTab = 'pending' | 'in_progress' | 'completed' | 'disputed';

const steps = ['Confirmed', 'Dispatched', 'Delivered', 'Released'];

export const FarmerOrdersScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState<OrderTab>('in_progress');

  const getFilteredOrders = () => {
    switch (activeTab) {
      case 'pending':
        return mockOrders.filter((o) => o.status === 'pending_payment' || o.status === 'confirmed');
      case 'in_progress':
        return mockOrders.filter((o) => o.status === 'dispatched' || o.status === 'confirmed');
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
    { key: 'pending', label: 'Pending' },
    { key: 'in_progress', label: 'In Progress' },
    { key: 'completed', label: 'Completed' },
    { key: 'disputed', label: 'Disputed' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.tabsContainer}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, activeTab === tab.key && styles.tabActive]}
            onPress={() => setActiveTab(tab.key)}
          >
            <Text style={[styles.tabText, activeTab === tab.key && styles.tabTextActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={getFilteredOrders()}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <EmptyState
            icon="package-variant-closed"
            title="No orders"
            subtitle={`No ${activeTab.replace('_', ' ')} orders at the moment.`}
          />
        }
        renderItem={({ item }) => {
          const stepIndex = getStepIndex(item.status);
          return (
            <Card style={styles.orderCard} elevated>
              <View style={styles.orderHeader}>
                <View style={styles.buyerInfo}>
                  <Avatar name={item.buyer.name} size="sm" />
                  <View style={styles.buyerDetails}>
                    <Text style={styles.buyerName}>{item.buyer.name}</Text>
                    <Text style={styles.orderDate}>{item.createdAt}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.orderDetails}>
                <Text style={styles.cropName}>{item.listing.cropType}</Text>
                <Text style={styles.quantityText}>
                  {item.quantity} {item.listing.unit}
                </Text>
                <Text style={styles.totalAmount}>{formatPKR(item.totalAmount)}</Text>
              </View>

              {item.escrowStatus === 'locked' && (
                <Badge label={`Funds locked (${formatPKR(item.totalAmount)})`} variant="info" />
              )}

              {item.status === 'completed' && (
                <Badge label="Funds Released" variant="success" />
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
                    {index < steps.length - 1 && (
                      <View
                        style={[
                          styles.stepLine,
                          index < stepIndex && styles.stepLineActive,
                        ]}
                      />
                    )}
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

              {item.status === 'confirmed' && (
                <Button
                  variant="primary"
                  label="Mark as Dispatched"
                  onPress={() => {}}
                  size="sm"
                  fullWidth
                />
              )}

              {item.status === 'completed' && item.buyer && (
                <Button
                  variant="outline"
                  label={`Rate ${item.buyer.name}`}
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
    flexDirection: 'row',
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.base,
    paddingTop: spacing.sm,
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
    marginBottom: spacing.md,
  },
  buyerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buyerDetails: {
    marginStart: spacing.md,
  },
  buyerName: {
    ...typography.label,
    color: colors.textPrimary,
  },
  orderDate: {
    ...typography.caption,
    color: colors.textTertiary,
  },
  orderDetails: {
    marginBottom: spacing.md,
  },
  cropName: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  quantityText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  totalAmount: {
    ...typography.price,
    marginTop: spacing.xs,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'flex-start',
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
  stepLine: {
    position: 'absolute',
    top: 11,
    left: '50%',
    right: '-50%',
    height: 2,
    backgroundColor: colors.border,
    zIndex: -1,
  },
  stepLineActive: {
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
});
