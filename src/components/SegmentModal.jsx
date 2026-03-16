import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';

export default function SegmentModal({ drug, segment, onSave, onDelete, onClose }) {
  const isEdit = !!segment;

  const today = format(new Date(), 'yyyy-MM-dd');

  const [form, setForm] = useState({
    startDate: today,
    endDate: today,
    dose: drug.doses[0] ?? '',
    route: drug.routes[0] ?? 'Oral (PO)',
    customDose: '',
  });

  useEffect(() => {
    if (segment) {
      setForm({
        startDate: segment.startDate,
        endDate: segment.endDate,
        dose: segment.dose,
        route: segment.route,
        customDose: '',
      });
    }
  }, [segment]);

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleSave = () => {
    if (!form.startDate || !form.endDate) return;
    if (form.endDate < form.startDate) {
      alert('End date must be on or after start date.');
      return;
    }
    onSave({
      ...(segment ?? {}),
      startDate: form.startDate,
      endDate: form.endDate,
      dose: form.dose || form.customDose,
      route: form.route,
    });
  };

  const doseOptions = [...drug.doses, 'Other…'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 p-6"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-slate-800">
            {isEdit ? 'Edit segment' : 'Add segment'} — {drug.name}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-xl leading-none"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="space-y-4">
          {/* Dates */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Start date</label>
              <input
                type="date"
                value={form.startDate}
                onChange={e => set('startDate', e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">End date</label>
              <input
                type="date"
                value={form.endDate}
                min={form.startDate}
                onChange={e => set('endDate', e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Dose */}
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Dose</label>
            <select
              value={form.dose === form.customDose && form.customDose ? 'Other…' : form.dose}
              onChange={e => {
                if (e.target.value === 'Other…') {
                  set('dose', '');
                } else {
                  set('dose', e.target.value);
                  set('customDose', '');
                }
              }}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {doseOptions.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
            {(form.dose === '' || !drug.doses.includes(form.dose)) && (
              <input
                type="text"
                placeholder="Enter dose (e.g. 7.5mg)"
                value={form.customDose || form.dose}
                onChange={e => { set('customDose', e.target.value); set('dose', e.target.value); }}
                className="mt-2 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            )}
          </div>

          {/* Route */}
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Route</label>
            <select
              value={form.route}
              onChange={e => set('route', e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {drug.routes.map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between mt-6">
          {isEdit ? (
            <button
              onClick={() => onDelete(segment.id)}
              className="text-sm text-red-500 hover:text-red-700 font-medium"
            >
              Delete segment
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
              className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700"
            >
              {isEdit ? 'Update' : 'Add segment'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
