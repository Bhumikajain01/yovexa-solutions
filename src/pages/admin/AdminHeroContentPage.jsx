import React, { useState, useEffect } from 'react';
import { Save, Sparkles, Loader2, Globe, Eye, ArrowLeft } from 'lucide-react';
import { contentService } from '../../services/contentService';
import { useToast } from '../../context/ToastContext';
import ImageUploader from '../../components/admin/ImageUploader';

export default function AdminHeroContentPage() {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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
    isVisible: true,
  });

  useEffect(() => {
    const fetchHero = async () => {
      try {
        setLoading(true);
        const data = await contentService.getHeroContent();
        if (data) {
          setFormData(prev => ({ ...prev, ...data }));
        }
      } catch (err) {
        console.error('Failed to load hero content:', err);
        showToast('Failed to load hero content', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchHero();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (url) => {
    setFormData(prev => ({ ...prev, heroImage: url }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await contentService.updateHeroContent(formData);
      showToast('Hero section updated successfully! Changes are live.', 'success');
    } catch (err) {
      console.error('Failed to update hero:', err);
      showToast(err.message || 'Failed to save hero changes', 'error');
    } finally {
      setSaving(false);
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
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#0EA5E9]/15 text-[#0284C7] text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Singleton CMS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0B1B3A] tracking-tight">
            Homepage Hero Section
          </h1>
          <p className="text-sm text-[#475569] mt-0.5 font-medium">
            Manage main value proposition, badge, headlines, and call-to-action buttons.
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
              <span>Save Hero Content</span>
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Text & Content (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white p-6 sm:p-7 rounded-2xl border border-[#E2E8F0] shadow-sm space-y-5">
            <h3 className="text-base font-bold text-[#0B1B3A] border-b border-[#E2E8F0] pb-3">
              Headlines & Messaging
            </h3>

            {/* Eyebrow / Tag Pill */}
            <div>
              <label htmlFor="badge" className="block text-xs font-extrabold text-[#0B1B3A] mb-1.5">
                Eyebrow Badge / Pill Text
              </label>
              <input
                type="text"
                id="badge"
                name="badge"
                value={formData.badge}
                onChange={handleChange}
                placeholder="e.g. Technology Partner for Modern Businesses"
                className="w-full px-4 py-2.5 rounded-xl border border-[#CBD5E1] text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#0EA5E9] font-medium"
              />
            </div>

            {/* Main Heading & Highlighted Part */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="heading" className="block text-xs font-extrabold text-[#0B1B3A] mb-1.5">
                  Main Headline (Leading Text)
                </label>
                <input
                  type="text"
                  id="heading"
                  name="heading"
                  value={formData.heading}
                  onChange={handleChange}
                  placeholder="e.g. Building Digital Solutions That"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#CBD5E1] text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#0EA5E9] font-bold"
                />
              </div>

              <div>
                <label htmlFor="highlightedText" className="block text-xs font-extrabold text-[#0B1B3A] mb-1.5">
                  Highlighted Headline (Gradient Text)
                </label>
                <input
                  type="text"
                  id="highlightedText"
                  name="highlightedText"
                  value={formData.highlightedText}
                  onChange={handleChange}
                  placeholder="e.g. Move Your Business Forward."
                  className="w-full px-4 py-2.5 rounded-xl border border-[#CBD5E1] text-sm text-[#0284C7] focus:outline-none focus:ring-2 focus:ring-[#0EA5E9] font-bold"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-xs font-extrabold text-[#0B1B3A] mb-1.5">
                Supporting Subheadline / Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleChange}
                placeholder="Detailed value proposition..."
                className="w-full px-4 py-2.5 rounded-xl border border-[#CBD5E1] text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#0EA5E9] resize-none"
              />
            </div>
          </div>

          {/* Action Buttons (CTAs) */}
          <div className="bg-white p-6 sm:p-7 rounded-2xl border border-[#E2E8F0] shadow-sm space-y-5">
            <h3 className="text-base font-bold text-[#0B1B3A] border-b border-[#E2E8F0] pb-3">
              Hero Call-to-Action (CTA) Buttons
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Primary CTA */}
              <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-3">
                <span className="text-xs font-bold text-[#0EA5E9] uppercase tracking-wider">Primary Button</span>
                <div>
                  <label htmlFor="primaryCtaText" className="block text-xs font-bold text-[#334155] mb-1">
                    Button Label
                  </label>
                  <input
                    type="text"
                    id="primaryCtaText"
                    name="primaryCtaText"
                    value={formData.primaryCtaText}
                    onChange={handleChange}
                    placeholder="Start a Project"
                    className="w-full px-3.5 py-2 rounded-lg border border-[#CBD5E1] text-xs font-semibold text-[#0F172A]"
                  />
                </div>
                <div>
                  <label htmlFor="primaryCtaLink" className="block text-xs font-bold text-[#334155] mb-1">
                    Button Link / Anchor
                  </label>
                  <input
                    type="text"
                    id="primaryCtaLink"
                    name="primaryCtaLink"
                    value={formData.primaryCtaLink}
                    onChange={handleChange}
                    placeholder="#contact"
                    className="w-full px-3.5 py-2 rounded-lg border border-[#CBD5E1] text-xs font-mono text-[#0F172A]"
                  />
                </div>
              </div>

              {/* Secondary CTA */}
              <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-3">
                <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider">Secondary Button</span>
                <div>
                  <label htmlFor="secondaryCtaText" className="block text-xs font-bold text-[#334155] mb-1">
                    Button Label
                  </label>
                  <input
                    type="text"
                    id="secondaryCtaText"
                    name="secondaryCtaText"
                    value={formData.secondaryCtaText}
                    onChange={handleChange}
                    placeholder="Explore Our Services"
                    className="w-full px-3.5 py-2 rounded-lg border border-[#CBD5E1] text-xs font-semibold text-[#0F172A]"
                  />
                </div>
                <div>
                  <label htmlFor="secondaryCtaLink" className="block text-xs font-bold text-[#334155] mb-1">
                    Button Link / Anchor
                  </label>
                  <input
                    type="text"
                    id="secondaryCtaLink"
                    name="secondaryCtaLink"
                    value={formData.secondaryCtaLink}
                    onChange={handleChange}
                    placeholder="#services"
                    className="w-full px-3.5 py-2 rounded-lg border border-[#CBD5E1] text-xs font-mono text-[#0F172A]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Visual & Visibility (4 cols) */}
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
                Display Hero Section on Homepage
              </span>
            </label>
          </div>

          {/* Hero Visual Media */}
          <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-sm space-y-4">
            <h4 className="text-xs font-extrabold text-[#0B1B3A] uppercase tracking-wider pb-2 border-b border-[#E2E8F0]">
              Hero Image Media
            </h4>
            <ImageUploader
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
                className="w-full px-3 py-2 rounded-lg border border-[#CBD5E1] text-xs text-[#0F172A]"
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
