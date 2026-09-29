import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Edit2,
  Trash2,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  Clock,
  Power,
  Loader2,
  Calendar
} from 'lucide-react';
import { heroService } from '../../services/heroService';
import { useToast } from '../../context/ToastContext';
import DeleteModal from '../../components/admin/DeleteModal';

export default function AdminViewHeroPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [hero, setHero] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const loadHero = async () => {
      try {
        setLoading(true);
        const data = await heroService.getHeroById(id);
        if (data) {
          setHero(data);
        } else {
          showToast('Hero section record not found', 'error');
          navigate('/admin/content/hero');
        }
      } catch (err) {
        console.error('Failed to load hero view:', err);
        showToast('Failed to load hero section', 'error');
      } finally {
        setLoading(false);
      }
    };
    loadHero();
  }, [id, navigate]);

  const handleSetActive = async () => {
    if (hero.status !== 'PUBLISHED') {
      showToast('Only published Hero sections can be activated on the homepage.', 'error');
      return;
    }
    try {
      await heroService.setActiveHero(id);
      showToast('Hero section is now ACTIVE on the public homepage!', 'success');
      setHero(prev => ({ ...prev, isActive: true }));
    } catch (err) {
      console.error('Failed to set active:', err);
      showToast(err.message || 'Failed to activate hero', 'error');
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await heroService.deleteHero(id);
      showToast('Hero section deleted successfully', 'success');
      navigate('/admin/content/hero');
    } catch (err) {
      console.error('Failed to delete hero:', err);
      showToast(err.message || 'Failed to delete hero section', 'error');
    } finally {
      setIsDeleting(false);
      setDeleteModalOpen(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 text-[#0EA5E9] animate-spin" />
        <p className="text-sm font-semibold text-[#64748B]">Loading Hero section details...</p>
      </div>
    );
  }

  if (!hero) return null;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/content/hero"
            className="p-2 rounded-xl border border-[#CBD5E1] bg-white text-[#475569] hover:bg-[#F8FAFC] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#0EA5E9]/15 text-[#0284C7] text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Hero Record Details</span>
              </span>
              {hero.isActive ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Active Live on Homepage
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">
                  Inactive Variation
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#0B1B3A] tracking-tight">
              {hero.heading}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {!hero.isActive && (
            <button
              type="button"
              onClick={handleSetActive}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white font-bold text-xs transition-all shadow-sm"
            >
              <Power className="w-4 h-4" />
              <span>Set as Active Hero</span>
            </button>
          )}

          <Link
            to={`/admin/content/hero/edit/${hero.id}`}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0EA5E9] hover:bg-[#0284C7] text-white font-bold text-xs shadow-md shadow-[#0EA5E9]/20 transition-all"
          >
            <Edit2 className="w-4 h-4" />
            <span>Edit Section</span>
          </Link>

          <button
            type="button"
            onClick={() => setDeleteModalOpen(true)}
            className="p-2.5 rounded-xl border border-rose-200 text-rose-600 bg-rose-50 hover:bg-rose-100 transition-colors"
            title="Delete this record"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Preview & Content (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Live Mockup / Card Preview */}
          <div className="bg-white text-[#0B1B3A] p-8 rounded-2xl border border-[#E2E8F0] shadow-card space-y-6 tech-grid-bg relative overflow-hidden">
            <div className="relative z-10 space-y-4">
              {hero.badge && (
                <span className="inline-block px-3 py-1 rounded-full bg-[#E0F2FE] text-[#0369A1] text-xs font-mono font-bold border border-[#BAE6FD]">
                  {hero.badge}
                </span>
              )}

              <h2 className="text-3xl sm:text-4xl font-black font-display tracking-tight text-[#0B1B3A] leading-tight">
                {hero.heading}{' '}
                {hero.highlightedText && (
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0284C7] to-[#0EA5E9]">
                    {hero.highlightedText}
                  </span>
                )}
              </h2>

              {hero.description && (
                <p className="text-sm sm:text-base text-[#334155] leading-relaxed max-w-2xl font-normal">
                  {hero.description}
                </p>
              )}

              <div className="pt-2 flex flex-wrap gap-4">
                {hero.primaryCtaText && (
                  <div className="px-5 py-2.5 rounded-xl bg-[#0EA5E9] text-white text-xs font-bold shadow-sm">
                    {hero.primaryCtaText} ({hero.primaryCtaLink || '#contact'})
                  </div>
                )}
                {hero.secondaryCtaText && (
                  <div className="px-5 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] text-[#0B1B3A] text-xs font-bold">
                    {hero.secondaryCtaText} ({hero.secondaryCtaLink || '#services'})
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Full Field Breakdown */}
          <div className="bg-white p-6 sm:p-7 rounded-2xl border border-[#E2E8F0] shadow-sm space-y-4">
            <h3 className="text-base font-bold text-[#0B1B3A] border-b border-[#E2E8F0] pb-3">
              Section Metadata & Values
            </h3>

            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-xs">
              <div>
                <dt className="font-bold text-[#64748B]">Eyebrow Badge</dt>
                <dd className="text-sm font-semibold text-[#0B1B3A] mt-0.5">{hero.badge || '—'}</dd>
              </div>

              <div>
                <dt className="font-bold text-[#64748B]">Status & Visibility</dt>
                <dd className="text-sm font-semibold text-[#0B1B3A] mt-0.5 flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                    hero.status === 'PUBLISHED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {hero.status}
                  </span>
                  <span>{hero.isVisible !== false ? '• Visible' : '• Hidden'}</span>
                </dd>
              </div>

              <div className="sm:col-span-2">
                <dt className="font-bold text-[#64748B]">Main Headline</dt>
                <dd className="text-sm font-semibold text-[#0B1B3A] mt-0.5">{hero.heading}</dd>
              </div>

              <div className="sm:col-span-2">
                <dt className="font-bold text-[#64748B]">Highlighted Gradient Text</dt>
                <dd className="text-sm font-semibold text-[#0284C7] mt-0.5">{hero.highlightedText || '—'}</dd>
              </div>

              <div className="sm:col-span-2">
                <dt className="font-bold text-[#64748B]">Description Text</dt>
                <dd className="text-sm text-[#334155] leading-relaxed mt-0.5 bg-[#F8FAFC] p-3 rounded-xl border border-[#E2E8F0]">
                  {hero.description}
                </dd>
              </div>

              <div>
                <dt className="font-bold text-[#64748B]">Primary CTA</dt>
                <dd className="text-xs text-[#0B1B3A] mt-0.5 font-medium">
                  <strong>{hero.primaryCtaText || '—'}</strong> ➔ <code className="text-[#0EA5E9]">{hero.primaryCtaLink}</code>
                </dd>
              </div>

              <div>
                <dt className="font-bold text-[#64748B]">Secondary CTA</dt>
                <dd className="text-xs text-[#0B1B3A] mt-0.5 font-medium">
                  <strong>{hero.secondaryCtaText || '—'}</strong> ➔ <code className="text-[#0EA5E9]">{hero.secondaryCtaLink}</code>
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Right Column: Graphic & System Meta (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Image Card */}
          <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-[#0B1B3A] border-b border-[#E2E8F0] pb-2">
              Hero Graphic
            </h3>
            {hero.heroImage ? (
              <div className="rounded-xl overflow-hidden border border-[#E2E8F0] bg-[#0B1B3A]">
                <img
                  src={hero.heroImage}
                  alt={hero.heroImageAlt || 'Hero Graphic'}
                  className="w-full h-44 object-cover"
                />
              </div>
            ) : (
              <div className="h-40 rounded-xl bg-slate-100 flex items-center justify-center text-xs text-slate-400">
                No custom graphic uploaded
              </div>
            )}
            {hero.heroImageAlt && (
              <p className="text-xs text-[#64748B] italic">
                Alt: {hero.heroImageAlt}
              </p>
            )}
          </div>

          {/* Timestamp Info */}
          <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-sm space-y-3 text-xs">
            <h3 className="text-sm font-bold text-[#0B1B3A] border-b border-[#E2E8F0] pb-2">
              System Audit
            </h3>
            <div className="flex items-center justify-between text-[#64748B]">
              <span>Created:</span>
              <span className="font-semibold text-[#0B1B3A]">
                {hero.createdAt ? new Date(hero.createdAt).toLocaleString() : '—'}
              </span>
            </div>
            <div className="flex items-center justify-between text-[#64748B]">
              <span>Last Modified:</span>
              <span className="font-semibold text-[#0B1B3A]">
                {hero.updatedAt ? new Date(hero.updatedAt).toLocaleString() : '—'}
              </span>
            </div>
            <div className="flex items-center justify-between text-[#64748B]">
              <span>Record ID:</span>
              <code className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-600 truncate max-w-[150px]">
                {hero.id}
              </code>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={deleteModalOpen}
        title={hero.heading}
        heading="Delete Hero Section"
        message={
          hero.isActive ? (
            'Warning: This Hero section is currently ACTIVE on the homepage. Deleting it may leave the homepage without Hero content. Continue?'
          ) : (
            `Are you sure you want to delete "${hero.heading}"?`
          )
        }
        onConfirm={handleDelete}
        onCancel={() => setDeleteModalOpen(false)}
        isDeleting={isDeleting}
      />
    </div>
  );
}
