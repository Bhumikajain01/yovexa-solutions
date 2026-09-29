import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { caseStudyService } from '../../services/caseStudyService';
import CaseStudyForm from '../../components/admin/CaseStudyForm';
import { useToast } from '../../context/ToastContext';

export default function AdminCreateCaseStudyPage() {
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleCreate = async (formData) => {
    try {
      setSaving(true);
      const created = await caseStudyService.createCaseStudy(formData);
      showToast(`Case Study "${created.title}" created successfully!`, 'success');
      navigate('/admin/case-studies');
    } catch (err) {
      console.error('Error creating case study:', err);
      showToast(err.message || 'Failed to create case study', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#0B1B3A] tracking-tight">
          Create Case Study
        </h1>
        <p className="text-sm text-[#475569] mt-0.5 font-medium">
          Author a new engineering case study, problem statement, technical implementation, and system capabilities.
        </p>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E2E8F0] shadow-sm">
        <CaseStudyForm
          onSubmit={handleCreate}
          onCancel={() => navigate('/admin/case-studies')}
          loading={saving}
        />
      </div>
    </div>
  );
}
