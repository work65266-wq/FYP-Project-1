import { create } from 'zustand';
import { User, currentFarmer, currentBuyer } from '../data/mockData';

interface AuthState {
  isAuthenticated: boolean;
  isOnboarded: boolean;
  user: User | null;
  role: 'farmer' | 'buyer' | null;
  token: string | null;
  login: (role: 'farmer' | 'buyer') => void;
  logout: () => void;
  setOnboarded: () => void;
  setRole: (role: 'farmer' | 'buyer') => void;
  updateUser: (updates: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  isOnboarded: false,
  user: null,
  role: null,
  token: null,
  login: (role) =>
    set({
      isAuthenticated: true,
      user: role === 'farmer' ? currentFarmer : currentBuyer,
      role,
      token: 'mock-jwt-token',
    }),
  logout: () =>
    set({
      isAuthenticated: false,
      user: null,
      role: null,
      token: null,
    }),
  setOnboarded: () => set({ isOnboarded: true }),
  setRole: (role) => set({ role }),
  updateUser: (updates) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...updates } : null,
    })),
}));
