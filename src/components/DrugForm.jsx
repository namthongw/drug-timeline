import React, { useState, useRef, useEffect } from 'react';
import { ALL_DRUG_NAMES, getDrugInfo } from '../data/drugs.js';

export default function DrugForm({ drugs, onAddDrug, onRemoveDrug, onAddSegment }) {
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  const suggestions = query.trim().length > 0
    ? ALL_DRUG_NAMES.filter(n => n.toLowerCase().includes(query.toLowerCase())).slice(0, 8)
    : [];

  const addCustom = () => {
    const name = query.trim();
    if (!name) return;
    if (drugs.find(d => d.name.toLowerCase() === name.toLowerCase())) {
      setQuery('');
      return;
    }
    onAddDrug(name);
    setQuery('');
    setShowSuggestions(false);
  };

  const selectSuggestion = (name) => {
    if (drugs.find(d => d.name.toLowerCase() === name.toLowerCase())) {
      setQuery('');
      setShowSuggestions(false);
      return;
    }
    onAddDrug(name);
    setQuery('');
    setShowSuggestions(false);
  };

  // Close suggestions on outside click
  useEffect(() => {
    const handler = (e) => {
      if (
        inputRef.current && !inputRef.current.contains(e.target) &&
        listRef.current && !listRef.current.contains(e.target)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="flex flex-col h-full">
      {/* Search / add drug */}
      <div className="p-4 border-b border-slate-100">
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
          Add drug
        </label>
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            placeholder="Search or type drug name…"
            value={query}
            onChange={e => { setQuery(e.target.value); setShowSuggestions(true); }}
            onFocus={() => setShowSuggestions(true)}
            onKeyDown={e => {
              if (e.key === 'Enter') addCustom();
              if (e.key === 'Escape') setShowSuggestions(false);
            }}
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
          />
          {query && (
            <button
              onClick={() => { setQuery(''); setShowSuggestions(false); }}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-lg leading-none"
            >
              ×
            </button>
          )}

          {/* Suggestions dropdown */}
          {showSuggestions && (suggestions.length > 0 || query.trim()) && (
            <ul
              ref={listRef}
              className="absolute z-30 top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-60 overflow-auto text-sm"
            >
              {suggestions.map(name => (
                <li key={name}>
                  <button
                    className="w-full text-left px-3 py-2 hover:bg-blue-50 hover:text-blue-700 text-slate-700"
                    onClick={() => selectSuggestion(name)}
                  >
                    {name}
                  </button>
                </li>
              ))}
              {query.trim() && !suggestions.find(s => s.toLowerCase() === query.toLowerCase()) && (
                <li>
                  <button
                    className="w-full text-left px-3 py-2 hover:bg-green-50 hover:text-green-700 text-slate-500 italic border-t border-slate-100"
                    onClick={addCustom}
                  >
                    Add "{query.trim()}" as custom
                  </button>
                </li>
              )}
            </ul>
          )}
        </div>
      </div>

      {/* Drug list */}
      <div className="flex-1 overflow-y-auto">
        {drugs.length === 0 && (
          <div className="p-6 text-center text-sm text-slate-400">
            No drugs added yet.<br />Search above to add one.
          </div>
        )}

        {drugs.map(drug => (
          <DrugCard
            key={drug.id}
            drug={drug}
            onRemove={() => onRemoveDrug(drug.id)}
            onAddSegment={() => onAddSegment(drug.id)}
          />
        ))}
      </div>
    </div>
  );
}

function DrugCard({ drug, onRemove, onAddSegment }) {
  const [collapsed, setCollapsed] = useState(false);
  const info = getDrugInfo(drug.name);

  return (
    <div className="border-b border-slate-100 last:border-0">
      {/* Drug header */}
      <div className="flex items-center gap-2 px-4 py-3">
        <div
          className="w-3 h-3 rounded-full flex-shrink-0"
          style={{ background: drug.color }}
        />
        <button
          className="flex-1 text-left text-sm font-semibold text-slate-800 hover:text-blue-600 truncate"
          onClick={() => setCollapsed(c => !c)}
          title={drug.name}
        >
          {drug.name}
        </button>
        <span className="text-[10px] bg-slate-100 text-slate-500 rounded px-1.5 py-0.5 whitespace-nowrap flex-shrink-0">
          {collapsed ? '▶' : '▼'}
        </span>
        <button
          onClick={onRemove}
          className="text-slate-300 hover:text-red-500 flex-shrink-0 ml-1"
          title="Remove drug"
        >
          ×
        </button>
      </div>

      {!collapsed && (
        <div className="px-4 pb-3 space-y-2">
          {/* Category badge */}
          <div className="text-[11px] text-slate-400">
            <span
              className="inline-block rounded px-1.5 py-0.5 text-white font-medium"
              style={{ background: drug.color }}
            >
              {info.category}
            </span>
          </div>

          {/* Segments */}
          {drug.segments.length === 0 && (
            <p className="text-xs text-slate-400 italic">No segments. Add one below.</p>
          )}
          {drug.segments.map(seg => (
            <SegmentRow key={seg.id} seg={seg} />
          ))}

          {/* Add segment */}
          <button
            onClick={onAddSegment}
            className="w-full text-xs font-semibold text-blue-600 hover:text-blue-800 border border-dashed border-blue-300 hover:border-blue-500 rounded-lg py-1.5 mt-1 transition"
          >
            + Add segment
          </button>
        </div>
      )}
    </div>
  );
}

function SegmentRow({ seg }) {
  const formatDate = (d) => {
    if (!d) return '—';
    const [y, m, day] = d.split('-');
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return `${parseInt(day)} ${months[parseInt(m)-1]} ${y}`;
  };

  return (
    <div className="text-xs text-slate-600 bg-slate-50 rounded-lg px-3 py-2 space-y-0.5">
      <div className="flex justify-between">
        <span className="font-medium">{seg.dose}</span>
        <span className="text-slate-400">{seg.route}</span>
      </div>
      <div className="text-slate-400">
        {formatDate(seg.startDate)} → {formatDate(seg.endDate)}
      </div>
    </div>
  );
}
