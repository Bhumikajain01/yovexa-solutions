import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

export default function DeleteModal({ 
  isOpen, 
  title, 
  heading = 'Confirm Deletion', 
  message, 
  confirmText = 'Confirm Delete',
  onConfirm, 
  onCancel, 
  onClose, 
  isDeleting, 
  loading 
}) {
  const handleClose = onCancel || onClose;
  const busy = isDeleting || loading;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#081A33]/75 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl border border-[#E2E8F0] animate-in zoom-in-95 duration-200">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-[#64748B] hover:text-[#0B1B3A] hover:bg-[#F1F5F9] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center mb-4">
          <AlertTriangle className="w-6 h-6" />
        </div>

        <h3 className="text-xl font-bold text-[#0B1B3A] font-display">
          {heading}
        </h3>

        <p className="mt-2 text-sm text-[#475569] leading-relaxed">
          {message || (
            <>
              Are you sure you want to delete {title ? <strong className="text-[#0B1B3A]">"{title}"</strong> : 'this item'}? This action cannot be undone.
            </>
          )}
        </p>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={handleClose}
            disabled={busy}
            className="px-4 py-2.5 rounded-xl border border-[#CBD5E1] text-xs font-bold text-[#334155] hover:bg-[#F1F5F9] transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={busy}
            className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors disabled:opacity-50 flex items-center gap-2 shadow-sm"
          >
            {busy ? 'Deleting...' : 'Confirm Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}
