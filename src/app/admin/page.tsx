'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Users, FileText, DollarSign, Target, Search,
  ChevronLeft, ChevronRight, Check, X, Edit2, Save,
  Ticket, Plus, Trash2, Copy, RefreshCw, TrendingUp, Calendar
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import { UserProfile } from '@/lib/types';

interface PeriodStats { users: number; resumes: number; ats: number }

interface Stats {
  totalUsers: number;
  totalResumes: number;
  totalATS: number;
  monthlyRevenue: string;
  yearlyRevenue: string;
  activeSubscriptions: number;
  planBreakdown: { plan: string; count: number }[];
  periods: {
    today: PeriodStats;
    yesterday: PeriodStats;
    week: PeriodStats;
    month: PeriodStats;
    year: PeriodStats;
  };
  last7DaysSignups: { date: string; count: number }[];
}

interface AdminUser {
  id: string; email: string; name: string | null; plan: string;
  credits: number; creditsLimit: number; atsCredits: number; atsCreditsLimit: number;
  emailVerified: boolean; isAdmin: boolean; createdAt: string;
  _count: { history: number; atsHistory: number };
}

interface Coupon {
  id: string; code: string; credits: number; atsCredits: number;
  maxUses: number; usedCount: number; expiresAt: string | null;
  note: string | null; createdAt: string;
  _count: { redemptions: number };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function BigStat({ icon: Icon, label, value, sub, color }: { icon: React.FC<any>; label: string; value: string | number; sub?: string; color: string }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color}`}>
        <Icon size={20} className="text-white" />
      </div>
      <p className="text-2xl font-extrabold text-gray-900">{value}</p>
      <p className="text-sm font-medium text-gray-700 mt-0.5">{label}</p>
      {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
    </div>
  );
}

function PeriodRow({ label, data }: { label: string; data: PeriodStats }) {
  return (
    <tr className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
      <td className="px-4 py-3 text-sm font-semibold text-gray-700 w-32">{label}</td>
      <td className="px-4 py-3 text-sm text-center">
        <span className="font-bold text-primary-700">{data.users}</span>
        <span className="text-gray-400 text-xs ml-1">users</span>
      </td>
      <td className="px-4 py-3 text-sm text-center">
        <span className="font-bold text-violet-700">{data.resumes}</span>
        <span className="text-gray-400 text-xs ml-1">resumes</span>
      </td>
      <td className="px-4 py-3 text-sm text-center">
        <span className="font-bold text-emerald-700">{data.ats}</span>
        <span className="text-gray-400 text-xs ml-1">ATS checks</span>
      </td>
    </tr>
  );
}

function Sparkline({ data }: { data: { date: string; count: number }[] }) {
  const max = Math.max(...data.map((d) => d.count), 1);
  const w = 280; const h = 48; const pad = 4;
  const pts = data.map((d, i) => {
    const x = pad + (i / (data.length - 1)) * (w - pad * 2);
    const y = h - pad - ((d.count / max) * (h - pad * 2));
    return `${x},${y}`;
  });
  return (
    <div className="mt-2">
      <svg width={w} height={h} className="overflow-visible">
        <polyline
          points={pts.join(' ')}
          fill="none"
          stroke="#6366f1"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {data.map((d, i) => {
          const x = pad + (i / (data.length - 1)) * (w - pad * 2);
          const y = h - pad - ((d.count / max) * (h - pad * 2));
          return (
            <g key={i}>
              <circle cx={x} cy={y} r="3" fill="#6366f1" />
              <text x={x} y={h + 12} textAnchor="middle" fontSize="9" fill="#9ca3af">
                {d.date.slice(5)}
              </text>
              {d.count > 0 && (
                <text x={x} y={y - 6} textAnchor="middle" fontSize="9" fill="#6366f1" fontWeight="bold">
                  {d.count}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

const EMPTY_COUPON = { code: '', credits: 5, atsCredits: 0, maxUses: 1, expiresAt: '', note: '' };

export default function AdminPage() {
  const router = useRouter();
  const [me, setMe] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<{ credits: number; atsCredits: number; plan: string }>({ credits: 0, atsCredits: 0, plan: '' });
  const [saving, setSaving] = useState(false);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [couponForm, setCouponForm] = useState(EMPTY_COUPON);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');
  const [creatingCoupon, setCreatingCoupon] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'coupons'>('overview');

  const fetchCoupons = () =>
    fetch('/api/admin/coupons').then((r) => r.json()).then((data) => {
      if (Array.isArray(data)) setCoupons(data);
    });

  useEffect(() => {
    fetch('/api/auth/me').then((r) => r.json()).then((u) => {
      if (!u.id) { router.push('/login'); return; }
      setMe(u);
      fetch('/api/admin/stats').then((r) => {
        if (r.status === 403) { router.push('/dashboard'); return; }
        return r.json();
      }).then((s) => { if (s) setStats(s); setLoading(false); });
    });
    fetchCoupons();
  }, [router]);

  useEffect(() => {
    const params = new URLSearchParams({ page: String(page), search });
    fetch(`/api/admin/users?${params}`).then((r) => r.json()).then((data) => {
      if (data.users) { setUsers(data.users); setTotal(data.total); setPages(data.pages); }
    });
  }, [page, search]);

  const startEdit = (u: AdminUser) => { setEditing(u.id); setEditValues({ credits: u.credits, atsCredits: u.atsCredits, plan: u.plan }); };

  const saveEdit = async (userId: string) => {
    setSaving(true);
    const res = await fetch(`/api/admin/users/${userId}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editValues),
    });
    if (res.ok) {
      const updated = await res.json();
      setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, ...updated } : u));
    }
    setEditing(null); setSaving(false);
  };

  const createCoupon = async () => {
    setCouponError(''); setCouponSuccess(''); setCreatingCoupon(true);
    const res = await fetch('/api/admin/coupons', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code: couponForm.code || undefined,
        credits: Number(couponForm.credits),
        atsCredits: Number(couponForm.atsCredits),
        maxUses: Number(couponForm.maxUses),
        expiresAt: couponForm.expiresAt || undefined,
        note: couponForm.note || undefined,
      }),
    });
    const data = await res.json();
    if (!res.ok) setCouponError(data.error);
    else { setCouponSuccess(`Coupon "${data.code}" created!`); setCouponForm(EMPTY_COUPON); fetchCoupons(); }
    setCreatingCoupon(false);
  };

  const deleteCoupon = async (id: string) => {
    if (!confirm('Delete this coupon?')) return;
    await fetch(`/api/admin/coupons/${id}`, { method: 'DELETE' });
    setCoupons((prev) => prev.filter((c) => c.id !== id));
  };

  const copyCouponCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  if (loading || !me) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  const PLAN_COLORS: Record<string, string> = { free: 'bg-gray-400', basic: 'bg-blue-500', pro: 'bg-violet-600', premium: 'bg-amber-500' };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={me} />
      <main className="max-w-7xl mx-auto px-4 py-8 space-y-6">

        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">Admin Panel</h1>
            <p className="text-gray-500 text-sm mt-1">Analytics, users, and coupons</p>
          </div>
          <div className="flex gap-2">
            {(['overview', 'users', 'coupons'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold capitalize transition-colors ${activeTab === tab ? 'bg-primary-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* ── OVERVIEW TAB ── */}
        {activeTab === 'overview' && stats && (
          <div className="space-y-6">

            {/* Top KPIs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <BigStat icon={Users} label="Total Users" value={stats.totalUsers} sub={`+${stats.periods.today.users} today`} color="bg-primary-600" />
              <BigStat icon={FileText} label="Total Resumes" value={stats.totalResumes} sub={`+${stats.periods.today.resumes} today`} color="bg-violet-600" />
              <BigStat icon={Target} label="ATS Checks" value={stats.totalATS} sub={`+${stats.periods.today.ats} today`} color="bg-emerald-600" />
              <BigStat icon={DollarSign} label="Monthly Revenue" value={`$${stats.monthlyRevenue}`} sub={`$${stats.yearlyRevenue}/yr est.`} color="bg-amber-500" />
            </div>

            {/* Revenue & subscriptions */}
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <DollarSign size={16} className="text-amber-500" /> Revenue
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Monthly (MRR)</span>
                    <span className="font-bold text-gray-900">${stats.monthlyRevenue}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Yearly (ARR est.)</span>
                    <span className="font-bold text-gray-900">${stats.yearlyRevenue}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Active subscriptions</span>
                    <span className="font-bold text-gray-900">{stats.activeSubscriptions}</span>
                  </div>
                </div>
              </div>

              {/* Plan breakdown */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <TrendingUp size={16} className="text-primary-600" /> Plan Breakdown
                </h3>
                <div className="space-y-3">
                  {stats.planBreakdown.sort((a, b) => b.count - a.count).map((p) => {
                    const pct = stats.totalUsers > 0 ? Math.round((p.count / stats.totalUsers) * 100) : 0;
                    return (
                      <div key={p.plan}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="capitalize font-semibold text-gray-700">{p.plan}</span>
                          <span className="text-gray-400">{p.count} ({pct}%)</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${PLAN_COLORS[p.plan] || 'bg-gray-400'}`} style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Sparkline */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <Users size={16} className="text-primary-600" /> New Signups — Last 7 Days
                </h3>
                <Sparkline data={stats.last7DaysSignups} />
              </div>
            </div>

            {/* Period breakdown table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-gray-100 flex items-center gap-2">
                <Calendar size={16} className="text-primary-600" />
                <h2 className="font-bold text-gray-900">Activity by Period</h2>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase text-left">Period</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase text-center">New Users</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase text-center">Resumes Made</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase text-center">ATS Checks</th>
                  </tr>
                </thead>
                <tbody>
                  <PeriodRow label="Today" data={stats.periods.today} />
                  <PeriodRow label="Yesterday" data={stats.periods.yesterday} />
                  <PeriodRow label="This Week" data={stats.periods.week} />
                  <PeriodRow label="This Month" data={stats.periods.month} />
                  <PeriodRow label="This Year" data={stats.periods.year} />
                  <PeriodRow label="All Time" data={{ users: stats.totalUsers, resumes: stats.totalResumes, ats: stats.totalATS }} />
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── USERS TAB ── */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex items-center gap-3">
              <h2 className="font-bold text-gray-900 flex-1">Users ({total})</h2>
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by email or name..."
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  className="pl-8 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 w-64"
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-left">
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">User</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Plan</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Credits</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">ATS Credits</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Activity</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Verified</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-800">{u.email}</p>
                        {u.name && <p className="text-xs text-gray-400">{u.name}</p>}
                        {u.isAdmin && <span className="text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-semibold">admin</span>}
                      </td>
                      <td className="px-4 py-3">
                        {editing === u.id ? (
                          <select value={editValues.plan} onChange={(e) => setEditValues((v) => ({ ...v, plan: e.target.value }))} className="border border-gray-200 rounded-lg px-2 py-1 text-sm">
                            {['free', 'basic', 'pro', 'premium'].map((p) => <option key={p} value={p}>{p}</option>)}
                          </select>
                        ) : (
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full text-white ${PLAN_COLORS[u.plan] || 'bg-gray-400'}`}>{u.plan}</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {editing === u.id ? (
                          <input type="number" value={editValues.credits} onChange={(e) => setEditValues((v) => ({ ...v, credits: parseInt(e.target.value) || 0 }))} className="w-16 border border-gray-200 rounded-lg px-2 py-1 text-sm" />
                        ) : <span>{u.credits} / {u.creditsLimit}</span>}
                      </td>
                      <td className="px-4 py-3">
                        {editing === u.id ? (
                          <input type="number" value={editValues.atsCredits} onChange={(e) => setEditValues((v) => ({ ...v, atsCredits: parseInt(e.target.value) || 0 }))} className="w-16 border border-gray-200 rounded-lg px-2 py-1 text-sm" />
                        ) : <span>{u.atsCredits >= 9999 ? '∞' : u.atsCredits}</span>}
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs">{u._count.history} resumes · {u._count.atsHistory} ATS</td>
                      <td className="px-4 py-3">
                        {u.emailVerified ? <Check size={16} className="text-green-500" /> : <X size={16} className="text-gray-300" />}
                      </td>
                      <td className="px-4 py-3">
                        {editing === u.id ? (
                          <div className="flex items-center gap-2">
                            <button onClick={() => saveEdit(u.id)} disabled={saving} className="flex items-center gap-1 text-xs bg-primary-600 text-white px-2.5 py-1.5 rounded-lg hover:bg-primary-700 disabled:opacity-50">
                              <Save size={12} /> Save
                            </button>
                            <button onClick={() => setEditing(null)} className="text-xs text-gray-400 hover:text-gray-600">Cancel</button>
                          </div>
                        ) : (
                          <button onClick={() => startEdit(u)} className="flex items-center gap-1 text-xs text-gray-500 hover:text-primary-600 border border-gray-200 px-2.5 py-1.5 rounded-lg hover:border-primary-300 transition-colors">
                            <Edit2 size={12} /> Edit
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {pages > 1 && (
              <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100">
                <p className="text-sm text-gray-500">Page {page} of {pages}</p>
                <div className="flex gap-2">
                  <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40"><ChevronLeft size={16} /></button>
                  <button onClick={() => setPage((p) => Math.min(pages, p + 1))} disabled={page === pages} className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40"><ChevronRight size={16} /></button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── COUPONS TAB ── */}
        {activeTab === 'coupons' && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex items-center gap-2">
              <Ticket size={18} className="text-primary-600" />
              <h2 className="font-bold text-gray-900 flex-1">Coupon Manager</h2>
              <span className="text-xs text-gray-400">{coupons.length} coupon{coupons.length !== 1 ? 's' : ''}</span>
            </div>

            {/* Create form */}
            <div className="p-5 border-b border-gray-100 bg-gray-50">
              <p className="text-xs font-semibold text-gray-500 uppercase mb-3">Create new coupon</p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                <div className="lg:col-span-1">
                  <label className="text-xs text-gray-500 mb-1 block">Code (auto if blank)</label>
                  <input type="text" placeholder="e.g. SUMMER25" value={couponForm.code} onChange={(e) => setCouponForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white font-mono" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Resume Credits</label>
                  <input type="number" min={0} value={couponForm.credits} onChange={(e) => setCouponForm((f) => ({ ...f, credits: Number(e.target.value) }))} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">ATS Credits</label>
                  <input type="number" min={0} value={couponForm.atsCredits} onChange={(e) => setCouponForm((f) => ({ ...f, atsCredits: Number(e.target.value) }))} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">
                    Redemptions Allowed
                    <span className="ml-1 text-amber-500">(1 = one person only)</span>
                  </label>
                  <input type="number" min={1} value={couponForm.maxUses} onChange={(e) => setCouponForm((f) => ({ ...f, maxUses: Number(e.target.value) }))} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white font-bold" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Expires (optional)</label>
                  <input type="date" value={couponForm.expiresAt} onChange={(e) => setCouponForm((f) => ({ ...f, expiresAt: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Note (optional)</label>
                  <input type="text" placeholder="Internal note" value={couponForm.note} onChange={(e) => setCouponForm((f) => ({ ...f, note: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white" />
                </div>
              </div>
              <div className="flex items-center gap-3 mt-3">
                <button onClick={createCoupon} disabled={creatingCoupon} className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-primary-700 disabled:opacity-50 transition-colors">
                  {creatingCoupon ? <RefreshCw size={14} className="animate-spin" /> : <Plus size={14} />}
                  Create Coupon
                </button>
                {couponError && <p className="text-red-500 text-sm">{couponError}</p>}
                {couponSuccess && <p className="text-green-600 text-sm font-medium">{couponSuccess}</p>}
              </div>
            </div>

            {coupons.length === 0 ? (
              <div className="text-center py-10 text-gray-400 text-sm">No coupons yet. Create one above.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 text-left">
                      <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Code</th>
                      <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Resume Credits</th>
                      <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">ATS Credits</th>
                      <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Redeemed / Allowed</th>
                      <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Expires</th>
                      <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Note</th>
                      <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {coupons.map((c) => {
                      const exhausted = c.usedCount >= c.maxUses;
                      const expired = c.expiresAt ? new Date(c.expiresAt) < new Date() : false;
                      return (
                        <tr key={c.id} className={`hover:bg-gray-50 transition-colors ${exhausted || expired ? 'opacity-50' : ''}`}>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-primary-700 bg-primary-50 px-2 py-0.5 rounded-lg">{c.code}</span>
                              <button onClick={() => copyCouponCode(c.code)} className="text-gray-400 hover:text-primary-600 transition-colors"><Copy size={13} /></button>
                              {copiedCode === c.code && <span className="text-xs text-green-600 font-medium">Copied!</span>}
                            </div>
                            {exhausted && <span className="text-xs text-red-500 font-medium">Exhausted</span>}
                            {!exhausted && expired && <span className="text-xs text-amber-500 font-medium">Expired</span>}
                          </td>
                          <td className="px-4 py-3 font-semibold text-gray-700">+{c.credits}</td>
                          <td className="px-4 py-3 font-semibold text-gray-700">+{c.atsCredits}</td>
                          <td className="px-4 py-3">
                            <span className={c.usedCount >= c.maxUses ? 'text-red-500 font-bold' : 'text-gray-600'}>
                              {c.usedCount} / {c.maxUses}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-gray-500 text-xs">{c.expiresAt ? new Date(c.expiresAt).toLocaleDateString() : '—'}</td>
                          <td className="px-4 py-3 text-gray-400 text-xs">{c.note || '—'}</td>
                          <td className="px-4 py-3">
                            <button onClick={() => deleteCoupon(c.id)} className="flex items-center gap-1 text-xs text-red-400 hover:text-red-600 border border-red-100 hover:border-red-300 px-2.5 py-1.5 rounded-lg transition-colors">
                              <Trash2 size={12} /> Delete
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
