export const COMPANY_INFO = {
  name: "Yovexa Solutions",

  // Social links are NOT stored here.
  // They are fetched dynamically from the backend SiteSettings API
  // via siteSettingsService and consumed directly by Footer.jsx.

  navLinks: [
    { label: "Home", href: "/#hero" },
    { label: "About", href: "/#about" },
    { label: "Services", href: "/#services" },
    { label: "Portfolio", href: "/#portfolio" },
    { label: "Case Studies", href: "/case-studies" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/#contact" },
  ],

  // Footer company navigation links — these are static internal page anchors (UI configuration),
  // not CMS content. They define the website navigation structure and must remain here.
  footerCompany: [
    { label: "Home", href: "/#hero" },
    { label: "About", href: "/#about" },
    { label: "Services", href: "/#services" },
    { label: "Portfolio", href: "/#portfolio" },
    { label: "Case Studies", href: "/case-studies" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/#contact" },
  ],

  // Services are NOT hardcoded here.
  // They are fetched dynamically from the backend Services API (/api/services)
  // via servicesService and consumed directly by Footer.jsx and Contact.jsx.
  footerServices: []
};
