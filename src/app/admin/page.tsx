'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  FilePlus,
  Upload,
  BarChart3,
  FileText,
  Search,
  Users,
  AlertCircle,
  CheckCircle2,
  TrendingUp,
  Download,
  Settings,
  Globe,
  Mail,
  Building2,
  Loader2,
  ShieldCheck,
  LogOut,
  ArrowRight
} from 'lucide-react';
import CSVUpload from '@/components/CSVUpload';

// ─── Types ────────────────────────────────────────────────────────────────────

interface StatsData {
  totalCerts: number;
  weeklyData: number[];
  recentCerts: { name: string; certificateId: string; eventName: string; createdAt: string }[];
  eventGroups: { eventName: string; _count: { _all: number } }[];
  totalViews: number;
  totalLookups: number;
}

interface IssuerProfile {
  id: string;
  name: string;
  website: string;
  email: string;
  address: string;
  description: string;
}

// ─── Login View ───────────────────────────────────────────────────────────────

const AdminLogin = ({ onLogin }: { onLogin: () => void }) => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      if (credentials.email === 'admin@certifyeasy.com' && credentials.password === 'admin123') {
        onLogin();
      } else {
        setError('Invalid credentials');
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100">
        <div className="bg-blue-600 p-10 text-white text-center">
          <ShieldCheck className="w-12 h-12 mx-auto mb-4" />
          <h2 className="text-2xl font-bold">Admin Portal</h2>
          <p className="opacity-80 mt-1">Authorized Access Only</p>
        </div>
        <form onSubmit={handleSubmit} className="p-10 space-y-6">
          {error && <div className="text-red-500 text-sm font-bold text-center bg-red-50 p-3 rounded-xl">{error}</div>}
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Admin Email</label>
            <input 
              type="email" 
              required
              className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-100 focus:border-blue-500 outline-none transition-all"
              placeholder="admin@certifyeasy.com"
              onChange={(e) => setCredentials({...credentials, email: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Password</label>
            <input 
              type="password" 
              required
              className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-100 focus:border-blue-500 outline-none transition-all"
              placeholder="••••••••"
              onChange={(e) => setCredentials({...credentials, password: e.target.value})}
            />
          </div>
          <button 
            disabled={loading}
            className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign In'} <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

// ─── Analytics View ───────────────────────────────────────────────────────────

function AnalyticsView() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch('/api/stats');
      if (res.ok) setStats(await res.json());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchStats(); }, [fetchStats]);

  const statCards = stats
    ? [
        {
          label: 'Total Issued',
          value: stats.totalCerts.toLocaleString(),
          icon: <FileText className="text-blue-600" />,
          bg: 'bg-blue-50',
          trend: '+' + stats.totalCerts,
          positive: true,
        },
        {
          label: 'Website Views',
          value: stats.totalViews.toLocaleString(),
          icon: <Globe className="text-emerald-600" />,
          bg: 'bg-emerald-50',
          trend: 'all time',
          positive: true,
        },
        {
          label: 'Verifications',
          value: stats.totalLookups.toLocaleString(),
          icon: <Search className="text-purple-600" />,
          bg: 'bg-purple-50',
          trend: 'lookups',
          positive: true,
        },
        {
          label: 'This Week',
          value: (stats.weeklyData[stats.weeklyData.length - 1] ?? 0).toString(),
          icon: <TrendingUp className="text-amber-600" />,
          bg: 'bg-amber-50',
          trend: 'new certs',
          positive: true,
        },
      ]
    : [];

  const chartData = stats?.weeklyData ?? Array(12).fill(0);
  const maxBar = Math.max(...chartData, 1);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((s) => (
          <div key={s.label} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl ${s.bg}`}>{s.icon}</div>
              <span className={`text-xs font-bold px-2 py-1 rounded-full bg-green-50 text-green-600`}>
                {s.trend}
              </span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{s.value}</p>
            <p className="text-sm text-gray-400 font-medium uppercase tracking-wider mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" /> Certificates Issued (Last 12 Weeks)
          </h3>
          <button onClick={fetchStats} className="bg-gray-50 border border-gray-100 text-sm font-bold text-gray-500 rounded-lg px-4 py-2 hover:bg-gray-100">
            Refresh
          </button>
        </div>
        <div className="h-64 w-full flex items-end gap-2 px-4">
          {chartData.map((h, i) => {
            const pct = maxBar === 0 ? 5 : Math.max((h / maxBar) * 100, 4);
            return (
              <div key={i} className="flex-1 bg-blue-100 hover:bg-blue-600 transition-colors rounded-t-lg relative group cursor-pointer" style={{ height: `${pct}%` }}>
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  {h} certs
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-4 border-t border-gray-50 pt-4 flex justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest">
          <span>Wk 1</span>
          <span>Wk 4</span>
          <span>Wk 8</span>
          <span>Wk 12</span>
        </div>
      </div>

      {stats && stats.recentCerts.length > 0 && (
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Recently Issued</h3>
          <div className="overflow-hidden border border-gray-100 rounded-xl">
            <table className="min-w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-gray-50 border-b border-gray-100 text-gray-500">
                <tr>
                  <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Certificate ID</th>
                  <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Name</th>
                  <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Event</th>
                  <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {stats.recentCerts.map((cert) => (
                  <tr key={cert.certificateId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-mono font-medium text-gray-600">{cert.certificateId}</td>
                    <td className="px-6 py-4 font-bold text-gray-900">{cert.name}</td>
                    <td className="px-6 py-4 text-gray-600">{cert.eventName}</td>
                    <td className="px-6 py-4 text-gray-500">{new Date(cert.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Manual Entry View ────────────────────────────────────────────────────────

function ManualEntryView() {
  const [formData, setFormData] = useState({ name: '', eventName: '', certificateId: '', issueDate: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch('/api/certificates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const result = await res.json();
      if (!res.ok) {
        setMessage({ type: 'error', text: result.message });
        return;
      }
      setMessage({ type: 'success', text: 'Certificate Issued & Unique ID Generated!' });
      setFormData({ name: '', eventName: '', certificateId: '', issueDate: '' });
      setTimeout(() => setMessage(null), 3000);
    } catch {
      setMessage({ type: 'error', text: 'Network error.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm">
        <h3 className="text-xl font-bold text-gray-900 mb-8 flex items-center gap-2">
          <FilePlus className="w-6 h-6 text-blue-600" /> Individual Issuance
        </h3>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Recipient Full Name</label>
              <input 
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 outline-none" 
                placeholder="e.g. Johnathan Smith"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Certificate ID</label>
              <input 
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 outline-none" 
                placeholder="e.g. CERT-001"
                value={formData.certificateId}
                onChange={(e) => setFormData({...formData, certificateId: e.target.value})}
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Course / Event Name</label>
            <input 
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 outline-none" 
              placeholder="e.g. Full Stack Bootcamp 2024"
              value={formData.eventName}
              onChange={(e) => setFormData({...formData, eventName: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Issue Date</label>
            <input 
              type="date"
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 outline-none"
              value={formData.issueDate}
              onChange={(e) => setFormData({...formData, issueDate: e.target.value})}
            />
          </div>
          
          {message && (
            <div className={`p-4 rounded-xl flex items-center justify-center gap-2 font-bold ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
              {message.text}
            </div>
          )}

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Confirm & Issue Certificate'}
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── CSV Upload View ──────────────────────────────────────────────────────────

function CsvUploadView() {
  return (
    <div className="max-w-2xl mx-auto py-12 animate-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white p-10 rounded-[2.5rem] border-2 border-dashed border-gray-200 text-center">
        <div className="bg-blue-50 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <Upload className="w-10 h-10 text-blue-400" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Bulk Certificate Upload</h3>
        <p className="text-gray-500 mb-8 max-w-sm mx-auto text-sm">
          Drag and drop your CSV file here. Ensure your columns match: <br/><code>name, eventName, certificateId, issueDate</code>
        </p>
        
        <CSVUpload />
        
        <div className="mt-8">
          <a href="/sample-certificates.csv" download className="text-sm font-bold text-blue-600 hover:underline flex items-center justify-center gap-1">
            <Download className="w-4 h-4" /> Download Sample Template
          </a>
        </div>
      </div>
    </div>
  );
}

// ─── Issuer Profile View ──────────────────────────────────────────────────────

function IssuerProfileView() {
  const [profile, setProfile] = useState<IssuerProfile | null>(null);
  const [draft, setDraft] = useState<IssuerProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/issuer-profile')
      .then(res => res.json())
      .then(data => {
        setProfile(data);
        setDraft(data);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    if (!draft) return;
    setSaving(true);
    try {
      const res = await fetch('/api/issuer-profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(draft),
      });
      const data = await res.json();
      if (res.ok) {
        setProfile(data.profile);
        setIsEditing(false);
      } else {
        alert(data.message);
      }
    } catch {
      alert('Error saving profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !draft) {
    return <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 text-blue-600 animate-spin" /></div>;
  }

  return (
    <div className="max-w-2xl mx-auto py-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="bg-gray-50 p-8 border-b border-gray-100 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="bg-blue-600 p-3 rounded-2xl text-white">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Issuer Profile</h3>
              <p className="text-xs text-gray-400 font-medium uppercase tracking-widest">Global Organization Details</p>
            </div>
          </div>
          <button 
            onClick={() => {
              if (isEditing) setDraft(profile);
              setIsEditing(!isEditing);
            }}
            className="text-sm font-bold text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg transition-all"
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>
        
        <div className="p-8 space-y-8">
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 px-1">
                <ShieldCheck className="w-3 h-3" /> Official Name
              </label>
              {isEditing ? (
                <input 
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 outline-none"
                  value={draft.name}
                  onChange={(e) => setDraft({...draft, name: e.target.value})}
                />
              ) : (
                <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900 font-bold">{draft.name}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 px-1">
                  <Globe className="w-3 h-3" /> Website
                </label>
                {isEditing ? (
                  <input 
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 outline-none"
                    value={draft.website}
                    onChange={(e) => setDraft({...draft, website: e.target.value})}
                  />
                ) : (
                  <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900 font-bold">{draft.website}</p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 px-1">
                  <Mail className="w-3 h-3" /> Support Email
                </label>
                {isEditing ? (
                  <input 
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 outline-none"
                    value={draft.email}
                    onChange={(e) => setDraft({...draft, email: e.target.value})}
                  />
                ) : (
                  <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900 font-bold">{draft.email}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 px-1">
                About the Organization
              </label>
              {isEditing ? (
                <textarea 
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 outline-none resize-none"
                  value={draft.description}
                  onChange={(e) => setDraft({...draft, description: e.target.value})}
                />
              ) : (
                <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-600 text-sm leading-relaxed">{draft.description}</p>
              )}
            </div>
          </div>

          {isEditing && (
            <button 
              onClick={handleSave}
              disabled={saving}
              className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-all flex justify-center items-center gap-2"
            >
              {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Save Profile Changes'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Certificates List View ───────────────────────────────────────────────────

function CertificatesListView() {
  const [certificates, setCertificates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const fetchCertificates = useCallback(async (searchQuery = '') => {
    setLoading(true);
    try {
      const url = searchQuery ? `/api/certificates?search=${encodeURIComponent(searchQuery)}` : '/api/certificates';
      const res = await fetch(url);
      if (res.ok) setCertificates(await res.json());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCertificates(debouncedSearch);
    const handleUploadSuccess = () => fetchCertificates(debouncedSearch);
    window.addEventListener('certificates-uploaded', handleUploadSuccess);
    return () => window.removeEventListener('certificates-uploaded', handleUploadSuccess);
  }, [fetchCertificates, debouncedSearch]);

  const handleDelete = async (certificateId: string) => {
    if (!confirm('Are you sure you want to delete this certificate?')) return;
    setDeleting(certificateId);
    try {
      const res = await fetch('/api/certificates', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ certificateId }),
      });
      if (res.ok) {
        setCertificates(prev => prev.filter(c => c.certificateId !== certificateId));
      }
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden animate-in fade-in duration-500">
      <div className="p-8 border-b border-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Issued Certificates</h2>
          <p className="text-sm text-gray-500 mt-1">Manage all certificates currently in the database.</p>
        </div>
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search certificates..." 
            className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 w-full sm:w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-gray-50 border-b border-gray-100 text-gray-500">
            <tr>
              <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Certificate ID</th>
              <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Recipient Name</th>
              <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Event / Course</th>
              <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr><td colSpan={4} className="px-6 py-12 text-center text-gray-400">Loading...</td></tr>
            ) : certificates.length === 0 ? (
              <tr><td colSpan={4} className="px-6 py-12 text-center text-gray-400">No certificates found.</td></tr>
            ) : (
              certificates.map((cert) => (
                <tr key={cert.certificateId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-mono font-medium text-gray-600">{cert.certificateId}</td>
                  <td className="px-6 py-4 font-bold text-gray-900">{cert.name}</td>
                  <td className="px-6 py-4 text-gray-600">{cert.eventName}</td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleDelete(cert.certificateId)}
                      disabled={deleting === cert.certificateId}
                      className="text-red-500 hover:text-red-700 font-bold"
                    >
                      {deleting === cert.certificateId ? 'Deleting...' : 'Delete'}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Main Admin Page ──────────────────────────────────────────────────────────

export default function AdminApp() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('analytics');

  if (!isAuthenticated) {
    return <AdminLogin onLogin={() => setIsAuthenticated(true)} />;
  }

  const menuItems = [
    { id: 'analytics', label: 'Analysis', icon: <BarChart3 className="w-5 h-5" /> },
    { id: 'certificates', label: 'Certificates', icon: <FileText className="w-5 h-5" /> },
    { id: 'manual', label: 'Manual Entry', icon: <FilePlus className="w-5 h-5" /> },
    { id: 'csv', label: 'CSV Upload', icon: <Upload className="w-5 h-5" /> },
    { id: 'profile', label: 'Issuer Profile', icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-gray-100 hidden lg:flex flex-col">
        <div className="p-8 border-b border-gray-50 flex items-center gap-3">
          <ShieldCheck className="w-8 h-8 text-blue-600" />
          <span className="text-xl font-black text-gray-900 tracking-tight">CertifyEasy</span>
        </div>
        <nav className="flex-1 p-6 space-y-2">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 px-4">Admin Controls</p>
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold transition-all ${
                activeTab === item.id 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
                : 'text-gray-500 hover:bg-gray-50 hover:text-blue-600'
              }`}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </nav>
        <div className="p-6 border-t border-gray-50">
          <button 
            onClick={() => setIsAuthenticated(false)}
            className="w-full flex items-center gap-3 px-4 py-3.5 text-red-500 font-bold hover:bg-red-50 rounded-xl transition-all"
          >
            <LogOut className="w-5 h-5" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Mobile Header */}
        <header className="lg:hidden bg-white border-b border-gray-100 p-4 flex justify-between items-center sticky top-0 z-30">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-blue-600" />
            <span className="font-bold text-gray-900">Admin</span>
          </div>
          <button onClick={() => setIsAuthenticated(false)} className="text-red-500 p-2"><LogOut className="w-5 h-5" /></button>
        </header>

        {/* Top Content Bar */}
        <div className="max-w-6xl mx-auto p-4 sm:p-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 capitalize">
                {menuItems.find(i => i.id === activeTab)?.label}
              </h2>
              <p className="text-gray-400 font-medium">Control and manage your organization's digital records</p>
            </div>
            {activeTab === 'analytics' && (
              <button className="bg-white border border-gray-200 text-gray-700 px-6 py-3 rounded-xl font-bold text-sm hover:bg-gray-50 transition-all flex items-center gap-2">
                <Download className="w-4 h-4" /> Export Report
              </button>
            )}
          </div>

          {/* Mobile Tab Content */}
          <div className="lg:hidden flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                  activeTab === item.id ? 'bg-blue-600 text-white' : 'bg-white text-gray-500 border border-gray-100'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {activeTab === 'analytics' && <AnalyticsView />}
          {activeTab === 'certificates' && <CertificatesListView />}
          {activeTab === 'csv' && <CsvUploadView />}
          {activeTab === 'manual' && <ManualEntryView />}
          {activeTab === 'profile' && <IssuerProfileView />}
        </div>
      </main>
    </div>
  );
}
