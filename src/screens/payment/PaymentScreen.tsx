import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, typography, spacing, radius, shadows } from '../../theme';
import { Button, Card, Input } from '../../components';
import { formatPKR } from '../../data/mockData';

type PaymentMethod = 'easypaisa' | 'jazzcash' | 'bank';

export const PaymentScreen: React.FC<{ navigation: any; route: any }> = ({
  navigation,
  route,
}) => {
  const order = route.params?.order;
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [mobileNumber, setMobileNumber] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [bankName, setBankName] = useState('');
  const [loading, setLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [feeExpanded, setFeeExpanded] = useState(false);

  const subtotal = order?.totalAmount || 45000;
  const platformFee = Math.round(subtotal * 0.02);
  const total = subtotal + platformFee;

  const handlePay = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setShowConfirmation(true);
    }, 2000);
  };

  if (showConfirmation) {
    return (
      <View style={styles.confirmationContainer}>
        <MaterialCommunityIcons name="shield-check" size={80} color={colors.trust} />
        <Text style={styles.confirmTitle}>Payment Secured in Escrow</Text>
        <Text style={styles.confirmRef}>Transaction Ref: AC-TXN-{Date.now().toString().slice(-8)}</Text>

        <Card style={styles.nextSteps} elevated>
          <Text style={styles.nextStepsTitle}>What happens next</Text>
          <View style={styles.stepGuide}>
            <View style={styles.guideStep}>
              <View style={styles.guideNumber}><Text style={styles.guideNumberText}>1</Text></View>
              <Text style={styles.guideText}>Farmer dispatches your order</Text>
            </View>
            <View style={styles.guideStep}>
              <View style={styles.guideNumber}><Text style={styles.guideNumberText}>2</Text></View>
              <Text style={styles.guideText}>You confirm receipt of produce</Text>
            </View>
            <View style={styles.guideStep}>
              <View style={styles.guideNumber}><Text style={styles.guideNumberText}>3</Text></View>
              <Text style={styles.guideText}>Funds released to farmer</Text>
            </View>
          </View>
        </Card>

        <View style={styles.confirmActions}>
          <Button variant="primary" label="View Order" onPress={() => navigation.goBack()} fullWidth />
          <View style={styles.actionSpacer} />
          <Button variant="outline" label="Message Seller" onPress={() => {}} fullWidth />
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton} accessibilityLabel="Go back">
        <MaterialCommunityIcons name="arrow-left" size={24} color={colors.textPrimary} />
      </TouchableOpacity>

      <Card style={styles.summaryCard} elevated>
        <Text style={styles.summaryTitle}>Order Summary</Text>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>
            {order?.listing?.cropType || 'Crop'} · {order?.quantity || 20} {order?.listing?.unit || 'maund'}
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Seller</Text>
          <Text style={styles.summaryValue}>{order?.seller?.name || 'Seller'}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Subtotal</Text>
          <Text style={styles.summaryValue}>{formatPKR(subtotal)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Platform fee (2%)</Text>
          <Text style={styles.summaryValue}>{formatPKR(platformFee)}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.summaryRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>{formatPKR(total)}</Text>
        </View>
      </Card>

      <TouchableOpacity
        style={styles.feeExplainer}
        onPress={() => setFeeExpanded(!feeExpanded)}
      >
        <MaterialCommunityIcons name="information" size={16} color={colors.info} />
        <Text style={styles.feeExplainerText}>Platform fee info</Text>
        <MaterialCommunityIcons
          name={feeExpanded ? 'chevron-up' : 'chevron-down'}
          size={16}
          color={colors.info}
        />
      </TouchableOpacity>
      {feeExpanded && (
        <Text style={styles.feeDetail}>
          2% is deducted when funds are released to the farmer. This is how AgriConnect operates.
        </Text>
      )}

      <Text style={styles.sectionTitle}>Payment Method</Text>

      <TouchableOpacity
        style={[styles.methodCard, selectedMethod === 'easypaisa' && styles.methodSelected]}
        onPress={() => setSelectedMethod('easypaisa')}
      >
        <View style={[styles.radio, selectedMethod === 'easypaisa' && styles.radioSelected]} />
        <Text style={styles.methodIcon}>🟢</Text>
        <Text style={styles.methodLabel}>Easypaisa</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.methodCard, selectedMethod === 'jazzcash' && styles.methodSelected]}
        onPress={() => setSelectedMethod('jazzcash')}
      >
        <View style={[styles.radio, selectedMethod === 'jazzcash' && styles.radioSelected]} />
        <Text style={styles.methodIcon}>🔵</Text>
        <Text style={styles.methodLabel}>JazzCash</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.methodCard, selectedMethod === 'bank' && styles.methodSelected]}
        onPress={() => setSelectedMethod('bank')}
      >
        <View style={[styles.radio, selectedMethod === 'bank' && styles.radioSelected]} />
        <Text style={styles.methodIcon}>🏦</Text>
        <Text style={styles.methodLabel}>Bank Transfer (IBFT)</Text>
      </TouchableOpacity>

      {(selectedMethod === 'easypaisa' || selectedMethod === 'jazzcash') && (
        <Input
          label="Mobile Number"
          placeholder="03XX XXXXXXX"
          value={mobileNumber}
          onChangeText={setMobileNumber}
          keyboardType="phone-pad"
        />
      )}

      {selectedMethod === 'bank' && (
        <>
          <Input
            label="Account Number"
            placeholder="Enter account number"
            value={accountNumber}
            onChangeText={setAccountNumber}
          />
          <Input
            label="Bank Name"
            placeholder="Enter bank name"
            value={bankName}
            onChangeText={setBankName}
          />
        </>
      )}

      <Card style={styles.escrowInfo} elevated>
        <MaterialCommunityIcons name="shield-lock" size={24} color={colors.trust} />
        <Text style={styles.escrowInfoText}>
          Your payment is held securely in escrow. Funds are only released when you confirm delivery.
        </Text>
      </Card>

      <Button
        variant="primary"
        label={`Pay ${formatPKR(total)} to Escrow`}
        onPress={handlePay}
        loading={loading}
        disabled={!selectedMethod}
        fullWidth
        size="lg"
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: spacing.base,
    paddingTop: spacing.xxxl,
    paddingBottom: spacing.xxl,
  },
  backButton: {
    marginBottom: spacing.lg,
    width: 48,
    height: 48,
    justifyContent: 'center',
  },
  summaryCard: {
    marginBottom: spacing.base,
  },
  summaryTitle: {
    ...typography.h2,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
  },
  summaryLabel: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
  },
  summaryValue: {
    ...typography.bodyMedium,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.sm,
  },
  totalLabel: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  totalValue: {
    ...typography.h3,
    color: colors.primary,
  },
  feeExplainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    gap: spacing.xs,
  },
  feeExplainerText: {
    ...typography.bodySmall,
    color: colors.info,
    flex: 1,
  },
  feeDetail: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    backgroundColor: colors.infoLight,
    padding: spacing.md,
    borderRadius: radius.md,
    marginBottom: spacing.base,
  },
  sectionTitle: {
    ...typography.h2,
    color: colors.textPrimary,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.base,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    marginBottom: spacing.sm,
  },
  methodSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primarySurface,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.border,
    marginEnd: spacing.md,
  },
  radioSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  methodIcon: {
    fontSize: 20,
    marginEnd: spacing.sm,
  },
  methodLabel: {
    ...typography.label,
    color: colors.textPrimary,
  },
  escrowInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.trustLight,
    marginVertical: spacing.lg,
    padding: spacing.base,
  },
  escrowInfoText: {
    ...typography.bodySmall,
    color: colors.trust,
    marginStart: spacing.md,
    flex: 1,
  },
  confirmationContainer: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.xl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmTitle: {
    ...typography.h1,
    color: colors.trust,
    marginTop: spacing.lg,
    textAlign: 'center',
  },
  confirmRef: {
    ...typography.bodySmall,
    color: colors.textTertiary,
    marginTop: spacing.sm,
    marginBottom: spacing.xxl,
  },
  nextSteps: {
    width: '100%',
    marginBottom: spacing.xl,
  },
  nextStepsTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  stepGuide: {
    gap: spacing.md,
  },
  guideStep: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  guideNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.trust,
    alignItems: 'center',
    justifyContent: 'center',
    marginEnd: spacing.md,
  },
  guideNumberText: {
    ...typography.label,
    color: colors.textInverse,
  },
  guideText: {
    ...typography.bodyMedium,
    color: colors.textPrimary,
  },
  confirmActions: {
    width: '100%',
  },
  actionSpacer: {
    height: spacing.md,
  },
});
