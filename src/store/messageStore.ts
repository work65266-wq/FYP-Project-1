import { create } from 'zustand';
import { Conversation, Message, mockConversations, mockMessages } from '../data/mockData';

interface MessageState {
  conversations: Conversation[];
  currentMessages: Message[];
  loading: boolean;
  setConversations: (conversations: Conversation[]) => void;
  setCurrentMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
  setLoading: (loading: boolean) => void;
}

export const useMessageStore = create<MessageState>((set) => ({
  conversations: mockConversations,
  currentMessages: mockMessages,
  loading: false,
  setConversations: (conversations) => set({ conversations }),
  setCurrentMessages: (currentMessages) => set({ currentMessages }),
  addMessage: (message) =>
    set((state) => ({ currentMessages: [...state.currentMessages, message] })),
  setLoading: (loading) => set({ loading }),
}));
