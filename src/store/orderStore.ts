import { create } from 'zustand';
import { Order, mockOrders } from '../data/mockData';

interface OrderState {
  orders: Order[];
  loading: boolean;
  setOrders: (orders: Order[]) => void;
  updateOrder: (id: string, updates: Partial<Order>) => void;
  setLoading: (loading: boolean) => void;
}

export const useOrderStore = create<OrderState>((set) => ({
  orders: mockOrders,
  loading: false,
  setOrders: (orders) => set({ orders }),
  updateOrder: (id, updates) =>
    set((state) => ({
      orders: state.orders.map((o) => (o.id === id ? { ...o, ...updates } : o)),
    })),
  setLoading: (loading) => set({ loading }),
}));
