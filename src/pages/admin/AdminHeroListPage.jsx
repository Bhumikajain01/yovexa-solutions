import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Plus,
  Sparkles,
  Edit2,
  Trash2,
  Eye,
  CheckCircle2,
  Clock,
  RefreshCw,
  Loader2,
  AlertCircle,
  ExternalLink,
  Power
} from 'lucide-react';
import { heroService } from '../../services/heroService';
import { useToast } from '../../context/ToastContext';
import DeleteModal from '../../components/admin/DeleteModal';

export default function AdminHeroListPage() {
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [heroes, setHeroes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [activatingId, setActivatingId] = useState(null);

  const loadHeroes = async () => {
    try {
      setLoading(true);
      const data = await heroService.getHeroes();
      setHeroes(data);
    } catch (err) {
      console.error('Failed to load hero sections:', err);
      showToast('Failed to load hero records', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHeroes();
  }, []);

  const handleSetActive = async (id, currentStatus) => {
    if (currentStatus !== 'PUBLISHED') {
      showToast('Only published Hero sections can be activated on the homepage.', 'error');
      return;
    }
    try {
      setActivatingId(id);
      await heroService.setActiveHero(id);
      showToast('Hero section activated on public homepage! Previous section deactivated.', 'success');
      await loadHeroes();
    } catch (err) {
      console.error('Failed to set active hero:', err);
      showToast(err.message || 'Failed to activate hero section', 'error');
    } finally {
      setActivatingId(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      setIsDeleting(true);
      await heroService.deleteHero(deleteTarget.id);
      showToast('Hero section deleted successfully', 'success');
      setDeleteTarget(null);
      await loadHeroes();
    } catch (err) {
      console.error('Failed to delete hero:', err);
      showToast(err.message || 'Failed to delete hero section', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const activeHero = heroes.find(h => h.isActive);
  const publishedCount = heroes.filter(h => h.status === 'PUBLISHED').length;
  const draftCount = heroes.filter(h => h.status === 'DRAFT').length;

  return (
    <div className="space-y-6">
      {/* Top Header & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#0EA5E9]/15 text-[#0284C7] text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Hero Management</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0B1B3A] tracking-tight">
            Hero Sections
          </h1>
          <p className="text-sm text-[#475569] mt-0.5 font-medium">
            Create and manage homepage hero variations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadHeroes}
            disabled={loading}
            className="p-2.5 rounded-xl border border-[#CBD5E1] bg-white hover:bg-[#F8FAFC] text-[#334155] transition-colors"
            title="Refresh list"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#0EA5E9]' : ''}`} />
          </button>

          <Link
            to="/admin/content/hero/create"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0EA5E9] hover:bg-[#0284C7] text-white font-bold text-sm shadow-md shadow-[#0EA5E9]/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create Hero Section</span>
          </Link>
        </div>
      </div>

      {/* Summary KPI Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-[#64748B] uppercase tracking-wider">Total Variations</div>
            <div className="text-2xl font-black text-[#0B1B3A] mt-1">{heroes.length}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#0EA5E9]/10 text-[#0EA5E9] flex items-center justify-center font-bold">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-[#059669] uppercase tracking-wider">Published</div>
            <div className="text-2xl font-black text-[#0B1B3A] mt-1">{publishedCount}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-[#D97706] uppercase tracking-wider">Drafts</div>
            <div className="text-2xl font-black text-[#0B1B3A] mt-1">{draftCount}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Clock className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Hero Table / List */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center flex flex-col items-center justify-center space-y-3">
            <Loader2 className="w-8 h-8 text-[#0EA5E9] animate-spin" />
            <p className="text-sm font-semibold text-[#64748B]">Loading Hero variations...</p>
          </div>
        ) : heroes.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center justify-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-[#0EA5E9]/10 text-[#0EA5E9] flex items-center justify-center">
              <Sparkles className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#0B1B3A]">No Hero sections found.</h3>
              <p className="text-xs text-[#64748B] mt-1 max-w-sm mx-auto">
                Create a new Hero section variation to customize your homepage headlines and CTAs.
              </p>
            </div>
            <Link
              to="/admin/content/hero/create"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0EA5E9] hover:bg-[#0284C7] text-white text-xs font-bold transition-all shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Create Hero Section</span>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC] text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
                  <th className="py-3.5 px-4 sm:px-6">Status</th>
                  <th className="py-3.5 px-4">Badge / Pill</th>
                  <th className="py-3.5 px-4">Main Headline</th>
                  <th className="py-3.5 px-4 hidden md:table-cell">Highlighted Text</th>
                  <th className="py-3.5 px-4">Visibility</th>
                  <th className="py-3.5 px-4 hidden lg:table-cell">Updated Date</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0] text-sm">
                {heroes.map((hero) => {
                  const isCurrentActive = Boolean(hero.isActive);
                  const isPublished = hero.status === 'PUBLISHED';

                  return (
                    <tr 
                      key={hero.id}
                      className={`hover:bg-[#F8FAFC] transition-colors ${
                        isCurrentActive ? 'bg-[#0EA5E9]/5' : ''
                      }`}
                    >
                      {/* Status Column */}
                      <td className="py-4 px-4 sm:px-6">
                        <div className="flex flex-col gap-1 items-start">
                          {isCurrentActive ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                              Active Live
                            </span>
                          ) : (
                            <button
                              onClick={() => handleSetActive(hero.id, hero.status)}
                              disabled={activatingId === hero.id || !isPublished}
                              title={isPublished ? 'Click to make this live on homepage' : 'Publish first to activate'}
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition-all ${
                                isPublished
                                  ? 'bg-slate-100 text-[#475569] border-[#CBD5E1] hover:bg-[#0EA5E9] hover:text-white hover:border-[#0EA5E9]'
                                  : 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                              }`}
                            >
                              <Power className="w-3 h-3" />
                              <span>Inactive</span>
                            </button>
                          )}
                        </div>
                      </td>

                      {/* Eyebrow Badge */}
                      <td className="py-4 px-4">
                        <span className="inline-block px-2.5 py-1 rounded-lg bg-[#0EA5E9]/10 text-[#0284C7] text-xs font-bold max-w-[180px] truncate">
                          {hero.badge || '—'}
                        </span>
                      </td>

                      {/* Main Headline */}
                      <td className="py-4 px-4 font-bold text-[#0B1B3A] max-w-[240px]">
                        <div className="truncate" title={hero.heading}>
                          {hero.heading}
                        </div>
                      </td>

                      {/* Highlighted Text */}
                      <td className="py-4 px-4 hidden md:table-cell text-xs font-semibold text-[#0284C7] max-w-[200px]">
                        <div className="truncate" title={hero.highlightedText}>
                          {hero.highlightedText}
                        </div>
                      </td>

                      {/* Visibility */}
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          isPublished
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-amber-50 text-amber-700'
                        }`}>
                          {hero.status || 'DRAFT'}
                        </span>
                      </td>

                      {/* Updated Date */}
                      <td className="py-4 px-4 hidden lg:table-cell text-xs text-[#64748B]">
                        {hero.updatedAt ? new Date(hero.updatedAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        }) : '—'}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 sm:px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            to={`/admin/content/hero/${hero.id}`}
                            className="p-1.5 rounded-lg text-[#64748B] hover:text-[#0B1B3A] hover:bg-[#F1F5F9] transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <Link
                            to={`/admin/content/hero/edit/${hero.id}`}
                            className="p-1.5 rounded-lg text-[#64748B] hover:text-[#0EA5E9] hover:bg-[#F1F5F9] transition-colors"
                            title="Edit Section"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => setDeleteTarget(hero)}
                            className="p-1.5 rounded-lg text-[#64748B] hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Delete Section"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={Boolean(deleteTarget)}
        title={deleteTarget?.heading}
        heading="Delete Hero Section"
        message={
          deleteTarget?.isActive ? (
            <div className="space-y-2">
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>Warning: This Hero section is currently ACTIVE on the public homepage!</span>
              </div>
              <p>
                Deleting it may leave the homepage without Hero content until another variation is activated. Continue?
              </p>
            </div>
          ) : (
            `Are you sure you want to delete the Hero section "${deleteTarget?.heading}"? This action cannot be undone.`
          )
        }
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
        isDeleting={isDeleting}
      />
    </div>
  );
}
