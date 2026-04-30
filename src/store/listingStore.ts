import { create } from 'zustand';
import { Listing, mockListings } from '../data/mockData';

interface ListingFilters {
  cropType: string[];
  province: string;
  district: string;
  priceRange: [number, number];
  minRating: number;
  sortBy: 'recent' | 'price_low' | 'price_high' | 'rating';
}

interface ListingState {
  listings: Listing[];
  filters: ListingFilters;
  searchQuery: string;
  viewMode: 'grid' | 'list';
  loading: boolean;
  setListings: (listings: Listing[]) => void;
  addListing: (listing: Listing) => void;
  updateListing: (id: string, updates: Partial<Listing>) => void;
  setFilters: (filters: Partial<ListingFilters>) => void;
  resetFilters: () => void;
  setSearchQuery: (query: string) => void;
  setViewMode: (mode: 'grid' | 'list') => void;
  setLoading: (loading: boolean) => void;
  getFilteredListings: () => Listing[];
}

const defaultFilters: ListingFilters = {
  cropType: [],
  province: '',
  district: '',
  priceRange: [0, 100000],
  minRating: 0,
  sortBy: 'recent',
};

export const useListingStore = create<ListingState>((set, get) => ({
  listings: mockListings,
  filters: defaultFilters,
  searchQuery: '',
  viewMode: 'list',
  loading: false,
  setListings: (listings) => set({ listings }),
  addListing: (listing) => set((state) => ({ listings: [listing, ...state.listings] })),
  updateListing: (id, updates) =>
    set((state) => ({
      listings: state.listings.map((l) => (l.id === id ? { ...l, ...updates } : l)),
    })),
  setFilters: (filters) =>
    set((state) => ({ filters: { ...state.filters, ...filters } })),
  resetFilters: () => set({ filters: defaultFilters }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setViewMode: (viewMode) => set({ viewMode }),
  setLoading: (loading) => set({ loading }),
  getFilteredListings: () => {
    const state = get();
    let result = state.listings.filter((l) => l.status === 'active');

    if (state.searchQuery) {
      const q = state.searchQuery.toLowerCase();
      result = result.filter(
        (l) =>
          l.cropType.toLowerCase().includes(q) ||
          l.location.district.toLowerCase().includes(q) ||
          l.location.province.toLowerCase().includes(q)
      );
    }

    if (state.filters.cropType.length > 0) {
      result = result.filter((l) => state.filters.cropType.includes(l.cropType));
    }

    if (state.filters.province) {
      result = result.filter((l) => l.location.province === state.filters.province);
    }

    if (state.filters.district) {
      result = result.filter((l) => l.location.district === state.filters.district);
    }

    result = result.filter(
      (l) =>
        l.pricePerUnit >= state.filters.priceRange[0] &&
        l.pricePerUnit <= state.filters.priceRange[1]
    );

    if (state.filters.minRating > 0) {
      result = result.filter((l) => l.seller.rating >= state.filters.minRating);
    }

    switch (state.filters.sortBy) {
      case 'price_low':
        result.sort((a, b) => a.pricePerUnit - b.pricePerUnit);
        break;
      case 'price_high':
        result.sort((a, b) => b.pricePerUnit - a.pricePerUnit);
        break;
      case 'rating':
        result.sort((a, b) => b.seller.rating - a.seller.rating);
        break;
      case 'recent':
      default:
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return result;
  },
}));
