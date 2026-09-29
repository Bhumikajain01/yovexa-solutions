import { api, extractData, extractListData } from './api';

export const heroService = {
  // Get all heroes (admin)
  async getHeroes() {
    try {
      const res = await api.get('/admin/content/hero');
      const list = extractListData(res);
      return Array.isArray(list) ? list : [];
    } catch (err) {
      console.error('Failed to fetch heroes:', err);
      return [];
    }
  },

  // Get single hero by id
  async getHeroById(id) {
    try {
      const res = await api.get(`/admin/content/hero/${id}`);
      return extractData(res) || null;
    } catch (err) {
      console.error('Failed to fetch hero by id:', err);
      return null;
    }
  },

  // Get active hero for public website
  async getActiveHero() {
    try {
      const res = await api.get('/content/hero/active');
      return extractData(res) || null;
    } catch (err) {
      console.error('Failed to fetch active hero:', err);
      return null;
    }
  },

  // Create new hero
  async createHero(data) {
    const payload = {
      ...data,
      badge: data.badge || data.eyebrow,
      eyebrow: data.badge || data.eyebrow,
      heading: data.heading || data.headline,
      headline: data.heading || data.headline,
      highlightedText: data.highlightedText || data.highlightedHeadline,
      highlightedHeadline: data.highlightedText || data.highlightedHeadline,
      primaryCtaText: data.primaryCtaText || data.primaryCtaLabel,
      primaryCtaLabel: data.primaryCtaText || data.primaryCtaLabel,
      secondaryCtaText: data.secondaryCtaText || data.secondaryCtaLabel,
      secondaryCtaLabel: data.secondaryCtaText || data.secondaryCtaLabel,
      status: data.status || 'DRAFT',
      isActive: Boolean(data.isActive),
    };

    const res = await api.post('/admin/content/hero', payload);
    return extractData(res, payload);
  },

  // Update existing hero
  async updateHero(id, data) {
    const payload = {
      ...data,
      badge: data.badge || data.eyebrow,
      eyebrow: data.badge || data.eyebrow,
      heading: data.heading || data.headline,
      headline: data.heading || data.headline,
      highlightedText: data.highlightedText || data.highlightedHeadline,
      highlightedHeadline: data.highlightedText || data.highlightedHeadline,
      primaryCtaText: data.primaryCtaText || data.primaryCtaLabel,
      primaryCtaLabel: data.primaryCtaText || data.primaryCtaLabel,
      secondaryCtaText: data.secondaryCtaText || data.secondaryCtaLabel,
      secondaryCtaLabel: data.secondaryCtaText || data.secondaryCtaLabel,
    };

    const res = await api.put(`/admin/content/hero/${id}`, payload);
    return extractData(res, payload);
  },

  // Delete hero
  async deleteHero(id) {
    await api.delete(`/admin/content/hero/${id}`);
    return true;
  },

  // Set active hero (deactivates others)
  async setActiveHero(id) {
    const hero = await this.getHeroById(id);
    if (!hero) throw new Error('Hero record not found');

    const updatedData = { ...hero, isActive: true, status: 'PUBLISHED' };
    const res = await api.put(`/admin/content/hero/${id}`, updatedData);
    return extractData(res, updatedData);
  }
};

export default heroService;
