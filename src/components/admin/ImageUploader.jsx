import React, { useState } from 'react';
import { Upload, Image as ImageIcon, Link as LinkIcon, X, Check } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export default function ImageUploader({ value, onChange }) {
  const { addToast } = useToast();
  const [tab, setTab] = useState('url'); // 'file' or 'url'
  const [urlInput, setUrlInput] = useState(value || '');

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      addToast('Invalid image type. Please select a JPG, PNG, or WEBP image.', 'error');
      return;
    }

    // Validate size (< 5MB)
    if (file.size > 5 * 1024 * 1024) {
      addToast('Image size exceeds 5MB limit. Please choose a smaller image.', 'error');
      return;
    }

    // Create local object URL for preview and form value
    const reader = new FileReader();
    reader.onloadend = () => {
      onChange(reader.result);
      addToast('Image attached successfully.', 'success');
    };
    reader.readAsDataURL(file);
  };

  const handleApplyUrl = () => {
    if (!urlInput.trim()) {
      addToast('Please enter an image URL', 'error');
      return;
    }
    onChange(urlInput.trim());
    addToast('Image URL applied', 'success');
  };

  const handleRemove = () => {
    onChange('');
    setUrlInput('');
  };

  return (
    <div className="space-y-3">
      {/* Tab Switcher */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setTab('url')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
            tab === 'url'
              ? 'bg-[#0B1B3A] text-white'
              : 'bg-[#F1F5F9] text-[#334155] hover:bg-[#E2E8F0]'
          }`}
        >
          <LinkIcon className="w-3.5 h-3.5" />
          <span>Image URL</span>
        </button>

        <button
          type="button"
          onClick={() => setTab('file')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
            tab === 'file'
              ? 'bg-[#0B1B3A] text-white'
              : 'bg-[#F1F5F9] text-[#334155] hover:bg-[#E2E8F0]'
          }`}
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Upload File</span>
        </button>
      </div>

      {/* Input depending on tab */}
      {tab === 'url' ? (
        <div className="flex items-center gap-2">
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://images.unsplash.com/... or image link"
            className="flex-1 px-4 py-2.5 rounded-xl border border-[#CBD5E1] text-sm text-[#0F172A] placeholder-[#64748B] focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]"
          />
          <button
            type="button"
            onClick={handleApplyUrl}
            className="px-4 py-2.5 rounded-xl bg-[#0EA5E9] hover:bg-[#0284C7] text-white text-xs font-bold transition-colors"
          >
            Apply
          </button>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-[#CBD5E1] rounded-xl hover:border-[#0EA5E9] cursor-pointer bg-[#F8FAFC] transition-colors">
          <Upload className="w-8 h-8 text-[#64748B] mb-2" />
          <span className="text-xs font-bold text-[#0B1B3A]">Click to upload featured image</span>
          <span className="text-[11px] text-[#64748B] mt-1">Supports JPG, PNG, WEBP (Max 5MB)</span>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/jpg"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
      )}

      {/* Image Preview Box */}
      {value && (
        <div className="relative mt-3 rounded-xl overflow-hidden border border-[#CBD5E1] bg-[#F1F5F9] max-h-56 flex items-center justify-center">
          <img
            src={value}
            alt="Featured Preview"
            className="w-full h-48 object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 p-1.5 rounded-full bg-[#081A33]/80 hover:bg-rose-600 text-white transition-colors"
            title="Remove Image"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
