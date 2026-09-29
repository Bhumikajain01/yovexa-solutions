import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Edit2,
  Trash2,
  Info,
  CheckCircle2,
  Power,
  Loader2,
  Check
} from 'lucide-react';
import { aboutService } from '../../services/aboutService';
import { useToast } from '../../context/ToastContext';
import DeleteModal from '../../components/admin/DeleteModal';

export default function AdminViewAboutPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [about, setAbout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const loadAbout = async () => {
      try {
        setLoading(true);
        const data = await aboutService.getAboutById(id);
        if (data) {
          setAbout(data);
        } else {
          showToast('About section record not found', 'error');
          navigate('/admin/content/about');
        }
      } catch (err) {
        console.error('Failed to load about view:', err);
        showToast('Failed to load about section', 'error');
      } finally {
        setLoading(false);
      }
    };
    loadAbout();
  }, [id, navigate]);

  const handleSetActive = async () => {
    if (about.status !== 'PUBLISHED') {
      showToast('Only published About sections can be activated on the homepage.', 'error');
      return;
    }
    try {
      await aboutService.setActiveAbout(id);
      showToast('About section is now ACTIVE on the public homepage!', 'success');
      setAbout(prev => ({ ...prev, isActive: true }));
    } catch (err) {
      console.error('Failed to set active:', err);
      showToast(err.message || 'Failed to activate about section', 'error');
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await aboutService.deleteAbout(id);
      showToast('About section deleted successfully', 'success');
      navigate('/admin/content/about');
    } catch (err) {
      console.error('Failed to delete about section:', err);
      showToast(err.message || 'Failed to delete about section', 'error');
    } finally {
      setIsDeleting(false);
      setDeleteModalOpen(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 text-[#0EA5E9] animate-spin" />
        <p className="text-sm font-semibold text-[#64748B]">Loading About section details...</p>
      </div>
    );
  }

  if (!about) return null;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/content/about"
            className="p-2 rounded-xl border border-[#CBD5E1] bg-white text-[#475569] hover:bg-[#F8FAFC] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#0EA5E9]/15 text-[#0284C7] text-xs font-bold uppercase tracking-wider">
                <Info className="w-3.5 h-3.5" />
                <span>About Record Details</span>
              </span>
              {about.isActive ? (
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
              {about.title}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {!about.isActive && (
            <button
              type="button"
              onClick={handleSetActive}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white font-bold text-xs transition-all shadow-sm"
            >
              <Power className="w-4 h-4" />
              <span>Set as Active About</span>
            </button>
          )}

          <Link
            to={`/admin/content/about/edit/${about.id}`}
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
          {/* Card Preview */}
          <div className="bg-white p-8 rounded-2xl border border-[#E2E8F0] shadow-sm space-y-5">
            <span className="inline-block px-3 py-1 rounded-full bg-[#0EA5E9]/10 text-[#0284C7] text-xs font-bold tracking-wide">
              {about.sectionLabel || about.eyebrow || 'About Yovexa Solutions'}
            </span>

            <h2 className="text-2xl sm:text-3xl font-black text-[#0B1B3A] tracking-tight">
              {about.title}{' '}
              <span className="text-[#0EA5E9]">
                {about.titleHighlight || about.highlightedTitle}
              </span>
            </h2>

            <p className="text-sm sm:text-base text-[#334155] leading-relaxed">
              {about.description}
            </p>

            {about.additionalDescription && (
              <p className="text-sm text-[#475569] leading-relaxed bg-[#F8FAFC] p-4 rounded-xl border border-[#E2E8F0]">
                {about.additionalDescription}
              </p>
            )}

            {/* Highlights */}
            {Array.isArray(about.highlights) && about.highlights.length > 0 && (
              <div className="pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#64748B] mb-3">
                  Highlights & Capabilities ({about.highlights.length})
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {about.highlights.map((h, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs font-semibold text-[#0B1B3A]">
                      <span className="w-5 h-5 rounded-md bg-[#0EA5E9]/15 text-[#0284C7] flex items-center justify-center shrink-0">
                        <Check className="w-3.5 h-3.5" />
                      </span>
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-4 flex flex-wrap gap-4 border-t border-[#E2E8F0]">
              {about.primaryCtaText && (
                <div className="px-5 py-2.5 rounded-xl bg-[#0EA5E9] text-white text-xs font-bold shadow-sm">
                  {about.primaryCtaText} ({about.primaryCtaLink || '#contact'})
                </div>
              )}
              {about.secondaryCtaText && (
                <div className="px-5 py-2.5 rounded-xl bg-slate-100 text-[#0B1B3A] text-xs font-bold">
                  {about.secondaryCtaText} ({about.secondaryCtaLink || '#services'})
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Graphic & System Meta (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Image Card */}
          <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-[#0B1B3A] border-b border-[#E2E8F0] pb-2">
              Section Graphic
            </h3>
            {about.image ? (
              <div className="rounded-xl overflow-hidden border border-[#E2E8F0] bg-slate-50">
                <img
                  src={about.image}
                  alt={about.imageAlt || 'About Graphic'}
                  className="w-full h-44 object-cover"
                />
              </div>
            ) : (
              <div className="h-40 rounded-xl bg-slate-100 flex items-center justify-center text-xs text-slate-400">
                No custom image uploaded
              </div>
            )}
            {about.imageAlt && (
              <p className="text-xs text-[#64748B] italic">
                Alt: {about.imageAlt}
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
                {about.createdAt ? new Date(about.createdAt).toLocaleString() : '—'}
              </span>
            </div>
            <div className="flex items-center justify-between text-[#64748B]">
              <span>Last Modified:</span>
              <span className="font-semibold text-[#0B1B3A]">
                {about.updatedAt ? new Date(about.updatedAt).toLocaleString() : '—'}
              </span>
            </div>
            <div className="flex items-center justify-between text-[#64748B]">
              <span>Record ID:</span>
              <code className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-600 truncate max-w-[150px]">
                {about.id}
              </code>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={deleteModalOpen}
        title={about.title}
        heading="Delete About Section"
        message={
          about.isActive ? (
            'Warning: This About section is currently ACTIVE on the homepage. Deleting it may leave the homepage without About content. Continue?'
          ) : (
            `Are you sure you want to delete "${about.title}"?`
          )
        }
        onConfirm={handleDelete}
        onCancel={() => setDeleteModalOpen(false)}
        isDeleting={isDeleting}
      />
    </div>
  );
}
