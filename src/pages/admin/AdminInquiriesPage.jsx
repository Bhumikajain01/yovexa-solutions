import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Search,
  Filter,
  Eye,
  Trash2,
  Mail,
  Phone,
  Building,
  Calendar,
  CheckCircle2,
  Clock,
  RefreshCw,
  Loader2,
  X,
  Send
} from 'lucide-react';
import { inquiryService } from '../../services/inquiryService';
import { useToast } from '../../context/ToastContext';
import DeleteModal from '../../components/admin/DeleteModal';

export default function AdminInquiriesPage() {
  const { showToast } = useToast();
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // View modal state
  const [selectedInquiry, setSelectedInquiry] = useState(null);

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadInquiries = async () => {
    try {
      setLoading(true);
      const data = await inquiryService.getInquiries();
      setInquiries(data);
    } catch (err) {
      console.error('Failed to load inquiries:', err);
      showToast('Failed to load inquiries', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInquiries();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await inquiryService.updateInquiryStatus(id, newStatus);
      showToast(`Status updated to ${newStatus}`, 'success');
      await loadInquiries();
      if (selectedInquiry && selectedInquiry.id === id) {
        setSelectedInquiry(prev => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      showToast('Failed to update status', 'error');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      await inquiryService.deleteInquiry(deleteTarget.id);
      showToast('Inquiry deleted successfully.', 'success');
      setDeleteTarget(null);
      if (selectedInquiry?.id === deleteTarget.id) {
        setSelectedInquiry(null);
      }
      await loadInquiries();
    } catch (err) {
      showToast('Failed to delete inquiry', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const filteredInquiries = inquiries.filter(inq => {
    const name = inq.fullName || inq.name || '';
    const email = inq.email || '';
    const company = inq.company || '';
    const message = inq.message || '';
    const matchesSearch = 
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || inq.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'NEW':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-sky-50 text-sky-700 border border-sky-200">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-ping" />
            New
          </span>
        );
      case 'CONTACTED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3.5 h-3.5" />
            Contacted
          </span>
        );
      case 'IN_PROGRESS':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
            In Progress
          </span>
        );
      case 'CLOSED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" />
            Closed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-slate-100 text-slate-700">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0B1B3A] tracking-tight">
            Client Inquiries & Leads
          </h1>
          <p className="text-sm text-[#475569] mt-0.5 font-medium">
            Review contact form submissions, manage communication status, and follow up.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadInquiries}
            disabled={loading}
            className="p-2.5 rounded-xl border border-[#CBD5E1] bg-white hover:bg-[#F8FAFC] text-[#334155] transition-colors"
            title="Refresh Inquiries"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#0EA5E9]' : ''}`} />
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by client name, email, company..."
            className="w-full pl-10 pr-4 py-2 text-sm bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-[#0B1B3A] placeholder-[#94A3B8] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#64748B]" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="py-2 px-3 text-sm bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-[#0B1B3A] font-semibold focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]"
            >
              <option value="ALL">All Statuses</option>
              <option value="NEW">New Inquiries</option>
              <option value="CONTACTED">Contacted</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="CLOSED">Closed</option>
            </select>
          </div>

          {(searchTerm || statusFilter !== 'ALL') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('ALL');
              }}
              className="text-xs font-bold text-[#0EA5E9] hover:underline px-2"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Inquiries Table */}
      {loading ? (
        <div className="min-h-[300px] flex flex-col items-center justify-center space-y-3 bg-white rounded-2xl border border-[#E2E8F0]">
          <Loader2 className="w-8 h-8 text-[#0EA5E9] animate-spin" />
          <p className="text-sm font-semibold text-[#64748B]">Loading inquiries...</p>
        </div>
      ) : filteredInquiries.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-12 text-center">
          <MessageSquare className="w-12 h-12 text-[#0EA5E9] mx-auto mb-3" />
          <h3 className="text-base font-bold text-[#0B1B3A]">No Inquiries Found</h3>
          <p className="text-xs text-[#64748B] mt-1 max-w-sm mx-auto">
            New contact submissions from the public website will automatically appear here.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[11px] font-extrabold uppercase tracking-wider text-[#64748B]">
                  <th className="py-3.5 px-4 sm:px-6">Contact / Lead</th>
                  <th className="py-3.5 px-4 hidden md:table-cell">Requirement & Budget</th>
                  <th className="py-3.5 px-4 hidden lg:table-cell">Date</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0] text-sm text-[#334155]">
                {filteredInquiries.map((inq) => (
                  <tr key={inq.id} className="hover:bg-[#F8FAFC] transition-colors">
                    {/* Contact details */}
                    <td className="py-4 px-4 sm:px-6">
                      <div className="max-w-xs">
                        <div className="font-bold text-[#0B1B3A] text-sm">
                          {inq.fullName || inq.name}
                        </div>
                        <div className="text-xs text-[#64748B] flex items-center gap-1 mt-0.5">
                          <Mail className="w-3 h-3 text-[#0EA5E9]" />
                          <span>{inq.email}</span>
                        </div>
                        {inq.company && (
                          <div className="text-[11px] text-[#475569] font-medium mt-0.5">
                            {inq.company}
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Requirement */}
                    <td className="py-4 px-4 hidden md:table-cell">
                      <div className="max-w-xs">
                        <span className="inline-block px-2.5 py-0.5 rounded-md text-xs font-semibold bg-[#E0F2FE] text-[#0369A1] border border-[#BAE6FD]">
                          {inq.serviceRequired || inq.service || 'General / Not Specified'}
                        </span>
                        <div className="text-xs text-[#64748B] line-clamp-1 mt-1 font-normal">
                          {inq.projectBudget && `Budget: ${inq.projectBudget} • `}
                          {inq.message}
                        </div>
                      </div>
                    </td>

                    {/* Date */}
                    <td className="py-4 px-4 hidden lg:table-cell text-xs text-[#64748B]">
                      {inq.createdAt ? new Date(inq.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      }) : 'Recent'}
                    </td>

                    {/* Status badge */}
                    <td className="py-4 px-4">
                      {getStatusBadge(inq.status)}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 sm:px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedInquiry(inq)}
                          className="p-2 rounded-lg text-[#64748B] hover:text-[#0EA5E9] hover:bg-[#E0F2FE]"
                          title="View Full Inquiry"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(inq)}
                          className="p-2 rounded-lg text-[#64748B] hover:text-rose-600 hover:bg-rose-50"
                          title="Delete Inquiry"
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

      {/* View Detail Modal */}
      {selectedInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#081A33]/75 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-xl bg-white rounded-2xl p-6 sm:p-8 shadow-2xl border border-[#E2E8F0] max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedInquiry(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-[#64748B] hover:text-[#0B1B3A] hover:bg-[#F1F5F9]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#E0F2FE] text-[#0284C7] flex items-center justify-center font-bold">
                {selectedInquiry.fullName?.charAt(0) || 'C'}
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#0B1B3A] font-display">
                  {selectedInquiry.fullName || selectedInquiry.name}
                </h3>
                <span className="text-xs text-[#64748B]">
                  Received on {new Date(selectedInquiry.createdAt).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] grid grid-cols-2 gap-4 mb-6 text-xs text-[#334155]">
              <div>
                <span className="text-[#64748B] block font-bold">Email:</span>
                <a href={`mailto:${selectedInquiry.email}`} className="text-[#0EA5E9] font-semibold hover:underline">
                  {selectedInquiry.email}
                </a>
              </div>
              <div>
                <span className="text-[#64748B] block font-bold">Phone:</span>
                <span>{selectedInquiry.phone || 'Not provided'}</span>
              </div>
              <div>
                <span className="text-[#64748B] block font-bold">Company:</span>
                <span>{selectedInquiry.company || 'Individual / Startup'}</span>
              </div>
              <div>
                <span className="text-[#64748B] block font-bold">Estimated Budget:</span>
                <span className="font-bold text-[#0B1B3A]">{selectedInquiry.projectBudget || 'Not specified'}</span>
              </div>
            </div>

            <div className="space-y-2 mb-6">
              <span className="text-xs font-bold text-[#0B1B3A] uppercase tracking-wider">
                Service Requested: <strong className="text-[#0EA5E9] normal-case">{selectedInquiry.serviceRequired || selectedInquiry.service}</strong>
              </span>
              <div className="p-4 rounded-xl bg-white border border-[#CBD5E1] text-xs leading-relaxed text-[#0F172A] whitespace-pre-wrap font-medium">
                {selectedInquiry.message}
              </div>
            </div>

            {/* Change Status */}
            <div className="pt-4 border-t border-[#E2E8F0] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#334155]">Update Status:</span>
                <select
                  value={selectedInquiry.status}
                  onChange={(e) => handleStatusChange(selectedInquiry.id, e.target.value)}
                  className="py-1.5 px-3 rounded-lg border border-[#CBD5E1] text-xs font-bold text-[#0B1B3A]"
                >
                  <option value="NEW">New</option>
                  <option value="CONTACTED">Contacted</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="CLOSED">Closed</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`mailto:${selectedInquiry.email}?subject=Regarding Your Inquiry with Yovexa Solutions`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0EA5E9] hover:bg-[#0284C7] text-white text-xs font-bold shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Reply by Email</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={Boolean(deleteTarget)}
        title={deleteTarget?.fullName || deleteTarget?.name}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
        isDeleting={deleting}
      />
    </div>
  );
}
