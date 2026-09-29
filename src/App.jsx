import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';

// Public Pages
import HomePage from './pages/HomePage';
import PortfolioPage from './pages/PortfolioPage';
import BlogListingPage from './pages/BlogListingPage';
import BlogDetailPage from './pages/BlogDetailPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import CaseStudyListingPage from './pages/CaseStudyListingPage';
import CaseStudyDetailPage from './pages/CaseStudyDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import NotFoundPage from './pages/NotFoundPage';

// Admin Components & Pages
import ProtectedRoute from './components/common/ProtectedRoute';
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminBlogsPage from './pages/admin/AdminBlogsPage';
import AdminCreateBlogPage from './pages/admin/AdminCreateBlogPage';
import AdminEditBlogPage from './pages/admin/AdminEditBlogPage';

// Hero Section CRUD Pages
import AdminHeroListPage from './pages/admin/AdminHeroListPage';
import AdminCreateHeroPage from './pages/admin/AdminCreateHeroPage';
import AdminEditHeroPage from './pages/admin/AdminEditHeroPage';
import AdminViewHeroPage from './pages/admin/AdminViewHeroPage';

// About Section CRUD Pages
import AdminAboutListPage from './pages/admin/AdminAboutListPage';
import AdminCreateAboutPage from './pages/admin/AdminCreateAboutPage';
import AdminEditAboutPage from './pages/admin/AdminEditAboutPage';
import AdminViewAboutPage from './pages/admin/AdminViewAboutPage';

// Other Admin Pages
import AdminServicesPage from './pages/admin/AdminServicesPage';
import AdminProjectsPage from './pages/admin/AdminProjectsPage';
import AdminCreateProjectPage from './pages/admin/AdminCreateProjectPage';
import AdminEditProjectPage from './pages/admin/AdminEditProjectPage';
import AdminCaseStudiesPage from './pages/admin/AdminCaseStudiesPage';
import AdminCreateCaseStudyPage from './pages/admin/AdminCreateCaseStudyPage';
import AdminEditCaseStudyPage from './pages/admin/AdminEditCaseStudyPage';
import AdminContactContentPage from './pages/admin/AdminContactContentPage';
import AdminFooterContentPage from './pages/admin/AdminFooterContentPage';
import AdminInquiriesPage from './pages/admin/AdminInquiriesPage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/portfolio" element={<PortfolioPage />} />
            <Route path="/portfolio/:slug" element={<ProjectDetailPage />} />
            <Route path="/projects/:slug" element={<ProjectDetailPage />} />
            <Route path="/case-studies" element={<CaseStudyListingPage />} />
            <Route path="/case-studies/:slug" element={<CaseStudyDetailPage />} />
            <Route path="/blog" element={<BlogListingPage />} />
            <Route path="/blog/:slug" element={<BlogDetailPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected Admin Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboardPage />} />
              
              {/* Blog Management */}
              <Route path="blogs" element={<AdminBlogsPage />} />
              <Route path="blogs/create" element={<AdminCreateBlogPage />} />
              <Route path="blogs/edit/:id" element={<AdminEditBlogPage />} />

              {/* Hero Section CRUD */}
              <Route path="content/hero" element={<AdminHeroListPage />} />
              <Route path="content/hero/create" element={<AdminCreateHeroPage />} />
              <Route path="content/hero/edit/:id" element={<AdminEditHeroPage />} />
              <Route path="content/hero/:id" element={<AdminViewHeroPage />} />

              {/* About Section CRUD */}
              <Route path="content/about" element={<AdminAboutListPage />} />
              <Route path="content/about/create" element={<AdminCreateAboutPage />} />
              <Route path="content/about/edit/:id" element={<AdminEditAboutPage />} />
              <Route path="content/about/:id" element={<AdminViewAboutPage />} />

              {/* Other CMS Sections */}
              <Route path="services" element={<AdminServicesPage />} />

              {/* Projects Management */}
              <Route path="projects" element={<AdminProjectsPage />} />
              <Route path="projects/create" element={<AdminCreateProjectPage />} />
              <Route path="projects/new" element={<AdminCreateProjectPage />} />
              <Route path="projects/edit/:id" element={<AdminEditProjectPage />} />
              <Route path="projects/:id/edit" element={<AdminEditProjectPage />} />

              {/* Case Studies Management */}
              <Route path="case-studies" element={<AdminCaseStudiesPage />} />
              <Route path="case-studies/create" element={<AdminCreateCaseStudyPage />} />
              <Route path="case-studies/new" element={<AdminCreateCaseStudyPage />} />
              <Route path="case-studies/edit/:id" element={<AdminEditCaseStudyPage />} />
              <Route path="case-studies/:id/edit" element={<AdminEditCaseStudyPage />} />

              <Route path="content/contact" element={<AdminContactContentPage />} />
              <Route path="content/footer" element={<AdminFooterContentPage />} />

              {/* Contact Inquiries */}
              <Route path="inquiries" element={<AdminInquiriesPage />} />
            </Route>

            {/* Catch-all 404 Route */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
