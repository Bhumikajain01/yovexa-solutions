import { api, extractData, extractListData } from './api';

export const servicesService = {
  async getServices({ activeOnly = false } = {}) {
    try {
      const res = await api.get(activeOnly ? '/services' : '/admin/services');
      const list = extractListData(res);
      return list.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
    } catch (err) {
      console.error('Failed to fetch services:', err);
      return [];
    }
  },

  async getServiceById(id) {
    try {
      const res = await api.get(`/admin/services/${id}`);
      return extractData(res);
    } catch (err) {
      console.error('Failed to fetch service by id:', err);
      throw err;
    }
  },

  async createService(serviceData) {
    const payload = {
      ...serviceData,
      features: Array.isArray(serviceData.features) 
        ? serviceData.features 
        : typeof serviceData.features === 'string' 
          ? serviceData.features.split('\n').map(s => s.trim()).filter(Boolean) 
          : [],
    };

    const res = await api.post('/admin/services', payload);
    return extractData(res);
  },

  async updateService(id, serviceData) {
    const payload = {
      ...serviceData,
      features: Array.isArray(serviceData.features)
        ? serviceData.features
        : typeof serviceData.features === 'string'
          ? serviceData.features.split('\n').map(s => s.trim()).filter(Boolean)
          : serviceData.features,
    };

    const res = await api.put(`/admin/services/${id}`, payload);
    return extractData(res);
  },

  async deleteService(id) {
    await api.delete(`/admin/services/${id}`);
    return true;
  },

  async moveService(id, direction) {
    const list = await this.getServices({ activeOnly: false });
    const index = list.findIndex(s => s.id === id);
    if (index === -1) return list;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= list.length) return list;

    const current = list[index];
    const target = list[targetIndex];

    const currentOrder = current.displayOrder ?? (index + 1);
    const targetOrder = target.displayOrder ?? (targetIndex + 1);

    await Promise.all([
      this.updateService(current.id, { ...current, displayOrder: targetOrder }),
      this.updateService(target.id, { ...target, displayOrder: currentOrder })
    ]);

    return this.getServices({ activeOnly: false });
  }
};
