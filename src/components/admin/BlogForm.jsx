import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, Globe, Eye, Sparkles, AlertCircle } from 'lucide-react';
import BlogEditor from './BlogEditor';
import ImageUploader from './ImageUploader';
import { blogService, generateSlug } from '../../services/blogService';

export default function BlogForm({ initialData = null, onSubmit, onCancel, loading = false, isSubmitting = false }) {
  const navigate = useNavigate();
  const isBusy = loading || isSubmitting;
  const handleCancelClick = onCancel || (() => navigate('/admin/blogs'));

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    featuredImage: '',
    category: '',
    author: 'Yovexa Solutions',
    tags: '',
    status: 'DRAFT',
    publishedAt: new Date().toISOString().split('T')[0],
    seoTitle: '',
    seoDescription: '',
  });

  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSlugManual, setIsSlugManual] = useState(false);

  useEffect(() => {
    let isMounted = true;
    blogService.getCategories()
      .then(cats => {
        if (isMounted && Array.isArray(cats)) {
          const filtered = cats.filter(c => c.id !== 'all');
          setCategories(filtered);
          if (!initialData && filtered.length > 0) {
            setFormData(prev => ({
              ...prev,
              category: prev.category || filtered[0].id
            }));
          }
        }
      })
      .catch(err => console.error('Failed to load blog categories in BlogForm:', err));
    return () => { isMounted = false; };
  }, [initialData]);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        slug: initialData.slug || '',
        excerpt: initialData.excerpt || '',
        content: initialData.content || '',
        featuredImage: initialData.featuredImage || '',
        category: (function(cat) {
          if (!cat) return 'WEB_APPLICATIONS';
          const upper = cat.toUpperCase();
          const map = { 'WEB': 'WEB_APPLICATIONS', 'MOBILE': 'MOBILE_APPS', 'ECOMMERCE': 'E_COMMERCE' };
          return map[upper] || upper;
        })(initialData.category),
        author: initialData.author || 'Yovexa Solutions',
        tags: Array.isArray(initialData.tags) ? initialData.tags.join(', ') : initialData.tags || '',
        status: initialData.status || 'PUBLISHED',
        publishedAt: initialData.publishedAt || new Date().toISOString().split('T')[0],
        seoTitle: initialData.seoTitle || '',
        seoDescription: initialData.seoDescription || '',
      });
      setIsSlugManual(true);
    }
  }, [initialData]);

  const handleTitleChange = (e) => {
    const title = e.target.value;
    setFormData((prev) => ({
      ...prev,
      title,
      slug: isSlugManual ? prev.slug : generateSlug(title),
      seoTitle: prev.seoTitle === prev.title || !prev.seoTitle ? title : prev.seoTitle,
    }));
    if (errors.title) setErrors((prev) => ({ ...prev, title: null }));
  };

  const handleSlugChange = (e) => {
    setIsSlugManual(true);
    setFormData((prev) => ({ ...prev, slug: generateSlug(e.target.value) }));
    if (errors.slug) setErrors((prev) => ({ ...prev, slug: null }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleContentChange = (content) => {
    setFormData((prev) => ({ ...prev, content }));
    if (errors.content) setErrors((prev) => ({ ...prev, content: null }));
  };

  const handleImageChange = (featuredImage) => {
    setFormData((prev) => ({ ...prev, featuredImage }));
  };

  const validate = () => {
    const errs = {};
    if (!formData.title.trim()) errs.title = 'Title is required';
    if (!formData.slug.trim()) errs.slug = 'URL slug is required';
    if (!formData.excerpt.trim()) errs.excerpt = 'Short excerpt/description is required';
    if (!formData.content || formData.content.trim() === '' || formData.content === '<p></p>') {
      errs.content = 'Article content is required';
    }
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
          <span>Back to Articles</span>
        </button>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={handleCancelClick}
            className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl border border-[#CBD5E1] text-xs font-bold text-[#334155] hover:bg-[#F1F5F9] transition-colors"
          >
            Cancel
          </button>
          
          <button
            type="submit"
            disabled={isBusy}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold text-white bg-[#0EA5E9] hover:bg-[#0284C7] transition-all shadow-sm text-xs disabled:opacity-60"
          >
            {isBusy ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Article</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column (8 cols): Main Content Editor */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Title */}
          <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-sm space-y-4">
            <div>
              <label htmlFor="title" className="block text-xs font-extrabold text-[#0B1B3A] mb-1.5">
                Article Title <span className="text-[#0EA5E9]">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleTitleChange}
                placeholder="e.g. Building Scalable Web Applications"
                className={`w-full px-4 py-3 rounded-xl border text-base font-bold text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#0EA5E9] ${
                  errors.title ? 'border-rose-500' : 'border-[#CBD5E1]'
                }`}
              />
              {errors.title && (
                <p className="mt-1 text-xs text-rose-600 flex items-center gap-1 font-semibold">
                  <AlertCircle className="w-3.5 h-3.5" /> {errors.title}
                </p>
              )}
            </div>

            {/* Auto Generated Slug */}
            <div>
              <label htmlFor="slug" className="block text-xs font-extrabold text-[#0B1B3A] mb-1.5">
                URL Slug <span className="text-[#0EA5E9]">*</span>
              </label>
              <div className="flex items-center">
                <span className="px-3 py-2.5 bg-[#F1F5F9] border border-r-0 border-[#CBD5E1] rounded-l-xl text-xs text-[#64748B] font-mono">
                  /blog/
                </span>
                <input
                  type="text"
                  id="slug"
                  name="slug"
                  value={formData.slug}
                  onChange={handleSlugChange}
                  placeholder="building-scalable-web-applications"
                  className={`flex-1 px-4 py-2.5 rounded-r-xl border text-xs font-mono text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#0EA5E9] ${
                    errors.slug ? 'border-rose-500' : 'border-[#CBD5E1]'
                  }`}
                />
              </div>
              {errors.slug && (
                <p className="mt-1 text-xs text-rose-600 flex items-center gap-1 font-semibold">
                  <AlertCircle className="w-3.5 h-3.5" /> {errors.slug}
                </p>
              )}
            </div>

            {/* Short Description */}
            <div>
              <label htmlFor="excerpt" className="block text-xs font-extrabold text-[#0B1B3A] mb-1.5">
                Short Excerpt / Summary <span className="text-[#0EA5E9]">*</span>
              </label>
              <textarea
                id="excerpt"
                name="excerpt"
                rows={2}
                value={formData.excerpt}
                onChange={handleChange}
                placeholder="A concise 1-2 sentence overview of the article for blog cards and search engines..."
                className={`w-full px-4 py-2.5 rounded-xl border text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#0EA5E9] resize-none ${
                  errors.excerpt ? 'border-rose-500' : 'border-[#CBD5E1]'
                }`}
              />
              {errors.excerpt && (
                <p className="mt-1 text-xs text-rose-600 flex items-center gap-1 font-semibold">
                  <AlertCircle className="w-3.5 h-3.5" /> {errors.excerpt}
                </p>
              )}
            </div>
          </div>

          {/* Rich Content Editor */}
          <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-sm space-y-2">
            <label className="block text-xs font-extrabold text-[#0B1B3A]">
              Article Body Content <span className="text-[#0EA5E9]">*</span>
            </label>
            <BlogEditor
              value={formData.content}
              onChange={handleContentChange}
              placeholder="Write formatted article body with headings, bullet lists, bold text, quotes, code snippets..."
            />
            {errors.content && (
              <p className="mt-1 text-xs text-rose-600 flex items-center gap-1 font-semibold">
                <AlertCircle className="w-3.5 h-3.5" /> {errors.content}
              </p>
            )}
          </div>

          {/* SEO Metadata */}
          <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-[#E2E8F0]">
              <Globe className="w-4 h-4 text-[#0EA5E9]" />
              <h4 className="text-xs font-extrabold text-[#0B1B3A] uppercase tracking-wider">
                SEO & Open Graph Configuration
              </h4>
            </div>

            <div>
              <label htmlFor="seoTitle" className="block text-xs font-bold text-[#334155] mb-1">
                SEO Meta Title <span className="text-[#64748B] font-normal">(Defaults to article title)</span>
              </label>
              <input
                type="text"
                id="seoTitle"
                name="seoTitle"
                value={formData.seoTitle}
                onChange={handleChange}
                placeholder="Custom meta title for Google search"
                className="w-full px-4 py-2.5 rounded-xl border border-[#CBD5E1] text-xs text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]"
              />
            </div>

            <div>
              <label htmlFor="seoDescription" className="block text-xs font-bold text-[#334155] mb-1">
                SEO Meta Description <span className="text-[#64748B] font-normal">(Defaults to excerpt)</span>
              </label>
              <textarea
                id="seoDescription"
                name="seoDescription"
                rows={2}
                value={formData.seoDescription}
                onChange={handleChange}
                placeholder="Custom description for search engine result snippets..."
                className="w-full px-4 py-2 rounded-xl border border-[#CBD5E1] text-xs text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#0EA5E9] resize-none"
              />
            </div>
          </div>

        </div>

        {/* Right Column (4 cols): Metadata & Settings */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Status & Publication */}
          <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-sm space-y-4">
            <h4 className="text-xs font-extrabold text-[#0B1B3A] uppercase tracking-wider pb-2 border-b border-[#E2E8F0]">
              Publishing State
            </h4>

            <div>
              <label htmlFor="status" className="block text-xs font-bold text-[#334155] mb-1.5">
                Visibility Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-[#CBD5E1] text-xs font-bold text-[#0B1B3A] focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]"
              >
                <option value="PUBLISHED">Published (Visible Publicly)</option>
                <option value="DRAFT">Draft (Admin Only)</option>
              </select>
            </div>

            <div>
              <label htmlFor="publishedAt" className="block text-xs font-bold text-[#334155] mb-1.5">
                Publication Date
              </label>
              <input
                type="date"
                id="publishedAt"
                name="publishedAt"
                value={formData.publishedAt}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-[#CBD5E1] text-xs text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]"
              />
            </div>
          </div>

          {/* Featured Image */}
          <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-sm space-y-3">
            <h4 className="text-xs font-extrabold text-[#0B1B3A] uppercase tracking-wider pb-2 border-b border-[#E2E8F0]">
              Featured Image
            </h4>
            <ImageUploader
              value={formData.featuredImage}
              onChange={handleImageChange}
            />
          </div>

          {/* Categorization & Author */}
          <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-sm space-y-4">
            <h4 className="text-xs font-extrabold text-[#0B1B3A] uppercase tracking-wider pb-2 border-b border-[#E2E8F0]">
              Article Attributes
            </h4>

            <div>
              <label htmlFor="category" className="block text-xs font-bold text-[#334155] mb-1.5">
                Category
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-[#CBD5E1] text-xs font-semibold text-[#0B1B3A] focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="author" className="block text-xs font-bold text-[#334155] mb-1.5">
                Author
              </label>
              <input
                type="text"
                id="author"
                name="author"
                value={formData.author}
                onChange={handleChange}
                placeholder="e.g. Yovexa Solutions"
                className="w-full px-4 py-2.5 rounded-xl border border-[#CBD5E1] text-xs text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]"
              />
            </div>

            <div>
              <label htmlFor="tags" className="block text-xs font-bold text-[#334155] mb-1.5">
                Tags <span className="text-[#64748B] font-normal">(Comma separated)</span>
              </label>
              <input
                type="text"
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="React, Spring Boot, Architecture"
                className="w-full px-4 py-2.5 rounded-xl border border-[#CBD5E1] text-xs text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]"
              />
            </div>
          </div>

        </div>

      </div>
    </form>
  );
}
