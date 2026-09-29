import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { projectService } from '../../services/projectService';
import ProjectForm from '../../components/admin/ProjectForm';
import { useToast } from '../../context/ToastContext';

export default function AdminEditProjectPage() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await projectService.getProjectById(id);
        if (!data) {
          setError('Project not found');
        } else {
          setProject(data);
        }
      } catch (err) {
        console.error('Failed to load project:', err);
        setError(err.message || 'Failed to load project');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProject();
    }
  }, [id]);

  const handleUpdate = async (formData) => {
    try {
      setSaving(true);
      const updated = await projectService.updateProject(id, formData);
      showToast(`Project "${updated.title || updated.projectName}" updated successfully!`, 'success');
      navigate('/admin/projects');
    } catch (err) {
      console.error('Error updating project:', err);
      showToast(err.message || 'Failed to update project', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 text-[#0EA5E9] animate-spin" />
        <p className="text-sm font-semibold text-[#64748B]">Loading project editor...</p>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="bg-white p-8 rounded-2xl border border-red-200 text-center max-w-lg mx-auto my-12 space-y-4">
        <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-[#0B1B3A]">Project Not Found</h2>
        <p className="text-sm text-[#64748B]">{error || "The project you are trying to edit does not exist."}</p>
        <Link
          to="/admin/projects"
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#0B1B3A] text-white rounded-xl text-sm font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Projects</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          to="/admin/projects"
          className="p-2 rounded-xl border border-[#CBD5E1] bg-white hover:bg-[#F8FAFC] text-[#334155]"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0B1B3A] tracking-tight">
            Edit Project: <span className="text-[#0EA5E9]">{project.title || project.projectName}</span>
          </h1>
          <p className="text-sm text-[#475569] mt-0.5 font-medium">
            Update project overview, technologies, links, and publication status.
          </p>
        </div>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E2E8F0] shadow-sm">
        <ProjectForm
          initialData={project}
          onSubmit={handleUpdate}
          onCancel={() => navigate('/admin/projects')}
          loading={saving}
        />
      </div>
    </div>
  );
}
