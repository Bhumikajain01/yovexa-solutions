# Yovexa Solutions — Corporate Website & CMS

A modern, high-converting corporate website and content management system for **Yovexa Solutions** — an IT startup and technology partner specializing in web applications, mobile apps, custom software, and business automation.

---

## 🚀 Tech Stack

- **Framework**: React 18 + Vite
- **Routing**: React Router DOM v6
- **Styling**: Tailwind CSS with custom design tokens
- **Icons**: Lucide React
- **Animations**: Framer Motion & CSS keyframes
- **Typography**: Plus Jakarta Sans & Inter (Google Fonts)
- **CMS / Data Layer**: REST API Services with persistent `localStorage` fallback

---

## 🔐 Admin Panel & Content Management

The website includes a dedicated, secure Admin Panel with full CRUD capabilities for website content and dynamic lead collection:

- **Admin Login Route**: `/login`
- **Default Admin Email**: `admin@yovexa.com`
- **Default Admin Password**: `admin123`
- **Admin Dashboard**: `/admin/dashboard` (Live metrics for Projects, Services, Inquiries, and Blogs)

### 🎛️ Manageable Sections:
1. **Hero Section (`/admin/content/hero`)**: Badge text, headlines, subheadline, primary/secondary CTA labels, links, and quick stats.
2. **About Section (`/admin/content/about`)**: Tagline, title, description paragraphs, vision/mission points, and interactive highlight cards.
3. **Services Management (`/admin/services`)**: Create, edit, delete, reorder (Move Up / Move Down), and toggle active/inactive status for services.
4. **Process Steps (`/admin/process`)**: Create, edit, delete, reorder, and toggle process phases (Discover -> Design -> Develop -> Launch).
5. **Portfolio / Projects (`/admin/projects`)**: Create, edit, delete, and publish project case studies with category tags, technology badges, deliverables, metrics, and live URLs. Dedicated public route at `/projects/:slug`.
6. **Blog Articles (`/admin/blogs`)**: Full article publishing suite with Markdown/rich content support, tags, cover images, and SEO fields.
7. **Contact Information (`/admin/content/contact`)**: Headquarters, email, direct inquiry details, and section headings.
8. **Footer & Social Links (`/admin/content/footer`)**: Brand description, copyright text, contact details, and social media URLs (LinkedIn, GitHub, Twitter, Instagram).
9. **Contact Inquiries (`/admin/inquiries`)**: Lead management system receiving public submissions from the Contact form with status tracking (`NEW`, `CONTACTED`, `IN_PROGRESS`, `CLOSED`) and direct email responses.

---

## 🎨 Brand Design Tokens

| Token | Hex Value | Role |
|---|---|---|
| Primary Text / Navy | `#0B1B3A` | Brand header & primary text |
| Dark Section | `#081A33` | Hero, CTA, and dark background sections |
| Primary Accent | `#0EA5E9` | Primary action buttons & active states |
| Accent Hover | `#0284C7` | Button hover & link interaction |
| Light Accent | `#E0F2FE` | Category pill & badge backgrounds |
| Page Background | `#F8FAFC` | Clean section backgrounds |
| Text Dark Slate | `#334155` | High-contrast body typography |

---

## 🛠️ How to Run Locally

1. Open your terminal in `d:/Development/yovexa-solutions` (or `yovexa-solutions-frontend`)
2. Install dependencies (if not already installed):
   ```bash
   npm install
   ```
3. Start development server:
   ```bash
   npm run dev
   ```
4. Build for production:
   ```bash
   npm run build
   ```
