import React, { useState, useEffect } from 'react';
import {
  Plus,
  Briefcase,
  Edit2,
  Trash2,
  ArrowUp,
  ArrowDown,
  CheckCircle2,
  XCircle,
  Loader2,
  RefreshCw,
  X,
  Save
} from 'lucide-react';
import { servicesService } from '../../services/servicesService';
import { useToast } from '../../context/ToastContext';
import DeleteModal from '../../components/admin/DeleteModal';
import { generateSlug } from '../../services/blogService';
import DynamicIcon from '../../components/DynamicIcon';

export default function AdminServicesPage() {
  const { showToast } = useToast();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal editor state
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [saving, setSaving] = useState(false);

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Form State
  const [form, setForm] = useState({
    title: '',
    slug: '',
    shortDescription: '',
    description: '',
    icon: 'Globe',
    features: '',
    popularTag: '',
    isActive: true,
  });

  const loadServices = async () => {
    try {
      setLoading(true);
      const data = await servicesService.getServices({ activeOnly: false });
      setServices(data);
    } catch (err) {
      console.error('Failed to load services:', err);
      showToast('Failed to load services', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const openCreateModal = () => {
    setEditingService(null);
    setForm({
      title: '',
      slug: '',
      shortDescription: '',
      description: '',
      icon: 'Globe',
      features: '',
      popularTag: '',
      isActive: true,
    });
    setIsEditorOpen(true);
  };

  const openEditModal = (service) => {
    setEditingService(service);
    setForm({
      title: service.title || '',
      slug: service.slug || service.id || '',
      shortDescription: service.shortDescription || '',
      description: service.description || service.deliverables || '',
      icon: service.icon || 'Globe',
      features: Array.isArray(service.features) ? service.features.join('\n') : service.features || '',
      popularTag: service.popularTag || '',
      isActive: service.isActive !== false,
    });
    setIsEditorOpen(true);
  };

  const handleTitleChange = (e) => {
    const title = e.target.value;
    setForm(prev => ({
      ...prev,
      title,
      slug: editingService ? prev.slug : generateSlug(title),
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      showToast('Service title is required', 'error');
      return;
    }

    try {
      setSaving(true);
      if (editingService) {
        await servicesService.updateService(editingService.id, form);
        showToast(`Service "${form.title}" updated successfully.`, 'success');
      } else {
        await servicesService.createService(form);
        showToast(`Service "${form.title}" created successfully.`, 'success');
      }
      setIsEditorOpen(false);
      await loadServices();
    } catch (err) {
      console.error('Failed to save service:', err);
      showToast(err.message || 'Failed to save service', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      await servicesService.deleteService(deleteTarget.id);
      showToast(`Service "${deleteTarget.title}" deleted.`, 'success');
      setDeleteTarget(null);
      await loadServices();
    } catch (err) {
      showToast(err.message || 'Failed to delete service', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const handleMove = async (id, direction) => {
    try {
      const updated = await servicesService.moveService(id, direction);
      setServices([...updated]);
      showToast('Order updated', 'info');
    } catch (err) {
      console.error('Failed to reorder:', err);
    }
  };

  const handleToggleActive = async (service) => {
    try {
      await servicesService.updateService(service.id, { isActive: !service.isActive });
      showToast(`Service set to ${!service.isActive ? 'Active' : 'Inactive'}`, 'success');
      await loadServices();
    } catch (err) {
      showToast('Failed to update status', 'error');
    }
  };

  const iconOptions = [
    { name: 'Globe', label: 'Web & Global (Globe)' },
    { name: 'Smartphone', label: 'Mobile Apps (Smartphone)' },
    { name: 'Code2', label: 'Custom Software (Code)' },
    { name: 'Store', label: 'E-Commerce (Store)' },
    { name: 'ShoppingBag', label: 'E-Commerce (Shopping Bag)' },
    { name: 'ShoppingCart', label: 'E-Commerce (Cart)' },
    { name: 'Server', label: 'API & Backend (Server)' },
  ];

  return (
    <div className="space-y-6">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0B1B3A] tracking-tight">
            Services Management
          </h1>
          <p className="text-sm text-[#475569] mt-0.5 font-medium">
            Create, reorder, edit, and activate/deactivate core offerings for Yovexa Solutions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadServices}
            disabled={loading}
            className="p-2.5 rounded-xl border border-[#CBD5E1] bg-white hover:bg-[#F8FAFC] text-[#334155] transition-colors"
            title="Refresh Services"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#0EA5E9]' : ''}`} />
          </button>

          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0EA5E9] hover:bg-[#0284C7] text-white font-bold text-sm shadow-md shadow-[#0EA5E9]/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Service</span>
          </button>
        </div>
      </div>

      {/* Services Table / Cards */}
      {loading ? (
        <div className="min-h-[300px] flex flex-col items-center justify-center space-y-3 bg-white rounded-2xl border border-[#E2E8F0]">
          <Loader2 className="w-8 h-8 text-[#0EA5E9] animate-spin" />
          <p className="text-sm font-semibold text-[#64748B]">Loading services...</p>
        </div>
      ) : services.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-12 text-center">
          <Briefcase className="w-12 h-12 text-[#0EA5E9] mx-auto mb-3" />
          <h3 className="text-base font-bold text-[#0B1B3A]">No Services Created</h3>
          <p className="text-xs text-[#64748B] mt-1 max-w-sm mx-auto">
            Add your first technology service offering.
          </p>
          <button
            onClick={openCreateModal}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0B1B3A] text-white text-xs font-bold"
          >
            <Plus className="w-4 h-4" />
            <span>Create Service</span>
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[11px] font-extrabold uppercase tracking-wider text-[#64748B]">
                  <th className="py-3.5 px-4 text-center w-16">Order</th>
                  <th className="py-3.5 px-4 sm:px-6">Service Offering</th>
                  <th className="py-3.5 px-4 hidden md:table-cell">Features Preview</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0] text-sm text-[#334155]">
                {services.map((srv, idx) => (
                  <tr key={srv.id} className="hover:bg-[#F8FAFC] transition-colors">
                    {/* Reorder Buttons */}
                    <td className="py-4 px-2 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleMove(srv.id, 'up')}
                          disabled={idx === 0}
                          className="p-1 text-slate-400 hover:text-[#0EA5E9] disabled:opacity-20"
                          title="Move Up"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-xs font-mono font-bold text-[#64748B]">{srv.displayOrder || idx + 1}</span>
                        <button
                          type="button"
                          onClick={() => handleMove(srv.id, 'down')}
                          disabled={idx === services.length - 1}
                          className="p-1 text-slate-400 hover:text-[#0EA5E9] disabled:opacity-20"
                          title="Move Down"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                    {/* Title & Short Description */}
                    <td className="py-4 px-4 sm:px-6">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#E0F2FE] border border-[#BAE6FD] text-[#0284C7] flex items-center justify-center shrink-0 mt-0.5">
                          <DynamicIcon name={srv.icon || 'Globe'} className="w-4 h-4" />
                        </div>
                        <div className="max-w-md">
                          <div className="flex items-center gap-2 font-bold text-[#0B1B3A] text-sm">
                            <span>{srv.title}</span>
                            {srv.popularTag && (
                              <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded bg-[#E0F2FE] text-[#0369A1] border border-[#BAE6FD]">
                                {srv.popularTag}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-[#64748B] line-clamp-2 mt-1 leading-relaxed">
                            {srv.shortDescription}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Features Preview */}
                    <td className="py-4 px-4 hidden md:table-cell text-xs text-[#475569]">
                      <span className="font-semibold">
                        {Array.isArray(srv.features) ? `${srv.features.length} core features listed` : 'Features defined'}
                      </span>
                    </td>

                    {/* Status Active/Inactive */}
                    <td className="py-4 px-4">
                      <button
                        onClick={() => handleToggleActive(srv)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold transition-colors ${
                          srv.isActive !== false
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-slate-100 text-slate-500 border border-slate-200'
                        }`}
                      >
                        {srv.isActive !== false ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                            <span>Active</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3.5 h-3.5 text-slate-400" />
                            <span>Inactive</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 sm:px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(srv)}
                          className="p-2 rounded-lg text-[#64748B] hover:text-[#0B1B3A] hover:bg-[#F1F5F9] transition-colors"
                          title="Edit Service"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(srv)}
                          className="p-2 rounded-lg text-[#64748B] hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Delete Service"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create / Edit Service Modal */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#081A33]/75 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-2xl bg-white rounded-2xl p-6 sm:p-8 shadow-2xl border border-[#E2E8F0] max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsEditorOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-[#64748B] hover:text-[#0B1B3A] hover:bg-[#F1F5F9]"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-[#0B1B3A] font-display mb-1">
              {editingService ? `Edit Service: ${editingService.title}` : 'Add New Service Offering'}
            </h3>
            <p className="text-xs text-[#64748B] mb-6">
              Configure service copy, bullet features, deliverables, and display settings.
            </p>

            <form onSubmit={handleSave} className="space-y-4" noValidate>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold text-[#0B1B3A] mb-1">
                    Service Title <span className="text-[#0EA5E9]">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={handleTitleChange}
                    placeholder="e.g. Web Development"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#0EA5E9] font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-[#0B1B3A] mb-1">
                    URL Slug / ID
                  </label>
                  <input
                    type="text"
                    value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: generateSlug(e.target.value) })}
                    placeholder="web-development"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] text-xs font-mono text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold text-[#0B1B3A] mb-1">
                    Icon Identifier
                  </label>
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-[#0B1B3A] text-[#38BDF8] flex items-center justify-center shrink-0 shadow-sm border border-[#0B1B3A]">
                      <DynamicIcon name={form.icon || 'Globe'} className="w-5 h-5" />
                    </div>
                    <select
                      value={form.icon}
                      onChange={(e) => setForm({ ...form, icon: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] text-xs font-semibold text-[#0B1B3A] focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]"
                    >
                      {iconOptions.map(opt => (
                        <option key={opt.name} value={opt.name}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-[#0B1B3A] mb-1">
                    Popular Tag <span className="text-[#64748B] font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={form.popularTag}
                    onChange={(e) => setForm({ ...form, popularTag: e.target.value })}
                    placeholder="e.g. Most In-Demand"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] text-xs text-[#0F172A]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-[#0B1B3A] mb-1">
                  Short Description
                </label>
                <textarea
                  rows={2}
                  value={form.shortDescription}
                  onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
                  placeholder="Concise overview for public service card..."
                  className="w-full px-3.5 py-2 rounded-xl border border-[#CBD5E1] text-xs text-[#0F172A] resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-[#0B1B3A] mb-1">
                  Key Capabilities / Feature Bullets <span className="text-[#64748B] font-normal">(One per line)</span>
                </label>
                <textarea
                  rows={3}
                  value={form.features}
                  onChange={(e) => setForm({ ...form, features: e.target.value })}
                  placeholder="React & Next.js architecture&#10;PWA & Single-Page Apps&#10;High-speed SEO"
                  className="w-full px-3.5 py-2 rounded-xl border border-[#CBD5E1] text-xs font-mono text-[#0F172A] resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-[#0B1B3A] mb-1">
                  Deliverables Summary
                </label>
                <input
                  type="text"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="e.g. Custom responsive web apps, admin portals, client dashboards."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] text-xs text-[#0F172A]"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-[#0B1B3A]">
                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                    className="w-4 h-4 text-[#0EA5E9] rounded"
                  />
                  <span>Active & Visible on Public Website</span>
                </label>
              </div>

              <div className="mt-6 pt-4 border-t border-[#E2E8F0] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditorOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-[#CBD5E1] text-xs font-bold text-[#334155] hover:bg-[#F1F5F9]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#0EA5E9] hover:bg-[#0284C7] text-white font-bold text-xs shadow-sm disabled:opacity-60"
                >
                  {saving ? 'Saving...' : 'Save Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      <DeleteModal
        isOpen={Boolean(deleteTarget)}
        title={deleteTarget?.title}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
        isDeleting={deleting}
      />
    </div>
  );
}
