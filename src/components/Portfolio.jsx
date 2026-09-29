import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, ExternalLink } from 'lucide-react';
import { projectService } from '../services/projectService';
import DynamicIcon from './DynamicIcon';

export default function Portfolio({ onSelectProject }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch categories dynamically from backend API on mount
  useEffect(() => {
    let isMounted = true;
    projectService.getCategories()
      .then(catData => {
        if (isMounted && Array.isArray(catData) && catData.length > 0) {
          setCategories(catData);
        }
      })
      .catch(err => console.warn('Using fallback categories', err));
    return () => { isMounted = false; };
  }, []);

  // Fetch projects from backend whenever activeCategory changes
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const filterCategory = activeCategory !== 'all' ? activeCategory : undefined;
    projectService.getProjects({ publishedOnly: true, category: filterCategory })
      .then(projData => {
        if (isMounted) {
          setProjects(projData);
          setLoading(false);
        }
      })
      .catch(err => {
        console.warn('Failed to fetch projects for category:', err);
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, [activeCategory]);

  const normalizeCategory = (cat) => {
    if (!cat) return 'WEB_APPLICATIONS';
    const clean = cat.toString().trim().toUpperCase().replace(/[\s-]+/g, '_');
    const map = {
      'WEB': 'WEB_APPLICATIONS',
      'WEB_APP': 'WEB_APPLICATIONS',
      'WEB_APPLICATION': 'WEB_APPLICATIONS',
      'MOBILE': 'MOBILE_APPS',
      'MOBILE_APP': 'MOBILE_APPS',
      'ECOMMERCE': 'E_COMMERCE',
    };
    return map[clean] || clean;
  };

  const filteredProjects = activeCategory === 'all'
    ? projects
    : projects.filter(p => {
        const pCat = normalizeCategory(p.category);
        const aCat = normalizeCategory(activeCategory);
        if (pCat === aCat) return true;
        if (Array.isArray(p.secondaryCategories)) {
          return p.secondaryCategories.some(sc => normalizeCategory(sc) === aCat);
        }
        return false;
      });


  return (
    <section id="portfolio" className="py-28 sm:py-32 bg-white text-[#0B1B3A] relative border-b border-[#E2E8F0] scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E0F2FE] border border-[#BAE6FD] text-[#0369A1] text-xs font-bold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5 text-[#0284C7]" />
              <span>Engineered Solutions</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0B1B3A] tracking-tight font-display">
              Selected Projects
            </h2>
            <p className="mt-3 text-base sm:text-lg text-[#334155] max-w-2xl font-normal">
              A showcase of our custom software systems, digital products, and production applications.
            </p>
          </div>

          {/* Project disclaimer */}
          <div className="mt-4 md:mt-0 text-xs text-[#64748B] max-w-xs md:text-right font-medium">
            Custom web platforms, mobile apps & enterprise software systems.
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 no-scrollbar">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 shrink-0 ${isActive
                    ? 'bg-[#0B1B3A] text-white shadow-md shadow-[#0B1B3A]/20 ring-2 ring-[#0EA5E9]'
                    : 'bg-white text-[#334155] hover:bg-[#F1F5F9] hover:text-[#0B1B3A] border border-[#E2E8F0]'
                  }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(n => (
              <div key={n} className="rounded-2xl bg-white border border-[#E2E8F0] p-6 space-y-4 animate-pulse">
                <div className="h-44 bg-slate-200 rounded-xl w-full" />
                <div className="h-6 bg-slate-200 rounded w-1/3" />
                <div className="h-8 bg-slate-200 rounded w-3/4" />
                <div className="h-16 bg-slate-200 rounded w-full" />
                <div className="h-6 bg-slate-200 rounded w-1/2 pt-2" />
              </div>
            ))}
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-12 text-center shadow-sm">
            <h3 className="text-base font-bold text-[#0B1B3A]">
              {projects.length === 0 ? 'No projects published yet' : 'No projects found in this category'}
            </h3>
            <p className="text-xs text-[#64748B] mt-1">
              {projects.length === 0
                ? 'Check back soon for our latest engineered solutions and software projects.'
                : 'Select another category or view all projects.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => {
              const projectTitle = project.title || project.name || project.projectName || 'Untitled Project';
              const projectImage = project.image || project.featuredImage;
              const projectDesc = project.shortDescription || project.description || project.summary || '';
              const liveLink = project.liveUrl || project.projectUrl;
              const technologies = Array.isArray(project.technologies)
                ? project.technologies
                : (typeof project.technologies === 'string' ? project.technologies.split(',').map(s => s.trim()).filter(Boolean) : []);

              return (
                <div
                  key={project.id || project._id || project.slug}
                  onClick={() => onSelectProject(project)}
                  className="group relative flex flex-col justify-between rounded-2xl bg-white border border-[#E2E8F0] hover:border-[#0284C7]/50 shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden transform hover:-translate-y-1 cursor-pointer"
                >
                  {/* Project Image Banner */}
                  {projectImage ? (
                    <div className="relative h-48 w-full overflow-hidden bg-slate-100 border-b border-[#E2E8F0]">
                      <img
                        src={projectImage}
                        alt={projectTitle}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => {
                          e.target.parentElement.style.display = 'none';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0B1B3A]/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  ) : null}

                  {/* Card Header */}
                  <div className="relative p-6 border-b border-[#E2E8F0]/70 bg-gradient-to-b from-[#F8FAFC] to-white">
                    <div className="flex items-center justify-between gap-2 mb-3">
                      {/* Category Label */}
                      <span className="text-xs font-bold uppercase tracking-wider text-[#0284C7] bg-[#E0F2FE] px-2.5 py-1 rounded-md border border-[#BAE6FD]">
                        {project.projectType || (project.category ? project.category.replace(/_/g, ' ') : 'Project')}
                      </span>

                      {liveLink && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#0369A1] bg-[#E0F2FE]/60 px-2 py-0.5 rounded-full border border-[#BAE6FD]">
                          Live
                        </span>
                      )}
                    </div>

                    {/* Project Title & Icon Header */}
                    <div className="flex items-start gap-3.5">
                      <div className="w-11 h-11 rounded-xl bg-[#0B1B3A] flex items-center justify-center shrink-0 shadow-sm group-hover:bg-[#0284C7] transition-colors duration-300">
                        <DynamicIcon name={project.accentIcon} className="w-5 h-5 text-[#0EA5E9] group-hover:text-white transition-colors" fallback="Code2" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-[#0B1B3A] font-display leading-tight group-hover:text-[#0284C7] transition-colors line-clamp-1">
                          {projectTitle}
                        </h3>
                        <p className="text-xs font-medium text-[#64748B] mt-0.5 line-clamp-1">
                          {project.subtitle || (project.category ? project.category.replace(/_/g, ' ') : 'Engineered Solution')}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 flex-1 flex flex-col justify-between bg-white">
                    <div>
                      {/* Description */}
                      <p className="text-sm text-[#334155] leading-relaxed line-clamp-3">
                        {projectDesc}
                      </p>

                      {/* Technology Tags */}
                      {technologies.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-1.5">
                          {technologies.slice(0, 4).map((tech, idx) => (
                            <span
                              key={idx}
                              className="px-2.5 py-1 rounded-md bg-[#F1F5F9] text-[#334155] text-xs font-semibold border border-[#CBD5E1]"
                            >
                              {tech}
                            </span>
                          ))}
                          {technologies.length > 4 && (
                            <span className="px-2 py-1 rounded-md bg-[#F1F5F9] text-[#64748B] text-xs font-semibold border border-[#CBD5E1]">
                              +{technologies.length - 4}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Bottom Action Footer */}
                    <div className="mt-6 pt-4 border-t border-[#E2E8F0] flex items-center justify-between">
                      <span className="inline-flex items-center gap-2 text-xs font-bold text-[#0B1B3A] group-hover:text-[#0284C7] transition-colors">
                        <span>View Project Details</span>
                        <ArrowRight className="w-4 h-4 text-[#0284C7] transition-transform group-hover:translate-x-1" />
                      </span>

                      {liveLink && (
                        <a
                          href={liveLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-[#0284C7] hover:text-[#0369A1] hover:underline"
                          title="Open Live Preview"
                        >
                          <span>Live Demo</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
}
