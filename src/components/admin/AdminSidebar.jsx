import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Globe,
  FileText,
  MessageSquare,
  Sparkles,
  Layers,
  ChevronDown,
  ChevronRight,
  LogOut,
  ExternalLink,
  X,
  Info,
  Briefcase,
  GitMerge,
  Phone,
  LayoutTemplate,
  BookOpen
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import Logo from '../Logo';

export default function AdminSidebar({ 
  isMobileOpen, 
  onCloseMobile, 
  isExpanded = false, 
  onHoverChange = () => {} 
}) {
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  // Collapsible website content sub-menu state
  const isContentActive = location.pathname.startsWith('/admin/content') || 
                          location.pathname.startsWith('/admin/services') || 
                          location.pathname.startsWith('/admin/process') || 
                          location.pathname.startsWith('/admin/projects') ||
                          location.pathname.startsWith('/admin/case-studies');

  const [contentMenuOpen, setContentMenuOpen] = useState(true);

  const handleLogout = () => {
    logout();
    showToast('Logged out successfully', 'info');
    navigate('/login');
  };

  const contentSubItems = [
    { label: 'Hero Section', path: '/admin/content/hero', icon: Sparkles },
    { label: 'About Section', path: '/admin/content/about', icon: Info },
    { label: 'Services', path: '/admin/services', icon: Briefcase },
    { label: 'Portfolio Projects', path: '/admin/projects', icon: Layers },
    { label: 'Case Studies', path: '/admin/case-studies', icon: BookOpen },
    { label: 'Contact Info', path: '/admin/content/contact', icon: Phone },
    { label: 'Footer Content', path: '/admin/content/footer', icon: LayoutTemplate },
  ];

  // Whether the sidebar UI is effectively expanded (either desktop hover OR mobile drawer)
  const isDesktopExpanded = isExpanded;
  const isEffectiveExpanded = isMobileOpen || isDesktopExpanded;

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-[#081A33]/70 backdrop-blur-sm lg:hidden animate-in fade-in"
        />
      )}

      {/* Sidebar Container */}
      <aside
        onMouseEnter={() => onHoverChange(true)}
        onMouseLeave={() => onHoverChange(false)}
        onFocus={() => onHoverChange(true)}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget)) {
            onHoverChange(false);
          }
        }}
        className={`fixed top-0 bottom-0 left-0 z-50 bg-[#081A33] text-white border-r border-white/10 flex flex-col justify-between transition-all duration-300 ease-in-out select-none ${
          isMobileOpen 
            ? 'translate-x-0 w-[288px]' 
            : '-translate-x-full lg:translate-x-0'
        } ${
          isDesktopExpanded ? 'lg:w-[288px]' : 'lg:w-[72px]'
        }`}
        aria-label="Admin Navigation Sidebar"
      >
        {/* Top Header & Navigation Links */}
        <div className="flex-1 overflow-y-auto no-scrollbar overflow-x-hidden">
          
          {/* Brand Header */}
          <div className="h-16 px-4 border-b border-white/10 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3 overflow-hidden">
              <Logo variant="dark" size="sm" showText={isEffectiveExpanded} />
              {isEffectiveExpanded && (
                <span className="text-[10px] font-mono tracking-widest text-[#38BDF8] uppercase font-bold whitespace-nowrap animate-in fade-in duration-200">
                  CMS
                </span>
              )}
            </div>

            {/* Mobile Close Button */}
            {onCloseMobile && (
              <button
                onClick={onCloseMobile}
                className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 focus:outline-none"
                aria-label="Close sidebar menu"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Navigation Items */}
          <div className="p-3 space-y-1.5">
            
            {/* Section Header */}
            {isEffectiveExpanded ? (
              <div className="px-3 py-1.5 text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider whitespace-nowrap animate-in fade-in duration-150">
                Main Menu
              </div>
            ) : (
              <div className="h-4" />
            )}

            {/* Dashboard Link */}
            <NavLink
              to="/admin/dashboard"
              onClick={onCloseMobile}
              title={!isEffectiveExpanded ? 'Dashboard' : undefined}
              aria-label="Dashboard"
              className={({ isActive }) =>
                `group flex items-center rounded-xl font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-[#0EA5E9] text-white shadow-sm'
                    : 'text-[#CBD5E1] hover:text-white hover:bg-white/5'
                } ${isEffectiveExpanded ? 'px-3 py-2.5 gap-3' : 'w-11 h-11 mx-auto justify-center'}`
              }
            >
              <div className="w-5 h-5 flex items-center justify-center shrink-0">
                <LayoutDashboard className="w-5 h-5" />
              </div>
              {isEffectiveExpanded && (
                <span className="text-sm whitespace-nowrap truncate animate-in fade-in duration-200">
                  Dashboard
                </span>
              )}
            </NavLink>

            {/* Website Content (Collapsible Group) */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => {
                  if (isEffectiveExpanded) {
                    setContentMenuOpen(!contentMenuOpen);
                  }
                }}
                title={!isEffectiveExpanded ? 'Website Content' : undefined}
                aria-label="Website Content"
                className={`w-full flex items-center rounded-xl font-semibold transition-colors duration-200 ${
                  isContentActive 
                    ? 'text-[#38BDF8] bg-white/5 font-bold' 
                    : 'text-[#CBD5E1] hover:text-white hover:bg-white/5'
                } ${isEffectiveExpanded ? 'px-3 py-2.5 justify-between' : 'w-11 h-11 mx-auto justify-center'}`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 flex items-center justify-center shrink-0">
                    <Globe className="w-5 h-5 text-[#38BDF8]" />
                  </div>
                  {isEffectiveExpanded && (
                    <span className="text-sm whitespace-nowrap truncate animate-in fade-in duration-200">
                      Website Content
                    </span>
                  )}
                </div>
                {isEffectiveExpanded && (
                  <div>
                    {contentMenuOpen ? (
                      <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                  </div>
                )}
              </button>

              {/* Sub-items (Shown only when expanded and open) */}
              {isEffectiveExpanded && contentMenuOpen && (
                <div className="ml-4 pl-3 border-l border-white/15 mt-1 space-y-1 animate-in fade-in duration-200">
                  {contentSubItems.map((sub) => {
                    const SubIcon = sub.icon;
                    return (
                      <NavLink
                        key={sub.path}
                        to={sub.path}
                        onClick={onCloseMobile}
                        className={({ isActive }) =>
                          `flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                            isActive
                              ? 'bg-[#0EA5E9] text-white font-bold shadow-sm'
                              : 'text-[#94A3B8] hover:text-white hover:bg-white/5'
                          }`
                        }
                      >
                        <SubIcon className="w-3.5 h-3.5 shrink-0" />
                        <span className="whitespace-nowrap truncate">{sub.label}</span>
                      </NavLink>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Blog Articles */}
            <NavLink
              to="/admin/blogs"
              onClick={onCloseMobile}
              title={!isEffectiveExpanded ? 'Blog Articles' : undefined}
              aria-label="Blog Articles"
              className={({ isActive }) =>
                `flex items-center rounded-xl font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-[#0EA5E9] text-white shadow-sm'
                    : 'text-[#CBD5E1] hover:text-white hover:bg-white/5'
                } ${isEffectiveExpanded ? 'px-3 py-2.5 gap-3' : 'w-11 h-11 mx-auto justify-center'}`
              }
            >
              <div className="w-5 h-5 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              {isEffectiveExpanded && (
                <span className="text-sm whitespace-nowrap truncate animate-in fade-in duration-200">
                  Blog Articles
                </span>
              )}
            </NavLink>

            {/* Contact Inquiries */}
            <NavLink
              to="/admin/inquiries"
              onClick={onCloseMobile}
              title={!isEffectiveExpanded ? 'Contact Inquiries' : undefined}
              aria-label="Contact Inquiries"
              className={({ isActive }) =>
                `flex items-center rounded-xl font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-[#0EA5E9] text-white shadow-sm'
                    : 'text-[#CBD5E1] hover:text-white hover:bg-white/5'
                } ${isEffectiveExpanded ? 'px-3 py-2.5 gap-3' : 'w-11 h-11 mx-auto justify-center'}`
              }
            >
              <div className="w-5 h-5 flex items-center justify-center shrink-0">
                <MessageSquare className="w-5 h-5" />
              </div>
              {isEffectiveExpanded && (
                <span className="text-sm whitespace-nowrap truncate animate-in fade-in duration-200">
                  Contact Inquiries
                </span>
              )}
            </NavLink>

            {/* Public Live Website Shortcut */}
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              title={!isEffectiveExpanded ? 'View Live Website' : undefined}
              aria-label="View Live Website"
              className={`flex items-center rounded-xl font-semibold text-[#CBD5E1] hover:text-white hover:bg-white/5 transition-all mt-4 ${
                isEffectiveExpanded ? 'px-3 py-2.5 justify-between' : 'w-11 h-11 mx-auto justify-center'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 flex items-center justify-center shrink-0">
                  <ExternalLink className="w-5 h-5 text-[#38BDF8]" />
                </div>
                {isEffectiveExpanded && (
                  <span className="text-sm whitespace-nowrap truncate animate-in fade-in duration-200">
                    Live Website
                  </span>
                )}
              </div>
              {isEffectiveExpanded && (
                <span className="text-[10px] font-mono bg-white/10 px-1.5 py-0.5 rounded text-slate-300 shrink-0">
                  View
                </span>
              )}
            </a>
          </div>
        </div>

        {/* Sidebar Footer & User Profile */}
        <div className="p-3 border-t border-white/10 space-y-2 bg-[#040B17]/60 shrink-0 overflow-hidden">
          
          {/* User Profile Card */}
          <div className={`flex items-center rounded-xl ${isEffectiveExpanded ? 'gap-3 px-2 py-1' : 'justify-center py-1'}`}>
            <div 
              className="w-9 h-9 rounded-full bg-[#0EA5E9] text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-sm"
              title={!isEffectiveExpanded ? (user?.name || 'Admin') : undefined}
            >
              {user?.name?.charAt(0) || 'A'}
            </div>
            {isEffectiveExpanded && (
              <div className="flex-1 min-w-0 animate-in fade-in duration-200">
                <div className="text-xs font-bold text-white truncate">
                  {user?.name || 'Yovexa Admin'}
                </div>
                <div className="text-[11px] text-[#94A3B8] truncate">
                  {user?.email || 'admin@yovexasolutions.com'}
                </div>
              </div>
            )}
          </div>

          {/* Sign Out Button */}
          <button
            onClick={handleLogout}
            title={!isEffectiveExpanded ? 'Sign Out' : undefined}
            aria-label="Sign Out"
            className={`flex items-center justify-center rounded-xl text-xs font-bold text-rose-300 hover:text-white bg-rose-500/10 hover:bg-rose-600 transition-colors border border-rose-500/20 ${
              isEffectiveExpanded ? 'w-full py-2.5 px-4 gap-2' : 'w-11 h-11 mx-auto'
            }`}
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {isEffectiveExpanded && (
              <span className="whitespace-nowrap animate-in fade-in duration-200">
                Sign Out
              </span>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}
