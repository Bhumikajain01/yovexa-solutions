import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  ExternalLink,
  Check,
  Sparkles,
  BookOpen,
  Layers,
  ArrowRight
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { caseStudyService } from '../services/caseStudyService';

function GithubIcon({ className = "w-3.5 h-3.5" }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"/>
    </svg>
  );
}

export default function CaseStudyDetailPage() {
  const { slug } = useParams();

  const [caseStudy, setCaseStudy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [relatedStudies, setRelatedStudies] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  useEffect(() => {
    let isMounted = true;
    const fetchCaseStudy = async () => {
      try {
        setLoading(true);
        setNotFound(false);
        const data = await caseStudyService.getCaseStudyBySlug(slug);
        if (!isMounted) return;
        setCaseStudy(data);

        // Update document title for SEO
        document.title = `${data.title} - Technical Case Study | Yovexa Solutions`;

        // Fetch related studies
        const allPublished = await caseStudyService.getCaseStudies({ publishedOnly: true });
        const related = allPublished.filter(cs => cs.id !== data.id && cs.slug !== data.slug).slice(0, 2);
        if (isMounted) setRelatedStudies(related);
      } catch (err) {
        if (isMounted) setNotFound(true);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchCaseStudy();

    return () => {
      isMounted = false;
      document.title = 'Yovexa Solutions | Digital Solutions & Software Development';
    };
  }, [slug]);

  if (notFound) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
        <Navbar />
        <main className="flex-1 flex items-center justify-center py-32 px-4 text-center">
          <div className="max-w-md mx-auto space-y-4">
            <h1 className="text-4xl font-extrabold text-[#0B1B3A] font-display">404</h1>
            <h2 className="text-xl font-bold text-[#0B1B3A]">Case Study Not Found</h2>
            <p className="text-sm text-[#475569]">
              The technical case study you are looking for might have been moved, removed, or is currently in draft state.
            </p>
            <Link
              to="/case-studies"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0B1B3A] text-white text-xs font-bold hover:bg-[#183B75] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Case Studies</span>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (loading || !caseStudy) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
        <Navbar />
        <main className="flex-1 max-w-4xl mx-auto w-full px-4 pt-36 pb-24 space-y-6 animate-pulse">
          <div className="h-6 bg-slate-200 rounded w-1/4" />
          <div className="h-12 bg-slate-200 rounded w-4/5" />
          <div className="h-64 bg-slate-200 rounded-2xl" />
          <div className="space-y-3 pt-6">
            <div className="h-4 bg-slate-200 rounded w-full" />
            <div className="h-4 bg-slate-200 rounded w-full" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const featuresList = Array.isArray(caseStudy.features)
    ? caseStudy.features
    : (typeof caseStudy.features === 'string' ? caseStudy.features.split('\n').filter(Boolean) : []);

  const techList = Array.isArray(caseStudy.technologies)
    ? caseStudy.technologies
    : (typeof caseStudy.technologies === 'string' ? caseStudy.technologies.split(',').map(s => s.trim()).filter(Boolean) : []);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-[#0B1B3A] font-sans">
      <Navbar />

      <main className="flex-1 pt-28 pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top Breadcrumb */}
          <div className="mb-6">
            <Link
              to="/case-studies"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0EA5E9] hover:text-[#0284C7] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Case Studies</span>
            </Link>
          </div>

          {/* Header Badges */}
          <div className="flex flex-wrap items-center gap-2.5 mb-3">
            <span className="px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-[#E0F2FE] text-[#0369A1] border border-[#BAE6FD]">
              {caseStudy.category ? caseStudy.category.replace(/_/g, ' ') : 'Case Study'}
            </span>
            {caseStudy.clientLabel && (
              <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-[#F1F5F9] text-[#475569] border border-[#CBD5E1]">
                {caseStudy.clientLabel}
              </span>
            )}
            {caseStudy.projectReference && (
              <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                Project: {caseStudy.projectReference}
              </span>
            )}
          </div>

          {/* Title & Subtitle */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0B1B3A] tracking-tight font-display leading-tight">
            {caseStudy.title}
          </h1>
          {caseStudy.subtitle && (
            <p className="mt-2 text-base sm:text-lg text-[#0284C7] font-semibold">
              {caseStudy.subtitle}
            </p>
          )}

          {/* Featured Hero Thumbnail / Architecture Diagram */}
          {caseStudy.featuredImage && (
            <div className="my-8 rounded-2xl overflow-hidden border border-[#E2E8F0] shadow-md bg-slate-100 max-h-[460px]">
              <img
                src={caseStudy.featuredImage}
                alt={caseStudy.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          )}

          {/* Executive Briefing / Architecture Overview */}
          <div className="p-6 rounded-2xl bg-white text-[#0B1B3A] border border-[#E2E8F0] shadow-card mb-10">
            <h3 className="text-xs font-mono font-bold uppercase text-[#0284C7] tracking-wider mb-2">
              Case Study Executive Briefing
            </h3>
            <p className="text-sm sm:text-base text-[#334155] leading-relaxed font-normal">
              {caseStudy.summary}
            </p>

            {/* Action buttons (only rendered when configured) */}
            {(caseStudy.liveUrl || caseStudy.githubUrl) && (
              <div className="mt-5 pt-4 border-t border-[#E2E8F0] flex flex-wrap items-center gap-3">
                {caseStudy.liveUrl && (
                  <a
                    href={caseStudy.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0EA5E9] hover:bg-[#0284C7] text-white text-xs font-bold transition-all shadow-sm"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>View Reference System</span>
                  </a>
                )}
                {caseStudy.githubUrl && (
                  <a
                    href={caseStudy.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0B1B3A] hover:bg-[#183B75] border border-[#CBD5E1] text-white text-xs font-bold transition-all shadow-sm"
                  >
                    <GithubIcon className="w-3.5 h-3.5 text-[#38BDF8]" />
                    <span>Architecture Repo</span>
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Deep Problem & Technical Solution Breakdown Cards */}
          <div className="space-y-6 mb-10">
            {caseStudy.problem && (
              <div className="p-6 sm:p-7 rounded-2xl bg-white border border-rose-100 shadow-sm space-y-2">
                <span className="text-xs font-extrabold uppercase tracking-wider text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded border border-rose-200 inline-block">
                  Business Challenge & Problem Statement
                </span>
                <p className="text-sm text-[#334155] leading-relaxed pt-1 whitespace-pre-line">
                  {caseStudy.problem}
                </p>
              </div>
            )}

            {caseStudy.solution && (
              <div className="p-6 sm:p-7 rounded-2xl bg-white border border-emerald-100 shadow-sm space-y-2">
                <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200 inline-block">
                  Technical Solution & Implementation
                </span>
                <p className="text-sm text-[#334155] leading-relaxed pt-1 whitespace-pre-line">
                  {caseStudy.solution}
                </p>
              </div>
            )}
          </div>

          {/* Key Architectural Features */}
          {featuresList.length > 0 && (
            <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm mb-10">
              <h3 className="text-lg font-bold text-[#0B1B3A] font-display mb-4">
                Key Architectural Features
              </h3>
              <div className="space-y-3">
                {featuresList.map((feat, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#E0F2FE] text-[#0284C7] flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                    <span className="text-xs sm:text-sm text-[#334155] font-medium leading-relaxed">
                      {feat}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Technology & Tooling Stack */}
          {techList.length > 0 && (
            <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm mb-10">
              <h3 className="text-xs font-extrabold text-[#0B1B3A] uppercase tracking-wider mb-3">
                Technologies & Architecture Stack
              </h3>
              <div className="flex flex-wrap gap-2">
                {techList.map((tech, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 rounded-lg bg-[#F8FAFC] text-[#0B1B3A] text-xs font-mono font-bold border border-[#CBD5E1]"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* CTA Banner */}
          <div className="p-8 rounded-2xl bg-white text-[#0B1B3A] border border-[#E2E8F0] shadow-card flex flex-col sm:flex-row items-center justify-between gap-6 tech-grid-bg">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E0F2FE] border border-[#BAE6FD] text-[#0369A1] text-xs font-bold mb-2 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-[#0284C7]" />
                <span>Custom Architecture Design</span>
              </div>
              <h3 className="text-xl font-bold font-display text-[#0B1B3A]">Facing a similar technical challenge?</h3>
              <p className="text-xs sm:text-sm text-[#475569] mt-1">
                Our architects can design and build high-performance systems for your organization.
              </p>
            </div>

            <a
              href="/#contact"
              className="shrink-0 px-6 py-3 rounded-xl font-bold text-xs sm:text-sm text-white bg-[#0EA5E9] hover:bg-[#0284C7] transition-all shadow-sm transform hover:-translate-y-0.5 active:translate-y-0"
            >
              Schedule Consultation
            </a>
          </div>

          {/* Related Case Studies */}
          {relatedStudies.length > 0 && (
            <div className="mt-16 pt-8 border-t border-[#E2E8F0]">
              <h3 className="text-xl font-bold text-[#0B1B3A] font-display mb-6">
                Explore More Case Studies
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {relatedStudies.map((cs) => (
                  <Link
                    key={cs.id}
                    to={`/case-studies/${cs.slug || cs.id}`}
                    className="p-5 rounded-2xl bg-white border border-[#E2E8F0] hover:border-[#0EA5E9] shadow-sm transition-all group"
                  >
                    <span className="text-[10px] font-bold uppercase text-[#0284C7] tracking-wider">
                      {cs.category}
                    </span>
                    <h4 className="text-base font-bold text-[#0B1B3A] group-hover:text-[#0284C7] transition-colors mt-1 font-display">
                      {cs.title}
                    </h4>
                    <p className="text-xs text-[#64748B] line-clamp-2 mt-1">
                      {cs.summary || cs.problem}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
