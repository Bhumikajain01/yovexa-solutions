import { api, extractData, extractListData } from './api';

function normalizeAbout(a) {
  if (!a) return null;
  return {
    ...a,
    sectionLabel: a.sectionLabel || a.eyebrow || a.badge || '',
    eyebrow: a.sectionLabel || a.eyebrow || a.badge || '',
    title: a.title || '',
    titleHighlight: a.titleHighlight || a.highlightedTitle || '',
    highlightedTitle: a.titleHighlight || a.highlightedTitle || '',
    description: a.description || a.primaryParagraph || '',
    primaryParagraph: a.description || a.primaryParagraph || '',
    additionalDescription: a.additionalDescription || a.secondaryParagraph || '',
    secondaryParagraph: a.additionalDescription || a.secondaryParagraph || '',
    primaryCtaText: a.primaryCtaText || a.primaryButtonLabel || '',
    primaryButtonLabel: a.primaryCtaText || a.primaryButtonLabel || '',
    primaryCtaLink: a.primaryCtaLink || a.primaryButtonLink || '',
    primaryButtonLink: a.primaryCtaLink || a.primaryButtonLink || '',
    secondaryCtaText: a.secondaryCtaText || a.secondaryButtonLabel || '',
    secondaryButtonLabel: a.secondaryCtaText || a.secondaryButtonLabel || '',
    secondaryCtaLink: a.secondaryCtaLink || a.secondaryButtonLink || '',
    secondaryButtonLink: a.secondaryCtaLink || a.secondaryButtonLink || '',
    image: a.image || '',
    imageAlt: a.imageAlt || '',
    imageCategory: a.imageCategory || '',
    imageTitle: a.imageTitle || '',
    imageBadge: a.imageBadge || '',
    highlights: Array.isArray(a.highlights) ? a.highlights : [],
  };
}

export const aboutService = {
  // Get all about records (admin)
  async getAbouts() {
    try {
      const res = await api.get('/admin/content/about');
      const list = extractListData(res);
      return Array.isArray(list) ? list.map(normalizeAbout) : [];
    } catch (err) {
      console.error('Failed to fetch about records:', err);
      return [];
    }
  },

  // Get single about record by id
  async getAboutById(id) {
    try {
      const res = await api.get(`/admin/content/about/${id}`);
      const data = extractData(res);
      return data ? normalizeAbout(data) : null;
    } catch (err) {
      console.error('Failed to fetch about record by id:', err);
      return null;
    }
  },

  // Get active about for public homepage
  async getActiveAbout() {
    try {
      const res = await api.get('/content/about/active');
      const data = extractData(res);
      return data ? normalizeAbout(data) : null;
    } catch (err) {
      console.error('Failed to fetch active about:', err);
      return null;
    }
  },

  // Create new about record
  async createAbout(data) {
    const payload = {
      ...data,
      eyebrow: data.sectionLabel || data.eyebrow || data.badge,
      title: data.title,
      highlightedTitle: data.titleHighlight || data.highlightedTitle,
      primaryParagraph: data.description || data.primaryParagraph,
      secondaryParagraph: data.additionalDescription || data.secondaryParagraph,
      primaryButtonLabel: data.primaryCtaText || data.primaryButtonLabel,
      primaryButtonLink: data.primaryCtaLink || data.primaryButtonLink,
      secondaryButtonLabel: data.secondaryCtaText || data.secondaryButtonLabel,
      secondaryButtonLink: data.secondaryCtaLink || data.secondaryButtonLink,
      image: data.image || '',
      imageAlt: data.imageAlt || '',
      imageCategory: data.imageCategory || '',
      imageTitle: data.imageTitle || '',
      imageBadge: data.imageBadge || '',
      highlights: Array.isArray(data.highlights) ? data.highlights : [],
      status: data.status || 'DRAFT',
      isActive: Boolean(data.isActive),
    };

    const res = await api.post('/admin/content/about', payload);
    return normalizeAbout(extractData(res, payload));
  },

  // Update existing about record
  async updateAbout(id, data) {
    const payload = {
      ...data,
      eyebrow: data.sectionLabel || data.eyebrow || data.badge,
      title: data.title,
      highlightedTitle: data.titleHighlight || data.highlightedTitle,
      primaryParagraph: data.description || data.primaryParagraph,
      secondaryParagraph: data.additionalDescription || data.secondaryParagraph,
      primaryButtonLabel: data.primaryCtaText || data.primaryButtonLabel,
      primaryButtonLink: data.primaryCtaLink || data.primaryButtonLink,
      secondaryButtonLabel: data.secondaryCtaText || data.secondaryButtonLabel,
      secondaryButtonLink: data.secondaryCtaLink || data.secondaryButtonLink,
      image: data.image || '',
      imageAlt: data.imageAlt || '',
      imageCategory: data.imageCategory || '',
      imageTitle: data.imageTitle || '',
      imageBadge: data.imageBadge || '',
      highlights: Array.isArray(data.highlights) ? data.highlights : [],
    };

    const res = await api.put(`/admin/content/about/${id}`, payload);
    return normalizeAbout(extractData(res, payload));
  },

  // Delete about record
  async deleteAbout(id) {
    await api.delete(`/admin/content/about/${id}`);
    return true;
  },

  // Set active about record (deactivates others)
  async setActiveAbout(id) {
    const about = await this.getAboutById(id);
    if (!about) throw new Error('About record not found');

    const updatedData = { ...about, isActive: true, status: 'PUBLISHED' };
    const res = await api.put(`/admin/content/about/${id}`, updatedData);
    return normalizeAbout(extractData(res, updatedData));
  }
};

export default aboutService;
