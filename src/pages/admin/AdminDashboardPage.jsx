import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FileText,
  CheckCircle2,
  Clock,
  Plus,
  ArrowRight,
  Sparkles,
  Layers,
  Briefcase,
  MessageSquare,
  ExternalLink,
  Edit2,
  Trash2,
  Info
} from 'lucide-react';
import BlogTable from '../../components/admin/BlogTable';
import DeleteModal from '../../components/admin/DeleteModal';
import { blogService } from '../../services/blogService';
import { projectService } from '../../services/projectService';
import { servicesService } from '../../services/servicesService';
import { inquiryService } from '../../services/inquiryService';
import { heroService } from '../../services/heroService';
import { aboutService } from '../../services/aboutService';
import { useToast } from '../../context/ToastContext';

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [stats, setStats] = useState({
    totalBlogs: 0,
    publishedBlogs: 0,
    draftBlogs: 0,
    totalProjects: 0,
    publishedProjects: 0,
    totalServices: 0,
    newInquiries: 0,
    totalHeroes: 0,
    totalAbouts: 0,
  });

  const [recentBlogs, setRecentBlogs] = useState([]);
  const [recentProjects, setRecentProjects] = useState([]);
  const [recentInquiries, setRecentInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [blogs, projects, services, inquiries, heroes, abouts] = await Promise.all([
        blogService.getAdminBlogs(),
        projectService.getProjects(),
        servicesService.getServices(),
        inquiryService.getInquiries(),
        heroService.getHeroes(),
        aboutService.getAbouts(),
      ]);

      const publishedB = blogs.filter(b => b.status === 'PUBLISHED').length;
      const draftB = blogs.filter(b => b.status === 'DRAFT').length;
      const publishedP = projects.filter(p => p.status === 'PUBLISHED').length;
      const newInq = inquiries.filter(i => i.status === 'NEW').length;

      setStats({
        totalBlogs: blogs.length,
        publishedBlogs: publishedB,
        draftBlogs: draftB,
        totalProjects: projects.length,
        publishedProjects: publishedP,
        totalServices: services.length,
        newInquiries: newInq,
        totalHeroes: heroes.length,
        totalAbouts: abouts.length,
      });

      setRecentBlogs(blogs.slice(0, 3));
      setRecentProjects(projects.slice(0, 3));
      setRecentInquiries(inquiries.slice(0, 3));
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
      showToast('Failed to load dashboard statistics', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await blogService.deleteBlog(deleteTarget.id);
      showToast(`"${deleteTarget.title}" deleted successfully.`, 'success');
      setDeleteTarget(null);
      await fetchAllData();
    } catch (err) {
      showToast(err.message || 'Failed to delete blog', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#081A33] text-white border border-white/10 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 tech-grid-dark">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0EA5E9]/20 text-[#38BDF8] text-xs font-mono font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Yovexa Solutions CMS Management</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-display">
            Welcome to Yovexa Solutions
          </h2>
          <p className="text-xs sm:text-sm text-[#E2E8F0] mt-1">
            Manage public website sections, publish technical case studies, and respond to incoming client leads.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/admin/projects/create"
            className="shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs text-[#0B1B3A] bg-white hover:bg-[#F8FAFC] transition-all shadow-sm"
          >
            <Plus className="w-4 h-4 text-[#0EA5E9]" />
            <span>Add Project</span>
          </Link>
          <Link
            to="/admin/blogs/create"
            className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-[#0EA5E9] hover:bg-[#0284C7] transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Write Blog</span>
          </Link>
        </div>
      </div>

      {/* Summary Metrics Cards (6 real counters) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Projects */}
        <Link
          to="/admin/projects"
          className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-card hover:border-[#CBD5E1] transition-all flex items-center justify-between group"
        >
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#64748B]">
              Portfolio Projects
            </span>
            <div className="mt-2 text-3xl font-black text-[#0B1B3A] font-display">
              {loading ? '—' : stats.totalProjects}
            </div>
            <span className="text-[11px] font-semibold text-emerald-600 mt-0.5 inline-block">
              {stats.publishedProjects} Published Live
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#E0F2FE] text-[#0284C7] flex items-center justify-center group-hover:scale-110 transition-transform">
            <Layers className="w-6 h-6" />
          </div>
        </Link>

        {/* Services */}
        <Link
          to="/admin/services"
          className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-card hover:border-[#CBD5E1] transition-all flex items-center justify-between group"
        >
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#64748B]">
              Services Offered
            </span>
            <div className="mt-2 text-3xl font-black text-[#0B1B3A] font-display">
              {loading ? '—' : stats.totalServices}
            </div>
            <span className="text-[11px] font-semibold text-[#64748B] mt-0.5 inline-block">
              Active Offerings
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Briefcase className="w-6 h-6" />
          </div>
        </Link>

        {/* New Inquiries */}
        <Link
          to="/admin/inquiries"
          className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-card hover:border-[#CBD5E1] transition-all flex items-center justify-between group"
        >
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-sky-700">
              New Inquiries
            </span>
            <div className="mt-2 text-3xl font-black text-[#0B1B3A] font-display">
              {loading ? '—' : stats.newInquiries}
            </div>
            <span className="text-[11px] font-semibold text-sky-600 mt-0.5 inline-block">
              Awaiting Follow-up
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center group-hover:scale-110 transition-transform">
            <MessageSquare className="w-6 h-6" />
          </div>
        </Link>

        {/* Published Blogs */}
        <Link
          to="/admin/blogs"
          className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-card hover:border-[#CBD5E1] transition-all flex items-center justify-between group"
        >
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-700">
              Published Articles
            </span>
            <div className="mt-2 text-3xl font-black text-[#0B1B3A] font-display">
              {loading ? '—' : stats.publishedBlogs}
            </div>
            <span className="text-[11px] font-semibold text-emerald-600 mt-0.5 inline-block">
              Visible on /blog
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </Link>

        {/* Draft Blogs */}
        <Link
          to="/admin/blogs"
          className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-card hover:border-[#CBD5E1] transition-all flex items-center justify-between group"
        >
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-amber-700">
              Draft Blogs
            </span>
            <div className="mt-2 text-3xl font-black text-[#0B1B3A] font-display">
              {loading ? '—' : stats.draftBlogs}
            </div>
            <span className="text-[11px] font-semibold text-amber-600 mt-0.5 inline-block">
              In Progress
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Clock className="w-6 h-6" />
          </div>
        </Link>

        {/* Hero Sections */}
        <Link
          to="/admin/content/hero"
          className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-card hover:border-[#CBD5E1] transition-all flex items-center justify-between group"
        >
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#0284C7]">
              Hero Variations
            </span>
            <div className="mt-2 text-3xl font-black text-[#0B1B3A] font-display">
              {loading ? '—' : stats.totalHeroes}
            </div>
            <span className="text-[11px] font-semibold text-emerald-600 mt-0.5 inline-block">
              1 Active on Homepage
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#E0F2FE] text-[#0284C7] flex items-center justify-center group-hover:scale-110 transition-transform">
            <Sparkles className="w-6 h-6" />
          </div>
        </Link>

        {/* About Sections */}
        <Link
          to="/admin/content/about"
          className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-card hover:border-[#CBD5E1] transition-all flex items-center justify-between group"
        >
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-700">
              About Sections
            </span>
            <div className="mt-2 text-3xl font-black text-[#0B1B3A] font-display">
              {loading ? '—' : stats.totalAbouts}
            </div>
            <span className="text-[11px] font-semibold text-emerald-600 mt-0.5 inline-block">
              1 Active on Homepage
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Info className="w-6 h-6" />
          </div>
        </Link>

        {/* Total Articles */}
        <Link
          to="/admin/blogs"
          className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-card hover:border-[#CBD5E1] transition-all flex items-center justify-between group"
        >
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#64748B]">
              Total Articles
            </span>
            <div className="mt-2 text-3xl font-black text-[#0B1B3A] font-display">
              {loading ? '—' : stats.totalBlogs}
            </div>
            <span className="text-[11px] font-semibold text-[#64748B] mt-0.5 inline-block">
              Content Repository
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center group-hover:scale-110 transition-transform">
            <FileText className="w-6 h-6" />
          </div>
        </Link>
      </div>

      {/* Grid: Recent Inquiries & Recent Projects */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Inquiries Card */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
            <div>
              <h3 className="text-base font-bold text-[#0B1B3A]">Recent Client Inquiries</h3>
              <p className="text-xs text-[#64748B]">Incoming leads from website contact form.</p>
            </div>
            <Link
              to="/admin/inquiries"
              className="text-xs font-bold text-[#0EA5E9] hover:underline inline-flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {recentInquiries.length === 0 ? (
              <p className="text-xs text-[#64748B] py-4 text-center">No inquiries yet.</p>
            ) : (
              recentInquiries.map((inq) => (
                <div
                  key={inq.id}
                  onClick={() => navigate('/admin/inquiries')}
                  className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#CBD5E1] transition-all cursor-pointer flex items-center justify-between"
                >
                  <div className="min-w-0 flex-1 pr-3">
                    <div className="font-bold text-xs text-[#0B1B3A] truncate">
                      {inq.fullName || inq.name}
                    </div>
                    <div className="text-[11px] text-[#64748B] truncate mt-0.5">
                      {inq.serviceRequired || inq.service} • {inq.company || 'Direct Inquiry'}
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    inq.status === 'NEW' ? 'bg-sky-100 text-sky-700' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {inq.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Projects Card */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
            <div>
              <h3 className="text-base font-bold text-[#0B1B3A]">Recent Portfolio Case Studies</h3>
              <p className="text-xs text-[#64748B]">Architectural prototypes and client projects.</p>
            </div>
            <Link
              to="/admin/projects"
              className="text-xs font-bold text-[#0EA5E9] hover:underline inline-flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {recentProjects.length === 0 ? (
              <p className="text-xs text-[#64748B] py-4 text-center">No projects yet.</p>
            ) : (
              recentProjects.map((p) => (
                <div
                  key={p.id}
                  className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={p.featuredImage}
                      alt={p.title}
                      className="w-10 h-10 rounded-lg object-cover bg-slate-200 shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="font-bold text-xs text-[#0B1B3A] truncate">
                        {p.title || p.projectName}
                      </div>
                      <div className="text-[11px] text-[#64748B] capitalize truncate">
                        {p.category} • {p.status}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate(`/admin/projects/edit/${p.id}`)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-[#0B1B3A] hover:bg-white"
                    title="Edit"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Recent Blogs Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-[#0B1B3A] font-display">
              Recent Blog Articles
            </h3>
            <p className="text-xs text-[#64748B]">
              Latest published and draft engineering posts.
            </p>
          </div>

          <Link
            to="/admin/blogs"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0EA5E9] hover:text-[#0284C7]"
          >
            <span>View All Articles</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <BlogTable
          blogs={recentBlogs}
          onDelete={(blog) => setDeleteTarget(blog)}
        />
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={Boolean(deleteTarget)}
        title={deleteTarget?.title}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
        isDeleting={isDeleting}
      />
    </div>
  );
}
