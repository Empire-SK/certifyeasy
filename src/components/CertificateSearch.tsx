'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CertificateSearch() {
  const router = useRouter();
  const [certificateId, setCertificateId] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (certificateId.trim()) {
      setLoading(true);
      router.push(`/verify/${encodeURIComponent(certificateId)}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="flex flex-col gap-4">
      <input
        type="text"
        value={certificateId}
        onChange={(e) => setCertificateId(e.target.value)}
        placeholder="Enter Certificate ID"
        className="rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder-slate-500 transition focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        required
      />
      <button
        type="submit"
        disabled={loading}
        className="rounded-lg bg-blue-600 px-4 py-3 font-medium text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-slate-400"
      >
        {loading ? 'Verifying...' : 'Verify'}
      </button>
    </form>
  );
}
