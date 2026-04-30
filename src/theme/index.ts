export const colors = {
  primary: '#1B5E20',
  primaryLight: '#2E7D32',
  primaryMuted: '#C8E6C9',
  primarySurface: '#F1F8E9',

  accent: '#F9A825',
  accentLight: '#FFF8E1',
  accentDark: '#F57F17',

  trust: '#1565C0',
  trustLight: '#E3F2FD',

  success: '#2E7D32',
  successLight: '#E8F5E9',
  warning: '#E65100',
  warningLight: '#FFF3E0',
  error: '#B71C1C',
  errorLight: '#FFEBEE',
  info: '#0277BD',
  infoLight: '#E1F5FE',

  background: '#FAFAF7',
  surface: '#FFFFFF',
  surfaceElevated: '#F5F5F0',
  border: '#E0E0DC',
  borderStrong: '#BDBDB8',
  textPrimary: '#1A1A1A',
  textSecondary: '#5C5C5C',
  textTertiary: '#9E9E9E',
  textInverse: '#FFFFFF',
  overlay: 'rgba(0,0,0,0.5)',
};

export const typography = {
  displayLarge: { fontSize: 32, fontWeight: '700' as const, lineHeight: 40 },
  displayMedium: { fontSize: 24, fontWeight: '700' as const, lineHeight: 32 },

  h1: { fontSize: 22, fontWeight: '700' as const, lineHeight: 30 },
  h2: { fontSize: 18, fontWeight: '600' as const, lineHeight: 26 },
  h3: { fontSize: 16, fontWeight: '600' as const, lineHeight: 24 },

  bodyLarge: { fontSize: 16, fontWeight: '400' as const, lineHeight: 24 },
  bodyMedium: { fontSize: 14, fontWeight: '400' as const, lineHeight: 22 },
  bodySmall: { fontSize: 12, fontWeight: '400' as const, lineHeight: 18 },

  label: { fontSize: 13, fontWeight: '500' as const, lineHeight: 20 },
  caption: { fontSize: 11, fontWeight: '400' as const, lineHeight: 16 },

  price: { fontSize: 20, fontWeight: '700' as const, color: '#1B5E20' },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 48,
};

export const radius = {
  sm: 6,
  md: 10,
  lg: 16,
  xl: 24,
  full: 999,
};

export const shadows = {
  sm: {
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
  },
  md: {
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  lg: {
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.16,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 },
  },
};
