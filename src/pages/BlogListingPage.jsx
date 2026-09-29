import React, { useState, useEffect } from 'react';
import { Sparkles, Search, BookOpen, Layers } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BlogCard from '../components/public/BlogCard';
import { blogService } from '../services/blogService';

export default function BlogListingPage() {
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([
    { id: 'all', label: 'All Articles' },
  ]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Dynamically load categories from backend blog categories API
  useEffect(() => {
    let isMounted = true;
    blogService.getCategories()
      .then(catData => {
        if (isMounted && Array.isArray(catData) && catData.length > 0) {
          setCategories(catData);
        }
      })
      .catch(err => console.warn('Failed to load blog categories:', err));
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    let isMounted = true;
    const fetchBlogs = async () => {
      setLoading(true);
      try {
        const data = await blogService.getPublicBlogs({
          search,
          category: activeCategory,
        });
        if (isMounted) setBlogs(data);
      } catch (err) {
        console.error('Failed to load blogs:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchBlogs, 200);
    return () => {
      isMounted = false;
      clearTimeout(debounceTimer);
    };
  }, [search, activeCategory]);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-[#0B1B3A] font-sans">
      {/* Public Sticky Navbar */}
      <Navbar />

      <main className="flex-1 pt-28 pb-24">
        {/* Blog Hero Header */}
        <section className="bg-white border-b border-[#E2E8F0] text-[#0B1B3A] py-16 sm:py-20 relative tech-grid-bg overflow-hidden mb-12 shadow-sm">
          {/* Subtle Glows */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#0EA5E9]/5 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E0F2FE] border border-[#BAE6FD] text-[#0369A1] text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#0284C7]" />
              <span>Yovexa Insights & Ideas</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#0B1B3A] tracking-tight font-display">
              Insights & <span className="text-[#0284C7]">Ideas</span>
            </h1>

            <p className="mt-4 text-base sm:text-lg text-[#334155] max-w-2xl mx-auto font-normal">
              Explore practical insights, technology trends, and engineering ideas from Yovexa Solutions.
            </p>

            {/* Search Input */}
            <div className="mt-8 max-w-lg mx-auto relative">
              <Search className="w-5 h-5 text-[#64748B] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search articles by topic, title, or tag..."
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

          {/* Blog Cards Grid */}
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
          ) : blogs.length === 0 ? (
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-16 text-center shadow-sm">
              <div className="w-14 h-14 rounded-2xl bg-[#E0F2FE] text-[#0284C7] flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-[#0B1B3A]">No articles found</h3>
              <p className="text-sm text-[#64748B] mt-1.5 max-w-md mx-auto">
                {search
                  ? `No published articles match "${search}". Try searching for another topic.`
                  : 'New articles will be published soon. Stay tuned!'}
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
              {blogs.map((blog) => (
                <BlogCard key={blog.id} blog={blog} />
              ))}
            </div>
          )}

        </div>
      </main>

      {/* Public Footer */}
      <Footer />
    </div>
  );
}
