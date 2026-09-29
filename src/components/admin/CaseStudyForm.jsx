import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, AlertCircle } from 'lucide-react';
import ImageUploader from './ImageUploader';
import { generateSlug } from '../../services/blogService';
import { caseStudyService } from '../../services/caseStudyService';

export default function CaseStudyForm({ initialData = null, onSubmit, onCancel, loading = false }) {
  const navigate = useNavigate();
  const handleCancelClick = onCancel || (() => navigate('/admin/case-studies'));

  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    subtitle: '',
    projectReference: '',
    category: '',
    clientLabel: '',
    summary: '',
    problem: '',
    solution: '',
    features: '',
    technologies: '',
    featuredImage: '',
    liveUrl: '',
    githubUrl: '',
    status: 'DRAFT',
    featured: false,
    displayOrder: 1,
    seoTitle: '',
    seoDescription: '',
  });

  const [errors, setErrors] = useState({});
  const [isSlugManual, setIsSlugManual] = useState(false);

  useEffect(() => {
    caseStudyService.getCategories().then(cats => {
      if (Array.isArray(cats)) {
        const filtered = cats.filter(c => c.id !== 'all');
        setCategories(filtered);
        if (!initialData && filtered.length > 0) {
          setFormData(prev => ({
            ...prev,
            category: prev.category || filtered[0].id
          }));
        }
      }
    });
  }, [initialData]);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        slug: initialData.slug || initialData.id || '',
        subtitle: initialData.subtitle || '',
        projectReference: initialData.projectReference || '',
        category: (function(cat) {
          if (!cat) return 'WEB_APPLICATIONS';
          const upper = cat.toUpperCase();
          const map = { 'WEB': 'WEB_APPLICATIONS', 'MOBILE': 'MOBILE_APPS', 'ECOMMERCE': 'E_COMMERCE' };
          return map[upper] || upper;
        })(initialData.category),
        clientLabel: initialData.clientLabel || 'Architecture Breakdown',
        summary: initialData.summary || '',
        problem: initialData.problem || '',
        solution: initialData.solution || '',
        features: Array.isArray(initialData.features) ? initialData.features.join('\n') : initialData.features || '',
        technologies: Array.isArray(initialData.technologies) ? initialData.technologies.join(', ') : initialData.technologies || '',
        featuredImage: initialData.featuredImage || initialData.image || '',
        liveUrl: initialData.liveUrl || initialData.projectUrl || '',
        githubUrl: initialData.githubUrl || '',
        status: initialData.status || 'PUBLISHED',
        featured: initialData.featured || false,
        displayOrder: initialData.displayOrder || 1,
        seoTitle: initialData.seoTitle || '',
        seoDescription: initialData.seoDescription || '',
      });
      setIsSlugManual(true);
    }
  }, [initialData]);

  const handleTitleChange = (e) => {
    const title = e.target.value;
    setFormData(prev => ({
      ...prev,
      title,
      slug: isSlugManual ? prev.slug : generateSlug(title),
      seoTitle: prev.seoTitle === `${prev.title} - Case Study | Yovexa Solutions` || !prev.seoTitle
        ? `${title} - Case Study | Yovexa Solutions`
        : prev.seoTitle,
    }));
    if (errors.title) setErrors(prev => ({ ...prev, title: null }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const handleImageChange = (url) => {
    setFormData(prev => ({ ...prev, featuredImage: url }));
  };

  const validate = () => {
    const errs = {};
    if (!formData.title.trim()) errs.title = 'Case study title is required';
    if (!formData.slug.trim()) errs.slug = 'Slug is required';
    if (!formData.summary.trim()) errs.summary = 'Summary overview is required';
    if (!formData.problem.trim()) errs.problem = 'Problem statement is required';
    if (!formData.solution.trim()) errs.solution = 'Technical solution is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8" noValidate>
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
        <button
          type="button"
          onClick={handleCancelClick}
          className="inline-flex items-center gap-2 text-xs font-bold text-[#64748B] hover:text-[#0B1B3A] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Case Studies</span>
        </button>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={handleCancelClick}
            className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl border border-[#CBD5E1] text-xs font-bold text-[#334155] hover:bg-[#F1F5F9]"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold text-white bg-[#0EA5E9] hover:bg-[#0284C7] shadow-sm text-xs disabled:opacity-60"
          >
            {loading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Saving Case Study...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Case Study</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Case Study Identity & Problem/Solution (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white p-6 sm:p-7 rounded-2xl border border-[#E2E8F0] shadow-sm space-y-4">
            <h3 className="text-base font-bold text-[#0B1B3A] border-b border-[#E2E8F0] pb-3">
              Case Study Identification
            </h3>

            <div>
              <label htmlFor="title" className="block text-xs font-extrabold text-[#0B1B3A] mb-1.5">
                Case Study Title <span className="text-[#0EA5E9]">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleTitleChange}
                placeholder="e.g. Scaling Enterprise Order Sync & Telemetry in Real-Time"
                className={`w-full px-4 py-2.5 rounded-xl border text-sm font-bold text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#0EA5E9] ${
                  errors.title ? 'border-rose-500' : 'border-[#CBD5E1]'
                }`}
              />
              {errors.title && (
                <p className="mt-1 text-xs text-rose-600 flex items-center gap-1 font-semibold">
                  <AlertCircle className="w-3.5 h-3.5" /> {errors.title}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="slug" className="block text-xs font-extrabold text-[#0B1B3A] mb-1.5">
                  URL Slug <span className="text-[#0EA5E9]">*</span>
                </label>
                <input
                  type="text"
                  id="slug"
                  name="slug"
                  value={formData.slug}
                  onChange={(e) => {
                    setIsSlugManual(true);
                    setFormData({ ...formData, slug: generateSlug(e.target.value) });
                  }}
                  placeholder="scaling-order-sync-telemetry"
                  className="w-full px-4 py-2 rounded-xl border border-[#CBD5E1] text-xs font-mono text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]"
                />
                {errors.slug && (
                  <p className="mt-1 text-xs text-rose-600 flex items-center gap-1 font-semibold">
                    <AlertCircle className="w-3.5 h-3.5" /> {errors.slug}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="subtitle" className="block text-xs font-extrabold text-[#0B1B3A] mb-1.5">
                  Subtitle / Architecture Tagline
                </label>
                <input
                  type="text"
                  id="subtitle"
                  name="subtitle"
                  value={formData.subtitle}
                  onChange={handleChange}
                  placeholder="High-concurrency distributed offline sync engine"
                  className="w-full px-4 py-2 rounded-xl border border-[#CBD5E1] text-xs text-[#0F172A]"
                />
              </div>
            </div>

            <div>
              <label htmlFor="projectReference" className="block text-xs font-extrabold text-[#0B1B3A] mb-1.5">
                Related Project Reference <span className="text-[#64748B] font-normal">(Optional project link or product name)</span>
              </label>
              <input
                type="text"
                id="projectReference"
                name="projectReference"
                value={formData.projectReference}
                onChange={handleChange}
                placeholder="e.g. FieldTrack Pro / Yovexa CRM"
                className="w-full px-4 py-2 rounded-xl border border-[#CBD5E1] text-xs text-[#0F172A]"
              />
            </div>

            <div>
              <label htmlFor="summary" className="block text-xs font-extrabold text-[#0B1B3A] mb-1.5">
                Executive Summary / Overview <span className="text-[#0EA5E9]">*</span>
              </label>
              <textarea
                id="summary"
                name="summary"
                rows={2}
                value={formData.summary}
                onChange={handleChange}
                placeholder="Executive briefing on the business and engineering scope of this case study..."
                className={`w-full px-4 py-2 rounded-xl border text-xs text-[#0F172A] resize-none ${
                  errors.summary ? 'border-rose-500' : 'border-[#CBD5E1]'
                }`}
              />
              {errors.summary && (
                <p className="mt-1 text-xs text-rose-600 flex items-center gap-1 font-semibold">
                  <AlertCircle className="w-3.5 h-3.5" /> {errors.summary}
                </p>
              )}
            </div>
          </div>

          {/* Deep Case Study Architecture Details */}
          <div className="bg-white p-6 sm:p-7 rounded-2xl border border-[#E2E8F0] shadow-sm space-y-4">
            <h3 className="text-base font-bold text-[#0B1B3A] border-b border-[#E2E8F0] pb-3">
              Case Study Problem & Solution Breakdown
            </h3>

            <div>
              <label htmlFor="problem" className="block text-xs font-extrabold text-[#0B1B3A] mb-1.5">
                Problem Statement / Business Challenge <span className="text-[#0EA5E9]">*</span>
              </label>
              <textarea
                id="problem"
                name="problem"
                rows={3}
                value={formData.problem}
                onChange={handleChange}
                placeholder="What operational pain point, technical bottleneck, or business challenge did the client face?"
                className={`w-full px-4 py-2 rounded-xl border text-xs text-[#0F172A] resize-none ${
                  errors.problem ? 'border-rose-500' : 'border-[#CBD5E1]'
                }`}
              />
              {errors.problem && (
                <p className="mt-1 text-xs text-rose-600 flex items-center gap-1 font-semibold">
                  <AlertCircle className="w-3.5 h-3.5" /> {errors.problem}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="solution" className="block text-xs font-extrabold text-[#0B1B3A] mb-1.5">
                Technical Solution & Implementation <span className="text-[#0EA5E9]">*</span>
              </label>
              <textarea
                id="solution"
                name="solution"
                rows={4}
                value={formData.solution}
                onChange={handleChange}
                placeholder="How Yovexa engineered the solution, designed the data pipeline, and implemented system components..."
                className={`w-full px-4 py-2 rounded-xl border text-xs text-[#0F172A] resize-none ${
                  errors.solution ? 'border-rose-500' : 'border-[#CBD5E1]'
                }`}
              />
              {errors.solution && (
                <p className="mt-1 text-xs text-rose-600 flex items-center gap-1 font-semibold">
                  <AlertCircle className="w-3.5 h-3.5" /> {errors.solution}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="features" className="block text-xs font-extrabold text-[#0B1B3A] mb-1.5">
                Key Architectural Features <span className="text-[#64748B] font-normal">(One bullet per line)</span>
              </label>
              <textarea
                id="features"
                name="features"
                rows={4}
                value={formData.features}
                onChange={handleChange}
                placeholder="Event-driven pub/sub architecture&#10;Sub-50ms offline database sync&#10;Telemetry dashboard with zero-lag updates"
                className="w-full px-4 py-2 rounded-xl border border-[#CBD5E1] text-xs font-mono text-[#0F172A] resize-none"
              />
            </div>
          </div>

          {/* Links & References */}
          <div className="bg-white p-6 sm:p-7 rounded-2xl border border-[#E2E8F0] shadow-sm space-y-4">
            <h3 className="text-base font-bold text-[#0B1B3A] border-b border-[#E2E8F0] pb-3">
              Case Study Links & References
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="liveUrl" className="block text-xs font-bold text-[#334155] mb-1">
                  Live System / Reference URL
                </label>
                <input
                  type="url"
                  id="liveUrl"
                  name="liveUrl"
                  value={formData.liveUrl}
                  onChange={handleChange}
                  placeholder="https://..."
                  className="w-full px-3 py-2 rounded-lg border border-[#CBD5E1] text-xs text-[#0F172A]"
                />
              </div>

              <div>
                <label htmlFor="githubUrl" className="block text-xs font-bold text-[#334155] mb-1">
                  GitHub / Technical Architecture Repo
                </label>
                <input
                  type="url"
                  id="githubUrl"
                  name="githubUrl"
                  value={formData.githubUrl}
                  onChange={handleChange}
                  placeholder="https://github.com/..."
                  className="w-full px-3 py-2 rounded-lg border border-[#CBD5E1] text-xs text-[#0F172A]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Taxonomy, Tech Tags, Image & Status (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Status & Category */}
          <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-sm space-y-4">
            <h4 className="text-xs font-extrabold text-[#0B1B3A] uppercase tracking-wider pb-2 border-b border-[#E2E8F0]">
              Publication & Category
            </h4>

            <div>
              <label htmlFor="status" className="block text-xs font-bold text-[#334155] mb-1">
                Publication Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] text-xs font-bold text-[#0B1B3A]"
              >
                <option value="PUBLISHED">Published (Visible on Case Studies)</option>
                <option value="DRAFT">Draft (Admin Only)</option>
              </select>
            </div>

            <div>
              <label htmlFor="category" className="block text-xs font-bold text-[#334155] mb-1">
                Domain / Industry Category
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] text-xs font-semibold text-[#0B1B3A]"
              >
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="clientLabel" className="block text-xs font-bold text-[#334155] mb-1">
                Architecture Badge Tag
              </label>
              <input
                type="text"
                id="clientLabel"
                name="clientLabel"
                value={formData.clientLabel}
                onChange={handleChange}
                placeholder="e.g. Enterprise Architecture"
                className="w-full px-3.5 py-2 rounded-xl border border-[#CBD5E1] text-xs text-[#0F172A]"
              />
            </div>

            <div className="pt-2 flex items-center gap-2">
              <input
                type="checkbox"
                id="featured"
                name="featured"
                checked={formData.featured}
                onChange={handleChange}
                className="w-4 h-4 text-[#0EA5E9] rounded"
              />
              <label htmlFor="featured" className="text-xs font-bold text-[#0B1B3A] cursor-pointer">
                Mark as Featured Case Study
              </label>
            </div>
          </div>

          {/* Technology Stack Tags */}
          <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-sm space-y-3">
            <h4 className="text-xs font-extrabold text-[#0B1B3A] uppercase tracking-wider pb-2 border-b border-[#E2E8F0]">
              Technology & Tooling Stack
            </h4>
            <p className="text-[11px] text-[#64748B]">
              Comma-separated technologies applied in this case study.
            </p>
            <input
              type="text"
              name="technologies"
              value={formData.technologies}
              onChange={handleChange}
              placeholder="Kafka, MongoDB, Spring Boot, React, Docker"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] text-xs font-mono text-[#0F172A]"
            />
          </div>

          {/* Featured Image */}
          <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-sm space-y-3">
            <h4 className="text-xs font-extrabold text-[#0B1B3A] uppercase tracking-wider pb-2 border-b border-[#E2E8F0]">
              Architecture Diagram / Thumbnail
            </h4>
            <ImageUploader
              value={formData.featuredImage}
              onChange={handleImageChange}
            />
          </div>
        </div>
      </div>
    </form>
  );
}
