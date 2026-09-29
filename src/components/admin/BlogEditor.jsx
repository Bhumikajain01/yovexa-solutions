import React, { useRef, useEffect } from 'react';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  Link as LinkIcon,
  Image as ImageIcon,
  Undo,
  Redo,
  Eye,
  Edit3
} from 'lucide-react';

export default function BlogEditor({ value, onChange, placeholder = 'Write your blog content here...' }) {
  const editorRef = useRef(null);
  const [isPreview, setIsPreview] = React.useState(false);

  // Sync incoming value to editor content if changed externally
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || '';
    }
  }, [value]);

  const executeCommand = (command, val = null) => {
    if (!editorRef.current) return;
    editorRef.current.focus();
    document.execCommand(command, false, val);
    handleInput();
  };

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleAddLink = () => {
    const url = prompt('Enter website link URL (e.g. https://example.com):');
    if (url) {
      executeCommand('createLink', url);
    }
  };

  const handleAddImage = () => {
    const url = prompt('Enter image URL (e.g. https://images.unsplash.com/...):');
    if (url) {
      executeCommand('insertImage', url);
    }
  };

  const formatBlock = (tag) => {
    executeCommand('formatBlock', `<${tag}>`);
  };

  return (
    <div className="border border-[#CBD5E1] rounded-xl overflow-hidden bg-white shadow-sm focus-within:border-[#0EA5E9] focus-within:ring-2 focus-within:ring-[#0EA5E9]/20 transition-all">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 bg-[#F8FAFC] border-b border-[#E2E8F0] select-none">
        
        {/* Headings */}
        <button
          type="button"
          onClick={() => formatBlock('h2')}
          title="Heading 2"
          className="p-1.5 rounded hover:bg-[#E2E8F0] text-[#334155] font-bold text-xs flex items-center gap-0.5"
        >
          <Heading1 className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => formatBlock('h3')}
          title="Heading 3"
          className="p-1.5 rounded hover:bg-[#E2E8F0] text-[#334155] font-bold text-xs flex items-center gap-0.5"
        >
          <Heading2 className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => formatBlock('p')}
          title="Paragraph"
          className="px-2 py-1 rounded hover:bg-[#E2E8F0] text-[#334155] font-semibold text-xs"
        >
          P
        </button>

        <div className="w-px h-5 bg-[#CBD5E1] mx-1" />

        {/* Text Styles */}
        <button
          type="button"
          onClick={() => executeCommand('bold')}
          title="Bold (Ctrl+B)"
          className="p-1.5 rounded hover:bg-[#E2E8F0] text-[#334155]"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => executeCommand('italic')}
          title="Italic (Ctrl+I)"
          className="p-1.5 rounded hover:bg-[#E2E8F0] text-[#334155]"
        >
          <Italic className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => executeCommand('underline')}
          title="Underline (Ctrl+U)"
          className="p-1.5 rounded hover:bg-[#E2E8F0] text-[#334155]"
        >
          <UnderlineIcon className="w-4 h-4" />
        </button>

        <div className="w-px h-5 bg-[#CBD5E1] mx-1" />

        {/* Lists & Blocks */}
        <button
          type="button"
          onClick={() => executeCommand('insertUnorderedList')}
          title="Bullet List"
          className="p-1.5 rounded hover:bg-[#E2E8F0] text-[#334155]"
        >
          <List className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => executeCommand('insertOrderedList')}
          title="Numbered List"
          className="p-1.5 rounded hover:bg-[#E2E8F0] text-[#334155]"
        >
          <ListOrdered className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => formatBlock('blockquote')}
          title="Blockquote"
          className="p-1.5 rounded hover:bg-[#E2E8F0] text-[#334155]"
        >
          <Quote className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => formatBlock('pre')}
          title="Code Block"
          className="p-1.5 rounded hover:bg-[#E2E8F0] text-[#334155]"
        >
          <Code className="w-4 h-4" />
        </button>

        <div className="w-px h-5 bg-[#CBD5E1] mx-1" />

        {/* Media & Links */}
        <button
          type="button"
          onClick={handleAddLink}
          title="Insert Link"
          className="p-1.5 rounded hover:bg-[#E2E8F0] text-[#334155]"
        >
          <LinkIcon className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={handleAddImage}
          title="Insert Image by URL"
          className="p-1.5 rounded hover:bg-[#E2E8F0] text-[#334155]"
        >
          <ImageIcon className="w-4 h-4" />
        </button>

        <div className="w-px h-5 bg-[#CBD5E1] mx-1" />

        {/* Undo/Redo */}
        <button
          type="button"
          onClick={() => executeCommand('undo')}
          title="Undo"
          className="p-1.5 rounded hover:bg-[#E2E8F0] text-[#64748B]"
        >
          <Undo className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => executeCommand('redo')}
          title="Redo"
          className="p-1.5 rounded hover:bg-[#E2E8F0] text-[#64748B]"
        >
          <Redo className="w-4 h-4" />
        </button>

        {/* Preview Toggle */}
        <div className="ml-auto">
          <button
            type="button"
            onClick={() => setIsPreview(!isPreview)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
              isPreview
                ? 'bg-[#0B1B3A] text-white'
                : 'bg-[#E2E8F0] text-[#334155] hover:bg-[#CBD5E1]'
            }`}
          >
            {isPreview ? <Edit3 className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{isPreview ? 'Edit' : 'Preview'}</span>
          </button>
        </div>
      </div>

      {/* Editor Content Area */}
      {isPreview ? (
        <div
          className="p-5 min-h-[300px] max-h-[550px] overflow-y-auto prose prose-slate max-w-none text-[#334155] leading-relaxed"
          dangerouslySetInnerHTML={{ __html: value || '<p class="text-[#94A3B8] italic">No content to preview.</p>' }}
        />
      ) : (
        <div
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          onBlur={handleInput}
          className="p-5 min-h-[300px] max-h-[550px] overflow-y-auto text-[#0F172A] leading-relaxed focus:outline-none text-base"
          style={{ minHeight: '280px' }}
          data-placeholder={placeholder}
        />
      )}
    </div>
  );
}
