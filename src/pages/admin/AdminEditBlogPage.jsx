import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { blogService } from '../../services/blogService';
import BlogForm from '../../components/admin/BlogForm';
import { useToast } from '../../context/ToastContext';
import { ArrowLeft, Loader2, AlertCircle } from 'lucide-react';

export default function AdminEditBlogPage() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await blogService.getAdminBlogById(id);
        if (!data) {
          setError('Blog article not found or has been removed.');
        } else {
          setBlog(data);
        }
      } catch (err) {
        console.error('Failed to fetch blog for editing:', err);
        setError(err.message || 'Failed to load blog article');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBlog();
    }
  }, [id]);

  const handleUpdateBlog = async (formData) => {
    try {
      setSaving(true);
      const updated = await blogService.updateBlog(id, formData);
      showToast(`Blog "${updated.title}" updated successfully!`, 'success');
      navigate('/admin/blogs');
    } catch (err) {
      console.error('Error updating blog:', err);
      showToast(err.message || 'Failed to update blog', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/blogs');
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-8 h-8 text-[#0EA5E9] animate-spin" />
        <p className="text-sm font-semibold text-[#64748B]">Loading blog editor...</p>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="bg-white p-8 rounded-2xl border border-red-200 text-center max-w-lg mx-auto my-12 space-y-4">
        <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-[#0B1B3A]">Article Not Found</h2>
        <p className="text-sm text-[#64748B]">{error || "The article you are trying to edit does not exist."}</p>
        <Link
          to="/admin/blogs"
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#0B1B3A] text-white rounded-xl text-sm font-bold hover:bg-[#183B75] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Blog Management</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          to="/admin/blogs"
          className="p-2 rounded-xl border border-[#CBD5E1] bg-white hover:bg-[#F8FAFC] text-[#334155] transition-colors"
          title="Back to blogs"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0B1B3A] tracking-tight">
            Edit Article: <span className="text-[#0EA5E9] font-bold">{blog.title}</span>
          </h1>
          <p className="text-sm text-[#475569] mt-1 font-medium">
            Update content, revise SEO tags, or change publication status.
          </p>
        </div>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E2E8F0] shadow-sm">
        <BlogForm
          initialData={blog}
          onSubmit={handleUpdateBlog}
          onCancel={handleCancel}
          loading={saving}
          isEdit={true}
        />
      </div>
    </div>
  );
}
