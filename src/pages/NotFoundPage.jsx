import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-[#0B1B3A]">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 py-24 sm:py-32">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-[#E0F2FE] text-[#0EA5E9] font-black text-3xl shadow-glow-cyan-sm">
            404
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-black tracking-tight text-[#0B1B3A]">
              Page Not Found
            </h1>
            <p className="text-sm text-[#475569] leading-relaxed">
              The page you're looking for doesn't exist or has been moved.
            </p>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#0B1B3A] hover:bg-[#183B75] text-white font-bold text-sm shadow-md transition-colors"
            >
              <Home className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>
            <Link
              to="/blog"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white border border-[#CBD5E1] hover:bg-[#F1F5F9] text-[#0B1B3A] font-bold text-sm transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Browse Blog</span>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
