import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Calendar, Clock, User, ArrowLeft, ArrowRight, Share2, Tag, Check, Sparkles } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BlogContent from '../components/public/BlogContent';
import BlogCard from '../components/public/BlogCard';
import { blogService } from '../services/blogService';
import { useToast } from '../context/ToastContext';

export default function BlogDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [blog, setBlog] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  useEffect(() => {
    let isMounted = true;
    const fetchArticle = async () => {
      setLoading(true);
      setNotFound(false);
      try {
        const article = await blogService.getBlogBySlug(slug);
        if (!isMounted) return;

        setBlog(article);

        // Update document SEO Title & Meta tags
        document.title = `${article.seoTitle || article.title} | Yovexa Solutions`;

        // Fetch related articles
        const allPublished = await blogService.getPublicBlogs();
        const related = allPublished
          .filter((b) => b.id !== article.id)
          .slice(0, 2);
        if (isMounted) setRelatedBlogs(related);
      } catch (err) {
        if (isMounted) setNotFound(true);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchArticle();

    return () => {
      isMounted = false;
      document.title = 'Yovexa Solutions | Digital Solutions & Software Development';
    };
  }, [slug]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: blog?.title,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      addToast('Article link copied to clipboard!', 'success');
    }
  };

  if (notFound) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
        <Navbar />
        <main className="flex-1 flex items-center justify-center py-32 px-4 text-center">
          <div className="max-w-md mx-auto space-y-4">
            <h1 className="text-4xl font-extrabold text-[#0B1B3A] font-display">404</h1>
            <h2 className="text-xl font-bold text-[#0B1B3A]">Article Not Found</h2>
            <p className="text-sm text-[#475569]">
              The blog article you are looking for might have been moved, removed, or is currently in draft state.
            </p>
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0B1B3A] text-white text-xs font-bold hover:bg-[#183B75] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to All Articles</span>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (loading || !blog) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
        <Navbar />
        <main className="flex-1 max-w-4xl mx-auto w-full px-4 pt-36 pb-24 space-y-6 animate-pulse">
          <div className="h-6 bg-slate-200 rounded w-1/4" />
          <div className="h-12 bg-slate-200 rounded w-4/5" />
          <div className="h-6 bg-slate-200 rounded w-1/3" />
          <div className="h-96 bg-slate-200 rounded-2xl" />
          <div className="space-y-3 pt-6">
            <div className="h-4 bg-slate-200 rounded w-full" />
            <div className="h-4 bg-slate-200 rounded w-full" />
            <div className="h-4 bg-slate-200 rounded w-2/3" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const formattedDate = blog.publishedAt || blog.createdAt
    ? new Date(blog.publishedAt || blog.createdAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Recently Published';

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-[#0B1B3A] font-sans">
      <Navbar />

      <main className="flex-1 pt-28 pb-24">
        
        {/* Article Header */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Breadcrumb & Navigation */}
          <div className="flex items-center justify-between gap-4 mb-6">
            <Link
              to="/blog"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0EA5E9] hover:text-[#0284C7] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Articles</span>
            </Link>

            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#E2E8F0] hover:bg-[#F1F5F9] text-xs font-semibold text-[#334155] transition-colors"
              title="Share article link"
            >
              <Share2 className="w-3.5 h-3.5 text-[#0EA5E9]" />
              <span>Share</span>
            </button>
          </div>

          {/* Category Pill */}
          <div className="mb-4">
            <span className="inline-block px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-[#E0F2FE] text-[#0369A1] border border-[#BAE6FD]">
              {blog.category}
            </span>
          </div>

          {/* Article Main Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0B1B3A] tracking-tight font-display leading-[1.18]">
            {blog.title}
          </h1>

          {/* Meta Information Bar */}
          <div className="mt-6 pb-6 border-b border-[#E2E8F0] flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-[#475569] font-medium">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-[#0B1B3A] text-white flex items-center justify-center font-bold text-xs">
                {blog.author?.charAt(0) || 'Y'}
              </div>
              <span className="font-bold text-[#0B1B3A]">{blog.author}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-[#0EA5E9]" />
              <span>{formattedDate}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#0EA5E9]" />
              <span>{blog.readingTime || '5 min read'}</span>
            </div>
          </div>

          {/* Featured Image */}
          {blog.featuredImage && (
            <div className="my-8 rounded-2xl overflow-hidden border border-[#E2E8F0] shadow-md bg-slate-100 max-h-[480px]">
              <img
                src={blog.featuredImage}
                alt={blog.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          )}

          {/* Article Formatted Body Content */}
          <article className="py-2">
            <BlogContent htmlContent={blog.content} />
          </article>

          {/* Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="mt-12 pt-6 border-t border-[#E2E8F0] flex items-center flex-wrap gap-2">
              <span className="text-xs font-bold text-[#0B1B3A] mr-2">Tags:</span>
              {blog.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-md bg-[#F1F5F9] text-[#334155] text-xs font-semibold border border-[#CBD5E1]"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* In-Article CTA Banner */}
          <div className="mt-14 p-8 rounded-2xl bg-[#081A33] text-white border border-white/15 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6 tech-grid-dark">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-[#0EA5E9]/20 text-[#38BDF8] text-xs font-mono font-bold mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Partner With Yovexa</span>
              </div>
              <h3 className="text-xl font-bold font-display">Have a project in mind?</h3>
              <p className="text-xs sm:text-sm text-[#E2E8F0] mt-1">
                Let's discuss how our software engineering team can build your solution.
              </p>
            </div>

            <a
              href="/#contact"
              className="shrink-0 px-6 py-3 rounded-xl font-bold text-xs sm:text-sm text-white bg-[#0EA5E9] hover:bg-[#0284C7] transition-all shadow-sm"
            >
              Let's Talk
            </a>
          </div>

          {/* Related Articles */}
          {relatedBlogs.length > 0 && (
            <div className="mt-20 pt-10 border-t border-[#E2E8F0]">
              <h3 className="text-2xl font-bold text-[#0B1B3A] font-display mb-8">
                Related Articles
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {relatedBlogs.map((item) => (
                  <BlogCard key={item.id} blog={item} />
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
