import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';

export default function EventModal({ rowLabel, rowColor, event, onSave, onDelete, onClose }) {
  const isEdit = !!event;
  const [date, setDate] = useState(event?.date ?? format(new Date(), 'yyyy-MM-dd'));
  const [note, setNote] = useState(event?.note ?? '');

  useEffect(() => {
    if (event) {
      setDate(event.date);
      setNote(event.note ?? '');
    }
  }, [event]);

  const handleSave = () => {
    if (!date) return;
    onSave({ date, note: note.trim() });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-sm mx-4 p-6"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-800">
            {isEdit ? 'Edit event' : 'Add event'}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Row label badge */}
        <div className="mb-5">
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-white text-xs font-semibold"
            style={{ background: rowColor }}
          >
            <svg width="8" height="8" viewBox="0 0 8 8">
              <circle cx="4" cy="4" r="4" fill="white" fillOpacity="0.4" />
            </svg>
            {rowLabel}
          </span>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Date</label>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">
              Note <span className="font-normal text-slate-400">(optional)</span>
            </label>
            <input
              type="text"
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="e.g. severe flare, generalised urticaria…"
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex items-center justify-between mt-6">
          {isEdit ? (
            <button
              onClick={() => onDelete(event.id)}
              className="text-sm text-red-500 hover:text-red-700 font-medium"
            >
              Delete event
            </button>
          ) : (
            <span />
          )}
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-slate-200 text-sm text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 rounded-lg text-white text-sm font-semibold hover:brightness-110"
              style={{ background: rowColor }}
            >
              {isEdit ? 'Update' : 'Add event'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
