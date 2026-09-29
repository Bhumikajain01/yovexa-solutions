import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Search, BookOpen, ArrowRight, ExternalLink } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { caseStudyService } from '../services/caseStudyService';

export default function CaseStudyListingPage() {
  const [caseStudies, setCaseStudies] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Case Studies | Yovexa Solutions';
  }, []);

  useEffect(() => {
    let isMounted = true;
    const fetchCaseStudies = async () => {
      setLoading(true);
      try {
        const [data, catData] = await Promise.all([
          caseStudyService.getCaseStudies({
            publishedOnly: true,
            search,
            category: activeCategory,
          }),
          caseStudyService.getCategories(),
        ]);
        if (isMounted) {
          setCaseStudies(data);
          setCategories(catData);
        }
      } catch (err) {
        console.error('Failed to load case studies:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchCaseStudies, 200);
    return () => {
      isMounted = false;
      clearTimeout(debounceTimer);
    };
  }, [search, activeCategory]);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-[#0B1B3A] font-sans">
      <Navbar />

      <main className="flex-1 pt-28 pb-24">
        {/* Case Studies Hero Header */}
        <section className="bg-white border-b border-[#E2E8F0] text-[#0B1B3A] py-16 sm:py-20 relative tech-grid-bg overflow-hidden mb-12 shadow-sm">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#0EA5E9]/5 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E0F2FE] border border-[#BAE6FD] text-[#0369A1] text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#0284C7]" />
              <span>Architectural Breakdowns</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#0B1B3A] tracking-tight font-display">
              Technical <span className="text-[#0284C7]">Case Studies</span>
            </h1>

            <p className="mt-4 text-base sm:text-lg text-[#334155] max-w-2xl mx-auto font-normal">
              In-depth technical breakdowns of challenges solved, engineering architectures, and business outcomes.
            </p>

            {/* Search Input */}
            <div className="mt-8 max-w-lg mx-auto relative">
              <Search className="w-5 h-5 text-[#64748B] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search case studies by challenge, architecture, or tech..."
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-[#F8FAFC] text-[#0F172A] placeholder-[#64748B] text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#0EA5E9] focus:bg-white shadow-sm border border-[#CBD5E1]"
              />
            </div>
          </div>
        </section>

        {/* Content Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 no-scrollbar">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 shrink-0 ${
                    isActive
                      ? 'bg-[#0B1B3A] text-white shadow-md ring-2 ring-[#0EA5E9]'
                      : 'bg-white text-[#334155] hover:bg-[#F1F5F9] hover:text-[#0B1B3A] border border-[#E2E8F0]'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Case Studies Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((n) => (
                <div key={n} className="rounded-2xl bg-white border border-[#E2E8F0] p-6 space-y-4 animate-pulse">
                  <div className="h-48 bg-slate-200 rounded-xl" />
                  <div className="h-4 bg-slate-200 rounded w-1/3" />
                  <div className="h-6 bg-slate-200 rounded w-4/5" />
                  <div className="h-16 bg-slate-200 rounded w-full" />
                </div>
              ))}
            </div>
          ) : caseStudies.length === 0 ? (
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-16 text-center shadow-sm max-w-2xl mx-auto">
              <div className="w-14 h-14 rounded-2xl bg-[#E0F2FE] text-[#0284C7] flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-[#0B1B3A]">
                {search ? 'No matching case studies found' : 'No case studies available yet.'}
              </h3>
              <p className="text-sm text-[#64748B] mt-2 max-w-md mx-auto leading-relaxed">
                {search
                  ? `No case studies match "${search}". Try searching for another architecture or keyword.`
                  : 'Our engineering team is currently documenting our latest enterprise architectures and technical breakdowns. Check back soon!'}
              </p>
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="mt-5 px-5 py-2.5 rounded-xl bg-[#0B1B3A] text-white text-xs font-bold hover:bg-[#183B75] transition-colors"
                >
                  Clear Search
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {caseStudies.map((cs) => {
                const technologies = Array.isArray(cs.technologies)
                  ? cs.technologies
                  : (typeof cs.technologies === 'string' ? cs.technologies.split(',').map(s => s.trim()).filter(Boolean) : []);

                return (
                  <Link
                    key={cs.id || cs.slug}
                    to={`/case-studies/${cs.slug || cs.id}`}
                    className="group relative flex flex-col justify-between rounded-2xl bg-white border border-[#E2E8F0] hover:border-[#0284C7]/50 shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden transform hover:-translate-y-1"
                  >
                    {/* Case Study Image Banner */}
                    {cs.featuredImage ? (
                      <div className="relative h-48 w-full overflow-hidden bg-slate-100 border-b border-[#E2E8F0]">
                        <img
                          src={cs.featuredImage}
                          alt={cs.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          onError={(e) => {
                            e.currentTarget.parentElement.style.display = 'none';
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1B3A]/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    ) : null}

                    {/* Card Header */}
                    <div className="relative p-6 border-b border-[#E2E8F0]/70 bg-gradient-to-b from-[#F8FAFC] to-white">
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#0284C7] bg-[#E0F2FE] px-2.5 py-1 rounded-md border border-[#BAE6FD]">
                          {cs.category ? cs.category.replace(/_/g, ' ') : 'Case Study'}
                        </span>

                        {cs.projectReference && (
                          <span className="text-[11px] font-semibold text-[#475569] bg-[#F1F5F9] px-2 py-0.5 rounded border border-[#CBD5E1] truncate max-w-[140px]">
                            {cs.projectReference}
                          </span>
                        )}
                      </div>

                      <h3 className="text-lg font-bold text-[#0B1B3A] font-display leading-tight group-hover:text-[#0284C7] transition-colors line-clamp-2">
                        {cs.title}
                      </h3>
                      {cs.subtitle && (
                        <p className="text-xs font-medium text-[#64748B] mt-1 line-clamp-1">
                          {cs.subtitle}
                        </p>
                      )}
                    </div>

                    {/* Card Body */}
                    <div className="p-6 flex-1 flex flex-col justify-between bg-white">
                      <div>
                        {cs.problem && (
                          <div className="mb-3 p-3 rounded-lg bg-rose-50/60 border border-rose-100 text-xs">
                            <span className="font-extrabold uppercase text-rose-700 block mb-0.5 tracking-wider text-[10px]">
                              Challenge
                            </span>
                            <p className="text-[#334155] line-clamp-2 leading-relaxed">
                              {cs.problem}
                            </p>
                          </div>
                        )}

                        <p className="text-xs text-[#64748B] leading-relaxed line-clamp-3">
                          {cs.summary || cs.solution}
                        </p>

                        {/* Tech tags */}
                        {technologies.length > 0 && (
                          <div className="mt-4 flex flex-wrap gap-1.5">
                            {technologies.slice(0, 4).map((tech, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-0.5 rounded-md bg-[#F1F5F9] text-[#334155] text-[11px] font-mono font-semibold border border-[#CBD5E1]"
                              >
                                {tech}
                              </span>
                            ))}
                            {technologies.length > 4 && (
                              <span className="px-2 py-0.5 rounded-md bg-[#F1F5F9] text-[#64748B] text-[11px] font-semibold border border-[#CBD5E1]">
                                +{technologies.length - 4}
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Card Footer */}
                      <div className="mt-6 pt-4 border-t border-[#E2E8F0] flex items-center justify-between">
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0B1B3A] group-hover:text-[#0284C7] transition-colors">
                          <span>Read Full Case Study</span>
                          <ArrowRight className="w-4 h-4 text-[#0284C7] transition-transform group-hover:translate-x-1" />
                        </span>

                        {cs.liveUrl && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#0369A1]">
                            <span>Live</span>
                            <ExternalLink className="w-3 h-3" />
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
