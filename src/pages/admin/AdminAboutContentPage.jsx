import React, { useState, useEffect } from 'react';
import { Save, Info, Plus, Trash2, Loader2, Check } from 'lucide-react';
import { contentService } from '../../services/contentService';
import { useToast } from '../../context/ToastContext';
import ImageUploader from '../../components/admin/ImageUploader';

export default function AdminAboutContentPage() {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    sectionLabel: '',
    title: '',
    titleHighlight: '',
    description: '',
    additionalDescription: '',
    primaryCtaText: '',
    primaryCtaLink: '',
    secondaryCtaText: '',
    secondaryCtaLink: '',
    image: '',
    imageAlt: '',
    imageCategory: '',
    imageTitle: '',
    imageBadge: '',
    highlights: [],
    isVisible: true,
  });

  const [newHighlight, setNewHighlight] = useState('');

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        setLoading(true);
        const data = await contentService.getAboutContent();
        if (data) {
          setFormData(prev => ({ ...prev, ...data }));
        }
      } catch (err) {
        console.error('Failed to load about content:', err);
        showToast('Failed to load about content', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchAbout();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (url) => {
    setFormData(prev => ({ ...prev, image: url }));
  };

  const handleAddHighlight = () => {
    if (!newHighlight.trim()) return;
    setFormData(prev => ({
      ...prev,
      highlights: [...(prev.highlights || []), newHighlight.trim()]
    }));
    setNewHighlight('');
  };

  const handleRemoveHighlight = (index) => {
    setFormData(prev => ({
      ...prev,
      highlights: prev.highlights.filter((_, idx) => idx !== index)
    }));
  };

  const handleHighlightChange = (index, value) => {
    setFormData(prev => {
      const updated = [...prev.highlights];
      updated[index] = value;
      return { ...prev, highlights: updated };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await contentService.updateAboutContent(formData);
      showToast('About section updated successfully! Changes are live.', 'success');
    } catch (err) {
      console.error('Failed to update about section:', err);
      showToast(err.message || 'Failed to save changes', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 text-[#0EA5E9] animate-spin" />
        <p className="text-sm font-semibold text-[#64748B]">Loading About section editor...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#0EA5E9]/15 text-[#0284C7] text-xs font-bold uppercase tracking-wider mb-1">
            <Info className="w-3.5 h-3.5" />
            <span>Singleton CMS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0B1B3A] tracking-tight">
            About Section Content
          </h1>
          <p className="text-sm text-[#475569] mt-0.5 font-medium">
            Manage company philosophy, focus areas, and narrative highlights.
          </p>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-white bg-[#0EA5E9] hover:bg-[#0284C7] transition-all shadow-md text-sm disabled:opacity-60 shrink-0"
        >
          {saving ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save About Content</span>
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Narrative & Focus Areas (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white p-6 sm:p-7 rounded-2xl border border-[#E2E8F0] shadow-sm space-y-5">
            <h3 className="text-base font-bold text-[#0B1B3A] border-b border-[#E2E8F0] pb-3">
              Section Headlines & Descriptions
            </h3>

            <div>
              <label htmlFor="sectionLabel" className="block text-xs font-extrabold text-[#0B1B3A] mb-1.5">
                Section Eyebrow Label
              </label>
              <input
                type="text"
                id="sectionLabel"
                name="sectionLabel"
                value={formData.sectionLabel}
                onChange={handleChange}
                placeholder="e.g. About Yovexa Solutions"
                className="w-full px-4 py-2.5 rounded-xl border border-[#CBD5E1] text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#0EA5E9] font-medium"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="title" className="block text-xs font-extrabold text-[#0B1B3A] mb-1.5">
                  Main Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Technology Built Around"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#CBD5E1] text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#0EA5E9] font-bold"
                />
              </div>

              <div>
                <label htmlFor="titleHighlight" className="block text-xs font-extrabold text-[#0B1B3A] mb-1.5">
                  Highlighted Title Text
                </label>
                <input
                  type="text"
                  id="titleHighlight"
                  name="titleHighlight"
                  value={formData.titleHighlight}
                  onChange={handleChange}
                  placeholder="e.g. Your Business"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#CBD5E1] text-sm text-[#0284C7] focus:outline-none focus:ring-2 focus:ring-[#0EA5E9] font-bold"
                />
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-xs font-extrabold text-[#0B1B3A] mb-1.5">
                Primary Narrative Paragraph
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleChange}
                placeholder="Core mission and company definition..."
                className="w-full px-4 py-2.5 rounded-xl border border-[#CBD5E1] text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#0EA5E9] resize-none"
              />
            </div>

            <div>
              <label htmlFor="additionalDescription" className="block text-xs font-extrabold text-[#0B1B3A] mb-1.5">
                Secondary Narrative Paragraph
              </label>
              <textarea
                id="additionalDescription"
                name="additionalDescription"
                rows={3}
                value={formData.additionalDescription}
                onChange={handleChange}
                placeholder="Approach to engineering and quality..."
                className="w-full px-4 py-2.5 rounded-xl border border-[#CBD5E1] text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#0EA5E9] resize-none"
              />
            </div>
          </div>

          {/* Highlights / Focus Areas */}
          <div className="bg-white p-6 sm:p-7 rounded-2xl border border-[#E2E8F0] shadow-sm space-y-4">
            <h3 className="text-base font-bold text-[#0B1B3A] border-b border-[#E2E8F0] pb-3 flex items-center justify-between">
              <span>What We Build / Highlights</span>
              <span className="text-xs text-[#64748B] font-normal">{formData.highlights?.length || 0} items</span>
            </h3>

            {/* Add new highlight item */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newHighlight}
                onChange={(e) => setNewHighlight(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddHighlight();
                  }
                }}
                placeholder="e.g. Enterprise Cloud Architecture (AWS / GCP)"
                className="flex-1 px-4 py-2.5 rounded-xl border border-[#CBD5E1] text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]"
              />
              <button
                type="button"
                onClick={handleAddHighlight}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#0B1B3A] text-white font-bold text-xs hover:bg-[#183B75] transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add</span>
              </button>
            </div>

            {/* List of current highlights */}
            <div className="space-y-2.5 pt-2">
              {formData.highlights?.map((hl, idx) => (
                <div key={idx} className="flex items-center gap-2 p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                  <div className="w-5 h-5 rounded-full bg-[#E0F2FE] flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 text-[#0284C7] stroke-[3]" />
                  </div>
                  <input
                    type="text"
                    value={hl}
                    onChange={(e) => handleHighlightChange(idx, e.target.value)}
                    className="flex-1 bg-transparent text-xs font-semibold text-[#0B1B3A] focus:outline-none focus:bg-white focus:px-2 focus:py-1 focus:rounded"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveHighlight(idx)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Settings, CTAs, & Media (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Section Visibility */}
          <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-sm space-y-3">
            <h4 className="text-xs font-extrabold text-[#0B1B3A] uppercase tracking-wider pb-2 border-b border-[#E2E8F0]">
              Section Settings
            </h4>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="isVisible"
                checked={formData.isVisible}
                onChange={handleChange}
                className="w-4 h-4 text-[#0EA5E9] rounded focus:ring-[#0EA5E9]"
              />
              <span className="text-xs font-bold text-[#0B1B3A]">
                Display About Section on Homepage
              </span>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-sm space-y-4">
            <h4 className="text-xs font-extrabold text-[#0B1B3A] uppercase tracking-wider pb-2 border-b border-[#E2E8F0]">
              About Buttons (CTAs)
            </h4>
            
            <div>
              <label htmlFor="primaryCtaText" className="block text-xs font-bold text-[#334155] mb-1">
                Primary Button Label
              </label>
              <input
                type="text"
                id="primaryCtaText"
                name="primaryCtaText"
                value={formData.primaryCtaText}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border border-[#CBD5E1] text-xs font-semibold text-[#0F172A]"
              />
            </div>

            <div>
              <label htmlFor="primaryCtaLink" className="block text-xs font-bold text-[#334155] mb-1">
                Primary Button Link
              </label>
              <input
                type="text"
                id="primaryCtaLink"
                name="primaryCtaLink"
                value={formData.primaryCtaLink}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border border-[#CBD5E1] text-xs font-mono text-[#0F172A]"
              />
            </div>

            <div className="pt-2 border-t border-[#E2E8F0]">
              <label htmlFor="secondaryCtaText" className="block text-xs font-bold text-[#334155] mb-1">
                Secondary Button Label
              </label>
              <input
                type="text"
                id="secondaryCtaText"
                name="secondaryCtaText"
                value={formData.secondaryCtaText}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border border-[#CBD5E1] text-xs font-semibold text-[#0F172A]"
              />
            </div>

            <div>
              <label htmlFor="secondaryCtaLink" className="block text-xs font-bold text-[#334155] mb-1">
                Secondary Button Link
              </label>
              <input
                type="text"
                id="secondaryCtaLink"
                name="secondaryCtaLink"
                value={formData.secondaryCtaLink}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border border-[#CBD5E1] text-xs font-mono text-[#0F172A]"
              />
            </div>
          </div>

          {/* About Media */}
          <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-sm space-y-4">
            <h4 className="text-xs font-extrabold text-[#0B1B3A] uppercase tracking-wider pb-2 border-b border-[#E2E8F0]">
              About Image
            </h4>
            <ImageUploader
              value={formData.image}
              onChange={handleImageChange}
            />
            <div>
              <label htmlFor="imageAlt" className="block text-xs font-bold text-[#334155] mb-1">
                Image Alt Text
              </label>
              <input
                type="text"
                id="imageAlt"
                name="imageAlt"
                value={formData.imageAlt}
                onChange={handleChange}
                placeholder="e.g. Yovexa Engineering Team"
                className="w-full px-3 py-2 rounded-lg border border-[#CBD5E1] text-xs text-[#0F172A]"
              />
            </div>

            <div>
              <label htmlFor="imageCategory" className="block text-xs font-bold text-[#334155] mb-1">
                Image Category / Kicker
              </label>
              <input
                type="text"
                id="imageCategory"
                name="imageCategory"
                value={formData.imageCategory || ''}
                onChange={handleChange}
                placeholder="e.g. Enterprise Technology"
                className="w-full px-3 py-2 rounded-lg border border-[#CBD5E1] text-xs text-[#0F172A]"
              />
            </div>

            <div>
              <label htmlFor="imageTitle" className="block text-xs font-bold text-[#334155] mb-1">
                Image Headline / Caption Title
              </label>
              <input
                type="text"
                id="imageTitle"
                name="imageTitle"
                value={formData.imageTitle || ''}
                onChange={handleChange}
                placeholder="e.g. Cloud Architecture & Digital Solutions"
                className="w-full px-3 py-2 rounded-lg border border-[#CBD5E1] text-xs font-semibold text-[#0F172A]"
              />
            </div>

            <div>
              <label htmlFor="imageBadge" className="block text-xs font-bold text-[#334155] mb-1">
                Image Status Badge
              </label>
              <input
                type="text"
                id="imageBadge"
                name="imageBadge"
                value={formData.imageBadge || ''}
                onChange={handleChange}
                placeholder="e.g. Production-Ready"
                className="w-full px-3 py-2 rounded-lg border border-[#CBD5E1] text-xs text-[#0F172A]"
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
