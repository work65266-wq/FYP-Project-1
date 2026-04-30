import React, { useState } from 'react';

interface ListingMod {
  id: string;
  crop: string;
  seller: string;
  price: number;
  mandiRate: number;
  deviation: number;
  flagReason: string;
  date: string;
  status: 'all' | 'flagged' | 'under_review' | 'removed';
}

const mockListings: ListingMod[] = [
  { id: 'l1', crop: 'Wheat', seller: 'Muhammad Aslam', price: 2600, mandiRate: 2400, deviation: 8, flagReason: '', date: '2026-04-28', status: 'all' },
  { id: 'l2', crop: 'Rice', seller: 'Fatima Bibi', price: 6000, mandiRate: 3800, deviation: 58, flagReason: 'Price too high', date: '2026-04-27', status: 'flagged' },
  { id: 'l3', crop: 'Mango', seller: 'Noor Muhammad', price: 5500, mandiRate: 3500, deviation: 57, flagReason: 'Price too high', date: '2026-04-27', status: 'flagged' },
  { id: 'l4', crop: 'Cotton', seller: 'Ghulam Hussain', price: 8800, mandiRate: 8500, deviation: 4, flagReason: '', date: '2026-04-26', status: 'all' },
  { id: 'l5', crop: 'Onion', seller: 'Abdul Rashid', price: 850, mandiRate: 800, deviation: 6, flagReason: '', date: '2026-04-26', status: 'all' },
  { id: 'l6', crop: 'Tomato', seller: 'Saima Bibi', price: 1400, mandiRate: 1500, deviation: -7, flagReason: 'Reported by buyer', date: '2026-04-25', status: 'under_review' },
];

type FilterTab = 'all' | 'flagged' | 'under_review' | 'removed';

export const ListingsModerationScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const tabs: { key: FilterTab; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'flagged', label: 'Flagged' },
    { key: 'under_review', label: 'Under Review' },
    { key: 'removed', label: 'Removed' },
  ];

  const filtered =
    activeTab === 'all'
      ? mockListings
      : mockListings.filter((l) => l.status === activeTab);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Listings Moderation</h2>
        {selectedIds.length > 0 && (
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700">
              Approve ({selectedIds.length})
            </button>
            <button className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700">
              Remove ({selectedIds.length})
            </button>
          </div>
        )}
      </div>

      <div className="flex gap-1 mb-4 bg-gray-100 p-1 rounded-lg w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition ${
              activeTab === tab.key
                ? 'bg-white text-primary shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 text-left text-sm text-gray-500">
              <th className="p-3 w-8">
                <input
                  type="checkbox"
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedIds(filtered.map((l) => l.id));
                    } else {
                      setSelectedIds([]);
                    }
                  }}
                />
              </th>
              <th className="p-3">Crop</th>
              <th className="p-3">Seller</th>
              <th className="p-3">Price</th>
              <th className="p-3">Mandi Dev.</th>
              <th className="p-3">Flag Reason</th>
              <th className="p-3">Date</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filtered.map((item) => (
              <React.Fragment key={item.id}>
                <tr
                  className={`hover:bg-gray-50 cursor-pointer ${
                    item.status === 'flagged' ? 'bg-amber-50' : ''
                  }`}
                  onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                >
                  <td className="p-3" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(item.id)}
                      onChange={() => toggleSelect(item.id)}
                    />
                  </td>
                  <td className="p-3 font-medium text-gray-900">{item.crop}</td>
                  <td className="p-3 text-gray-600">{item.seller}</td>
                  <td className="p-3 text-gray-900 font-medium">PKR {item.price.toLocaleString()}</td>
                  <td className="p-3">
                    <span
                      className={`text-sm font-medium ${
                        item.deviation > 20
                          ? 'text-red-600'
                          : item.deviation > 0
                          ? 'text-amber-600'
                          : 'text-green-600'
                      }`}
                    >
                      {item.deviation > 0 ? '+' : ''}
                      {item.deviation}%
                    </span>
                  </td>
                  <td className="p-3 text-sm text-gray-500">{item.flagReason || '—'}</td>
                  <td className="p-3 text-sm text-gray-500">{item.date}</td>
                  <td className="p-3">
                    <span className="text-gray-400">▼</span>
                  </td>
                </tr>
                {expandedId === item.id && (
                  <tr>
                    <td colSpan={8} className="p-4 bg-gray-50">
                      <div className="flex gap-4 items-center">
                        <div className="w-20 h-20 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-sm">
                          Photo
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-600">
                            Full listing preview: {item.crop} from {item.seller}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            Price: PKR {item.price.toLocaleString()} | Mandi Rate: PKR{' '}
                            {item.mandiRate.toLocaleString()}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button className="px-3 py-1.5 bg-green-600 text-white rounded text-sm hover:bg-green-700">
                            Approve
                          </button>
                          <button className="px-3 py-1.5 bg-red-600 text-white rounded text-sm hover:bg-red-700">
                            Remove Listing
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
