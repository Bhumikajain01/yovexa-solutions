import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Save, ArrowLeft, Info, Plus, Trash2 } from 'lucide-react';
import { aboutService } from '../../services/aboutService';
import { useToast } from '../../context/ToastContext';
import ImageUploader from '../../components/admin/ImageUploader';

export default function AdminCreateAboutPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
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
    highlights: [],
    status: 'DRAFT',
    isActive: false,
    isVisible: true,
  });

  const [newHighlight, setNewHighlight] = useState('');
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!formData.title.trim()) errs.title = 'Main title is required';
    if (!formData.description.trim()) errs.description = 'Primary narrative paragraph is required';
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
    setFormData(prev => ({ ...prev, image: url }));
  };

  const handleAddHighlight = () => {
    if (!newHighlight.trim()) return;
    setFormData(prev => ({
      ...prev,
      highlights: [...prev.highlights, newHighlight.trim()]
    }));
    setNewHighlight('');
  };

  const handleRemoveHighlight = (index) => {
    setFormData(prev => ({
      ...prev,
      highlights: prev.highlights.filter((_, idx) => idx !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      showToast('Please fix the required fields before saving', 'error');
      return;
    }

    try {
      setSaving(true);
      await aboutService.createAbout(formData);
      showToast('About section created successfully!', 'success');
      navigate('/admin/content/about');
    } catch (err) {
      console.error('Failed to create about section:', err);
      showToast(err.message || 'Failed to create about section', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
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
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#0EA5E9]/15 text-[#0284C7] text-xs font-bold uppercase tracking-wider mb-1">
              <Info className="w-3.5 h-3.5" />
              <span>New About Record</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#0B1B3A] tracking-tight">
              Create About Section
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/content/about"
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
            <span>{saving ? 'Saving...' : 'Save About Section'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Narrative & Highlights (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white p-6 sm:p-7 rounded-2xl border border-[#E2E8F0] shadow-sm space-y-5">
            <h3 className="text-base font-bold text-[#0B1B3A] border-b border-[#E2E8F0] pb-3">
              Narrative & Headings
            </h3>

            {/* Eyebrow Label */}
            <div>
              <label htmlFor="sectionLabel" className="block text-xs font-bold text-[#334155] mb-1">
                Section Eyebrow Label
              </label>
              <input
                type="text"
                id="sectionLabel"
                name="sectionLabel"
                value={formData.sectionLabel}
                onChange={handleChange}
                placeholder="e.g. About Yovexa Solutions"
                className="w-full px-4 py-2.5 rounded-xl border border-[#CBD5E1] focus:ring-2 focus:ring-[#0EA5E9] text-sm text-[#0B1B3A]"
              />
            </div>

            {/* Main Title & Highlight */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="title" className="block text-xs font-bold text-[#334155] mb-1">
                  Main Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Technology Built Around"
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm text-[#0B1B3A] focus:ring-2 focus:ring-[#0EA5E9] ${
                    errors.title ? 'border-rose-400 bg-rose-50/30' : 'border-[#CBD5E1]'
                  }`}
                />
                {errors.title && (
                  <p className="text-xs text-rose-600 mt-1 font-semibold">{errors.title}</p>
                )}
              </div>

              <div>
                <label htmlFor="titleHighlight" className="block text-xs font-bold text-[#334155] mb-1">
                  Highlighted Title Text
                </label>
                <input
                  type="text"
                  id="titleHighlight"
                  name="titleHighlight"
                  value={formData.titleHighlight}
                  onChange={handleChange}
                  placeholder="e.g. Your Business"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#CBD5E1] focus:ring-2 focus:ring-[#0EA5E9] text-sm text-[#0B1B3A]"
                />
              </div>
            </div>

            {/* Primary Paragraph */}
            <div>
              <label htmlFor="description" className="block text-xs font-bold text-[#334155] mb-1">
                Primary Narrative Paragraph <span className="text-rose-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleChange}
                placeholder="Core introductory statement..."
                className={`w-full px-4 py-2.5 rounded-xl border text-sm text-[#0B1B3A] focus:ring-2 focus:ring-[#0EA5E9] ${
                  errors.description ? 'border-rose-400 bg-rose-50/30' : 'border-[#CBD5E1]'
                }`}
              />
              {errors.description && (
                <p className="text-xs text-rose-600 mt-1 font-semibold">{errors.description}</p>
              )}
            </div>

            {/* Secondary Paragraph */}
            <div>
              <label htmlFor="additionalDescription" className="block text-xs font-bold text-[#334155] mb-1">
                Secondary Narrative Paragraph (Beliefs & Approach)
              </label>
              <textarea
                id="additionalDescription"
                name="additionalDescription"
                rows={3}
                value={formData.additionalDescription}
                onChange={handleChange}
                placeholder="Elaborate on your development philosophy..."
                className="w-full px-4 py-2.5 rounded-xl border border-[#CBD5E1] text-sm text-[#0B1B3A]"
              />
            </div>
          </div>

          {/* Highlights & Bullet Points */}
          <div className="bg-white p-6 sm:p-7 rounded-2xl border border-[#E2E8F0] shadow-sm space-y-4">
            <h3 className="text-base font-bold text-[#0B1B3A] border-b border-[#E2E8F0] pb-3">
              Key Capabilities / Highlights
            </h3>

            <div className="space-y-2">
              {formData.highlights.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 p-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs font-semibold text-[#0B1B3A]">
                  <span className="w-2 h-2 rounded-full bg-[#0EA5E9] shrink-0" />
                  <span className="flex-1">{item}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveHighlight(idx)}
                    className="p-1 text-slate-400 hover:text-rose-600 rounded"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2 pt-2">
              <input
                type="text"
                value={newHighlight}
                onChange={(e) => setNewHighlight(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddHighlight(); } }}
                placeholder="Add capability point..."
                className="flex-1 px-4 py-2 rounded-xl border border-[#CBD5E1] text-xs text-[#0B1B3A]"
              />
              <button
                type="button"
                onClick={handleAddHighlight}
                className="px-4 py-2 rounded-xl bg-[#0EA5E9] hover:bg-[#0284C7] text-white font-bold text-xs flex items-center gap-1 shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>
          </div>

          {/* Action Buttons / CTAs */}
          <div className="bg-white p-6 sm:p-7 rounded-2xl border border-[#E2E8F0] shadow-sm space-y-5">
            <h3 className="text-base font-bold text-[#0B1B3A] border-b border-[#E2E8F0] pb-3">
              Action Buttons
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  placeholder="e.g. Work With Us"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#CBD5E1] text-sm text-[#0B1B3A]"
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
                  placeholder="e.g. #contact"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#CBD5E1] text-sm text-[#0B1B3A]"
                />
              </div>

              <div>
                <label htmlFor="secondaryCtaText" className="block text-xs font-bold text-[#334155] mb-1">
                  Secondary Button Label
                </label>
                <input
                  type="text"
                  id="secondaryCtaText"
                  name="secondaryCtaText"
                  value={formData.secondaryCtaText}
                  onChange={handleChange}
                  placeholder="e.g. View Full Services"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#CBD5E1] text-sm text-[#0B1B3A]"
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
                    Activating this will automatically deactivate any other active About section.
                  </span>
                </div>
              </label>
            </div>
          </div>

          {/* About Image Settings */}
          <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-[#0B1B3A] border-b border-[#E2E8F0] pb-2">
              About Photo / Team Graphic
            </h3>

            <ImageUploader
              label="About Section Graphic"
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
                className="w-full px-4 py-2 rounded-xl border border-[#CBD5E1] text-xs text-[#0B1B3A]"
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
