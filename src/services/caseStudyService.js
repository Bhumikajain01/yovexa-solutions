import { api, extractData, extractListData } from './api';
import { generateSlug } from './blogService';

export const caseStudyService = {
  async getCategories() {
    try {
      const res = await api.get('/case-studies/categories');
      const data = extractData(res);
      if (Array.isArray(data)) {
        return data;
      }
      return [];
    } catch (err) {
      console.warn('Failed to fetch case study categories from backend:', err);
      return [];
    }
  },

  async getCaseStudies({ category = 'all', publishedOnly = false, search = '' } = {}) {
    try {
      let endpoint;
      if (publishedOnly) {
        const params = new URLSearchParams();
        if (category && category.toLowerCase() !== 'all') params.append('category', category.toUpperCase());
        if (search) params.append('search', search);
        const query = params.toString();
        endpoint = query ? `/case-studies?${query}` : '/case-studies';
      } else {
        const params = new URLSearchParams();
        if (category && category.toLowerCase() !== 'all') params.append('category', category.toUpperCase());
        if (search) params.append('search', search);
        params.append('size', '100');
        const query = params.toString();
        endpoint = query ? `/admin/case-studies?${query}` : '/admin/case-studies';
      }

      const res = await api.get(endpoint);
      const list = extractListData(res);
      return list.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
    } catch (err) {
      console.error('Failed to fetch case studies:', err);
      return [];
    }
  },

  async getCaseStudyBySlug(slug) {
    try {
      const res = await api.get(`/case-studies/${slug}`);
      return extractData(res);
    } catch (err) {
      console.error('Failed to fetch case study by slug:', err);
      throw err;
    }
  },

  async getCaseStudyById(id) {
    try {
      const res = await api.get(`/admin/case-studies/${id}`);
      return extractData(res);
    } catch (err) {
      console.error('Failed to fetch case study by id:', err);
      throw err;
    }
  },

  async createCaseStudy(caseStudyData) {
    const title = caseStudyData.title || 'Untitled Case Study';
    const slug = caseStudyData.slug || generateSlug(title);

    const payload = {
      title,
      slug,
      subtitle: caseStudyData.subtitle || '',
      summary: caseStudyData.summary || '',
      projectReference: caseStudyData.projectReference || '',
      category: caseStudyData.category || 'WEB_APPLICATIONS',
      status: caseStudyData.status || 'PUBLISHED',
      clientLabel: caseStudyData.clientLabel || '',
      featured: Boolean(caseStudyData.featured),
      featuredImage: caseStudyData.featuredImage || '',
      problem: caseStudyData.problem || '',
      solution: caseStudyData.solution || '',
      features: Array.isArray(caseStudyData.features)
        ? caseStudyData.features
        : typeof caseStudyData.features === 'string'
          ? caseStudyData.features.split('\n').map(f => f.trim()).filter(Boolean)
          : [],
      technologies: Array.isArray(caseStudyData.technologies)
        ? caseStudyData.technologies
        : typeof caseStudyData.technologies === 'string'
          ? caseStudyData.technologies.split(',').map(t => t.trim()).filter(Boolean)
          : [],
      liveUrl: caseStudyData.liveUrl || '',
      githubUrl: caseStudyData.githubUrl || '',
      displayOrder: Number(caseStudyData.displayOrder) || 0,
      seoTitle: caseStudyData.seoTitle || '',
      seoDescription: caseStudyData.seoDescription || '',
    };

    const res = await api.post('/admin/case-studies', payload);
    return extractData(res);
  },

  async updateCaseStudy(id, caseStudyData) {
    const title = caseStudyData.title || '';
    const slug = caseStudyData.slug || (title ? generateSlug(title) : '');

    const payload = {
      ...caseStudyData,
      title,
      slug,
      features: Array.isArray(caseStudyData.features)
        ? caseStudyData.features
        : typeof caseStudyData.features === 'string'
          ? caseStudyData.features.split('\n').map(f => f.trim()).filter(Boolean)
          : [],
      technologies: Array.isArray(caseStudyData.technologies)
        ? caseStudyData.technologies
        : typeof caseStudyData.technologies === 'string'
          ? caseStudyData.technologies.split(',').map(t => t.trim()).filter(Boolean)
          : [],
      displayOrder: Number(caseStudyData.displayOrder) || 0,
    };

    const res = await api.put(`/admin/case-studies/${id}`, payload);
    return extractData(res);
  },

  async deleteCaseStudy(id) {
    await api.delete(`/admin/case-studies/${id}`);
    return true;
  }
};
