import React, { useEffect } from 'react';
import { X, CheckCircle2, ArrowRight, ExternalLink } from 'lucide-react';

function GithubIcon({ className = "w-3.5 h-3.5" }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"/>
    </svg>
  );
}

export default function ProjectModal({ project, onClose, onDiscussProject }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  if (!project) return null;

  const projectTitle = project.title || project.name || project.projectName || 'Project Details';
  const projectImage = project.image || project.featuredImage;
  const liveLink = project.liveUrl || project.projectUrl;
  const projectDesc = project.description || project.shortDescription || project.summary || '';
  const features = Array.isArray(project.features)
    ? project.features
    : (typeof project.features === 'string' ? project.features.split('\n').filter(Boolean) : []);
  const technologies = Array.isArray(project.technologies)
    ? project.technologies
    : (typeof project.technologies === 'string' ? project.technologies.split(',').map(s => s.trim()).filter(Boolean) : []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-[#081A33]/80 backdrop-blur-md transition-opacity animate-in fade-in"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-[#E2E8F0] overflow-hidden z-10 max-h-[90vh] flex flex-col my-auto animate-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="relative bg-[#0B1B3A] text-white p-6 sm:p-8 border-b border-white/10 tech-grid-dark">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-white" />
          </button>

          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="px-3 py-1 rounded-md text-xs font-bold bg-[#0EA5E9]/20 text-[#38BDF8] border border-[#0EA5E9]/40">
              {project.projectType || (project.category ? project.category.replace(/_/g, ' ') : 'Project')}
            </span>
            {liveLink && (
              <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Live Project
              </span>
            )}
          </div>

          <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
            {projectTitle}
          </h3>
          <p className="mt-1 text-sm sm:text-base text-[#E2E8F0] font-normal">
            {project.subtitle || (project.category ? project.category.replace(/_/g, ' ') : 'Engineered Solution')}
          </p>
        </div>

        {/* Modal Body Scrollable */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-7 bg-white text-[#334155]">
          
          {/* Project Image Banner */}
          {projectImage && (
            <div className="rounded-xl overflow-hidden border border-[#E2E8F0] shadow-sm max-h-80 w-full bg-slate-100">
              <img
                src={projectImage}
                alt={projectTitle}
                className="w-full h-full object-cover object-top"
                onError={(e) => { e.target.parentElement.style.display = 'none'; }}
              />
            </div>
          )}

          {/* Quick Action Links */}
          {(liveLink || project.githubUrl) && (
            <div className="flex flex-wrap items-center gap-3 pt-1">
              {liveLink && (
                <a
                  href={liveLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-bold shadow-sm transition-all"
                >
                  <span>Visit Live Application</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0B1B3A] hover:bg-[#1E293B] text-white text-xs font-bold shadow-sm transition-all"
                >
                  <GithubIcon className="w-3.5 h-3.5" />
                  <span>View Repository</span>
                </a>
              )}
            </div>
          )}

          {/* Project Description */}
          {projectDesc && (
            <div>
              <h4 className="text-xs uppercase tracking-wider font-extrabold text-[#0B1B3A] mb-2.5">
                About The Project
              </h4>
              <p className="text-sm sm:text-base text-[#334155] leading-relaxed font-normal whitespace-pre-line">
                {projectDesc}
              </p>
            </div>
          )}

          {/* Key Features */}
          {features.length > 0 && (
            <div>
              <h4 className="text-xs uppercase tracking-wider font-extrabold text-[#0B1B3A] mb-3">
                Key Features & Capabilities
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {features.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 p-3.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
                    <CheckCircle2 className="w-4 h-4 text-[#0284C7] shrink-0 mt-0.5" />
                    <span className="text-xs font-semibold text-[#0B1B3A] leading-snug">{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tech Stack Badges */}
          {technologies.length > 0 && (
            <div>
              <h4 className="text-xs uppercase tracking-wider font-extrabold text-[#0B1B3A] mb-3">
                Technologies & Tools
              </h4>
              <div className="flex flex-wrap gap-2">
                {technologies.map((t, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 rounded-lg bg-[#F1F5F9] text-[#0B1B3A] text-xs font-mono font-bold border border-[#CBD5E1]"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-6 bg-[#F8FAFC] border-t border-[#E2E8F0] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-[#64748B] font-medium text-center sm:text-left">
            Interested in building a project like <strong className="text-[#0B1B3A]">{projectTitle}</strong>?
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-[#334155] hover:bg-[#E2E8F0] hover:text-[#0B1B3A] transition-colors w-full sm:w-auto text-center border border-[#E2E8F0]"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                if (onDiscussProject) onDiscussProject(projectTitle);
              }}
              className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-[#0B1B3A] hover:bg-[#183B75] transition-all shadow-sm flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              <span>Discuss Similar Project</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#38BDF8]" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
