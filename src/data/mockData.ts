export interface MandiRate {
  id: string;
  crop: string;
  rate: number;
  previousRate: number;
  unit: string;
  mandi: string;
  province: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  phone: string;
  role: 'farmer' | 'buyer';
  avatar?: string;
  verified: boolean;
  rating: number;
  transactionCount: number;
  memberSince: string;
  location: {
    district: string;
    province: string;
    tehsil?: string;
  };
  kycStatus: 'pending' | 'approved' | 'rejected';
}

export interface Listing {
  id: string;
  cropType: string;
  grade: string;
  quantity: number;
  unit: string;
  minOrder?: number;
  pricePerUnit: number;
  description: string;
  photos: string[];
  location: {
    district: string;
    province: string;
    tehsil?: string;
  };
  harvestDate: string;
  expiresAt: string;
  status: 'active' | 'sold' | 'expired';
  seller: User;
  enquiriesCount: number;
  createdAt: string;
}

export interface Order {
  id: string;
  listing: Listing;
  buyer: User;
  seller: User;
  quantity: number;
  totalAmount: number;
  platformFee: number;
  status: 'pending_payment' | 'confirmed' | 'dispatched' | 'delivered' | 'completed' | 'disputed';
  escrowStatus: 'pending' | 'locked' | 'released' | 'frozen';
  createdAt: string;
  paymentDeadline?: string;
  disputeReason?: string;
}

export interface Conversation {
  id: string;
  otherParty: User;
  listing: Listing;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  type: 'user' | 'system';
}

export const currentFarmer: User = {
  id: 'f1',
  name: 'Muhammad Aslam',
  phone: '+92 312 4567890',
  role: 'farmer',
  verified: true,
  rating: 4.5,
  transactionCount: 23,
  memberSince: '2025-03',
  location: { district: 'Multan', province: 'Punjab', tehsil: 'Multan City' },
  kycStatus: 'approved',
};

export const currentBuyer: User = {
  id: 'b1',
  name: 'Ahmed Khan',
  phone: '+92 321 9876543',
  role: 'buyer',
  verified: true,
  rating: 4.8,
  transactionCount: 45,
  memberSince: '2024-11',
  location: { district: 'Lahore', province: 'Punjab' },
  kycStatus: 'approved',
};

export const mockFarmers: User[] = [
  currentFarmer,
  {
    id: 'f2',
    name: 'Ghulam Hussain',
    phone: '+92 300 1234567',
    role: 'farmer',
    verified: true,
    rating: 4.2,
    transactionCount: 15,
    memberSince: '2025-06',
    location: { district: 'Faisalabad', province: 'Punjab' },
    kycStatus: 'approved',
  },
  {
    id: 'f3',
    name: 'Fatima Bibi',
    phone: '+92 303 7654321',
    role: 'farmer',
    verified: true,
    rating: 4.7,
    transactionCount: 31,
    memberSince: '2025-01',
    location: { district: 'Gujranwala', province: 'Punjab' },
    kycStatus: 'approved',
  },
  {
    id: 'f4',
    name: 'Abdul Rashid',
    phone: '+92 315 5551234',
    role: 'farmer',
    verified: false,
    rating: 0,
    transactionCount: 0,
    memberSince: '2026-04',
    location: { district: 'Hyderabad', province: 'Sindh' },
    kycStatus: 'pending',
  },
  {
    id: 'f5',
    name: 'Noor Muhammad',
    phone: '+92 333 8887654',
    role: 'farmer',
    verified: true,
    rating: 3.9,
    transactionCount: 8,
    memberSince: '2025-09',
    location: { district: 'Sukkur', province: 'Sindh' },
    kycStatus: 'approved',
  },
];

export const mockBuyers: User[] = [
  currentBuyer,
  {
    id: 'b2',
    name: 'Tariq Mehmood',
    phone: '+92 345 6789012',
    role: 'buyer',
    verified: true,
    rating: 4.6,
    transactionCount: 67,
    memberSince: '2024-08',
    location: { district: 'Karachi', province: 'Sindh' },
    kycStatus: 'approved',
  },
  {
    id: 'b3',
    name: 'Imran Ali',
    phone: '+92 311 2345678',
    role: 'buyer',
    verified: true,
    rating: 4.1,
    transactionCount: 22,
    memberSince: '2025-04',
    location: { district: 'Faisalabad', province: 'Punjab' },
    kycStatus: 'approved',
  },
];

export const mockMandiRates: MandiRate[] = [
  { id: 'mr1', crop: 'Wheat', rate: 2400, previousRate: 2350, unit: 'maund', mandi: 'Lahore Mandi', province: 'Punjab', updatedAt: '12 min ago' },
  { id: 'mr2', crop: 'Rice', rate: 3800, previousRate: 3900, unit: 'maund', mandi: 'Lahore Mandi', province: 'Punjab', updatedAt: '12 min ago' },
  { id: 'mr3', crop: 'Sugarcane', rate: 300, previousRate: 290, unit: 'maund', mandi: 'Faisalabad Mandi', province: 'Punjab', updatedAt: '18 min ago' },
  { id: 'mr4', crop: 'Cotton', rate: 8500, previousRate: 8600, unit: 'maund', mandi: 'Multan Mandi', province: 'Punjab', updatedAt: '15 min ago' },
  { id: 'mr5', crop: 'Maize', rate: 2100, previousRate: 2050, unit: 'maund', mandi: 'Gujranwala Mandi', province: 'Punjab', updatedAt: '20 min ago' },
  { id: 'mr6', crop: 'Onion', rate: 800, previousRate: 850, unit: '40kg', mandi: 'Karachi Mandi', province: 'Sindh', updatedAt: '10 min ago' },
  { id: 'mr7', crop: 'Potato', rate: 1200, previousRate: 1150, unit: 'maund', mandi: 'Sialkot Mandi', province: 'Punjab', updatedAt: '25 min ago' },
  { id: 'mr8', crop: 'Mango', rate: 3500, previousRate: 3400, unit: 'maund', mandi: 'Multan Mandi', province: 'Punjab', updatedAt: '14 min ago' },
  { id: 'mr9', crop: 'Citrus', rate: 2800, previousRate: 2800, unit: 'maund', mandi: 'Sargodha Mandi', province: 'Punjab', updatedAt: '22 min ago' },
  { id: 'mr10', crop: 'Tomato', rate: 1500, previousRate: 1600, unit: '40kg', mandi: 'Peshawar Mandi', province: 'KPK', updatedAt: '8 min ago' },
];

export const mockListings: Listing[] = [
  {
    id: 'l1',
    cropType: 'Wheat',
    grade: 'Grade A',
    quantity: 500,
    unit: 'maund',
    minOrder: 50,
    pricePerUnit: 2600,
    description: 'Premium quality wheat from irrigated fields of Multan. Fresh harvest, well-dried, and properly stored. No pesticide residue. Suitable for flour mills and wholesale buyers.',
    photos: [],
    location: { district: 'Multan', province: 'Punjab', tehsil: 'Multan City' },
    harvestDate: '2026-04-15',
    expiresAt: '2026-05-30',
    status: 'active',
    seller: currentFarmer,
    enquiriesCount: 5,
    createdAt: '2026-04-20',
  },
  {
    id: 'l2',
    cropType: 'Rice',
    grade: 'Grade A',
    quantity: 300,
    unit: 'maund',
    minOrder: 30,
    pricePerUnit: 4000,
    description: 'Basmati rice, long grain, aromatic. From the rice belt of Punjab. Ideal for export quality packaging and wholesale distribution.',
    photos: [],
    location: { district: 'Gujranwala', province: 'Punjab' },
    harvestDate: '2026-03-20',
    expiresAt: '2026-05-20',
    status: 'active',
    seller: mockFarmers[2],
    enquiriesCount: 8,
    createdAt: '2026-04-10',
  },
  {
    id: 'l3',
    cropType: 'Mango',
    grade: 'Grade A',
    quantity: 200,
    unit: 'maund',
    pricePerUnit: 3800,
    description: 'Sindhri mangoes from Multan orchards. Hand-picked, naturally ripened. Available for bulk orders. Transportation assistance available.',
    photos: [],
    location: { district: 'Multan', province: 'Punjab', tehsil: 'Shujabad' },
    harvestDate: '2026-06-01',
    expiresAt: '2026-07-15',
    status: 'active',
    seller: currentFarmer,
    enquiriesCount: 12,
    createdAt: '2026-04-25',
  },
  {
    id: 'l4',
    cropType: 'Cotton',
    grade: 'Grade B',
    quantity: 150,
    unit: 'maund',
    minOrder: 20,
    pricePerUnit: 8800,
    description: 'Quality cotton from Southern Punjab. Good fiber length. Suitable for textile mills.',
    photos: [],
    location: { district: 'Faisalabad', province: 'Punjab' },
    harvestDate: '2026-03-01',
    expiresAt: '2026-04-30',
    status: 'sold',
    seller: mockFarmers[1],
    enquiriesCount: 6,
    createdAt: '2026-03-15',
  },
  {
    id: 'l5',
    cropType: 'Onion',
    grade: 'Grade A',
    quantity: 100,
    unit: '40kg',
    minOrder: 10,
    pricePerUnit: 850,
    description: 'Fresh red onions from Sindh. Large size, well-cured. Ready for market distribution.',
    photos: [],
    location: { district: 'Hyderabad', province: 'Sindh' },
    harvestDate: '2026-04-10',
    expiresAt: '2026-05-10',
    status: 'active',
    seller: mockFarmers[3],
    enquiriesCount: 3,
    createdAt: '2026-04-12',
  },
  {
    id: 'l6',
    cropType: 'Potato',
    grade: 'Grade A',
    quantity: 400,
    unit: 'maund',
    minOrder: 40,
    pricePerUnit: 1300,
    description: 'Fresh potatoes from Sahiwal farms. Medium to large size, good for chips and cooking. Cold storage available.',
    photos: [],
    location: { district: 'Sialkot', province: 'Punjab' },
    harvestDate: '2026-04-05',
    expiresAt: '2026-06-05',
    status: 'active',
    seller: mockFarmers[2],
    enquiriesCount: 7,
    createdAt: '2026-04-08',
  },
  {
    id: 'l7',
    cropType: 'Sugarcane',
    grade: 'Grade A',
    quantity: 1000,
    unit: 'maund',
    minOrder: 100,
    pricePerUnit: 320,
    description: 'High-quality sugarcane. High sucrose content, ideal for sugar mills. Transportation can be arranged.',
    photos: [],
    location: { district: 'Sukkur', province: 'Sindh' },
    harvestDate: '2026-03-25',
    expiresAt: '2026-05-25',
    status: 'active',
    seller: mockFarmers[4],
    enquiriesCount: 2,
    createdAt: '2026-03-28',
  },
  {
    id: 'l8',
    cropType: 'Tomato',
    grade: 'Grade B',
    quantity: 80,
    unit: '40kg',
    pricePerUnit: 1400,
    description: 'Farm fresh tomatoes from Peshawar region. Firm and ripe, suitable for wholesale markets.',
    photos: [],
    location: { district: 'Peshawar', province: 'KPK' },
    harvestDate: '2026-04-18',
    expiresAt: '2026-05-18',
    status: 'active',
    seller: mockFarmers[1],
    enquiriesCount: 4,
    createdAt: '2026-04-20',
  },
];

export const mockOrders: Order[] = [
  {
    id: 'o1',
    listing: mockListings[0],
    buyer: currentBuyer,
    seller: currentFarmer,
    quantity: 100,
    totalAmount: 260000,
    platformFee: 5200,
    status: 'dispatched',
    escrowStatus: 'locked',
    createdAt: '2026-04-22',
  },
  {
    id: 'o2',
    listing: mockListings[3],
    buyer: mockBuyers[1],
    seller: mockFarmers[1],
    quantity: 50,
    totalAmount: 440000,
    platformFee: 8800,
    status: 'completed',
    escrowStatus: 'released',
    createdAt: '2026-03-20',
  },
  {
    id: 'o3',
    listing: mockListings[1],
    buyer: mockBuyers[2],
    seller: mockFarmers[2],
    quantity: 30,
    totalAmount: 120000,
    platformFee: 2400,
    status: 'confirmed',
    escrowStatus: 'locked',
    createdAt: '2026-04-25',
  },
  {
    id: 'o4',
    listing: mockListings[4],
    buyer: currentBuyer,
    seller: mockFarmers[3],
    quantity: 20,
    totalAmount: 17000,
    platformFee: 340,
    status: 'pending_payment',
    escrowStatus: 'pending',
    createdAt: '2026-04-28',
    paymentDeadline: '2026-04-28T18:00:00',
  },
];

export const mockConversations: Conversation[] = [
  {
    id: 'c1',
    otherParty: currentBuyer,
    listing: mockListings[0],
    lastMessage: 'I am interested in your wheat listing. Can we discuss the price?',
    lastMessageTime: '2 min ago',
    unreadCount: 2,
  },
  {
    id: 'c2',
    otherParty: mockBuyers[1],
    listing: mockListings[2],
    lastMessage: 'When will the mangoes be ready for dispatch?',
    lastMessageTime: '1 hour ago',
    unreadCount: 0,
  },
  {
    id: 'c3',
    otherParty: mockBuyers[2],
    listing: mockListings[0],
    lastMessage: 'Can you reduce the price to 2500/maund?',
    lastMessageTime: '3 hours ago',
    unreadCount: 1,
  },
];

export const mockMessages: Message[] = [
  { id: 'm1', senderId: 'b1', text: 'Assalamu Alaikum! I saw your wheat listing.', timestamp: '10:30 AM', type: 'user' },
  { id: 'm2', senderId: 'f1', text: 'Wa Alaikum Assalam! Yes, it is fresh harvest from last week.', timestamp: '10:32 AM', type: 'user' },
  { id: 'm3', senderId: 'b1', text: 'What is the minimum order quantity?', timestamp: '10:33 AM', type: 'user' },
  { id: 'm4', senderId: 'f1', text: 'Minimum 50 maund. For orders above 200 maund, I can offer better price.', timestamp: '10:35 AM', type: 'user' },
  { id: 'm5', senderId: 'b1', text: 'I need 100 maund. Can you do 2500/maund?', timestamp: '10:38 AM', type: 'user' },
  { id: 'm6', senderId: 'f1', text: 'Best I can do is 2550/maund for 100 maund order.', timestamp: '10:40 AM', type: 'user' },
  { id: 'm7', senderId: 'system', text: 'Order confirmed', timestamp: '11:00 AM', type: 'system' },
];

export const cropTypes = [
  'Wheat', 'Rice', 'Cotton', 'Sugarcane', 'Maize',
  'Onion', 'Potato', 'Mango', 'Citrus', 'Tomato',
];

export const provinces = ['Punjab', 'Sindh', 'KPK', 'Balochistan'];

export const districtsByProvince: Record<string, string[]> = {
  Punjab: ['Lahore', 'Faisalabad', 'Multan', 'Gujranwala', 'Sialkot', 'Sargodha', 'Sahiwal'],
  Sindh: ['Karachi', 'Hyderabad', 'Sukkur', 'Larkana', 'Nawabshah'],
  KPK: ['Peshawar', 'Mardan', 'Abbottabad', 'Swat', 'Mansehra'],
  Balochistan: ['Quetta', 'Gwadar', 'Turbat', 'Khuzdar'],
};

export const formatPKR = (amount: number): string => {
  return `PKR ${amount.toLocaleString('en-PK')}`;
};
