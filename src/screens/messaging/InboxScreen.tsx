import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, typography, spacing, radius } from '../../theme';
import { Avatar, EmptyState } from '../../components';
import { mockConversations } from '../../data/mockData';

export const InboxScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
        <TouchableOpacity accessibilityLabel="Search messages">
          <MaterialCommunityIcons name="magnify" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={mockConversations}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <EmptyState
            icon="message-text-outline"
            title="No messages yet"
            subtitle="Enquire on a listing to start a conversation."
          />
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.threadItem, item.unreadCount > 0 && styles.threadUnread]}
            onPress={() => navigation.navigate('Chat', { conversation: item })}
            activeOpacity={0.7}
          >
            <Avatar name={item.otherParty.name} size="md" verified={item.otherParty.verified} />
            <View style={styles.threadContent}>
              <View style={styles.threadHeader}>
                <Text style={[styles.threadName, item.unreadCount > 0 && styles.threadNameBold]}>
                  {item.otherParty.name}
                </Text>
                <Text style={styles.threadTime}>{item.lastMessageTime}</Text>
              </View>
              <Text style={styles.threadCrop}>{item.listing.cropType}</Text>
              <Text style={styles.threadMessage} numberOfLines={1}>
                {item.lastMessage}
              </Text>
            </View>
            {item.unreadCount > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadText}>{item.unreadCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        )}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.base,
    paddingTop: spacing.xxxl,
    paddingBottom: spacing.base,
    backgroundColor: colors.surface,
  },
  headerTitle: {
    ...typography.h1,
    color: colors.textPrimary,
  },
  threadItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
  },
  threadUnread: {
    borderStartWidth: 3,
    borderStartColor: colors.primary,
    backgroundColor: colors.primarySurface,
  },
  threadContent: {
    flex: 1,
    marginStart: spacing.md,
  },
  threadHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  threadName: {
    ...typography.label,
    color: colors.textPrimary,
  },
  threadNameBold: {
    fontWeight: '700',
  },
  threadTime: {
    ...typography.caption,
    color: colors.textTertiary,
  },
  threadCrop: {
    ...typography.caption,
    color: colors.primary,
  },
  threadMessage: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: 2,
  },
  unreadBadge: {
    backgroundColor: colors.primary,
    borderRadius: radius.full,
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginStart: spacing.sm,
  },
  unreadText: {
    ...typography.caption,
    color: colors.textInverse,
    fontWeight: '700',
    fontSize: 10,
  },
});
