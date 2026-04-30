import React, { useState } from 'react';

interface KYCSubmission {
  id: string;
  name: string;
  role: 'farmer' | 'buyer';
  phone: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  ntn?: string;
  rejectionReason?: string;
}

const mockSubmissions: KYCSubmission[] = [
  { id: 'k1', name: 'Abdul Rashid', role: 'farmer', phone: '+92 315 5551234', submittedAt: '2026-04-28 10:30', status: 'pending' },
  { id: 'k2', name: 'Noor Muhammad', role: 'farmer', phone: '+92 333 8887654', submittedAt: '2026-04-28 09:15', status: 'pending' },
  { id: 'k3', name: 'Saima Bibi', role: 'buyer', phone: '+92 300 1112233', submittedAt: '2026-04-27 16:45', status: 'pending', ntn: '1234567-8' },
  { id: 'k4', name: 'Usman Shah', role: 'farmer', phone: '+92 345 9998877', submittedAt: '2026-04-27 14:20', status: 'pending' },
  { id: 'k5', name: 'Fatima Zahra', role: 'buyer', phone: '+92 311 4445566', submittedAt: '2026-04-26 11:00', status: 'approved' },
];

const rejectionReasons = ['Image unclear', 'CNIC expired', 'Name mismatch', 'Duplicate CNIC'];

export const KYCReviewScreen: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string | null>('k1');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [rejectNote, setRejectNote] = useState('');
  const [submissions, setSubmissions] = useState(mockSubmissions);

  const selected = submissions.find((s) => s.id === selectedId);
  const pendingSubmissions = submissions.filter((s) => s.status === 'pending');

  const handleApprove = () => {
    if (selectedId) {
      setSubmissions(
        submissions.map((s) => (s.id === selectedId ? { ...s, status: 'approved' as const } : s))
      );
    }
  };

  const handleReject = () => {
    if (selectedId && rejectReason) {
      setSubmissions(
        submissions.map((s) =>
          s.id === selectedId
            ? { ...s, status: 'rejected' as const, rejectionReason: rejectReason }
            : s
        )
      );
      setShowRejectModal(false);
      setRejectReason('');
      setRejectNote('');
    }
  };

  return (
    <div className="flex h-full">
      {/* Left panel - Queue */}
      <div className="w-96 border-r bg-white overflow-y-auto">
        <div className="p-4 border-b">
          <h2 className="text-lg font-bold text-gray-900">KYC Reviews</h2>
          <p className="text-sm text-gray-500">{pendingSubmissions.length} pending submissions</p>
        </div>

        <div className="divide-y">
          {submissions
            .filter((s) => s.status === 'pending')
            .sort((a, b) => new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime())
            .map((item) => (
              <button
                key={item.id}
                onClick={() => setSelectedId(item.id)}
                className={`w-full text-left p-4 hover:bg-gray-50 transition ${
                  selectedId === item.id ? 'bg-green-50 border-l-4 border-primary' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-500">{item.phone}</p>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      item.role === 'farmer'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    {item.role}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <div className="w-12 h-8 bg-gray-200 rounded text-xs flex items-center justify-center text-gray-500">
                    CNIC
                  </div>
                  <span className="text-xs text-gray-400">{item.submittedAt}</span>
                </div>
              </button>
            ))}
        </div>
      </div>

      {/* Right panel - Review detail */}
      <div className="flex-1 p-6">
        {selected ? (
          <div>
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900">{selected.name}</h3>
              <div className="flex gap-4 mt-2 text-sm text-gray-600">
                <span>📱 {selected.phone}</span>
                <span>👤 {selected.role}</span>
                {selected.ntn && <span>📄 NTN: {selected.ntn}</span>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">CNIC Front</h4>
                <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg h-48 flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <span className="text-4xl">🪪</span>
                    <p className="text-sm mt-2">CNIC Front Image</p>
                    <p className="text-xs text-gray-400">Click to zoom</p>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">CNIC Back</h4>
                <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg h-48 flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <span className="text-4xl">🪪</span>
                    <p className="text-sm mt-2">CNIC Back Image</p>
                    <p className="text-xs text-gray-400">Click to zoom</p>
                  </div>
                </div>
              </div>
            </div>

            {selected.status === 'pending' && (
              <div className="flex gap-3">
                <button
                  onClick={handleApprove}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
                >
                  ✓ Approve
                </button>
                <button
                  onClick={() => setShowRejectModal(true)}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
                >
                  ✕ Reject
                </button>
              </div>
            )}

            {selected.status === 'approved' && (
              <div className="bg-green-50 text-green-700 px-4 py-3 rounded-lg font-medium">
                ✓ Approved
              </div>
            )}

            {selected.status === 'rejected' && (
              <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg">
                <span className="font-medium">✕ Rejected:</span> {selected.rejectionReason}
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            <p>Select a submission to review</p>
          </div>
        )}
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-96 shadow-xl">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Reject KYC Submission</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rejection Reason *
              </label>
              <select
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm"
              >
                <option value="">Select reason...</option>
                {rejectionReasons.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Note (optional)
              </label>
              <textarea
                value={rejectNote}
                onChange={(e) => setRejectNote(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm"
                rows={3}
                placeholder="Any additional details..."
              />
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowRejectModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={!rejectReason}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
