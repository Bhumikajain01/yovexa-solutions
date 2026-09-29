import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Search, Filter, RefreshCw, FileText, CheckCircle2, FileEdit } from 'lucide-react';
import { blogService } from '../../services/blogService';
import BlogTable from '../../components/admin/BlogTable';
import DeleteModal from '../../components/admin/DeleteModal';
import { useToast } from '../../context/ToastContext';

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { showToast } = useToast();
  const navigate = useNavigate();

  const loadBlogs = async () => {
    try {
      setLoading(true);
      const [data, catData] = await Promise.all([
        blogService.getAdminBlogs(),
        blogService.getCategories(),
      ]);
      setBlogs(data);
      if (Array.isArray(catData)) {
        setCategories(catData);
      }
    } catch (err) {
      console.error('Failed to load admin blogs:', err);
      showToast('Failed to load blogs from database', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBlogs();
  }, []);

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      setIsDeleting(true);
      await blogService.deleteBlog(deleteTarget.id);
      showToast('Blog article deleted successfully', 'success');
      setDeleteTarget(null);
      await loadBlogs();
    } catch (err) {
      console.error('Failed to delete blog:', err);
      showToast(err.message || 'Failed to delete blog', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  // Filtered blogs
  const filteredBlogs = blogs.filter(b => {
    const matchesSearch = 
      b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.author && b.author.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (b.category && b.category.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'ALL' || b.status === statusFilter;
    const normFilter = selectedCategory.trim().toUpperCase().replace(/[\s-]+/g, '_');
    const bCatNorm = b.category ? b.category.trim().toUpperCase().replace(/[\s-]+/g, '_') : '';
    const matchesCategory = selectedCategory.toLowerCase() === 'all' || bCatNorm === normFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const publishedCount = blogs.filter(b => b.status === 'PUBLISHED').length;
  const draftCount = blogs.filter(b => b.status === 'DRAFT').length;

  return (
    <div className="space-y-6">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0B1B3A] tracking-tight">
            Blog Management
          </h1>
          <p className="text-sm text-[#475569] mt-1 font-medium">
            Create, edit, organize and publish technical articles for Yovexa Solutions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadBlogs}
            disabled={loading}
            className="p-2.5 rounded-xl border border-[#CBD5E1] bg-white hover:bg-[#F8FAFC] text-[#334155] transition-colors"
            title="Refresh Blogs"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#0EA5E9]' : ''}`} />
          </button>
          
          <Link
            to="/admin/blogs/create"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0EA5E9] hover:bg-[#0284C7] text-white font-bold text-sm shadow-md shadow-[#0EA5E9]/20 transition-all hover:shadow-lg"
          >
            <Plus className="w-4 h-4" />
            <span>Create Blog</span>
          </Link>
        </div>
      </div>

      {/* Quick Status Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          onClick={() => setStatusFilter('ALL')}
          className={`p-4 rounded-xl border text-left transition-all ${
            statusFilter === 'ALL'
              ? 'bg-white border-[#0EA5E9] shadow-sm ring-2 ring-[#0EA5E9]/20'
              : 'bg-white border-[#E2E8F0] hover:border-[#CBD5E1]'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider">All Articles</span>
            <FileText className="w-4 h-4 text-[#0EA5E9]" />
          </div>
          <p className="text-2xl font-black text-[#0B1B3A] mt-2">{blogs.length}</p>
        </button>

        <button
          onClick={() => setStatusFilter('PUBLISHED')}
          className={`p-4 rounded-xl border text-left transition-all ${
            statusFilter === 'PUBLISHED'
              ? 'bg-white border-[#10B981] shadow-sm ring-2 ring-[#10B981]/20'
              : 'bg-white border-[#E2E8F0] hover:border-[#CBD5E1]'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#059669] uppercase tracking-wider">Published</span>
            <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
          </div>
          <p className="text-2xl font-black text-[#0B1B3A] mt-2">{publishedCount}</p>
        </button>

        <button
          onClick={() => setStatusFilter('DRAFT')}
          className={`p-4 rounded-xl border text-left transition-all ${
            statusFilter === 'DRAFT'
              ? 'bg-white border-[#F59E0B] shadow-sm ring-2 ring-[#F59E0B]/20'
              : 'bg-white border-[#E2E8F0] hover:border-[#CBD5E1]'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#D97706] uppercase tracking-wider">Drafts</span>
            <FileEdit className="w-4 h-4 text-[#F59E0B]" />
          </div>
          <p className="text-2xl font-black text-[#0B1B3A] mt-2">{draftCount}</p>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by title, author, category..."
            className="w-full pl-10 pr-4 py-2 text-sm bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-[#0B1B3A] placeholder-[#94A3B8] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0EA5E9] focus:border-transparent font-medium"
          />
        </div>

        {/* Category & Reset Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#64748B]" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="py-2 px-3 text-sm bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-[#0B1B3A] font-semibold focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]"
            >
              <option value="all">All Categories</option>
              {categories.filter(c => c.id !== 'all').map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {(searchTerm || statusFilter !== 'ALL' || selectedCategory !== 'all') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('ALL');
                setSelectedCategory('all');
              }}
              className="text-xs font-bold text-[#0EA5E9] hover:underline px-2 py-1"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden">
        <BlogTable
          blogs={filteredBlogs}
          loading={loading}
          onDelete={(blog) => setDeleteTarget(blog)}
        />
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title={deleteTarget?.title}
        loading={isDeleting}
      />
    </div>
  );
}
