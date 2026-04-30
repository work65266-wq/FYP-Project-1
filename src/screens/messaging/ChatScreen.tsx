import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, typography, spacing, radius, shadows } from '../../theme';
import { Avatar } from '../../components';
import { mockMessages, Message } from '../../data/mockData';
import { useAuthStore } from '../../store/authStore';

const PHONE_REGEX = /(\+?\d{1,4}[\s-]?)?\(?\d{1,4}\)?[\s-]?\d{1,4}[\s-]?\d{1,9}/;

const quickReplies = [
  "I'm interested",
  'Can you reduce the price?',
  'What is the minimum order?',
  'When will produce be available?',
];

export const ChatScreen: React.FC<{ navigation: any; route: any }> = ({
  navigation,
  route,
}) => {
  const conversation = route.params?.conversation;
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [inputText, setInputText] = useState('');
  const [phoneWarning, setPhoneWarning] = useState(false);
  const user = useAuthStore((s) => s.user);
  const flatListRef = useRef<FlatList>(null);

  const handleTextChange = (text: string) => {
    setInputText(text);
    setPhoneWarning(PHONE_REGEX.test(text));
  };

  const handleSend = () => {
    if (!inputText.trim()) return;
    const newMsg: Message = {
      id: `m${Date.now()}`,
      senderId: user?.id || 'f1',
      text: inputText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'user',
    };
    setMessages([...messages, newMsg]);
    setInputText('');
    setPhoneWarning(false);
  };

  const handleQuickReply = (text: string) => {
    setInputText(text);
  };

  const renderMessage = ({ item }: { item: Message }) => {
    if (item.type === 'system') {
      return (
        <View style={styles.systemMessage}>
          <Text style={styles.systemText}>{item.text} · {item.timestamp}</Text>
        </View>
      );
    }

    const isOwn = item.senderId === (user?.id || 'f1');
    return (
      <View style={[styles.messageBubbleContainer, isOwn && styles.ownMessage]}>
        <View style={[styles.bubble, isOwn ? styles.ownBubble : styles.otherBubble]}>
          <Text style={[styles.bubbleText, isOwn && styles.ownBubbleText]}>
            {item.text}
          </Text>
        </View>
        <Text style={styles.timestamp}>{item.timestamp}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} accessibilityLabel="Go back">
          <MaterialCommunityIcons name="arrow-left" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        {conversation && (
          <>
            <Avatar name={conversation.otherParty.name} size="sm" />
            <Text style={styles.headerName}>{conversation.otherParty.name}</Text>
          </>
        )}
      </View>

      {conversation && (
        <TouchableOpacity style={styles.listingStrip}>
          <View style={styles.listingThumb}>
            <MaterialCommunityIcons name="image" size={16} color={colors.textTertiary} />
          </View>
          <Text style={styles.listingStripCrop}>{conversation.listing.cropType}</Text>
          <Text style={styles.listingStripPrice}>
            PKR {conversation.listing.pricePerUnit}/{conversation.listing.unit}
          </Text>
        </TouchableOpacity>
      )}

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={styles.messagesList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
      />

      <View style={styles.quickRepliesContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {quickReplies.map((reply, i) => (
            <TouchableOpacity
              key={i}
              style={styles.quickReplyChip}
              onPress={() => handleQuickReply(reply)}
            >
              <Text style={styles.quickReplyText}>{reply}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.inputBar}>
        <TextInput
          style={styles.textInput}
          placeholder="Type a message..."
          placeholderTextColor={colors.textTertiary}
          value={inputText}
          onChangeText={handleTextChange}
          multiline
          maxLength={300}
        />
        <TouchableOpacity
          style={styles.sendButton}
          onPress={handleSend}
          disabled={!inputText.trim()}
          accessibilityLabel="Send message"
        >
          <MaterialCommunityIcons
            name="send"
            size={22}
            color={inputText.trim() ? colors.primary : colors.textTertiary}
          />
        </TouchableOpacity>
      </View>
      {phoneWarning && (
        <View style={styles.phoneWarning}>
          <MaterialCommunityIcons name="alert" size={14} color={colors.warning} />
          <Text style={styles.phoneWarningText}>
            Sharing personal contact details is not allowed
          </Text>
        </View>
      )}
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
    alignItems: 'center',
    paddingHorizontal: spacing.base,
    paddingTop: spacing.xxxl,
    paddingBottom: spacing.md,
    backgroundColor: colors.surface,
    ...shadows.sm,
    gap: spacing.sm,
  },
  headerName: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  listingStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceElevated,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  listingThumb: {
    width: 32,
    height: 32,
    borderRadius: radius.sm,
    backgroundColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginEnd: spacing.sm,
  },
  listingStripCrop: {
    ...typography.label,
    color: colors.textPrimary,
    flex: 1,
  },
  listingStripPrice: {
    ...typography.label,
    color: colors.primary,
  },
  messagesList: {
    padding: spacing.base,
    paddingBottom: spacing.xxl,
  },
  messageBubbleContainer: {
    marginBottom: spacing.md,
    alignItems: 'flex-start',
  },
  ownMessage: {
    alignItems: 'flex-end',
  },
  bubble: {
    maxWidth: '80%',
    padding: spacing.md,
    borderRadius: radius.lg,
  },
  ownBubble: {
    backgroundColor: colors.primary,
    borderBottomEndRadius: spacing.xs,
  },
  otherBubble: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderBottomStartRadius: spacing.xs,
  },
  bubbleText: {
    ...typography.bodyMedium,
    color: colors.textPrimary,
  },
  ownBubbleText: {
    color: colors.textInverse,
  },
  timestamp: {
    ...typography.caption,
    color: colors.textTertiary,
    marginTop: spacing.xs,
  },
  systemMessage: {
    alignItems: 'center',
    marginVertical: spacing.md,
  },
  systemText: {
    ...typography.caption,
    color: colors.textTertiary,
    backgroundColor: colors.surfaceElevated,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
  },
  quickRepliesContainer: {
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  quickReplyChip: {
    backgroundColor: colors.primarySurface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    marginEnd: spacing.sm,
  },
  quickReplyText: {
    ...typography.bodySmall,
    color: colors.primary,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surface,
    ...shadows.sm,
  },
  textInput: {
    flex: 1,
    ...typography.bodyMedium,
    color: colors.textPrimary,
    maxHeight: 100,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surfaceElevated,
    borderRadius: radius.lg,
  },
  sendButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginStart: spacing.sm,
  },
  phoneWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.xs,
    backgroundColor: colors.warningLight,
  },
  phoneWarningText: {
    ...typography.caption,
    color: colors.warning,
    marginStart: spacing.xs,
  },
});
