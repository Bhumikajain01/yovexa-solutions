import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Save, ArrowLeft, Sparkles, Loader2, Trash2 } from 'lucide-react';
import { heroService } from '../../services/heroService';
import { useToast } from '../../context/ToastContext';
import ImageUploader from '../../components/admin/ImageUploader';
import DeleteModal from '../../components/admin/DeleteModal';

export default function AdminEditHeroPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [formData, setFormData] = useState({
    badge: '',
    heading: '',
    highlightedText: '',
    description: '',
    primaryCtaText: '',
    primaryCtaLink: '',
    secondaryCtaText: '',
    secondaryCtaLink: '',
    heroImage: '',
    heroImageAlt: '',
    status: 'PUBLISHED',
    isActive: false,
    isVisible: true,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchHero = async () => {
      try {
        setLoading(true);
        const data = await heroService.getHeroById(id);
        if (data) {
          setFormData(data);
        } else {
          showToast('Hero section record not found', 'error');
          navigate('/admin/content/hero');
        }
      } catch (err) {
        console.error('Failed to load hero for editing:', err);
        showToast('Failed to load hero section', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchHero();
  }, [id, navigate]);

  const validate = () => {
    const errs = {};
    if (!formData.heading.trim()) errs.heading = 'Main headline is required';
    if (!formData.description.trim()) errs.description = 'Description is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleImageChange = (url) => {
    setFormData(prev => ({ ...prev, heroImage: url }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      showToast('Please fix the required fields before saving', 'error');
      return;
    }

    try {
      setSaving(true);
      await heroService.updateHero(id, formData);
      showToast('Hero section updated successfully! Changes are live.', 'success');
      navigate('/admin/content/hero');
    } catch (err) {
      console.error('Failed to update hero:', err);
      showToast(err.message || 'Failed to save hero changes', 'error');
    } finally {
      setSaving(false);
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
        <p className="text-sm font-semibold text-[#64748B]">Loading Hero section editor...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
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
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#0EA5E9]/15 text-[#0284C7] text-xs font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Edit Hero Record</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#0B1B3A] tracking-tight">
              Edit Hero Section
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setDeleteModalOpen(true)}
            className="p-2.5 rounded-xl border border-rose-200 text-rose-600 bg-rose-50 hover:bg-rose-100 transition-colors"
            title="Delete this record"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <Link
            to="/admin/content/hero"
            className="px-4 py-2.5 rounded-xl border border-[#CBD5E1] bg-white text-[#334155] font-bold text-xs hover:bg-[#F8FAFC] transition-all"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#0EA5E9] hover:bg-[#0284C7] text-white font-bold text-xs shadow-md shadow-[#0EA5E9]/20 transition-all disabled:opacity-60"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Headlines & CTAs (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white p-6 sm:p-7 rounded-2xl border border-[#E2E8F0] shadow-sm space-y-5">
            <h3 className="text-base font-bold text-[#0B1B3A] border-b border-[#E2E8F0] pb-3">
              Headlines & Messaging
            </h3>

            {/* Eyebrow Badge */}
            <div>
              <label htmlFor="badge" className="block text-xs font-bold text-[#334155] mb-1">
                Eyebrow Badge / Pill Text
              </label>
              <input
                type="text"
                id="badge"
                name="badge"
                value={formData.badge}
                onChange={handleChange}
                placeholder="e.g. Technology Partner for Modern Businesses"
                className="w-full px-4 py-2.5 rounded-xl border border-[#CBD5E1] focus:ring-2 focus:ring-[#0EA5E9] text-sm text-[#0B1B3A]"
              />
            </div>

            {/* Main Headline */}
            <div>
              <label htmlFor="heading" className="block text-xs font-bold text-[#334155] mb-1">
                Main Headline <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                id="heading"
                name="heading"
                value={formData.heading}
                onChange={handleChange}
                placeholder="e.g. Building Digital Solutions That"
                className={`w-full px-4 py-2.5 rounded-xl border text-sm text-[#0B1B3A] focus:ring-2 focus:ring-[#0EA5E9] ${
                  errors.heading ? 'border-rose-400 bg-rose-50/30' : 'border-[#CBD5E1]'
                }`}
              />
              {errors.heading && (
                <p className="text-xs text-rose-600 mt-1 font-semibold">{errors.heading}</p>
              )}
            </div>

            {/* Highlighted Headline */}
            <div>
              <label htmlFor="highlightedText" className="block text-xs font-bold text-[#334155] mb-1">
                Highlighted Headline (Cyan Gradient)
              </label>
              <input
                type="text"
                id="highlightedText"
                name="highlightedText"
                value={formData.highlightedText}
                onChange={handleChange}
                placeholder="e.g. Move Your Business Forward."
                className="w-full px-4 py-2.5 rounded-xl border border-[#CBD5E1] focus:ring-2 focus:ring-[#0EA5E9] text-sm text-[#0B1B3A]"
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-xs font-bold text-[#334155] mb-1">
                Supporting Description / Subheadline <span className="text-rose-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your core value proposition..."
                className={`w-full px-4 py-2.5 rounded-xl border text-sm text-[#0B1B3A] focus:ring-2 focus:ring-[#0EA5E9] ${
                  errors.description ? 'border-rose-400 bg-rose-50/30' : 'border-[#CBD5E1]'
                }`}
              />
              {errors.description && (
                <p className="text-xs text-rose-600 mt-1 font-semibold">{errors.description}</p>
              )}
            </div>
          </div>

          {/* Action Buttons / CTAs */}
          <div className="bg-white p-6 sm:p-7 rounded-2xl border border-[#E2E8F0] shadow-sm space-y-5">
            <h3 className="text-base font-bold text-[#0B1B3A] border-b border-[#E2E8F0] pb-3">
              Call-to-Action Buttons
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="primaryCtaText" className="block text-xs font-bold text-[#334155] mb-1">
                  Primary CTA Label
                </label>
                <input
                  type="text"
                  id="primaryCtaText"
                  name="primaryCtaText"
                  value={formData.primaryCtaText}
                  onChange={handleChange}
                  placeholder="e.g. Start a Project"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#CBD5E1] text-sm text-[#0B1B3A]"
                />
              </div>

              <div>
                <label htmlFor="primaryCtaLink" className="block text-xs font-bold text-[#334155] mb-1">
                  Primary CTA Link
                </label>
                <input
                  type="text"
                  id="primaryCtaLink"
                  name="primaryCtaLink"
                  value={formData.primaryCtaLink}
                  onChange={handleChange}
                  placeholder="e.g. #contact or /contact"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#CBD5E1] text-sm text-[#0B1B3A]"
                />
              </div>

              <div>
                <label htmlFor="secondaryCtaText" className="block text-xs font-bold text-[#334155] mb-1">
                  Secondary CTA Label
                </label>
                <input
                  type="text"
                  id="secondaryCtaText"
                  name="secondaryCtaText"
                  value={formData.secondaryCtaText}
                  onChange={handleChange}
                  placeholder="e.g. Explore Our Services"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#CBD5E1] text-sm text-[#0B1B3A]"
                />
              </div>

              <div>
                <label htmlFor="secondaryCtaLink" className="block text-xs font-bold text-[#334155] mb-1">
                  Secondary CTA Link
                </label>
                <input
                  type="text"
                  id="secondaryCtaLink"
                  name="secondaryCtaLink"
                  value={formData.secondaryCtaLink}
                  onChange={handleChange}
                  placeholder="e.g. #services"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#CBD5E1] text-sm text-[#0B1B3A]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Status & Media Settings (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Status & Activation Card */}
          <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-[#0B1B3A] border-b border-[#E2E8F0] pb-2">
              Publishing & Status
            </h3>

            <div>
              <label htmlFor="status" className="block text-xs font-bold text-[#334155] mb-1">
                Publication Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-[#CBD5E1] text-sm font-bold text-[#0B1B3A] bg-white focus:ring-2 focus:ring-[#0EA5E9]"
              >
                <option value="PUBLISHED">Published (Live candidate)</option>
                <option value="DRAFT">Draft (Work in progress)</option>
              </select>
            </div>

            <div className="pt-2 border-t border-[#E2E8F0]">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="mt-1 w-4 h-4 text-[#0EA5E9] rounded focus:ring-[#0EA5E9]"
                />
                <div>
                  <span className="text-xs font-bold text-[#0B1B3A] block">
                    Make this Active on Homepage
                  </span>
                  <span className="text-[11px] text-[#64748B] block mt-0.5">
                    Activating this will automatically deactivate any other active Hero section.
                  </span>
                </div>
              </label>
            </div>
          </div>

          {/* Hero Image Settings */}
          <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-[#0B1B3A] border-b border-[#E2E8F0] pb-2">
              Hero Graphic & Image
            </h3>

            <ImageUploader
              label="Hero Image / Architecture Graphic"
              value={formData.heroImage}
              onChange={handleImageChange}
            />

            <div>
              <label htmlFor="heroImageAlt" className="block text-xs font-bold text-[#334155] mb-1">
                Image Alt Text
              </label>
              <input
                type="text"
                id="heroImageAlt"
                name="heroImageAlt"
                value={formData.heroImageAlt}
                onChange={handleChange}
                placeholder="e.g. Modern Software Architecture"
                className="w-full px-4 py-2 rounded-xl border border-[#CBD5E1] text-xs text-[#0B1B3A]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={deleteModalOpen}
        title={formData.heading}
        heading="Delete Hero Section"
        message={
          formData.isActive ? (
            'Warning: This Hero section is currently ACTIVE on the homepage. Deleting it may leave the homepage without Hero content. Continue?'
          ) : (
            `Are you sure you want to delete the Hero section "${formData.heading}"?`
          )
        }
        onConfirm={handleDelete}
        onCancel={() => setDeleteModalOpen(false)}
        isDeleting={isDeleting}
      />
    </form>
  );
}
