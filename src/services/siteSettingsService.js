import { api, extractData } from './api';

/**
 * Maps the flat social URL fields returned by the backend
 * (linkedin, github, instagram, facebook) into a
 * uniform socials array used by Footer and other UI components.
 *
 * Only social platforms that have a non-empty URL are included.
 */
const SOCIAL_PLATFORM_MAP = [
  { key: 'linkedin', name: 'LinkedIn' },
  { key: 'github', name: 'GitHub' },
  { key: 'instagram', name: 'Instagram' },
  { key: 'facebook', name: 'Facebook' },
];

function buildSocialsArray(data) {
  if (!data) return [];
  return SOCIAL_PLATFORM_MAP
    .filter(({ key }) => data[key] && typeof data[key] === 'string' && data[key].trim() !== '')
    .map(({ key, name }) => ({ name, href: data[key].trim() }));
}

export const siteSettingsService = {
  /**
   * Fetches the public site-settings singleton and returns it with a
   * pre-built `socials` array so callers don't need to know the shape
   * of the raw backend response.
   *
   * @returns {Promise<object|null>}
   */
  async getSettings() {
    try {
      const res = await api.get('/site-settings');
      const data = extractData(res);
      if (!data) return null;
      return {
        ...data,
        // Convenience aliases used by Footer and Contact components
        email: data.contactEmail || '',
        location: data.location || '',
        phone: data.phone || '',
        whatsapp: data.whatsapp || '',
        address: data.address || '',
        workingHours: data.workingHours || '',
        description: data.footerDescription || '',
        copyright: data.copyrightText || '',
        // Derived socials array — only platforms with a URL set in admin
        socials: buildSocialsArray(data),
      };
    } catch (err) {
      console.error('Failed to fetch site settings:', err);
      return null;
    }
  },
};

export default siteSettingsService;
