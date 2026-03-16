import React, { useState, useCallback } from 'react';
import DrugForm from './components/DrugForm.jsx';
import Timeline from './components/Timeline.jsx';
import SegmentModal from './components/SegmentModal.jsx';
import PrintModal from './components/PrintModal.jsx';
import EventModal from './components/EventModal.jsx';
import ClinicalEventsPanel from './components/ClinicalEventsPanel.jsx';
import { getDrugInfo, getDrugColor } from './data/drugs.js';

let _id = 1;
const uid = () => String(_id++);

const ZOOM_LABELS = [
  { key: '1week',   label: '1 W' },
  { key: '1month',  label: '1 M' },
  { key: '3months', label: '3 M' },
  { key: 'all',     label: 'All' },
];

// Default clinical event row definitions.
// Each row can have multiple eventTypes — all types share one timeline row.
const DEFAULT_EVENT_ROWS = [
  {
    id: 'rash-events',
    label: 'Rash events',
    eventTypes: [
      { id: 'onset',      label: 'Onset / flare', color: '#ef4444', shape: 'triangle-down' },
      { id: 'resolution', label: 'Resolution',     color: '#16a34a', shape: 'triangle-up'   },
    ],
    events: [],   // each event: { id, date, note, typeId }
  },
];

export default function App() {
  const [drugs, setDrugs]             = useState([]);
  const [zoom, setZoom]               = useState('3months');
  const [categorized, setCategorized] = useState(false);
  const [showPrint, setShowPrint]     = useState(false);

  // Segment modal
  const [segModal, setSegModal] = useState(null); // { drugId, segmentId | null }

  // Clinical events
  const [eventRows, setEventRows]     = useState(DEFAULT_EVENT_ROWS);
  const [eventModal, setEventModal]   = useState(null); // { rowId, eventId | null }

  // ── Drug CRUD ──────────────────────────────────────────────────
  const addDrug = useCallback((name) => {
    const info  = getDrugInfo(name);
    const color = getDrugColor(info.category);
    setDrugs(prev => [
      ...prev,
      { id: uid(), name, color, doses: info.doses, routes: info.routes, segments: [] },
    ]);
  }, []);

  const removeDrug = useCallback((drugId) => {
    setDrugs(prev => prev.filter(d => d.id !== drugId));
  }, []);

  // ── Segment CRUD ───────────────────────────────────────────────
  const openAddSegment  = useCallback((drugId)            => setSegModal({ drugId, segmentId: null }), []);
  const openEditSegment = useCallback((drugId, segmentId) => setSegModal({ drugId, segmentId }), []);

  const saveSegment = useCallback((newSeg) => {
    const { drugId, segmentId } = segModal;
    setDrugs(prev => prev.map(d => {
      if (d.id !== drugId) return d;
      if (segmentId) {
        return { ...d, segments: d.segments.map(s => s.id === segmentId ? { ...newSeg, id: s.id } : s) };
      }
      return { ...d, segments: [...d.segments, { ...newSeg, id: uid() }] };
    }));
    setSegModal(null);
  }, [segModal]);

  const deleteSegment = useCallback((segId) => {
    setDrugs(prev => prev.map(d =>
      d.id === segModal.drugId ? { ...d, segments: d.segments.filter(s => s.id !== segId) } : d
    ));
    setSegModal(null);
  }, [segModal]);

  // ── Clinical event CRUD ────────────────────────────────────────
  // typeId is which sub-type to create (e.g. 'onset' | 'resolution')
  const openAddEvent  = useCallback((rowId, typeId) => setEventModal({ rowId, eventId: null, typeId }), []);
  const openEditEvent = useCallback((rowId, eventId) => {
    const row = eventRows.find(r => r.id === rowId);
    const ev  = row?.events.find(e => e.id === eventId);
    setEventModal({ rowId, eventId, typeId: ev?.typeId });
  }, [eventRows]);

  const saveEvent = useCallback((data) => {
    const { rowId, eventId, typeId } = eventModal;
    setEventRows(prev => prev.map(row => {
      if (row.id !== rowId) return row;
      const eventData = { ...data, typeId };
      if (eventId) {
        return { ...row, events: row.events.map(e => e.id === eventId ? { ...e, ...eventData } : e) };
      }
      return { ...row, events: [...row.events, { ...eventData, id: uid() }] };
    }));
    setEventModal(null);
  }, [eventModal]);

  const deleteEvent = useCallback((evId) => {
    setEventRows(prev => prev.map(row =>
      row.id === eventModal.rowId
        ? { ...row, events: row.events.filter(e => e.id !== evId) }
        : row
    ));
    setEventModal(null);
  }, [eventModal]);

  // ── Derived ────────────────────────────────────────────────────
  const modalDrug = segModal   ? drugs.find(d => d.id === segModal.drugId) : null;
  const modalSeg  = modalDrug && segModal?.segmentId
    ? modalDrug.segments.find(s => s.id === segModal.segmentId)
    : null;

  const modalEventRow  = eventModal ? eventRows.find(r => r.id === eventModal.rowId) : null;
  const modalEventType = modalEventRow?.eventTypes?.find(t => t.id === eventModal?.typeId)
    ?? modalEventRow?.eventTypes?.[0];
  const modalEvent     = modalEventRow && eventModal?.eventId
    ? modalEventRow.events.find(e => e.id === eventModal.eventId)
    : null;

  return (
    <div className="flex flex-col h-screen bg-white text-slate-800">

      {/* ── Toolbar ── */}
      <header className="no-print flex items-center gap-3 px-4 py-3 border-b border-slate-200 bg-white shadow-sm flex-shrink-0">
        {/* Title */}
        <div className="flex items-center gap-2 mr-2">
          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <span className="font-bold text-slate-800 text-base tracking-tight hidden sm:inline">
            Drug Timeline
          </span>
        </div>

        {/* Zoom buttons */}
        <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
          {ZOOM_LABELS.map(z => (
            <button
              key={z.key}
              onClick={() => setZoom(z.key)}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition ${
                zoom === z.key
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {z.label}
            </button>
          ))}
        </div>

        {/* Re-arrange by category */}
        <button
          onClick={() => setCategorized(c => !c)}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
            categorized
              ? 'bg-green-600 text-white border-green-600 hover:bg-green-700'
              : 'bg-white text-slate-600 border-slate-200 hover:border-green-400 hover:text-green-700'
          }`}
        >
          {categorized ? '✓ By category' : 'Re-arrange by category'}
        </button>

        <div className="flex-1" />

        {/* Print */}
        <button
          onClick={() => setShowPrint(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:border-sky-400 hover:text-sky-600 transition"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          Print
        </button>
      </header>

      {/* ── Body ── */}
      <div className="flex flex-1 min-h-0 overflow-hidden">

        {/* Sidebar */}
        <aside className="no-print w-64 flex-shrink-0 border-r border-slate-200 flex flex-col bg-white overflow-hidden">
          {/* Clinical events panel (top of sidebar) */}
          <ClinicalEventsPanel
            eventRows={eventRows}
            onAddEvent={openAddEvent}
            onEditEvent={openEditEvent}
          />

          {/* Drug form (rest of sidebar) */}
          <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
            <DrugForm
              drugs={drugs}
              onAddDrug={addDrug}
              onRemoveDrug={removeDrug}
              onAddSegment={openAddSegment}
            />
          </div>
        </aside>

        {/* Timeline */}
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <Timeline
            drugs={drugs}
            zoom={zoom}
            categorized={categorized}
            onSegmentClick={openEditSegment}
            eventRows={eventRows}
            onAddEvent={openAddEvent}
            onEditEvent={openEditEvent}
          />
        </main>
      </div>

      {/* ── Modals ── */}
      {segModal && modalDrug && (
        <SegmentModal
          drug={modalDrug}
          segment={modalSeg}
          onSave={saveSegment}
          onDelete={deleteSegment}
          onClose={() => setSegModal(null)}
        />
      )}

      {eventModal && modalEventRow && modalEventType && (
        <EventModal
          rowLabel={modalEventType.label}
          rowColor={modalEventType.color}
          event={modalEvent}
          onSave={saveEvent}
          onDelete={deleteEvent}
          onClose={() => setEventModal(null)}
        />
      )}

      {showPrint && (
        <PrintModal onClose={() => setShowPrint(false)} />
      )}
    </div>
  );
}
