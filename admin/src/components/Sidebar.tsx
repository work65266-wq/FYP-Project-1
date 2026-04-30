import React from 'react';
import { NavLink } from 'react-router-dom';

const navItems = [
  { path: '/kyc', label: 'KYC Reviews', icon: '🪪', badge: 12 },
  { path: '/listings', label: 'Listings Moderation', icon: '📋', badge: 0 },
  { path: '/disputes', label: 'Dispute Management', icon: '⚖️', badge: 3 },
  { path: '/users', label: 'User Management', icon: '👥', badge: 0 },
  { path: '/market-rates', label: 'Market Rates', icon: '📊', badge: 0 },
  { path: '/analytics', label: 'Platform Analytics', icon: '📈', badge: 0 },
];

export const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-primary text-white flex flex-col min-h-screen">
      <div className="p-6 border-b border-primary-light">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🌾</span>
          <div>
            <h1 className="text-lg font-bold">AgriConnect</h1>
            <span className="text-xs text-primary-muted opacity-80">Admin Dashboard</span>
          </div>
        </div>
      </div>

      <nav className="flex-1 py-4">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-6 py-3 text-sm transition-colors ${
                isActive
                  ? 'bg-primary-light text-white font-semibold'
                  : 'text-gray-300 hover:bg-primary-light hover:text-white'
              }`
            }
          >
            <span className="text-lg">{item.icon}</span>
            <span className="flex-1">{item.label}</span>
            {item.badge > 0 && (
              <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5 font-bold">
                {item.badge}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-primary-light">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center text-sm font-bold">
            A
          </div>
          <div>
            <p className="text-sm font-medium">Admin User</p>
            <p className="text-xs text-gray-400">admin@agriconnect.pk</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
