import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Package,
  FileText,
  Users,
  BarChart3,
  Plus,
  Edit,
  Trash2,
  LogOut,
  RefreshCw,
  ArrowLeft,
  Phone,
  MessageSquare,
  MessageCircle,
  Send,
  Eye,
  Activity,
  CheckCircle2,
  Menu,
  X,
  Shield,
  Layers,
  ChevronRight,
} from 'lucide-react';
import type { Listing } from '../../types';
import { getApiBaseUrl } from '../../config/api';
import { formatImageUrl } from '../../utils/imageUtils';

interface RequirementItem {
  _id: string;
  buyerName: string;
  buyerEmail: string;
  buyerPhone?: string;
  desiredLeadership: string;
  relocationTickets?: string;
  budgetUSD: number;
  preferredContactChannel: 'WhatsApp' | 'Line' | 'Telegram' | 'WeChat';
  contactDetail?: string;
  additionalNotes?: string;
  status: 'New' | 'Contacted' | 'Fulfilled' | 'Closed';
  createdAt: string;
}

interface BuyerItem {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  createdAt: string;
}

interface AnalyticsData {
  totalVisits: number;
  uniqueVisitors: number;
  activeSessions: number;
  registeredBuyersCount: number;
  totalListingsCount: number;
  availableListings: number;
  soldListings: number;
  totalRequirementsCount: number;
}

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'listings' | 'requirements' | 'buyers' | 'analytics'>('listings');
  
  // Mobile / Phone View Sidebar Drawer Toggle (Open on desktop by default, collapsible on phone)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Data States
  const [listings, setListings] = useState<Listing[]>([]);
  const [requirements, setRequirements] = useState<RequirementItem[]>([]);
  const [buyers, setBuyers] = useState<BuyerItem[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalVisits: 0,
    uniqueVisitors: 0,
    activeSessions: 1,
    registeredBuyersCount: 0,
    totalListingsCount: 0,
    availableListings: 0,
    soldListings: 0,
    totalRequirementsCount: 0,
  });

  const [deletingId, setDeletingId] = useState<string | null>(null);
  const navigate = useNavigate();
  const token = localStorage.getItem('adminToken');

  useEffect(() => {
    if (!token) {
      navigate('/admin/login');
      return;
    }

    fetchAllData();
  }, [token, navigate]);

  const fetchAllData = () => {
    fetchListings();
    fetchRequirements();
    fetchBuyers();
    fetchAnalytics();
  };

  const fetchListings = () => {
    const apiBase = getApiBaseUrl();
    const localCustom: Listing[] = JSON.parse(localStorage.getItem('customAdminListings') || '[]');
    fetch(`${apiBase}/listings`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const merged = [...data];
          localCustom.forEach((loc) => {
            if (!merged.some((m) => m._id === loc._id)) {
              merged.unshift(loc);
            }
          });
          setListings(merged);
        } else if (localCustom.length > 0) {
          setListings(localCustom);
        }
      })
      .catch(() => {
        if (localCustom.length > 0) setListings(localCustom);
      });
  };

  const fetchRequirements = () => {
    const apiBase = getApiBaseUrl();
    fetch(`${apiBase}/requirements`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setRequirements(data);
      })
      .catch(() => {});
  };

  const fetchBuyers = () => {
    const apiBase = getApiBaseUrl();
    fetch(`${apiBase}/auth/buyers`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setBuyers(data);
      })
      .catch(() => {});
  };

  const fetchAnalytics = () => {
    const apiBase = getApiBaseUrl();
    fetch(`${apiBase}/analytics`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.totalVisits !== undefined) setAnalytics(data);
      })
      .catch(() => {});
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/admin/login');
  };

  const handleStatusChange = async (id: string, newStatus: Listing['status']) => {
    setListings((prev) =>
      prev.map((item) => (item._id === id ? { ...item, status: newStatus } : item))
    );

    try {
      const apiBase = getApiBaseUrl();
      await fetch(`${apiBase}/listings/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      fetchAnalytics();
    } catch (err) {}
  };

  const handleDeleteListing = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this Brutal Age listing?')) return;

    setDeletingId(id);
    try {
      const apiBase = getApiBaseUrl();
      await fetch(`${apiBase}/listings/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (err) {
    } finally {
      setListings((prev) => prev.filter((item) => item._id !== id));
      setDeletingId(null);
      fetchAnalytics();
    }
  };

  const handleRequirementStatusChange = async (id: string, newStatus: RequirementItem['status']) => {
    setRequirements((prev) =>
      prev.map((item) => (item._id === id ? { ...item, status: newStatus } : item))
    );

    try {
      const apiBase = getApiBaseUrl();
      await fetch(`${apiBase}/requirements/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
    } catch (err) {}
  };

  const availableCount = listings.filter((l) => l.status === 'Available').length;
  const soldCount = listings.filter((l) => l.status === 'Sold').length;
  const newReqCount = requirements.filter((r) => r.status === 'New').length;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-heading flex flex-col">
      
      {/* ========================================================= */}
      {/* EXECUTIVE TOP HEADER BAR */}
      {/* ========================================================= */}
      <header className="bg-white border-b border-slate-200 px-4 sm:px-6 py-3 sticky top-0 z-30 shadow-xs font-heading">
        <div className="flex items-center justify-between gap-3">
          
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              className="lg:hidden p-2 border border-slate-300 bg-slate-50 text-slate-800 text-xs font-bold flex items-center gap-1.5"
              title="Open Navigation Menu"
            >
              <Menu className="w-4 h-4 text-slate-900" />
              <span className="text-[11px] uppercase font-bold">Menu</span>
            </button>

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-slate-900 text-white font-black text-sm flex items-center justify-center font-heading shadow-xs">
                AB
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-sm font-black text-slate-900 font-heading uppercase tracking-wide">
                    AB's Admin Console
                  </h1>
                  <span className="hidden sm:inline-block px-2 py-0.5 text-[9px] font-extrabold uppercase bg-emerald-50 text-emerald-700 border border-emerald-300">
                    Live Atlas DB
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 font-medium block">
                  Brutal Age Verified Marketplace
                </span>
              </div>
            </div>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-2">
            <Link
              to="/admin/add"
              className="btn-indigo px-3.5 py-2 text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span className="hidden sm:inline">Add Listing</span>
              <span className="sm:hidden">Add</span>
            </Link>

            <Link
              to="/"
              className="hidden md:flex text-xs font-bold text-slate-600 hover:text-slate-900 border border-slate-300 bg-slate-50 px-3 py-2 items-center gap-1 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Public Store</span>
            </Link>

            <button
              onClick={handleLogout}
              className="p-2 sm:px-3 sm:py-2 border border-slate-300 bg-white text-xs font-bold text-slate-700 hover:text-red-700 hover:border-red-300 flex items-center gap-1 transition-colors"
              title="Logout session"
            >
              <LogOut className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>

        </div>
      </header>

      {/* Main Layout Area */}
      <div className="flex-1 flex relative">
        
        {/* ========================================================= */}
        {/* MOBILE OVERLAY BACKDROP */}
        {/* ========================================================= */}
        {mobileSidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs lg:hidden transition-opacity"
            onClick={() => setMobileSidebarOpen(false)}
          />
        )}

        {/* ========================================================= */}
        {/* ULTRA-PROFESSIONAL LIGHT THEME SIDEBAR */}
        {/* ========================================================= */}
        <aside
          className={`fixed lg:static top-[53px] bottom-0 left-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col justify-between shadow-xl lg:shadow-none transition-transform duration-200 ease-in-out font-heading ${
            mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          <div className="p-4 space-y-6">
            
            {/* Mobile Header Close */}
            <div className="flex lg:hidden items-center justify-between border-b border-slate-200 pb-3">
              <span className="text-xs font-black text-slate-900 uppercase tracking-wider font-heading flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-indigo-600" />
                <span>Admin Navigation</span>
              </span>
              <button
                onClick={() => setMobileSidebarOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-900 text-xs"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Category 1: MAIN MANAGEMENT */}
            <div className="space-y-2">
              <span className="block px-3 text-[10px] font-extrabold uppercase tracking-widest text-slate-400 font-heading">
                Main Management
              </span>

              <nav className="space-y-1 font-heading">
                {/* Tab 1: Listings Console */}
                <button
                  onClick={() => { setActiveTab('listings'); setMobileSidebarOpen(false); }}
                  className={`w-full px-3.5 py-2.5 text-xs font-bold uppercase tracking-wider flex items-center justify-between transition-all ${
                    activeTab === 'listings'
                      ? 'border-l-4 border-indigo-600 bg-indigo-50/80 text-indigo-900 font-black shadow-2xs'
                      : 'border-l-4 border-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Package className={`w-4 h-4 ${activeTab === 'listings' ? 'text-indigo-600' : 'text-slate-400'}`} />
                    <span>Listings</span>
                  </div>
                  <span className={`text-[10px] font-mono-num px-2 py-0.5 font-bold ${
                    activeTab === 'listings'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 text-slate-600 border border-slate-200'
                  }`}>
                    {listings.length}
                  </span>
                </button>

                {/* Tab 2: Custom Requirements */}
                <button
                  onClick={() => { setActiveTab('requirements'); setMobileSidebarOpen(false); }}
                  className={`w-full px-3.5 py-2.5 text-xs font-bold uppercase tracking-wider flex items-center justify-between transition-all ${
                    activeTab === 'requirements'
                      ? 'border-l-4 border-indigo-600 bg-indigo-50/80 text-indigo-900 font-black shadow-2xs'
                      : 'border-l-4 border-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <FileText className={`w-4 h-4 ${activeTab === 'requirements' ? 'text-indigo-600' : 'text-slate-400'}`} />
                    <span>Requirements</span>
                  </div>
                  {newReqCount > 0 ? (
                    <span className="text-[10px] font-extrabold px-2 py-0.5 bg-amber-500 text-white animate-pulse">
                      {newReqCount} NEW
                    </span>
                  ) : (
                    <span className={`text-[10px] font-mono-num px-2 py-0.5 font-bold ${
                      activeTab === 'requirements'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 text-slate-600 border border-slate-200'
                    }`}>
                      {requirements.length}
                    </span>
                  )}
                </button>

                {/* Tab 3: Registered Buyers */}
                <button
                  onClick={() => { setActiveTab('buyers'); setMobileSidebarOpen(false); }}
                  className={`w-full px-3.5 py-2.5 text-xs font-bold uppercase tracking-wider flex items-center justify-between transition-all ${
                    activeTab === 'buyers'
                      ? 'border-l-4 border-indigo-600 bg-indigo-50/80 text-indigo-900 font-black shadow-2xs'
                      : 'border-l-4 border-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Users className={`w-4 h-4 ${activeTab === 'buyers' ? 'text-indigo-600' : 'text-slate-400'}`} />
                    <span>Buyers</span>
                  </div>
                  <span className={`text-[10px] font-mono-num px-2 py-0.5 font-bold ${
                    activeTab === 'buyers'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 text-slate-600 border border-slate-200'
                  }`}>
                    {buyers.length}
                  </span>
                </button>

              </nav>
            </div>

            {/* Category 2: ANALYTICS & INSIGHTS */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <span className="block px-3 text-[10px] font-extrabold uppercase tracking-widest text-slate-400 font-heading">
                Analytics & Insights
              </span>

              <nav className="space-y-1 font-heading">
                {/* Tab 4: Visits & Analytics */}
                <button
                  onClick={() => { setActiveTab('analytics'); setMobileSidebarOpen(false); }}
                  className={`w-full px-3.5 py-2.5 text-xs font-bold uppercase tracking-wider flex items-center justify-between transition-all ${
                    activeTab === 'analytics'
                      ? 'border-l-4 border-indigo-600 bg-indigo-50/80 text-indigo-900 font-black shadow-2xs'
                      : 'border-l-4 border-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <BarChart3 className={`w-4 h-4 ${activeTab === 'analytics' ? 'text-indigo-600' : 'text-slate-400'}`} />
                    <span>Analytics</span>
                  </div>
                  <span className="text-[10px] font-mono-num px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1 font-bold">
                    <Activity className="w-2.5 h-2.5 text-emerald-600 animate-pulse" />
                    <span>{analytics.activeSessions}</span>
                  </span>
                </button>
              </nav>
            </div>

            {/* Sidebar Embedded Action CTA */}
            <div className="pt-2">
              <Link
                to="/admin/add"
                onClick={() => setMobileSidebarOpen(false)}
                className="w-full py-2.5 bg-slate-900 hover:bg-indigo-600 text-white text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Listing</span>
              </Link>
            </div>

          </div>

          {/* Ultra-Clean Bottom Profile Footer */}
          <div className="p-4 border-t border-slate-200 bg-slate-50 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-indigo-600 text-white font-extrabold text-xs flex items-center justify-center rounded-none font-heading">
                  A
                </div>
                <div>
                  <span className="font-bold text-slate-900 block leading-tight">Admin User</span>
                  <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping inline-block" />
                    Online Session
                  </span>
                </div>
              </div>

              <Shield className="w-4 h-4 text-slate-400" />
            </div>

            <button
              onClick={handleLogout}
              className="w-full py-2 border border-slate-300 bg-white hover:bg-red-50 hover:border-red-300 hover:text-red-700 text-slate-700 text-[11px] font-bold uppercase flex items-center justify-center gap-1.5 transition-all shadow-2xs"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout Admin Session</span>
            </button>
          </div>

        </aside>

        {/* ========================================================= */}
        {/* MAIN DE-CONGESTED CONTENT DISPLAY AREA */}
        {/* ========================================================= */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full font-heading">
          
          {/* Main Top Breadcrumb Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-5 border border-slate-200 shadow-xs">
            <div>
              <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold uppercase mb-1">
                <span>Dashboard</span>
                <ChevronRight className="w-3 h-3 text-slate-300" />
                <span className="text-indigo-600">
                  {activeTab === 'listings' && 'Listings Console'}
                  {activeTab === 'requirements' && 'Custom Requirements'}
                  {activeTab === 'buyers' && 'Registered Buyers'}
                  {activeTab === 'analytics' && 'Visits & Analytics'}
                </span>
              </div>
              <h2 className="text-xl font-black text-slate-900 font-heading uppercase">
                {activeTab === 'listings' && 'Brutal Age Listings Management'}
                {activeTab === 'requirements' && 'Custom Buyer Account Requests'}
                {activeTab === 'buyers' && 'Registered Buyer User Directory'}
                {activeTab === 'analytics' && 'Total Website Visits & Analytics Board'}
              </h2>
            </div>

            <button
              onClick={fetchAllData}
              className="px-3.5 py-2 border border-slate-300 bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-700 flex items-center gap-1.5 shadow-xs"
            >
              <RefreshCw className="w-3.5 h-3.5 text-indigo-600" />
              <span>Sync Database</span>
            </button>
          </div>

          {/* Executive Real Analytics Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 border border-slate-200 border-l-4 border-l-slate-900 shadow-xs">
              <span className="block text-[10px] font-extrabold uppercase text-slate-500 mb-1">Total Website Visits</span>
              <div className="flex items-center justify-between">
                <span className="text-xl sm:text-2xl font-black text-slate-900 font-mono-num">{analytics.totalVisits.toLocaleString()}</span>
                <Eye className="w-5 h-5 text-slate-400" />
              </div>
            </div>

            <div className="bg-white p-5 border border-slate-200 border-l-4 border-l-emerald-600 shadow-xs">
              <span className="block text-[10px] font-extrabold uppercase text-slate-500 mb-1">Active Users</span>
              <div className="flex items-center justify-between">
                <span className="text-xl sm:text-2xl font-black text-emerald-600 font-mono-num">{analytics.activeSessions}</span>
                <Activity className="w-5 h-5 text-emerald-600 animate-pulse" />
              </div>
            </div>

            <div className="bg-white p-5 border border-slate-200 border-l-4 border-l-indigo-600 shadow-xs">
              <span className="block text-[10px] font-extrabold uppercase text-slate-500 mb-1">Registered Buyers</span>
              <div className="flex items-center justify-between">
                <span className="text-xl sm:text-2xl font-black text-indigo-600 font-mono-num">{buyers.length}</span>
                <Users className="w-5 h-5 text-indigo-600" />
              </div>
            </div>

            <div className="bg-white p-5 border border-slate-200 border-l-4 border-l-amber-500 shadow-xs">
              <span className="block text-[10px] font-extrabold uppercase text-slate-500 mb-1">Custom Requests</span>
              <div className="flex items-center justify-between">
                <span className="text-xl sm:text-2xl font-black text-amber-600 font-mono-num">{requirements.length}</span>
                <FileText className="w-5 h-5 text-amber-500" />
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* TAB 1: LISTINGS CONSOLE */}
          {/* ========================================================= */}
          {activeTab === 'listings' && (
            <div className="bg-white border border-slate-200 shadow-xs overflow-hidden">
              
              <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 uppercase font-heading">
                  Published Brutal Age Listings ({listings.length})
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 border border-emerald-200">
                    {availableCount} Available
                  </span>
                  <span className="text-[11px] font-bold text-purple-700 bg-purple-50 px-2.5 py-1 border border-purple-200">
                    {soldCount} Sold Proof
                  </span>
                </div>
              </div>

              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-700 uppercase text-[10px] font-extrabold border-b border-slate-200">
                    <tr>
                      <th className="px-5 py-3.5">Account Title</th>
                      <th className="px-5 py-3.5">Leadership & Relocation Tickets</th>
                      <th className="px-5 py-3.5">Price ($ USD)</th>
                      <th className="px-5 py-3.5">Status</th>
                      <th className="px-5 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 font-medium">
                    {listings.length > 0 ? (
                      listings.map((item) => (
                        <tr key={item._id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-5 py-4 flex items-center gap-3.5 max-w-sm">
                            <img
                              src={formatImageUrl(item.images?.[0])}
                              alt=""
                              className="w-12 h-12 object-cover border border-slate-300 flex-shrink-0"
                            />
                            <span className="font-bold text-slate-900 leading-snug">
                              {item.title}
                            </span>
                          </td>

                          <td className="px-5 py-4 text-slate-600">
                            {item.rank} ({item.level})
                          </td>

                          <td className="px-5 py-4 font-bold text-slate-900 font-mono-num text-sm">
                            ${item.price.toLocaleString('en-US')}
                          </td>

                          <td className="px-5 py-4">
                            <select
                              id={`status-select-${item._id}`}
                              name="status"
                              aria-label={`Change status for ${item.title}`}
                              value={item.status}
                              onChange={(e) => handleStatusChange(item._id, e.target.value as Listing['status'])}
                              className="bg-white border border-slate-300 px-2.5 py-1.5 text-xs font-bold shadow-xs"
                            >
                              <option value="Available">Available</option>
                              <option value="Sold">Sold</option>
                              <option value="Reserved">Reserved</option>
                            </select>
                          </td>

                          <td className="px-5 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Link
                                to={`/admin/edit/${item._id}`}
                                className="px-3 py-1.5 border border-slate-300 bg-white text-xs font-bold text-slate-700 hover:bg-slate-100 flex items-center gap-1 min-h-[34px]"
                              >
                                <Edit className="w-3.5 h-3.5 text-slate-600" />
                                <span>Edit</span>
                              </Link>
                              <button
                                onClick={() => handleDeleteListing(item._id)}
                                disabled={deletingId === item._id}
                                className="px-3 py-1.5 border border-red-300 bg-red-50 text-xs font-bold text-red-700 hover:bg-red-100 flex items-center gap-1 min-h-[34px]"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Delete</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="text-center py-12 text-slate-500 font-bold text-xs space-y-2">
                          <p>No listings published yet in MongoDB Atlas.</p>
                          <Link
                            to="/admin/add"
                            className="btn-indigo inline-flex items-center gap-1.5 px-4 py-2 text-xs font-extrabold uppercase"
                          >
                            <Plus className="w-4 h-4" />
                            <span>Add First Listing</span>
                          </Link>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Mobile Phone List Cards */}
              <div className="block md:hidden divide-y divide-slate-200">
                {listings.length > 0 ? (
                  listings.map((item) => (
                    <div key={item._id} className="p-4 space-y-3 bg-white">
                      <div className="flex items-start gap-3">
                        <img
                          src={formatImageUrl(item.images?.[0])}
                          alt=""
                          className="w-16 h-16 object-cover border border-slate-300 flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-slate-900 leading-snug line-clamp-2">
                            {item.title}
                          </h4>
                          <span className="text-sm font-extrabold text-slate-900 font-mono-num block mt-1">
                            ${item.price.toLocaleString('en-US')}
                          </span>
                        </div>
                      </div>

                      <div className="p-2.5 bg-slate-50 border border-slate-200 text-xs space-y-1">
                        <div>
                          <span className="text-slate-500 font-semibold">Leadership & Tickets: </span>
                          <strong className="text-slate-800">{item.level} ({item.rank})</strong>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-2 pt-1">
                        <select
                          id={`mobile-status-select-${item._id}`}
                          name="mobileStatus"
                          aria-label={`Change status for ${item.title}`}
                          value={item.status}
                          onChange={(e) => handleStatusChange(item._id, e.target.value as Listing['status'])}
                          className="bg-slate-50 border border-slate-300 px-2.5 py-1 text-xs font-bold"
                        >
                          <option value="Available">Available</option>
                          <option value="Sold">Sold</option>
                          <option value="Reserved">Reserved</option>
                        </select>

                        <div className="flex items-center gap-2">
                          <Link
                            to={`/admin/edit/${item._id}`}
                            className="px-3 py-1.5 border border-slate-300 text-xs font-bold text-slate-800 hover:bg-slate-100 flex items-center gap-1 min-h-[36px]"
                          >
                            <Edit className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </Link>
                          <button
                            onClick={() => handleDeleteListing(item._id)}
                            disabled={deletingId === item._id}
                            className="px-3 py-1.5 border border-red-300 bg-red-50 text-xs font-bold text-red-700 hover:bg-red-100 flex items-center gap-1 min-h-[36px]"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-slate-500 font-bold text-xs space-y-2">
                    <p>No listings published yet.</p>
                    <Link
                      to="/admin/add"
                      className="btn-indigo inline-flex items-center gap-1.5 px-4 py-2 text-xs font-extrabold uppercase"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add First Listing</span>
                    </Link>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 2: CUSTOM BUYER ACCOUNT REQUIREMENTS */}
          {/* ========================================================= */}
          {activeTab === 'requirements' && (
            <div className="bg-white border border-slate-200 shadow-xs overflow-hidden space-y-4 p-5 sm:p-6">
              
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div>
                  <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 uppercase font-heading">
                    Custom Account Requirement Requests ({requirements.length})
                  </h3>
                  <span className="text-xs text-slate-500 font-medium">
                    Buyer requests submitted for specific Brutal Age account specifications
                  </span>
                </div>
              </div>

              {requirements.length > 0 ? (
                <div className="space-y-4">
                  {requirements.map((req) => (
                    <div key={req._id} className="p-5 bg-slate-50 border border-slate-300 space-y-3">
                      
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
                        <div>
                          <span className="inline-block px-2.5 py-0.5 text-[9px] font-black uppercase bg-indigo-900 text-white mb-1">
                            {req.desiredLeadership}
                          </span>
                          <h4 className="text-sm font-bold text-slate-900">
                            {req.buyerName} ({req.buyerEmail})
                          </h4>
                        </div>

                        <div className="flex items-center gap-2">
                          <select
                            id={`req-status-select-${req._id}`}
                            name="requirementStatus"
                            aria-label={`Change requirement status for ${req.buyerName}`}
                            value={req.status}
                            onChange={(e) => handleRequirementStatusChange(req._id, e.target.value as RequirementItem['status'])}
                            className="bg-white border border-slate-300 px-3 py-1 text-xs font-bold shadow-xs"
                          >
                            <option value="New">New Request</option>
                            <option value="Contacted">Contacted</option>
                            <option value="Fulfilled">Fulfilled</option>
                            <option value="Closed">Closed</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-medium">
                        <div>
                          <span className="text-slate-500 font-bold block mb-0.5">Budget USD:</span>
                          <strong className="text-slate-900 font-mono-num text-sm">${req.budgetUSD.toLocaleString()}</strong>
                        </div>
                        <div>
                          <span className="text-slate-500 font-bold block mb-0.5">Relocation Tickets / Features:</span>
                          <strong className="text-slate-800">{req.relocationTickets || 'Standard'}</strong>
                        </div>
                        <div>
                          <span className="text-slate-500 font-bold block mb-0.5">Preferred Channel:</span>
                          <strong className="text-indigo-700">{req.preferredContactChannel} ({req.contactDetail || req.buyerPhone || 'N/A'})</strong>
                        </div>
                      </div>

                      {req.additionalNotes && (
                        <div className="p-3 bg-white border border-slate-200 text-xs text-slate-700">
                          <span className="font-bold text-slate-500 block mb-1">Additional Notes:</span>
                          <p>{req.additionalNotes}</p>
                        </div>
                      )}

                      {/* Direct Admin Contact Actions */}
                      <div className="pt-2 flex items-center gap-2">
                        {req.preferredContactChannel === 'WhatsApp' && (
                          <a
                            href={`https://wa.me/${req.buyerPhone?.replace(/\D/g, '') || '917517491313'}?text=Hi%20${encodeURIComponent(req.buyerName)},%20I%20saw%20your%20custom%20Brutal%20Age%20account%20request!`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3.5 py-2 bg-emerald-600 text-white text-xs font-bold flex items-center gap-1.5 hover:bg-emerald-700 shadow-xs"
                          >
                            <Phone className="w-3.5 h-3.5" />
                            <span>Contact via WhatsApp</span>
                          </a>
                        )}

                        {req.preferredContactChannel === 'Line' && (
                          <a
                            href="https://line.me/R/ti/g/aM3NznSNe2"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3.5 py-2 bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 hover:bg-emerald-600 shadow-xs"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>Contact via Line</span>
                          </a>
                        )}

                        {req.preferredContactChannel === 'Telegram' && (
                          <a
                            href={`https://t.me/${req.contactDetail?.replace('@', '') || 'Raindrop132613'}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3.5 py-2 bg-sky-600 text-white text-xs font-bold flex items-center gap-1.5 hover:bg-sky-700 shadow-xs"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>Contact via Telegram</span>
                          </a>
                        )}

                        {req.preferredContactChannel === 'WeChat' && (
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(req.contactDetail || req.buyerEmail);
                              alert(`Buyer WeChat Info '${req.contactDetail || req.buyerEmail}' copied!`);
                            }}
                            className="px-3.5 py-2 bg-emerald-800 text-white text-xs font-bold flex items-center gap-1.5 hover:bg-emerald-900 shadow-xs"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>Copy WeChat Info</span>
                          </button>
                        )}
                      </div>

                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center text-slate-500 font-bold text-xs">
                  No custom account requirement requests submitted yet.
                </div>
              )}

            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 3: REGISTERED BUYERS USER DIRECTORY */}
          {/* ========================================================= */}
          {activeTab === 'buyers' && (
            <div className="bg-white border border-slate-200 shadow-xs overflow-hidden">
              <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
                <div>
                  <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 uppercase font-heading">
                    Registered Buyer Directory ({buyers.length})
                  </h3>
                  <span className="text-xs text-slate-500 font-medium">
                    Verified buyer user accounts registered on MongoDB Atlas
                  </span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-700 uppercase text-[10px] font-extrabold border-b border-slate-200">
                    <tr>
                      <th className="px-5 py-3.5">Full Name</th>
                      <th className="px-5 py-3.5">Email Address</th>
                      <th className="px-5 py-3.5">WhatsApp / Phone</th>
                      <th className="px-5 py-3.5">Registration Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 font-medium">
                    {buyers.length > 0 ? (
                      buyers.map((buyer) => (
                        <tr key={buyer._id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-5 py-4 font-bold text-slate-900">
                            {buyer.name}
                          </td>
                          <td className="px-5 py-4 text-slate-700">
                            {buyer.email}
                          </td>
                          <td className="px-5 py-4 text-slate-600 font-mono-num">
                            {buyer.phone || 'Not provided'}
                          </td>
                          <td className="px-5 py-4 text-slate-500 font-mono-num">
                            {new Date(buyer.createdAt || Date.now()).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="text-center py-12 text-slate-500 font-bold text-xs">
                          No registered buyer users in database yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 4: WEBSITE VISIT & ANALYTICS BOARD */}
          {/* ========================================================= */}
          {activeTab === 'analytics' && (
            <div className="space-y-6 font-heading">
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="bg-white p-6 border border-slate-200 shadow-xs space-y-2">
                  <div className="flex items-center justify-between text-slate-500 text-xs font-extrabold uppercase">
                    <span>Total Website Visits</span>
                    <Eye className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div className="text-3xl font-black text-slate-900 font-mono-num">
                    {analytics.totalVisits.toLocaleString()}
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Real page visits recorded across all mobile & desktop clients
                  </p>
                </div>

                <div className="bg-white p-6 border border-slate-200 shadow-xs space-y-2">
                  <div className="flex items-center justify-between text-slate-500 text-xs font-extrabold uppercase">
                    <span>Unique Visitors</span>
                    <Users className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="text-3xl font-black text-slate-900 font-mono-num">
                    {analytics.uniqueVisitors.toLocaleString()}
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Real unique browser sessions
                  </p>
                </div>

                <div className="bg-white p-6 border border-slate-200 shadow-xs space-y-2">
                  <div className="flex items-center justify-between text-slate-500 text-xs font-extrabold uppercase">
                    <span>Active Users</span>
                    <Activity className="w-4 h-4 text-emerald-600 animate-pulse" />
                  </div>
                  <div className="text-3xl font-black text-emerald-600 font-mono-num">
                    {analytics.activeSessions}
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Active online sessions right now
                  </p>
                </div>
              </div>

              <div className="bg-white p-6 border border-slate-200 shadow-xs space-y-4">
                <h3 className="text-sm font-extrabold text-slate-900 uppercase font-heading border-b border-slate-200 pb-3">
                  Storefront Conversion & Database Status
                </h3>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-medium">
                  <div className="p-4 bg-slate-50 border border-slate-200">
                    <span className="text-slate-500 font-bold uppercase block text-[10px]">Published Listings</span>
                    <strong className="text-lg text-slate-900 font-mono-num">{analytics.totalListingsCount || listings.length}</strong>
                  </div>

                  <div className="p-4 bg-emerald-50 border border-emerald-200">
                    <span className="text-emerald-800 font-bold uppercase block text-[10px]">Available Accounts</span>
                    <strong className="text-lg text-emerald-900 font-mono-num">{availableCount}</strong>
                  </div>

                  <div className="p-4 bg-purple-50 border border-purple-200">
                    <span className="text-purple-800 font-bold uppercase block text-[10px]">Sold Accounts Proof</span>
                    <strong className="text-lg text-purple-900 font-mono-num">{soldCount}</strong>
                  </div>

                  <div className="p-4 bg-amber-50 border border-amber-200">
                    <span className="text-amber-800 font-bold uppercase block text-[10px]">Custom Requests</span>
                    <strong className="text-lg text-amber-900 font-mono-num">{requirements.length}</strong>
                  </div>
                </div>

                <div className="p-4 bg-slate-900 text-slate-300 text-xs font-mono font-medium flex items-center justify-between">
                  <span>MongoDB Atlas Connection: Connected</span>
                  <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                    <CheckCircle2 className="w-4 h-4" /> 100% Operational
                  </span>
                </div>
              </div>

            </div>
          )}

        </main>
      </div>

    </div>
  );
};
