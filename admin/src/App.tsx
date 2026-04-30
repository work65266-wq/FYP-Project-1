import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { KYCReviewScreen } from './screens/KYCReviewScreen';
import { ListingsModerationScreen } from './screens/ListingsModerationScreen';
import { DisputeManagementScreen } from './screens/DisputeManagementScreen';
import { MarketRatesManagementScreen } from './screens/MarketRatesManagementScreen';

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Navigate to="/kyc" replace />} />
            <Route path="/kyc" element={<KYCReviewScreen />} />
            <Route path="/listings" element={<ListingsModerationScreen />} />
            <Route path="/disputes" element={<DisputeManagementScreen />} />
            <Route path="/market-rates" element={<MarketRatesManagementScreen />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
