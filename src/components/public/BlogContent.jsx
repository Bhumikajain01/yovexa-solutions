import React from 'react';

/**
 * Sanitized Blog Article Renderer
 * Applies high-contrast typography styles for headings, quotes, code, and lists
 */
export default function BlogContent({ htmlContent }) {
  if (!htmlContent) return null;

  return (
    <div
      className="prose prose-lg max-w-none text-[#334155] leading-relaxed
        [&>h2]:text-2xl [&>h2]:sm:text-3xl [&>h2]:font-extrabold [&>h2]:text-[#0B1B3A] [&>h2]:mt-10 [&>h2]:mb-4 [&>h2]:font-display
        [&>h3]:text-xl [&>h3]:sm:text-2xl [&>h3]:font-bold [&>h3]:text-[#0B1B3A] [&>h3]:mt-8 [&>h3]:mb-3 [&>h3]:font-display
        [&>p]:text-base [&>p]:sm:text-lg [&>p]:text-[#334155] [&>p]:leading-relaxed [&>p]:mb-6
        [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-6 [&>ul]:space-y-2 [&>ul>li]:text-[#334155]
        [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:mb-6 [&>ol]:space-y-2 [&>ol>li]:text-[#334155]
        [&>blockquote]:border-l-4 [&>blockquote]:border-[#0EA5E9] [&>blockquote]:pl-4 [&>blockquote]:py-1 [&>blockquote]:my-6 [&>blockquote]:text-lg [&>blockquote]:italic [&>blockquote]:text-[#0B1B3A] [&>blockquote]:bg-[#F8FAFC] [&>blockquote]:rounded-r-xl
        [&>pre]:bg-[#081A33] [&>pre]:text-[#E2E8F0] [&>pre]:p-4 [&>pre]:rounded-xl [&>pre]:overflow-x-auto [&>pre]:my-6 [&>pre]:font-mono [&>pre]:text-sm
        [&>code]:bg-[#F1F5F9] [&>code]:text-[#0B1B3A] [&>code]:px-1.5 [&>code]:py-0.5 [&>code]:rounded [&>code]:font-mono [&>code]:text-sm
        [&>img]:rounded-2xl [&>img]:my-8 [&>img]:w-full [&>img]:shadow-md [&>img]:border [&>img]:border-[#E2E8F0]
        [&>a]:text-[#0284C7] [&>a]:font-semibold [&>a]:underline hover:[&>a]:text-[#0369A1]"
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
}
