import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Plus,
  Layers,
  Search,
  Filter,
  Edit2,
  Trash2,
  ExternalLink,
  CheckCircle2,
  FileEdit,
  RefreshCw,
  Loader2
} from 'lucide-react';
import { projectService } from '../../services/projectService';
import { useToast } from '../../context/ToastContext';
import DeleteModal from '../../components/admin/DeleteModal';

export default function AdminProjectsPage() {
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const [projList, catList] = await Promise.all([
        projectService.getProjects(),
        projectService.getCategories(),
      ]);
      setProjects(projList);
      setCategories(catList);
    } catch (err) {
      console.error('Failed to load projects:', err);
      showToast('Failed to load projects', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      await projectService.deleteProject(deleteTarget.id);
      showToast(`Project "${deleteTarget.title || deleteTarget.projectName}" deleted successfully.`, 'success');
      setDeleteTarget(null);
      await loadProjects();
    } catch (err) {
      showToast(err.message || 'Failed to delete project', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const filteredProjects = projects.filter(p => {
    const title = p.title || p.projectName || '';
    const matchesSearch = 
      title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.summary && p.summary.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (Array.isArray(p.technologies) && p.technologies.some(t => t.toLowerCase().includes(searchTerm.toLowerCase())));
    const pCat = (p.category || 'WEB_APPLICATIONS').toUpperCase().replace(/[\s-]+/g, '_');
    const sCat = selectedCategory.toUpperCase().replace(/[\s-]+/g, '_');
    const matchesCategory = selectedCategory === 'all' || pCat === sCat;
    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const publishedCount = projects.filter(p => p.status === 'PUBLISHED').length;
  const draftCount = projects.filter(p => p.status === 'DRAFT').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0B1B3A] tracking-tight">
            Portfolio Projects
          </h1>
          <p className="text-sm text-[#475569] mt-0.5 font-medium">
            Manage public projects, tech stacks, and live demo links.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadProjects}
            disabled={loading}
            className="p-2.5 rounded-xl border border-[#CBD5E1] bg-white hover:bg-[#F8FAFC] text-[#334155] transition-colors"
            title="Refresh Projects"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#0EA5E9]' : ''}`} />
          </button>

          <Link
            to="/admin/projects/create"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0EA5E9] hover:bg-[#0284C7] text-white font-bold text-sm shadow-md shadow-[#0EA5E9]/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Project</span>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          onClick={() => setStatusFilter('ALL')}
          className={`p-4 rounded-xl border text-left transition-all ${
            statusFilter === 'ALL'
              ? 'bg-white border-[#0EA5E9] shadow-sm ring-2 ring-[#0EA5E9]/20'
              : 'bg-white border-[#E2E8F0]'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#64748B] uppercase">All Projects</span>
            <Layers className="w-4 h-4 text-[#0EA5E9]" />
          </div>
          <p className="text-2xl font-black text-[#0B1B3A] mt-2">{projects.length}</p>
        </button>

        <button
          onClick={() => setStatusFilter('PUBLISHED')}
          className={`p-4 rounded-xl border text-left transition-all ${
            statusFilter === 'PUBLISHED'
              ? 'bg-white border-[#10B981] shadow-sm ring-2 ring-[#10B981]/20'
              : 'bg-white border-[#E2E8F0]'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#059669] uppercase">Published Live</span>
            <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
          </div>
          <p className="text-2xl font-black text-[#0B1B3A] mt-2">{publishedCount}</p>
        </button>

        <button
          onClick={() => setStatusFilter('DRAFT')}
          className={`p-4 rounded-xl border text-left transition-all ${
            statusFilter === 'DRAFT'
              ? 'bg-white border-[#F59E0B] shadow-sm ring-2 ring-[#F59E0B]/20'
              : 'bg-white border-[#E2E8F0]'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#D97706] uppercase">Drafts</span>
            <FileEdit className="w-4 h-4 text-[#F59E0B]" />
          </div>
          <p className="text-2xl font-black text-[#0B1B3A] mt-2">{draftCount}</p>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search projects or technologies..."
            className="w-full pl-10 pr-4 py-2 text-sm bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-[#0B1B3A] placeholder-[#94A3B8] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#64748B]" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="py-2 px-3 text-sm bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-[#0B1B3A] font-semibold focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]"
            >
              <option value="all">All Categories</option>
              {categories.filter(c => c.id !== 'all').map(c => (
                <option key={c.id} value={c.id}>{c.label}</option>
              ))}
            </select>
          </div>

          {(searchTerm || selectedCategory !== 'all' || statusFilter !== 'ALL') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setStatusFilter('ALL');
              }}
              className="text-xs font-bold text-[#0EA5E9] hover:underline px-2"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Projects Table */}
      {loading ? (
        <div className="min-h-[300px] flex flex-col items-center justify-center space-y-3 bg-white rounded-2xl border border-[#E2E8F0]">
          <Loader2 className="w-8 h-8 text-[#0EA5E9] animate-spin" />
          <p className="text-sm font-semibold text-[#64748B]">Loading portfolio...</p>
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-12 text-center">
          <Layers className="w-12 h-12 text-[#0EA5E9] mx-auto mb-3" />
          <h3 className="text-base font-bold text-[#0B1B3A]">No projects match your filter</h3>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[11px] font-extrabold uppercase tracking-wider text-[#64748B]">
                  <th className="py-3.5 px-4 sm:px-6">Project</th>
                  <th className="py-3.5 px-4 hidden md:table-cell">Category</th>
                  <th className="py-3.5 px-4 hidden lg:table-cell">Tech Stack</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0] text-sm text-[#334155]">
                {filteredProjects.map((p) => (
                  <tr key={p.id} className="hover:bg-[#F8FAFC] transition-colors">
                    {/* Project & Thumbnail */}
                    <td className="py-4 px-4 sm:px-6">
                      <div className="flex items-center gap-3.5 max-w-md">
                        {p.featuredImage ? (
                          <img
                            src={p.featuredImage}
                            alt={p.title || p.projectName}
                            className="w-12 h-12 rounded-lg object-cover shrink-0 border border-[#E2E8F0] bg-slate-100"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-slate-100 text-slate-400 flex items-center justify-center shrink-0 border border-[#E2E8F0]">
                            <Layers className="w-5 h-5 text-[#64748B]" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <div className="font-bold text-[#0B1B3A] text-sm truncate">
                            {p.title || p.projectName}
                          </div>
                          <div className="text-xs text-[#64748B] line-clamp-1 mt-0.5">
                            {p.summary || p.shortDescription}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-4 px-4 hidden md:table-cell">
                      <span className="inline-block px-2.5 py-0.5 rounded-md text-xs font-semibold bg-[#E0F2FE] text-[#0369A1] border border-[#BAE6FD] capitalize">
                        {p.category}
                      </span>
                    </td>

                    {/* Technologies */}
                    <td className="py-4 px-4 hidden lg:table-cell text-xs text-[#475569]">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {Array.isArray(p.technologies) ? p.technologies.slice(0, 3).map((t, i) => (
                          <span key={i} className="px-1.5 py-0.5 bg-[#F1F5F9] rounded text-[11px] font-mono border border-[#CBD5E1]">
                            {t}
                          </span>
                        )) : null}
                        {Array.isArray(p.technologies) && p.technologies.length > 3 && (
                          <span className="text-[10px] text-[#64748B] font-bold">+{p.technologies.length - 3}</span>
                        )}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-4">
                      {p.status === 'PUBLISHED' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                          Draft
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 sm:px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          to={`/projects/${p.slug || p.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg text-[#64748B] hover:text-[#0EA5E9] hover:bg-[#E0F2FE]"
                          title="View Project"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>

                        <button
                          onClick={() => navigate(`/admin/projects/edit/${p.id}`)}
                          className="p-2 rounded-lg text-[#64748B] hover:text-[#0B1B3A] hover:bg-[#F1F5F9]"
                          title="Edit Project"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => setDeleteTarget(p)}
                          className="p-2 rounded-lg text-[#64748B] hover:text-rose-600 hover:bg-rose-50"
                          title="Delete Project"
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

      {/* Delete Modal */}
      <DeleteModal
        isOpen={Boolean(deleteTarget)}
        title={deleteTarget?.title || deleteTarget?.projectName}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
        isDeleting={deleting}
      />
    </div>
  );
}
