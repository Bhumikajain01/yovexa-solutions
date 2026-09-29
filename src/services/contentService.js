import { api, extractData } from './api';
import { heroService } from './heroService';
import { aboutService } from './aboutService';

export const contentService = {
  // HERO (Delegates to heroService)
  async getHeroContent() {
    return heroService.getActiveHero();
  },

  async updateHeroContent(heroData) {
    const active = await heroService.getActiveHero();
    if (active && active.id) {
      return heroService.updateHero(active.id, heroData);
    }
    return heroService.createHero({ ...heroData, isActive: true, status: 'PUBLISHED' });
  },

  // ABOUT (Delegates to aboutService)
  async getAboutContent() {
    return aboutService.getActiveAbout();
  },

  async updateAboutContent(aboutData) {
    const active = await aboutService.getActiveAbout();
    if (active && active.id) {
      return aboutService.updateAbout(active.id, aboutData);
    }
    return aboutService.createAbout({ ...aboutData, isActive: true, status: 'PUBLISHED' });
  },

  // CONTACT
  async getContactContent() {
    try {
      const res = await api.get('/content/contact');
      const data = extractData(res);
      if (!data) return null;
      return {
        ...data,
        email: data.contactEmail || data.email || '',
        phone: data.phone || '',
        whatsapp: data.whatsapp || '',
        location: data.location || '',
        address: data.address || '',
        workingHours: data.workingHours || '',
        turnaroundTime: data.turnaroundTime || '',
        heading: data.heading || '',
        description: data.description || '',
        budgetOptions: Array.isArray(data.budgetOptions) && data.budgetOptions.length > 0
          ? data.budgetOptions
          : [
              "Under ₹25,000",
              "₹25,000 – ₹50,000",
              "₹50,000 – ₹1,00,000",
              "₹1,00,000+",
              "Not Sure Yet"
            ],
      };
    } catch (err) {
      console.error('Failed to fetch contact content:', err);
      return null;
    }
  },

  async getBudgetOptions() {
    try {
      const res = await api.get('/content/budget-options');
      const data = extractData(res);
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
    } catch (err) {
      console.warn('Fallback to contact content for budget options', err);
    }
    const contact = await this.getContactContent();
    return contact?.budgetOptions || [
      "Under ₹25,000",
      "₹25,000 – ₹50,000",
      "₹50,000 – ₹1,00,000",
      "₹1,00,000+",
      "Not Sure Yet"
    ];
  },

  async updateContactContent(contactData) {
    try {
      const payload = {
        ...contactData,
        contactEmail: contactData.email || contactData.contactEmail,
        budgetOptions: contactData.budgetOptions,
      };
      const res = await api.put('/admin/content/contact', payload);
      return extractData(res);
    } catch (err) {
      console.error('Failed to update contact content:', err);
      throw err;
    }
  },

  // FOOTER
  async getFooterContent() {
    try {
      const res = await api.get('/content/footer');
      const data = extractData(res);
      if (!data) return null;
      return {
        ...data,
        description: data.footerDescription || data.description || '',
        email: data.contactEmail || data.email || '',
        phone: data.phone || '',
        location: data.location || '',
        copyright: data.copyrightText || data.copyright || '',
        socials: Array.isArray(data.socials) ? data.socials : [],
      };
    } catch (err) {
      console.error('Failed to fetch footer content:', err);
      return null;
    }
  },

  async updateFooterContent(footerData) {
    try {
      const payload = {
        ...footerData,
        footerDescription: footerData.description || footerData.footerDescription,
        copyrightText: footerData.copyright || footerData.copyrightText,
        contactEmail: footerData.email || footerData.contactEmail,
      };
      const res = await api.put('/admin/content/footer', payload);
      return extractData(res);
    } catch (err) {
      console.error('Failed to update footer content:', err);
      throw err;
    }
  },
};

export { heroService, aboutService };
export default contentService;
