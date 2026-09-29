import { api, extractData, extractListData } from './api';
import { generateSlug } from './blogService';

export const projectService = {
  async getCategories() {
    try {
      const res = await api.get('/projects/categories');
      const data = extractData(res);
      if (Array.isArray(data)) {
        return data;
      }
      return [];
    } catch (err) {
      console.warn('Failed to fetch categories from backend:', err);
      return [];
    }
  },

  async getProjects({ category = 'all', publishedOnly = false, search = '' } = {}) {
    try {
      let endpoint;
      if (publishedOnly) {
        const params = new URLSearchParams();
        if (category && category.toLowerCase() !== 'all') params.append('category', category.toUpperCase());
        if (search) params.append('search', search);
        const query = params.toString();
        endpoint = query ? `/projects?${query}` : '/projects';
      } else {
        const params = new URLSearchParams();
        if (category && category.toLowerCase() !== 'all') params.append('category', category.toUpperCase());
        if (search) params.append('search', search);
        params.append('size', '100');
        const query = params.toString();
        endpoint = query ? `/admin/projects?${query}` : '/admin/projects';
      }

      const res = await api.get(endpoint);
      const list = extractListData(res);
      return list.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
    } catch (err) {
      console.error('Failed to fetch projects:', err);
      return [];
    }
  },

  async getProjectBySlug(slug) {
    try {
      const res = await api.get(`/projects/${slug}`);
      return extractData(res);
    } catch (err) {
      console.error('Failed to fetch project by slug:', err);
      throw err;
    }
  },

  async getProjectById(id) {
    try {
      const res = await api.get(`/admin/projects/${id}`);
      return extractData(res);
    } catch (err) {
      console.error('Failed to fetch project by id:', err);
      throw err;
    }
  },

  async createProject(projectData) {
    const title = projectData.name || projectData.projectName || projectData.title || 'Untitled Project';
    const slug = projectData.slug || generateSlug(title);

    const payload = {
      name: title,
      title,
      projectName: title,
      slug,
      subtitle: projectData.subtitle || '',
      clientLabel: projectData.clientLabel || '',
      shortDescription: projectData.shortDescription || projectData.summary || '',
      summary: projectData.shortDescription || projectData.summary || '',
      description: projectData.description || projectData.solution || projectData.fullDescription || projectData.shortDescription || projectData.summary || '',
      solution: projectData.description || projectData.solution || projectData.fullDescription || projectData.shortDescription || projectData.summary || '',
      category: projectData.category || 'WEB_APPLICATIONS',
      projectType: projectData.projectType || 'Web Application',
      featuredImage: projectData.featuredImage || projectData.thumbnailUrl || projectData.image || '',
      thumbnailUrl: projectData.featuredImage || projectData.thumbnailUrl || projectData.image || '',
      technologies: Array.isArray(projectData.technologies)
        ? projectData.technologies
        : typeof projectData.technologies === 'string'
          ? projectData.technologies.split(',').map(t => t.trim()).filter(Boolean)
          : [],
      projectUrl: projectData.projectUrl || '',
      githubUrl: projectData.githubUrl || '',
      caseStudyUrl: projectData.caseStudyUrl || '',
      status: projectData.status || 'PUBLISHED',
      featured: Boolean(projectData.featured),
      displayOrder: Number(projectData.displayOrder) || 0,
      seoTitle: projectData.seoTitle || '',
      seoDescription: projectData.seoDescription || '',
    };

    const res = await api.post('/admin/projects', payload);
    return extractData(res);
  },

  async updateProject(id, projectData) {
    const title = projectData.name || projectData.projectName || projectData.title || '';
    const slug = projectData.slug || (title ? generateSlug(title) : '');

    const payload = {
      name: title,
      title,
      projectName: title,
      slug,
      subtitle: projectData.subtitle || '',
      clientLabel: projectData.clientLabel || '',
      shortDescription: projectData.shortDescription || projectData.summary || '',
      summary: projectData.shortDescription || projectData.summary || '',
      description: projectData.description || projectData.solution || projectData.fullDescription || projectData.shortDescription || projectData.summary || '',
      solution: projectData.description || projectData.solution || projectData.fullDescription || projectData.shortDescription || projectData.summary || '',
      category: projectData.category,
      projectType: projectData.projectType,
      featuredImage: projectData.featuredImage || projectData.thumbnailUrl || projectData.image,
      thumbnailUrl: projectData.featuredImage || projectData.thumbnailUrl || projectData.image,
      technologies: Array.isArray(projectData.technologies)
        ? projectData.technologies
        : typeof projectData.technologies === 'string'
          ? projectData.technologies.split(',').map(t => t.trim()).filter(Boolean)
          : projectData.technologies,
      projectUrl: projectData.projectUrl,
      githubUrl: projectData.githubUrl,
      caseStudyUrl: projectData.caseStudyUrl,
      status: projectData.status,
      featured: Boolean(projectData.featured),
      displayOrder: Number(projectData.displayOrder) || 0,
      seoTitle: projectData.seoTitle,
      seoDescription: projectData.seoDescription,
    };

    const res = await api.put(`/admin/projects/${id}`, payload);
    return extractData(res);
  },

  async deleteProject(id) {
    await api.delete(`/admin/projects/${id}`);
    return true;
  }
};
