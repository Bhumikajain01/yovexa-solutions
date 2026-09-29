import React, { useState, useEffect } from 'react';
import { Save, Phone, Mail, MapPin, Clock, Loader2, MessageSquare, Plus, Trash2, IndianRupee, RotateCcw } from 'lucide-react';
import { contentService } from '../../services/contentService';
import { useToast } from '../../context/ToastContext';

export default function AdminContactContentPage() {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    whatsapp: '',
    location: '',
    address: '',
    turnaroundTime: '',
    workingHours: '',
    heading: '',
    description: '',
    budgetOptions: [
      "Under ₹25,000",
      "₹25,000 – ₹50,000",
      "₹50,000 – ₹1,00,000",
      "₹1,00,000+",
      "Not Sure Yet"
    ],
  });

  useEffect(() => {
    const fetchContact = async () => {
      try {
        setLoading(true);
        const data = await contentService.getContactContent();
        if (data) {
          setFormData(prev => ({
            ...prev,
            ...data,
            budgetOptions: Array.isArray(data.budgetOptions) && data.budgetOptions.length > 0
              ? data.budgetOptions
              : prev.budgetOptions,
          }));
        }
      } catch (err) {
        console.error('Failed to load contact info:', err);
        showToast('Failed to load contact info', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchContact();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleBudgetChange = (index, value) => {
    setFormData(prev => {
      const updated = [...(prev.budgetOptions || [])];
      updated[index] = value;
      return { ...prev, budgetOptions: updated };
    });
  };

  const handleAddBudgetOption = () => {
    setFormData(prev => ({
      ...prev,
      budgetOptions: [...(prev.budgetOptions || []), '']
    }));
  };

  const handleRemoveBudgetOption = (index) => {
    setFormData(prev => ({
      ...prev,
      budgetOptions: (prev.budgetOptions || []).filter((_, i) => i !== index)
    }));
  };

  const handleResetBudgetDefaults = () => {
    setFormData(prev => ({
      ...prev,
      budgetOptions: [
        "Under ₹25,000",
        "₹25,000 – ₹50,000",
        "₹50,000 – ₹1,00,000",
        "₹1,00,000+",
        "Not Sure Yet"
      ]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const cleanedBudgetOptions = (formData.budgetOptions || [])
        .map(opt => typeof opt === 'string' ? opt.trim() : '')
        .filter(Boolean);

      await contentService.updateContactContent({
        ...formData,
        budgetOptions: cleanedBudgetOptions.length > 0 ? cleanedBudgetOptions : undefined,
      });
      showToast('Contact information & budget options saved successfully!', 'success');
    } catch (err) {
      console.error('Failed to update contact info:', err);
      showToast(err.message || 'Failed to save contact changes', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 text-[#0EA5E9] animate-spin" />
        <p className="text-sm font-semibold text-[#64748B]">Loading Contact editor...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#0EA5E9]/15 text-[#0284C7] text-xs font-bold uppercase tracking-wider mb-1">
            <Phone className="w-3.5 h-3.5" />
            <span>Singleton CMS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0B1B3A] tracking-tight">
            Contact Information & Section Copy
          </h1>
          <p className="text-sm text-[#475569] mt-0.5 font-medium">
            Manage company email, phone numbers, working schedule, and contact section headers.
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
              <span>Save Contact Info</span>
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Direct Contact Info (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white p-6 sm:p-7 rounded-2xl border border-[#E2E8F0] shadow-sm space-y-4">
            <h3 className="text-base font-bold text-[#0B1B3A] border-b border-[#E2E8F0] pb-3">
              Official Communication Channels
            </h3>

            <div>
              <label htmlFor="email" className="block text-xs font-extrabold text-[#0B1B3A] mb-1.5">
                Official Company Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="contact@yovexasolutions.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#CBD5E1] text-sm text-[#0F172A] font-semibold"
                />
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="block text-xs font-extrabold text-[#0B1B3A] mb-1.5">
                Phone Number / Call Line
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 (Contact Available on Inquiry)"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#CBD5E1] text-sm text-[#0F172A]"
                />
              </div>
            </div>

            <div>
              <label htmlFor="whatsapp" className="block text-xs font-extrabold text-[#0B1B3A] mb-1.5">
                WhatsApp Business Number
              </label>
              <div className="relative">
                <MessageSquare className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  id="whatsapp"
                  name="whatsapp"
                  value={formData.whatsapp}
                  onChange={handleChange}
                  placeholder="+91 9876543210"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#CBD5E1] text-sm text-[#0F172A]"
                />
              </div>
            </div>

            <div>
              <label htmlFor="location" className="block text-xs font-extrabold text-[#0B1B3A] mb-1.5">
                Primary Location Tag
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="India (Serving Clients Globally)"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#CBD5E1] text-sm text-[#0F172A]"
                />
              </div>
            </div>

            <div>
              <label htmlFor="turnaroundTime" className="block text-xs font-extrabold text-[#0B1B3A] mb-1.5">
                Turnaround Response Time
              </label>
              <div className="relative">
                <Clock className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  id="turnaroundTime"
                  name="turnaroundTime"
                  value={formData.turnaroundTime}
                  onChange={handleChange}
                  placeholder="Within 24 Hours"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#CBD5E1] text-sm text-[#0F172A]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Contact Section Copy (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white p-6 sm:p-7 rounded-2xl border border-[#E2E8F0] shadow-sm space-y-4">
            <h3 className="text-base font-bold text-[#0B1B3A] border-b border-[#E2E8F0] pb-3">
              Contact Section Copy on Homepage
            </h3>

            <div>
              <label htmlFor="heading" className="block text-xs font-extrabold text-[#0B1B3A] mb-1.5">
                Section Heading
              </label>
              <input
                type="text"
                id="heading"
                name="heading"
                value={formData.heading}
                onChange={handleChange}
                placeholder="Have an Idea? Let's Build It."
                className="w-full px-4 py-2.5 rounded-xl border border-[#CBD5E1] text-sm font-bold text-[#0F172A]"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-xs font-extrabold text-[#0B1B3A] mb-1.5">
                Section Supporting Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleChange}
                placeholder="Tell us what you're building..."
                className="w-full px-4 py-2.5 rounded-xl border border-[#CBD5E1] text-sm text-[#0F172A] resize-none"
              />
            </div>

            <div>
              <label htmlFor="workingHours" className="block text-xs font-extrabold text-[#0B1B3A] mb-1.5">
                Working Schedule & Timezone
              </label>
              <input
                type="text"
                id="workingHours"
                name="workingHours"
                value={formData.workingHours}
                onChange={handleChange}
                placeholder="Mon - Sat: 9:00 AM - 7:00 PM IST"
                className="w-full px-4 py-2.5 rounded-xl border border-[#CBD5E1] text-sm text-[#0F172A]"
              />
            </div>

            <div>
              <label htmlFor="address" className="block text-xs font-extrabold text-[#0B1B3A] mb-1.5">
                Office / Operational Hub
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Bangalore / Remote Global Hub"
                className="w-full px-4 py-2.5 rounded-xl border border-[#CBD5E1] text-sm text-[#0F172A]"
              />
            </div>
          </div>
        </div>

        {/* Full Width Row: Estimated Budget Options (Dynamic Inquiry Dropdown) */}
        <div className="lg:col-span-12 space-y-4">
          <div className="bg-white p-6 sm:p-7 rounded-2xl border border-[#E2E8F0] shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[#E2E8F0] pb-3">
              <div>
                <h3 className="text-base font-bold text-[#0B1B3A] flex items-center gap-2">
                  <IndianRupee className="w-4 h-4 text-[#0EA5E9]" />
                  Estimated Budget Options (Dynamic Contact Dropdown)
                </h3>
                <p className="text-xs text-[#64748B] mt-0.5">
                  Configure the options displayed in the "Estimated Budget" dropdown on the contact / inquiry form.
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleResetBudgetDefaults}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#64748B] hover:text-[#0B1B3A] bg-[#F1F5F9] hover:bg-[#E2E8F0] transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset Defaults
                </button>
                <button
                  type="button"
                  onClick={handleAddBudgetOption}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-[#0EA5E9] hover:bg-[#0284C7] transition-colors shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Option
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
              {formData.budgetOptions?.map((option, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-[#F8FAFC] p-2.5 rounded-xl border border-[#E2E8F0]">
                  <span className="text-xs font-bold text-[#64748B] pl-2 w-6">
                    {idx + 1}.
                  </span>
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => handleBudgetChange(idx, e.target.value)}
                    placeholder="e.g. ₹50,000 – ₹1,00,000"
                    className="flex-1 px-3 py-1.5 bg-white rounded-lg border border-[#CBD5E1] text-xs font-semibold text-[#0F172A] focus:outline-none focus:ring-1 focus:ring-[#0EA5E9]"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveBudgetOption(idx)}
                    title="Remove option"
                    className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 hover:text-rose-700 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            {(!formData.budgetOptions || formData.budgetOptions.length === 0) && (
              <p className="text-xs text-amber-600 font-medium italic">
                No budget options configured. Click "Reset Defaults" or "Add Option" above.
              </p>
            )}
          </div>
        </div>
      </div>
    </form>
  );
}
