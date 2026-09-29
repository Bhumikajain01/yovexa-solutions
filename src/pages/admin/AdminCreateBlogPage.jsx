import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { blogService } from '../../services/blogService';
import BlogForm from '../../components/admin/BlogForm';
import { useToast } from '../../context/ToastContext';

export default function AdminCreateBlogPage() {
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleCreateBlog = async (formData) => {
    try {
      setSaving(true);
      const created = await blogService.createBlog(formData);
      showToast(`Blog "${created.title}" created successfully!`, 'success');
      navigate('/admin/blogs');
    } catch (err) {
      console.error('Error creating blog:', err);
      showToast(err.message || 'Failed to create blog', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/blogs');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#0B1B3A] tracking-tight">
          Create New Blog Post
        </h1>
        <p className="text-sm text-[#475569] mt-1 font-medium">
          Draft a technical article, upload media, optimize SEO metadata, and publish live.
        </p>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E2E8F0] shadow-sm">
        <BlogForm
          onSubmit={handleCreateBlog}
          onCancel={handleCancel}
          loading={saving}
          isEdit={false}
        />
      </div>
    </div>
  );
}
