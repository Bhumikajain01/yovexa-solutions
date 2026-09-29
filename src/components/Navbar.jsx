import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Menu, X, ArrowUpRight, MessageSquareCode } from 'lucide-react';
import { COMPANY_INFO } from '../data/company';
import Logo from './Logo';

export default function Navbar({ onOpenContact }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  const navigate = useNavigate();
  const location = useLocation();

  // State A: Dark/navy background (Top of homepage over dark #hero)
  // State B: White/light background (Scrolled homepage or any internal page like /blog, /projects)
  const isHomePage = location.pathname === '/';
  const isDarkHeader = false;

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }

      // Active section spy only on homepage
      if (location.pathname === '/') {
        if (window.scrollY < 80) {
          setActiveSection('hero');
          return;
        }

        const sections = ['hero', 'about', 'services', 'process', 'portfolio', 'why-us', 'contact'];
        const scrollPosition = window.scrollY + 100;

        for (const section of sections) {
          const el = document.getElementById(section);
          if (el) {
            const top = el.offsetTop;
            const height = el.offsetHeight;
            if (scrollPosition >= top && scrollPosition < top + height) {
              setActiveSection(section);
              break;
            }
          }
        }
      } else if (location.pathname.startsWith('/blog')) {
        setActiveSection('blog');
      } else if (location.pathname.startsWith('/case-studies')) {
        setActiveSection('case-studies');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  // Handle URL hash on initial load or navigation
  useEffect(() => {
    if (location.hash && location.pathname === '/') {
      const targetId = location.hash.replace('#', '');
      if (targetId === 'hero') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setActiveSection('hero');
      } else {
        setTimeout(() => {
          const element = document.getElementById(targetId);
          if (element) {
            const navHeight = 72;
            const elementPosition = element.getBoundingClientRect().top + window.scrollY;
            window.scrollTo({
              top: Math.max(0, elementPosition - navHeight),
              behavior: 'smooth'
            });
            setActiveSection(targetId);
          }
        }, 150);
      }
    }
  }, [location.hash, location.pathname]);

  const handleNavClick = (e, href) => {
    e.preventDefault();
    setMobileMenuOpen(false);

    if (href === '/blog' || href === '/blog/') {
      navigate('/blog');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (href === '/case-studies' || href === '/case-studies/') {
      navigate('/case-studies');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const targetId = href.replace('/#', '').replace('#', '');

    if (location.pathname === '/') {
      if (targetId === 'hero') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        window.history.pushState(null, '', '/#hero');
        setActiveSection('hero');
        return;
      }

      const element = document.getElementById(targetId);
      if (element) {
        const navHeight = 72;
        const elementPosition = element.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({
          top: Math.max(0, elementPosition - navHeight),
          behavior: 'smooth'
        });
        window.history.pushState(null, '', `/#${targetId}`);
        setActiveSection(targetId);
      }
    } else {
      navigate(`/#${targetId}`);
      setTimeout(() => {
        if (targetId === 'hero') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          setActiveSection('hero');
          return;
        }
        const element = document.getElementById(targetId);
        if (element) {
          const navHeight = 72;
          const elementPosition = element.getBoundingClientRect().top + window.scrollY;
          window.scrollTo({
            top: Math.max(0, elementPosition - navHeight),
            behavior: 'smooth'
          });
          setActiveSection(targetId);
        }
      }, 150);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white/95 backdrop-blur-md py-3.5 border-b border-[#E2E8F0] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a
            href="#hero"
            onClick={(e) => handleNavClick(e, '#hero')}
            className="flex items-center focus:outline-none focus:ring-2 focus:ring-[#0EA5E9] rounded-lg p-1"
            aria-label="Yovexa Solutions Home"
          >
            <Logo variant="light" size="default" />
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2 p-1.5 rounded-full bg-[#F8FAFC] border border-[#E2E8F0] transition-all duration-300">
            {COMPANY_INFO.navLinks.map((link) => {
              const sectionId = link.href.replace('#', '').replace('/#', '').replace(/^\//, '');
              const isActive = activeSection === sectionId;
              
              return (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`px-4 py-1.5 rounded-full text-xs lg:text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-[#0B1B3A] text-white shadow-sm'
                      : 'text-[#334155] hover:text-[#0B1B3A] hover:bg-[#E2E8F0]/60'
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
          </nav>

          {/* Desktop Right CTA */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => {
                if (onOpenContact) onOpenContact();
                else {
                  const el = document.getElementById('contact');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="group relative inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold text-white bg-[#0EA5E9] hover:bg-[#0284C7] transition-all duration-200 shadow-sm transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>Let's Talk</span>
              <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-white" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#0EA5E9] text-[#0B1B3A] bg-[#F1F5F9] border-[#CBD5E1]"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-[#0EA5E9]" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-full bg-white/98 backdrop-blur-xl border-b border-[#E2E8F0] shadow-2xl px-6 py-6 transition-all animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex flex-col space-y-2.5">
            {COMPANY_INFO.navLinks.map((link) => {
              const sectionId = link.href.replace('#', '').replace('/#', '').replace(/^\//, '');
              const isActive = activeSection === sectionId;
              return (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-[#0B1B3A] text-white'
                      : 'text-[#334155] hover:text-[#0B1B3A] hover:bg-[#F1F5F9]'
                  }`}
                >
                  <span>{link.label}</span>
                  {isActive && <span className="w-2 h-2 rounded-full bg-[#0EA5E9]"></span>}
                </a>
              );
            })}

            <div className="pt-4 mt-2 border-t border-[#E2E8F0]">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  const el = document.getElementById('contact');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-bold text-white bg-[#0B1B3A] hover:bg-[#183B75] transition-colors shadow-md"
              >
                <MessageSquareCode className="w-4 h-4 text-[#38BDF8]" />
                <span>Let's Talk & Start a Project</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
