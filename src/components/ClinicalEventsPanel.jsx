import React, { useState } from 'react';
import { format, parseISO } from 'date-fns';

export default function ClinicalEventsPanel({ eventRows, onAddEvent, onEditEvent }) {
  const [collapsed, setCollapsed] = useState(false);
  const totalEvents = eventRows.reduce((s, r) => s + r.events.length, 0);

  return (
    <div className="border-b border-slate-200">
      <button
        className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-slate-50 transition"
        onClick={() => setCollapsed(c => !c)}
      >
        <span className="text-xs font-bold uppercase tracking-wide text-slate-500">
          Clinical Events
          {totalEvents > 0 && (
            <span className="ml-1 font-normal text-slate-400 normal-case">({totalEvents})</span>
          )}
        </span>
        <span className="text-slate-400 text-[10px]">{collapsed ? '▶' : '▼'}</span>
      </button>

      {!collapsed && (
        <div className="pb-2">
          {eventRows.map(row => (
            <RowSection
              key={row.id}
              row={row}
              onAddEvent={onAddEvent}
              onEditEvent={onEditEvent}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function RowSection({ row, onAddEvent, onEditEvent }) {
  // Sort events chronologically
  const sorted = [...row.events].sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div className="px-4 py-2">
      {/* Row label */}
      <div className="flex items-center gap-1.5 mb-2">
        {/* Mini legend for all event types */}
        <div className="flex gap-0.5">
          {row.eventTypes.map(et => (
            <MarkerIcon key={et.id} shape={et.shape} color={et.color} size={9} />
          ))}
        </div>
        <span className="text-xs font-bold text-slate-700">{row.label}</span>
      </div>

      {/* Add buttons — one per event type */}
      <div className="flex gap-2 mb-2">
        {row.eventTypes.map(et => (
          <button
            key={et.id}
            onClick={() => onAddEvent(row.id, et.id)}
            className="flex items-center gap-1 text-[11px] font-semibold rounded px-2 py-0.5 border border-dashed transition hover:opacity-80"
            style={{ color: et.color, borderColor: et.color }}
          >
            <MarkerIcon shape={et.shape} color={et.color} size={8} />
            + {et.label}
          </button>
        ))}
      </div>

      {/* Events list */}
      {sorted.length === 0 ? (
        <p className="text-xs text-slate-400 italic">No events recorded.</p>
      ) : (
        <div className="space-y-1">
          {sorted.map(ev => {
            const et = row.eventTypes.find(t => t.id === ev.typeId) ?? row.eventTypes[0];
            return (
              <button
                key={ev.id}
                onClick={() => onEditEvent(row.id, ev.id)}
                className="w-full flex items-start gap-2 text-left group hover:bg-slate-50 rounded px-1 py-0.5 transition"
              >
                <span className="flex-shrink-0 mt-0.5">
                  <MarkerIcon shape={et.shape} color={et.color} size={9} />
                </span>
                <div className="min-w-0">
                  <span
                    className="text-xs font-semibold group-hover:underline"
                    style={{ color: et.color }}
                  >
                    {format(parseISO(ev.date), 'd MMM yyyy')}
                  </span>
                  {ev.note && (
                    <span className="text-xs text-slate-400 ml-1 truncate">— {ev.note}</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function MarkerIcon({ shape, color, size }) {
  if (shape === 'triangle-down') {
    return (
      <svg width={size} height={size} viewBox="0 0 10 10" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
        <polygon points="5,10 0,0 10,0" fill={color} />
      </svg>
    );
  }
  if (shape === 'triangle-up') {
    return (
      <svg width={size} height={size} viewBox="0 0 10 10" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
        <polygon points="5,0 10,10 0,10" fill={color} />
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 10 10" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
      <circle cx="5" cy="5" r="5" fill={color} />
    </svg>
  );
}
