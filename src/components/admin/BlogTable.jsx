import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit2, Trash2, ExternalLink, Tag, FileText } from 'lucide-react';

export default function BlogTable({ blogs, onEdit, onDelete, loading }) {
  const navigate = useNavigate();

  const handleEditClick = (id) => {
    if (onEdit) {
      onEdit(id);
    } else {
      navigate(`/admin/blogs/edit/${id}`);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center bg-white">
        <div className="w-6 h-6 border-2 border-[#0EA5E9] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
        <span className="text-xs text-[#64748B]">Loading articles...</span>
      </div>
    );
  }

  if (!blogs || blogs.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center">
        <div className="w-12 h-12 rounded-xl bg-[#E0F2FE] text-[#0284C7] flex items-center justify-center mx-auto mb-3">
          <Tag className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-[#0B1B3A]">No blog articles found</h3>
        <p className="text-xs text-[#64748B] mt-1 max-w-sm mx-auto">
          No articles match the current filter or search criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[11px] font-extrabold uppercase tracking-wider text-[#64748B]">
              <th className="py-3.5 px-4 sm:px-6">Article</th>
              <th className="py-3.5 px-4 hidden md:table-cell">Category</th>
              <th className="py-3.5 px-4 hidden lg:table-cell">Author</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 hidden sm:table-cell">Date</th>
              <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E8F0] text-sm text-[#334155]">
            {blogs.map((blog) => (
              <tr key={blog.id} className="hover:bg-[#F8FAFC] transition-colors">
                
                {/* Article Info & Thumbnail */}
                <td className="py-4 px-4 sm:px-6">
                  <div className="flex items-center gap-3.5 max-w-md">
                  {blog.featuredImage ? (
                    <img
                      src={blog.featuredImage}
                      alt={blog.title}
                      className="w-12 h-12 rounded-lg object-cover shrink-0 border border-[#E2E8F0] bg-slate-100"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-slate-100 text-slate-400 flex items-center justify-center shrink-0 border border-[#E2E8F0]">
                      <FileText className="w-5 h-5 text-[#64748B]" />
                    </div>
                  )}
                    <div className="min-w-0">
                      <div className="font-bold text-[#0B1B3A] line-clamp-1 text-sm leading-snug">
                        {blog.title}
                      </div>
                      <div className="text-xs text-[#64748B] line-clamp-1 mt-0.5">
                        {blog.excerpt || 'No description provided'}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Category */}
                <td className="py-4 px-4 hidden md:table-cell">
                  <span className="inline-block px-2.5 py-0.5 rounded-md text-xs font-semibold bg-[#E0F2FE] text-[#0369A1] border border-[#BAE6FD]">
                    {blog.category || 'General'}
                  </span>
                </td>

                {/* Author */}
                <td className="py-4 px-4 hidden lg:table-cell text-xs font-medium text-[#475569]">
                  {blog.author}
                </td>

                {/* Status Badge */}
                <td className="py-4 px-4">
                  {blog.status === 'PUBLISHED' ? (
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

                {/* Date */}
                <td className="py-4 px-4 hidden sm:table-cell text-xs text-[#64748B]">
                  {blog.publishedAt || blog.createdAt ? new Date(blog.publishedAt || blog.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  }) : '—'}
                </td>

                {/* Actions */}
                <td className="py-4 px-4 sm:px-6 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    {/* View on Public Site (if published) */}
                    {blog.status === 'PUBLISHED' && (
                      <a
                        href={`/blog/${blog.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg text-[#64748B] hover:text-[#0EA5E9] hover:bg-[#E0F2FE] transition-colors"
                        title="View Live Article"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}

                    {/* Edit */}
                    <button
                      onClick={() => handleEditClick(blog.id)}
                      className="p-2 rounded-lg text-[#64748B] hover:text-[#0B1B3A] hover:bg-[#F1F5F9] transition-colors"
                      title="Edit Article"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => onDelete(blog)}
                      className="p-2 rounded-lg text-[#64748B] hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Delete Article"
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
  );
}
