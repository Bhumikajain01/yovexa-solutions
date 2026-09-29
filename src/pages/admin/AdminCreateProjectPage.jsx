import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { projectService } from '../../services/projectService';
import ProjectForm from '../../components/admin/ProjectForm';
import { useToast } from '../../context/ToastContext';

export default function AdminCreateProjectPage() {
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleCreate = async (formData) => {
    try {
      setSaving(true);
      const created = await projectService.createProject(formData);
      showToast(`Project "${created.title || created.projectName}" created successfully!`, 'success');
      navigate('/admin/projects');
    } catch (err) {
      console.error('Error creating project:', err);
      showToast(err.message || 'Failed to create project', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#0B1B3A] tracking-tight">
          Create Portfolio Project
        </h1>
        <p className="text-sm text-[#475569] mt-0.5 font-medium">
          Add a new software project, technology stack tags, and demo references.
        </p>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E2E8F0] shadow-sm">
        <ProjectForm
          onSubmit={handleCreate}
          onCancel={() => navigate('/admin/projects')}
          loading={saving}
        />
      </div>
    </div>
  );
}
