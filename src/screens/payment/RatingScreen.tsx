import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing, radius } from '../../theme';
import { Button, Input, StarRating, Card } from '../../components';

export const RatingScreen: React.FC<{ navigation: any; route: any }> = ({
  navigation,
  route,
}) => {
  const order = route.params?.order;
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');

  const otherParty = order?.seller || order?.buyer;

  return (
    <View style={styles.container}>
      <Card style={styles.summaryCard} elevated>
        <Text style={styles.summaryTitle}>
          {order?.listing?.cropType || 'Crop'} · {order?.quantity || 0} {order?.listing?.unit || 'maund'}
        </Text>
        <Text style={styles.summaryDetail}>
          with {otherParty?.name || 'User'} · {order?.createdAt || 'Date'}
        </Text>
      </Card>

      <Text style={styles.title}>
        Rate your experience with {otherParty?.name || 'this user'}
      </Text>

      <View style={styles.starsContainer}>
        <StarRating rating={rating} size={40} interactive onRate={setRating} />
      </View>

      <Input
        label="Write a review (optional)"
        placeholder="Share your experience..."
        value={review}
        onChangeText={setReview}
        multiline
        maxLength={200}
      />

      <Text style={styles.note}>Your review is public and visible on their profile</Text>

      <View style={styles.actions}>
        <Button
          variant="primary"
          label="Submit Rating"
          onPress={() => navigation.goBack()}
          disabled={rating === 0}
          fullWidth
        />
        <View style={styles.spacer} />
        <Button
          variant="ghost"
          label="Skip"
          onPress={() => navigation.goBack()}
          fullWidth
        />
      </View>
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
  summaryCard: {
    marginBottom: spacing.xl,
  },
  summaryTitle: {
    ...typography.label,
    color: colors.textPrimary,
  },
  summaryDetail: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  title: {
    ...typography.h2,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  starsContainer: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  note: {
    ...typography.caption,
    color: colors.textTertiary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  actions: {
    marginTop: 'auto',
    paddingBottom: spacing.xxl,
  },
  spacer: {
    height: spacing.md,
  },
});
