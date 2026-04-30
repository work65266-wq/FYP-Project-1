import React, { useState } from 'react';

interface Dispute {
  id: string;
  buyerName: string;
  sellerName: string;
  crop: string;
  amount: number;
  daysOpen: number;
  status: 'open' | 'under_review' | 'resolved';
  reason: string;
  description: string;
}

const mockDisputes: Dispute[] = [
  { id: 'D-001', buyerName: 'Ahmed Khan', sellerName: 'Muhammad Aslam', crop: 'Wheat', amount: 260000, daysOpen: 3, status: 'open', reason: "Quality doesn't match listing", description: 'The wheat received is not Grade A as listed. Contains foreign matter and is not properly dried.' },
  { id: 'D-002', buyerName: 'Tariq Mehmood', sellerName: 'Fatima Bibi', crop: 'Rice', amount: 120000, daysOpen: 5, status: 'under_review', reason: 'Quantity received is short', description: 'Ordered 30 maund but received only 25 maund. Short by 5 maund.' },
  { id: 'D-003', buyerName: 'Imran Ali', sellerName: 'Noor Muhammad', crop: 'Mango', amount: 175000, daysOpen: 1, status: 'open', reason: 'Produce not delivered', description: 'It has been 5 days since dispatch. The produce has not arrived and the seller is not responding.' },
  { id: 'D-004', buyerName: 'Saima Bibi', sellerName: 'Ghulam Hussain', crop: 'Cotton', amount: 440000, daysOpen: 14, status: 'resolved', reason: "Quality doesn't match listing", description: 'Cotton quality was Grade B, not Grade A as listed.' },
];

type FilterTab = 'open' | 'under_review' | 'resolved';

export const DisputeManagementScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<FilterTab>('open');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [resolution, setResolution] = useState('');
  const [partialPercent, setPartialPercent] = useState('70');

  const tabs: { key: FilterTab; label: string }[] = [
    { key: 'open', label: 'Open' },
    { key: 'under_review', label: 'Under Review' },
    { key: 'resolved', label: 'Resolved' },
  ];

  const filtered = mockDisputes.filter((d) => d.status === activeTab);
  const selected = mockDisputes.find((d) => d.id === selectedId);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Dispute Management</h2>

      <div className="flex gap-1 mb-4 bg-gray-100 p-1 rounded-lg w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => { setActiveTab(tab.key); setSelectedId(null); }}
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

      <div className="flex gap-6">
        {/* Dispute table */}
        <div className="flex-1 bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 text-left text-sm text-gray-500">
                <th className="p-3">ID</th>
                <th className="p-3">Buyer</th>
                <th className="p-3">Seller</th>
                <th className="p-3">Crop</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Days Open</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => setSelectedId(item.id)}
                  className={`hover:bg-gray-50 cursor-pointer ${
                    selectedId === item.id ? 'bg-blue-50' : ''
                  }`}
                >
                  <td className="p-3 font-medium text-gray-900">{item.id}</td>
                  <td className="p-3 text-gray-600">{item.buyerName}</td>
                  <td className="p-3 text-gray-600">{item.sellerName}</td>
                  <td className="p-3 text-gray-900">{item.crop}</td>
                  <td className="p-3 font-medium">PKR {item.amount.toLocaleString()}</td>
                  <td className="p-3">{item.daysOpen}d</td>
                  <td className="p-3">
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium ${
                        item.status === 'open'
                          ? 'bg-red-100 text-red-700'
                          : item.status === 'under_review'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-green-100 text-green-700'
                      }`}
                    >
                      {item.status.replace('_', ' ')}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Dispute detail panel */}
        {selected && (
          <div className="w-96 bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Dispute {selected.id}</h3>

            <div className="space-y-4 mb-6">
              <div>
                <p className="text-xs text-gray-500">Reason</p>
                <p className="text-sm font-medium text-gray-900">{selected.reason}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Description</p>
                <p className="text-sm text-gray-700">{selected.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Buyer</p>
                  <p className="text-sm font-medium">{selected.buyerName}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Seller</p>
                  <p className="text-sm font-medium">{selected.sellerName}</p>
                </div>
              </div>

              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-xs text-blue-600 font-medium">Escrow Amount</p>
                <p className="text-lg font-bold text-blue-700">PKR {selected.amount.toLocaleString()}</p>
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-2">Evidence Photos</p>
                <div className="flex gap-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center text-gray-400 text-xs">
                      Photo
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-2">Chat Transcript</p>
                <div className="bg-gray-50 rounded p-3 text-xs text-gray-600 max-h-32 overflow-y-auto">
                  <p className="mb-1"><span className="font-medium">Buyer:</span> The quality is not as described.</p>
                  <p className="mb-1"><span className="font-medium">Seller:</span> I sent Grade A quality.</p>
                  <p><span className="font-medium">Buyer:</span> Sending photos as proof.</p>
                </div>
              </div>
            </div>

            {selected.status !== 'resolved' && (
              <button
                onClick={() => setShowResolveModal(true)}
                className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-light font-medium"
              >
                Resolve Dispute
              </button>
            )}
          </div>
        )}
      </div>

      {/* Resolve Modal */}
      {showResolveModal && selected && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-[480px] shadow-xl">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Resolve Dispute {selected.id}</h3>

            <div className="space-y-3 mb-6">
              <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input type="radio" name="resolution" value="farmer" onChange={(e) => setResolution(e.target.value)} />
                <div>
                  <p className="font-medium text-sm">Release to Farmer</p>
                  <p className="text-xs text-gray-500">Full amount released to farmer</p>
                </div>
              </label>
              <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input type="radio" name="resolution" value="partial" onChange={(e) => setResolution(e.target.value)} />
                <div>
                  <p className="font-medium text-sm">Partial Refund</p>
                  <p className="text-xs text-gray-500">Split amount between parties</p>
                </div>
              </label>
              <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input type="radio" name="resolution" value="buyer" onChange={(e) => setResolution(e.target.value)} />
                <div>
                  <p className="font-medium text-sm">Full Refund to Buyer</p>
                  <p className="text-xs text-gray-500">Full amount returned to buyer</p>
                </div>
              </label>
            </div>

            {resolution === 'partial' && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Farmer's portion (%)
                </label>
                <input
                  type="number"
                  value={partialPercent}
                  onChange={(e) => setPartialPercent(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2"
                  min="0"
                  max="100"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Farmer: PKR {Math.round(selected.amount * parseInt(partialPercent || '0') / 100).toLocaleString()} | 
                  Buyer: PKR {Math.round(selected.amount * (100 - parseInt(partialPercent || '0')) / 100).toLocaleString()}
                </p>
              </div>
            )}

            <div className="flex gap-3 justify-end">
              <button onClick={() => setShowResolveModal(false)} className="px-4 py-2 text-gray-600">
                Cancel
              </button>
              <button
                disabled={!resolution}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-light disabled:opacity-50 font-medium"
                onClick={() => {
                  setShowResolveModal(false);
                  setSelectedId(null);
                }}
              >
                Resolve Dispute
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
