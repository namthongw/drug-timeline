import React from 'react';

export default function PrintModal({ onClose }) {
  const triggerPrint = (mode) => {
    onClose();
    // Wait for React to unmount the modal before opening the print dialog
    setTimeout(() => {
      if (mode === 'print-consultation') {
        document.body.classList.add('print-consult');
      }
      window.print();
      const cleanup = () => {
        document.body.classList.remove('print-consult');
        window.removeEventListener('afterprint', cleanup);
      };
      window.addEventListener('afterprint', cleanup);
    }, 200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-sm mx-4 p-6"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-slate-800">Print timeline</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-xl leading-none">×</button>
        </div>

        <p className="text-sm text-slate-500 mb-5">
          Choose a print layout. UI controls are hidden in all modes.
        </p>

        <div className="space-y-3">
          <button
            onClick={() => triggerPrint('print-consultation')}
            className="w-full text-left border border-slate-200 rounded-xl p-4 hover:border-blue-400 hover:bg-blue-50 transition group"
          >
            <div className="font-semibold text-slate-800 group-hover:text-blue-700 mb-1">
              For consultation note
            </div>
            <div className="text-xs text-slate-500 leading-relaxed">
              A4 landscape · 10 cm right margin (portrait letterhead becomes right edge) · 4 cm other sides
            </div>
          </button>

          <button
            onClick={() => triggerPrint('print-normal')}
            className="w-full text-left border border-slate-200 rounded-xl p-4 hover:border-green-400 hover:bg-green-50 transition group"
          >
            <div className="font-semibold text-slate-800 group-hover:text-green-700 mb-1">
              Normal print
            </div>
            <div className="text-xs text-slate-500 leading-relaxed">
              A4 landscape · 1 cm margins · timeline fills the full page
            </div>
          </button>
        </div>

        <button onClick={onClose} className="mt-5 w-full text-sm text-slate-500 hover:text-slate-700">
          Cancel
        </button>
      </div>
    </div>
  );
}
