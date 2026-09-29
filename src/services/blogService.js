import { api, extractData, extractListData } from './api';

// Calculate reading time from text content
export function calculateReadingTime(text = '') {
  const plainText = text.replace(/<[^>]*>/g, ' ').trim();
  const words = plainText.split(/\s+/).filter(Boolean).length;
  const minutes = Math.ceil(words / 200) || 1;
  return `${minutes} min read`;
}

// Auto-generate URL-friendly slug
export function generateSlug(text = '') {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function formatPublishedAt(status, publishedAt) {
  if (status !== 'PUBLISHED') return null;
  if (!publishedAt) return new Date().toISOString();
  try {
    const d = new Date(publishedAt);
    return isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
  } catch {
    return new Date().toISOString();
  }
}

export const blogService = {
  // Public: Get dynamic blog categories
  async getCategories() {
    try {
      const res = await api.get('/blogs/categories');
      const data = extractData(res);
      if (Array.isArray(data)) {
        return data;
      }
      return [];
    } catch (err) {
      console.warn('Failed to fetch blog categories from backend:', err);
      return [];
    }
  },

  // Public: Get all published blogs with optional search/category filter
  async getPublicBlogs({ search = '', category = 'all' } = {}) {
    try {
      const queryParams = new URLSearchParams();
      if (search) queryParams.append('search', search);
      if (category && category !== 'all') queryParams.append('category', category);
      
      const queryStr = queryParams.toString() ? `?${queryParams.toString()}` : '';
      const response = await api.get(`/blogs${queryStr}`);
      return extractListData(response);
    } catch (err) {
      console.error('Failed to fetch public blogs:', err);
      return [];
    }
  },

  // Public: Get single blog by slug (must be PUBLISHED)
  async getBlogBySlug(slug) {
    try {
      const response = await api.get(`/blogs/${slug}`);
      return extractData(response);
    } catch (err) {
      console.error('Failed to fetch blog by slug:', err);
      throw err;
    }
  },

  // Admin: Get all blogs (both Draft and Published)
  async getAdminBlogs({ search = '', category = '', status = '', page = 0, size = 100 } = {}) {
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (category && category !== 'all') params.append('category', category);
      if (status && status !== 'ALL') params.append('status', status);
      params.append('page', String(page));
      params.append('size', String(size));

      const response = await api.get(`/admin/blogs?${params.toString()}`);
      return extractListData(response);
    } catch (err) {
      console.error('Failed to fetch admin blogs:', err);
      return [];
    }
  },

  // Admin: Get single blog by ID for editing
  async getAdminBlogById(id) {
    try {
      const response = await api.get(`/admin/blogs/${id}`);
      return extractData(response);
    } catch (err) {
      console.error('Failed to fetch admin blog by id:', err);
      throw err;
    }
  },

  // Admin: Create new blog
  async createBlog(data) {
    const slug = data.slug?.trim() || generateSlug(data.title);
    const readingTime = calculateReadingTime(data.content);
    const tags = Array.isArray(data.tags)
      ? data.tags
      : data.tags
        ? data.tags.split(',').map((t) => t.trim()).filter(Boolean)
        : [];

    const payload = {
      title: data.title?.trim(),
      slug,
      excerpt: data.excerpt?.trim(),
      content: data.content,
      featuredImage: data.featuredImage || '',
      category: data.category || 'General',
      author: data.author?.trim() || 'Yovexa Solutions',
      tags,
      status: data.status || 'DRAFT',
      readingTime,
      publishedAt: formatPublishedAt(data.status, data.publishedAt),
      seoTitle: data.seoTitle?.trim() || data.title?.trim(),
      seoDescription: data.seoDescription?.trim() || data.excerpt?.trim(),
    };

    const response = await api.post('/admin/blogs', payload);
    return extractData(response);
  },

  // Admin: Update blog
  async updateBlog(id, data) {
    const readingTime = calculateReadingTime(data.content);
    const tags = Array.isArray(data.tags)
      ? data.tags
      : data.tags
        ? data.tags.split(',').map((t) => t.trim()).filter(Boolean)
        : data.tags;

    const payload = {
      title: data.title?.trim(),
      slug: data.slug?.trim() || (data.title ? generateSlug(data.title) : undefined),
      excerpt: data.excerpt?.trim(),
      content: data.content,
      featuredImage: data.featuredImage,
      category: data.category,
      author: data.author?.trim(),
      tags,
      status: data.status,
      readingTime,
      publishedAt: formatPublishedAt(data.status, data.publishedAt),
      seoTitle: data.seoTitle?.trim() || data.title?.trim(),
      seoDescription: data.seoDescription?.trim() || data.excerpt?.trim(),
    };

    const response = await api.put(`/admin/blogs/${id}`, payload);
    return extractData(response);
  },

  // Admin: Delete blog
  async deleteBlog(id) {
    await api.delete(`/admin/blogs/${id}`);
    return { success: true, message: 'Blog deleted successfully' };
  },

  // Admin: Dashboard stats summary
  async getAdminStats() {
    try {
      const response = await api.get('/admin/dashboard');
      return extractData(response);
    } catch (err) {
      console.error('Failed to fetch admin stats:', err);
      return {
        totalBlogs: 0,
        publishedBlogs: 0,
        draftBlogs: 0,
        recentBlogs: [],
      };
    }
  },
};
