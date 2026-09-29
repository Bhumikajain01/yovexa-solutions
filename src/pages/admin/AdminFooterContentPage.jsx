import React, { useState, useEffect } from 'react';
import { Save, LayoutTemplate, Loader2 } from 'lucide-react';
import { siteSettingsService } from '../../services/siteSettingsService';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';

const SOCIAL_PLATFORMS = [
  { key: 'linkedin',  label: 'LinkedIn',   placeholder: 'https://linkedin.com/in/yourprofile' },
  { key: 'github',    label: 'GitHub',     placeholder: 'https://github.com/yourorg' },
  { key: 'instagram', label: 'Instagram',  placeholder: 'https://instagram.com/yourhandle' },
  { key: 'facebook',  label: 'Facebook',   placeholder: 'https://facebook.com/yourpage' },
];

const EMPTY_FORM = {
  contactEmail: '',
  phone: '',
  whatsapp: '',
  location: '',
  address: '',
  workingHours: '',
  footerDescription: '',
  copyrightText: '',
  linkedin: '',
  github: '',
  instagram: '',
  facebook: '',
};

export default function AdminFooterContentPage() {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState(EMPTY_FORM);

  useEffect(() => {
    siteSettingsService.getSettings()
      .then(data => {
        if (data) {
          setFormData({
            contactEmail:      data.contactEmail      || '',
            phone:             data.phone             || '',
            whatsapp:          data.whatsapp          || '',
            location:          data.location          || '',
            address:           data.address           || '',
            workingHours:      data.workingHours      || '',
            footerDescription: data.footerDescription || '',
            copyrightText:     data.copyrightText     || '',
            linkedin:          data.linkedin          || '',
            github:            data.github            || '',
            instagram:         data.instagram         || '',
            facebook:          data.facebook          || '',
          });
        }
      })
      .catch(err => {
        console.error('Failed to load site settings:', err);
        showToast('Failed to load settings', 'error');
      })
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await api.put('/admin/site-settings', formData);
      showToast('Footer & social settings saved!', 'success');
    } catch (err) {
      console.error('Failed to save settings:', err);
      showToast(err.message || 'Failed to save settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 text-[#0EA5E9] animate-spin" />
        <p className="text-sm font-semibold text-[#64748B]">Loading settings...</p>
      </div>
    );
  }

  const FIELDS = [
    { id: 'footerDescription', label: 'Footer Brand Summary', type: 'textarea', placeholder: 'Building practical, scalable digital solutions...' },
    { id: 'copyrightText',     label: 'Copyright Notice',     type: 'text',     placeholder: 'All rights reserved.' },
    { id: 'contactEmail',      label: 'Contact Email',        type: 'email',    placeholder: 'hello@yovexa.com' },
    { id: 'phone',             label: 'Phone',                type: 'text',     placeholder: '+91 XXXXX XXXXX' },
    { id: 'whatsapp',          label: 'WhatsApp',             type: 'text',     placeholder: '+91 XXXXX XXXXX' },
    { id: 'location',          label: 'Location / City',      type: 'text',     placeholder: 'Jaipur, Rajasthan, India' },
    { id: 'address',           label: 'Full Address',         type: 'text',     placeholder: 'Street, City, State, PIN' },
    { id: 'workingHours',      label: 'Working Hours',        type: 'text',     placeholder: 'Mon-Fri, 9am-6pm IST' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#0EA5E9]/15 text-[#0284C7] text-xs font-bold uppercase tracking-wider mb-1">
            <LayoutTemplate className="w-3.5 h-3.5" />
            <span>Singleton CMS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0B1B3A] tracking-tight">
            Footer &amp; Social Links
          </h1>
          <p className="text-sm text-[#475569] mt-0.5 font-medium">
            Manage contact info, footer copy, and social media URLs. Leave a social URL blank to hide that icon.
          </p>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-white bg-[#0EA5E9] hover:bg-[#0284C7] transition-all shadow-md text-sm disabled:opacity-60 shrink-0"
        >
          {saving ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save Settings</span>
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white p-6 sm:p-7 rounded-2xl border border-[#E2E8F0] shadow-sm space-y-4">
            <h3 className="text-base font-bold text-[#0B1B3A] border-b border-[#E2E8F0] pb-3">
              Contact &amp; Footer Copy
            </h3>
            {FIELDS.map(field => (
              <div key={field.id}>
                <label htmlFor={field.id} className="block text-xs font-extrabold text-[#0B1B3A] mb-1.5">
                  {field.label}
                </label>
                {field.type === 'textarea' ? (
                  <textarea
                    id={field.id}
                    name={field.id}
                    rows={3}
                    value={formData[field.id]}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#CBD5E1] text-sm text-[#0F172A] resize-none focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]/40"
                  />
                ) : (
                  <input
                    type={field.type}
                    id={field.id}
                    name={field.id}
                    value={formData[field.id]}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#CBD5E1] text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]/40"
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white p-6 sm:p-7 rounded-2xl border border-[#E2E8F0] shadow-sm space-y-4">
            <h3 className="text-base font-bold text-[#0B1B3A] border-b border-[#E2E8F0] pb-3">
              Social Media Links
            </h3>
            <p className="text-xs text-[#64748B]">
              Only platforms with a URL will show as icons in the public footer.
            </p>
            {SOCIAL_PLATFORMS.map(({ key, label, placeholder }) => (
              <div key={key}>
                <label htmlFor={key} className="block text-xs font-extrabold text-[#0B1B3A] mb-1.5">
                  {label}
                </label>
                <input
                  type="url"
                  id={key}
                  name={key}
                  value={formData[key]}
                  onChange={handleChange}
                  placeholder={placeholder}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#CBD5E1] text-sm font-mono text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]/40"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </form>
  );
}
