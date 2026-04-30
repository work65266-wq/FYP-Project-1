# Testing AgriConnect Frontend

## Overview
AgriConnect is a React Native (Expo) mobile app for connecting Pakistani farmers with buyers. It runs on web via `npx expo start --web`.

## Setup

```bash
cd /home/ubuntu/repos/FYP-Project-1
npm install
# Web dependencies may need to be installed separately:
npx expo install react-dom react-native-web
# Start web dev server:
npx expo start --web --port 19006
```

The app will be available at `http://localhost:19006`.

**Note:** You may see version mismatch warnings for packages like `expo-image`, `react-native-gesture-handler`, etc. These are warnings only and don't prevent the app from running on web.

## Auth Flow Navigation

The app starts at the Splash screen and auto-navigates after ~2 seconds:

1. **Splash** (2s auto) → **Onboarding** (if first visit) or **Role Selection** (if already onboarded)
2. **Onboarding**: 3 slides. Click "Skip" or "Next" through all 3 → "Get Started"
3. **Role Selection**: Click "I am a Farmer" or "I am a Buyer / Trader" card, then "Continue"
4. **Phone Input**: Enter any 10-digit number (e.g., `3001234567`), click "Send OTP"
5. **OTP Verification**: Enter `123456` (the hardcoded mock OTP code). Auto-advances on 6th digit.
6. **KYC Upload**: Tap both CNIC upload zones (front and back) to simulate upload, then "Submit for Review"
7. **Success**: Click "Continue to App" → lands on Farmer/Buyer Home based on role selected

### Key Mock Values
- **Mock OTP code**: `123456` (hardcoded in `src/screens/auth/OTPVerificationScreen.tsx`)
- **Mock farmer user**: "Muhammad Aslam" (defined in `src/data/mockData.ts`)
- **Mock buyer user**: "Ahmed Khan" (defined in `src/data/mockData.ts`)

## Tab Navigation

### Farmer Tabs
- Home, Marketplace, My Listings, Messages, Profile

### Buyer Tabs  
- Home, Marketplace, My Orders, Messages, Profile

## Key Test Scenarios

1. **Full Auth Flow**: Navigate Splash → Onboarding → Role Selection → Phone → OTP → KYC → Home
2. **Home Content**: Verify greeting, mandi rates, listings, enquiries, stats render with mock data
3. **Tab Navigation**: Verify all 5 tabs load their respective screens
4. **OTP Lockout**: Enter wrong OTP 3 times → expect "Too many attempts. Try again in 10 minutes."
5. **Logout**: Scroll to bottom of Profile screen → click "Logout" → returns to Splash

## Gotchas

- The Splash screen auto-navigates after 2 seconds — you might miss it if you're not watching
- After logout, the app remembers the `isOnboarded` state, so it skips onboarding and goes straight to Role Selection
- The app uses mock data only — no real API calls are made
- TypeScript check: `npx tsc --noEmit` (exclude `admin/` directory via tsconfig)

## Admin Dashboard (Separate App)

The admin dashboard is a separate React web app in `admin/`:

```bash
cd admin
npm install
npm start
```

Runs on `http://localhost:3000` by default. Has KYC Review, Listings Moderation, Dispute Management, and Market Rates Management screens.

## Devin Secrets Needed

No secrets required — the app uses mock data only.
