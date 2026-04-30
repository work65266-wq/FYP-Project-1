import React, { useState } from 'react';

interface RateEntry {
  id: string;
  crop: string;
  rate: number;
  unit: string;
  apiRate: number;
  overrideApi: boolean;
  lastUpdatedBy: string;
  lastUpdatedAt: string;
}

const mockRates: RateEntry[] = [
  { id: 'r1', crop: 'Wheat', rate: 2400, unit: 'maund', apiRate: 2400, overrideApi: false, lastUpdatedBy: 'API', lastUpdatedAt: '2026-04-30 12:45' },
  { id: 'r2', crop: 'Rice', rate: 3800, unit: 'maund', apiRate: 3800, overrideApi: false, lastUpdatedBy: 'API', lastUpdatedAt: '2026-04-30 12:45' },
  { id: 'r3', crop: 'Sugarcane', rate: 300, unit: 'maund', apiRate: 295, overrideApi: true, lastUpdatedBy: 'Admin (Zara)', lastUpdatedAt: '2026-04-30 10:20' },
  { id: 'r4', crop: 'Cotton', rate: 8500, unit: 'maund', apiRate: 8500, overrideApi: false, lastUpdatedBy: 'API', lastUpdatedAt: '2026-04-30 12:45' },
  { id: 'r5', crop: 'Maize', rate: 2100, unit: 'maund', apiRate: 2100, overrideApi: false, lastUpdatedBy: 'API', lastUpdatedAt: '2026-04-30 12:45' },
  { id: 'r6', crop: 'Onion', rate: 800, unit: '40kg', apiRate: 800, overrideApi: false, lastUpdatedBy: 'API', lastUpdatedAt: '2026-04-30 12:45' },
  { id: 'r7', crop: 'Potato', rate: 1200, unit: 'maund', apiRate: 1200, overrideApi: false, lastUpdatedBy: 'API', lastUpdatedAt: '2026-04-30 12:45' },
  { id: 'r8', crop: 'Mango', rate: 3500, unit: 'maund', apiRate: 3500, overrideApi: false, lastUpdatedBy: 'API', lastUpdatedAt: '2026-04-30 12:45' },
  { id: 'r9', crop: 'Citrus', rate: 2800, unit: 'maund', apiRate: 2800, overrideApi: false, lastUpdatedBy: 'API', lastUpdatedAt: '2026-04-30 12:45' },
  { id: 'r10', crop: 'Tomato', rate: 1500, unit: '40kg', apiRate: 1500, overrideApi: false, lastUpdatedBy: 'API', lastUpdatedAt: '2026-04-30 12:45' },
];

export const MarketRatesManagementScreen: React.FC = () => {
  const [rates, setRates] = useState(mockRates);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [apiConnected] = useState(true);

  const handleEdit = (id: string, currentRate: number) => {
    setEditingId(id);
    setEditValue(currentRate.toString());
  };

  const handleSave = (id: string) => {
    setRates(
      rates.map((r) =>
        r.id === id
          ? {
              ...r,
              rate: parseInt(editValue) || r.rate,
              overrideApi: true,
              lastUpdatedBy: 'Admin (You)',
              lastUpdatedAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
            }
          : r
      )
    );
    setEditingId(null);
  };

  const toggleOverride = (id: string) => {
    setRates(
      rates.map((r) =>
        r.id === id
          ? {
              ...r,
              overrideApi: !r.overrideApi,
              rate: !r.overrideApi ? r.rate : r.apiRate,
              lastUpdatedBy: !r.overrideApi ? 'Admin (You)' : 'API',
            }
          : r
      )
    );
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Market Rates Management</h2>
        <div className="flex items-center gap-2">
          <span
            className={`w-3 h-3 rounded-full ${
              apiConnected ? 'bg-green-500' : 'bg-red-500'
            }`}
          />
          <span className={`text-sm font-medium ${apiConnected ? 'text-green-700' : 'text-red-700'}`}>
            {apiConnected ? 'API Connected' : 'API Down — Manual Mode'}
          </span>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 text-left text-sm text-gray-500">
              <th className="p-3">Crop</th>
              <th className="p-3">Current Rate</th>
              <th className="p-3">Unit</th>
              <th className="p-3">API Rate</th>
              <th className="p-3">Override API</th>
              <th className="p-3">Last Updated By</th>
              <th className="p-3">Last Updated</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {rates.map((item) => (
              <tr key={item.id} className={`hover:bg-gray-50 ${item.overrideApi ? 'bg-amber-50' : ''}`}>
                <td className="p-3 font-medium text-gray-900">{item.crop}</td>
                <td className="p-3">
                  {editingId === item.id ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="w-24 border rounded px-2 py-1 text-sm"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSave(item.id);
                          if (e.key === 'Escape') setEditingId(null);
                        }}
                      />
                      <button
                        onClick={() => handleSave(item.id)}
                        className="text-green-600 hover:text-green-700 text-sm font-medium"
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleEdit(item.id, item.rate)}
                      className="text-gray-900 font-medium hover:text-primary cursor-pointer"
                    >
                      PKR {item.rate.toLocaleString()}
                    </button>
                  )}
                </td>
                <td className="p-3 text-gray-600 text-sm">{item.unit}</td>
                <td className="p-3 text-gray-500 text-sm">PKR {item.apiRate.toLocaleString()}</td>
                <td className="p-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={item.overrideApi}
                      onChange={() => toggleOverride(item.id)}
                      className="w-4 h-4 text-primary rounded"
                    />
                  </label>
                </td>
                <td className="p-3 text-sm text-gray-500">{item.lastUpdatedBy}</td>
                <td className="p-3 text-sm text-gray-400">{item.lastUpdatedAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
