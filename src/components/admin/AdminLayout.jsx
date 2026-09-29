import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Menu } from 'lucide-react';
import AdminSidebar from './AdminSidebar';

export default function AdminLayout() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const location = useLocation();

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/admin/dashboard') return 'Dashboard Overview';
    if (path === '/admin/content/hero') return 'Hero Sections Management';
    if (path === '/admin/content/hero/create') return 'Create Hero Section';
    if (path.startsWith('/admin/content/hero/edit')) return 'Edit Hero Section';
    if (path.startsWith('/admin/content/hero/')) return 'Hero Section Details';
    if (path === '/admin/content/about') return 'About Sections Management';
    if (path === '/admin/content/about/create') return 'Create About Section';
    if (path.startsWith('/admin/content/about/edit')) return 'Edit About Section';
    if (path.startsWith('/admin/content/about/')) return 'About Section Details';
    if (path === '/admin/services') return 'Services Management';
    if (path === '/admin/projects') return 'Portfolio Projects Management';
    if (path === '/admin/projects/create') return 'Create Portfolio Project';
    if (path.startsWith('/admin/projects/edit')) return 'Edit Portfolio Project';
    if (path === '/admin/content/contact') return 'Contact Information Management';
    if (path === '/admin/content/footer') return 'Footer & Socials Management';
    if (path === '/admin/inquiries') return 'Contact Form Inquiries';
    if (path === '/admin/blogs') return 'Blog Posts Management';
    if (path === '/admin/blogs/create') return 'Create New Article';
    if (path.startsWith('/admin/blogs/edit')) return 'Edit Blog Article';
    return 'Admin Panel';
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0B1B3A] flex">
      {/* Sidebar */}
      <AdminSidebar
        isMobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
        isExpanded={isSidebarExpanded}
        onHoverChange={setIsSidebarExpanded}
      />

      {/* Main Content Area — shifts smoothly when sidebar expands/collapses */}
      <div 
        className={`flex-1 flex flex-col min-w-0 transition-[padding] duration-300 ease-in-out ${
          isSidebarExpanded ? 'lg:pl-[288px]' : 'lg:pl-[72px]'
        }`}
      >
        {/* Topbar */}
        <header className="sticky top-0 z-30 bg-white border-b border-[#E2E8F0] px-6 sm:px-8 lg:px-10 py-4 sm:py-5 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-[#334155] hover:bg-[#F1F5F9] focus:outline-none"
              aria-label="Open sidebar menu"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-[#0B1B3A] font-display">
                {getPageTitle()}
              </h1>
            </div>
          </div>
        </header>

        {/* Dynamic Nested Page Route View — Uses full available viewport width */}
        <main className="flex-1 w-full px-6 sm:px-8 lg:px-10 py-6 sm:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
