import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, typography } from '../theme';
import { useAuthStore } from '../store/authStore';

import { SplashScreen } from '../screens/auth/SplashScreen';
import { OnboardingScreen } from '../screens/auth/OnboardingScreen';
import { RoleSelectionScreen } from '../screens/auth/RoleSelectionScreen';
import { PhoneInputScreen } from '../screens/auth/PhoneInputScreen';
import { OTPVerificationScreen } from '../screens/auth/OTPVerificationScreen';
import { KYCUploadScreen } from '../screens/auth/KYCUploadScreen';

import { FarmerHomeScreen } from '../screens/farmer/FarmerHomeScreen';
import { CreateListingScreen } from '../screens/farmer/CreateListingScreen';
import { MyListingsScreen } from '../screens/farmer/MyListingsScreen';
import { FarmerOrdersScreen } from '../screens/farmer/FarmerOrdersScreen';

import { BuyerHomeScreen } from '../screens/buyer/BuyerHomeScreen';
import { BuyerOrdersScreen } from '../screens/buyer/BuyerOrdersScreen';

import { MarketplaceScreen } from '../screens/marketplace/MarketplaceScreen';
import { ListingDetailScreen } from '../screens/marketplace/ListingDetailScreen';

import { InboxScreen } from '../screens/messaging/InboxScreen';
import { ChatScreen } from '../screens/messaging/ChatScreen';

import { PaymentScreen } from '../screens/payment/PaymentScreen';
import { DisputeScreen } from '../screens/payment/DisputeScreen';
import { RatingScreen } from '../screens/payment/RatingScreen';

import { ProfileScreen } from '../screens/profile/ProfileScreen';
import { MarketRatesScreen } from '../screens/profile/MarketRatesScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const FarmerTabs = () => (
  <Tab.Navigator
    screenOptions={{
      tabBarStyle: {
        backgroundColor: colors.primary,
        borderTopWidth: 0,
        height: 60,
        paddingBottom: 8,
        paddingTop: 4,
      },
      tabBarActiveTintColor: colors.accent,
      tabBarInactiveTintColor: 'rgba(255,255,255,0.6)',
      tabBarLabelStyle: {
        ...typography.caption,
        fontWeight: '500',
      },
      headerShown: false,
    }}
  >
    <Tab.Screen
      name="Home"
      component={FarmerHomeScreen}
      options={{
        tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons name="home" size={size} color={color} />
        ),
      }}
    />
    <Tab.Screen
      name="Marketplace"
      component={MarketplaceScreen}
      options={{
        tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons name="shopping" size={size} color={color} />
        ),
      }}
    />
    <Tab.Screen
      name="My Listings"
      component={MyListingsScreen}
      options={{
        tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons name="format-list-bulleted" size={size} color={color} />
        ),
      }}
    />
    <Tab.Screen
      name="Messages"
      component={InboxScreen}
      options={{
        tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons name="message" size={size} color={color} />
        ),
        tabBarBadge: 3,
      }}
    />
    <Tab.Screen
      name="Profile"
      component={ProfileScreen}
      options={{
        tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons name="account" size={size} color={color} />
        ),
      }}
    />
  </Tab.Navigator>
);

const BuyerTabs = () => (
  <Tab.Navigator
    screenOptions={{
      tabBarStyle: {
        backgroundColor: colors.primary,
        borderTopWidth: 0,
        height: 60,
        paddingBottom: 8,
        paddingTop: 4,
      },
      tabBarActiveTintColor: colors.accent,
      tabBarInactiveTintColor: 'rgba(255,255,255,0.6)',
      tabBarLabelStyle: {
        ...typography.caption,
        fontWeight: '500',
      },
      headerShown: false,
    }}
  >
    <Tab.Screen
      name="Home"
      component={BuyerHomeScreen}
      options={{
        tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons name="home" size={size} color={color} />
        ),
      }}
    />
    <Tab.Screen
      name="Marketplace"
      component={MarketplaceScreen}
      options={{
        tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons name="shopping" size={size} color={color} />
        ),
      }}
    />
    <Tab.Screen
      name="My Orders"
      component={BuyerOrdersScreen}
      options={{
        tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons name="package-variant" size={size} color={color} />
        ),
      }}
    />
    <Tab.Screen
      name="Messages"
      component={InboxScreen}
      options={{
        tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons name="message" size={size} color={color} />
        ),
        tabBarBadge: 5,
      }}
    />
    <Tab.Screen
      name="Profile"
      component={ProfileScreen}
      options={{
        tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons name="account" size={size} color={color} />
        ),
      }}
    />
  </Tab.Navigator>
);

const MainTabs: React.FC = () => {
  const role = useAuthStore((s) => s.role);
  return role === 'buyer' ? <BuyerTabs /> : <FarmerTabs />;
};

export const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName="Splash"
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="RoleSelection" component={RoleSelectionScreen} />
        <Stack.Screen name="PhoneInput" component={PhoneInputScreen} />
        <Stack.Screen name="OTPVerification" component={OTPVerificationScreen} />
        <Stack.Screen name="KYCUpload" component={KYCUploadScreen} />
        <Stack.Screen name="Main" component={MainTabs} />
        <Stack.Screen name="CreateListing" component={CreateListingScreen} />
        <Stack.Screen name="ListingDetail" component={ListingDetailScreen} />
        <Stack.Screen name="Chat" component={ChatScreen} />
        <Stack.Screen name="Payment" component={PaymentScreen} />
        <Stack.Screen name="Dispute" component={DisputeScreen} />
        <Stack.Screen name="Rating" component={RatingScreen} />
        <Stack.Screen name="FarmerOrders" component={FarmerOrdersScreen} />
        <Stack.Screen name="MarketRates" component={MarketRatesScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
