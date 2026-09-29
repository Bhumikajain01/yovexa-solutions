import { api, extractData, extractListData } from './api';

export const inquiryService = {
  async submitInquiry(inquiryData) {
    const payload = {
      fullName: inquiryData.fullName || inquiryData.name || '',
      email: inquiryData.email || '',
      phone: inquiryData.phone || '',
      companyName: inquiryData.companyName || inquiryData.company || '',
      service: inquiryData.service || inquiryData.serviceRequired || '',
      budget: inquiryData.budget || inquiryData.projectBudget || '',
      message: inquiryData.message || '',
    };

    const res = await api.post('/inquiries', payload);
    return extractData(res);
  },

  async getInquiries({ search = '', status = '', page = 0, size = 100 } = {}) {
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (status && status !== 'ALL') params.append('status', status);
      params.append('page', String(page));
      params.append('size', String(size));

      const res = await api.get(`/admin/inquiries?${params.toString()}`);
      return extractListData(res);
    } catch (err) {
      console.error('Failed to fetch inquiries:', err);
      return [];
    }
  },

  async getInquiryById(id) {
    try {
      const res = await api.get(`/admin/inquiries/${id}`);
      return extractData(res);
    } catch (err) {
      console.error('Failed to fetch inquiry by id:', err);
      throw err;
    }
  },

  async updateInquiryStatus(id, status) {
    const res = await api.put(`/admin/inquiries/${id}`, { status });
    return extractData(res);
  },

  async deleteInquiry(id) {
    await api.delete(`/admin/inquiries/${id}`);
    return true;
  }
};
