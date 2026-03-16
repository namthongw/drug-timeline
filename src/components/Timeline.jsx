import React, { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import {
  startOfDay, addDays, addMonths, subDays, subMonths,
  differenceInDays, parseISO, format,
  isAfter, isBefore, min as dateMin, max as dateMax,
} from 'date-fns';
import { CATEGORY_ORDER, CATEGORY_COLORS, getDrugInfo } from '../data/drugs.js';

// ── Layout constants ──────────────────────────────────────────────
const ROW_HEIGHT      = 54;   // drug row (taller for date labels below bar)
const CAT_ROW_HEIGHT  = 26;   // category divider
const LABEL_W         = 195;  // width of sticky drug-name column
const HEADER_H        = 40;   // date header height

// Clinical events section
const CE_SECTION_H    = 26;   // "Clinical Events" header row
const CE_ROW_H        = 38;   // per-event-type row height

// Pixels-per-day for fixed zoom modes
const PPD = { '1week': 80, '1month': 26, '3months': 9 };

// ── Helpers ───────────────────────────────────────────────────────
function getTimelineRange(zoom, drugs, eventRows) {
  const today = startOfDay(new Date());

  const allDates = [
    ...drugs.flatMap(d => d.segments.flatMap(s => [parseISO(s.startDate), parseISO(s.endDate)])),
    ...eventRows.flatMap(r => r.events.map(e => parseISO(e.date))),
  ];

  const dataMin = allDates.length ? dateMin(allDates) : subMonths(today, 1);
  const dataMax = allDates.length ? dateMax(allDates) : addMonths(today, 2);

  // Right edge is always today; left edge = today minus zoom window
  const vpEnd = today;
  let vpStart;
  if (zoom === '1week') {
    vpStart = subDays(today, 7);
  } else if (zoom === '1month') {
    vpStart = subDays(today, 30);
  } else if (zoom === '3months') {
    vpStart = subDays(today, 90);
  } else {
    // "All": start a week before the earliest data point
    vpStart = subDays(dataMin, 7);
  }

  // If data extends further left than the viewport, include it
  const rangeStart = startOfDay(isBefore(dataMin, vpStart) ? subDays(dataMin, 7) : vpStart);
  const rangeEnd   = today; // never show future dates
  return { rangeStart, rangeEnd };
}

function getPPD(zoom, rangeStart, rangeEnd, containerWidth) {
  if (zoom === 'all') {
    const days = Math.max(differenceInDays(rangeEnd, rangeStart), 1);
    return Math.max(containerWidth / days, 3);
  }
  return PPD[zoom] ?? 9;
}

function buildDrugRows(drugs, categorized) {
  if (!categorized) return drugs.map(d => ({ type: 'drug', drug: d }));

  const groups = {};
  CATEGORY_ORDER.forEach(cat => { groups[cat] = []; });

  drugs.forEach(d => {
    const info = getDrugInfo(d.name);
    const key = CATEGORY_ORDER.includes(info.category) ? info.category : 'Others';
    groups[key].push(d);
  });

  const rows = [];
  CATEGORY_ORDER.forEach(cat => {
    const catDrugs = groups[cat];
    if (!catDrugs || catDrugs.length === 0) return;
    catDrugs.sort((a, b) => a.name.localeCompare(b.name));
    rows.push({ type: 'category', label: cat });
    catDrugs.forEach(d => rows.push({ type: 'drug', drug: d }));
  });
  return rows;
}

function buildHeaderTicks(zoom, rangeStart, rangeEnd, ppd) {
  const totalDays = differenceInDays(rangeEnd, rangeStart);
  const MIN_PX    = 52; // minimum px between major labels
  const INTERVALS = [1, 7, 14, 28, 60, 90, 182, 365];

  // Choose the smallest interval where labels won't overlap
  let majorInterval;
  if (zoom === '1week') {
    majorInterval = 1;
  } else {
    majorInterval = INTERVALS.find(iv => iv * ppd >= MIN_PX) ?? 365;
  }

  // Draw minor (tick-only) lines each day when ppd is large enough
  const showMinorDailyTicks = ppd >= 10 && majorInterval > 1;

  // Label format: day-level for intervals ≤28 days, month-level otherwise
  const labelFmt = majorInterval <= 28 ? 'd MMM' : "MMM ''yy";

  const ticks = [];
  for (let i = 0; i <= totalDays; i++) {
    const isMajor = i % majorInterval === 0;
    const isMinor = !isMajor && showMinorDailyTicks;
    if (isMajor || isMinor) {
      ticks.push({
        x:     i * ppd,
        label: isMajor ? format(addDays(rangeStart, i), labelFmt) : '',
        major: isMajor,
      });
    }
  }
  return ticks;
}

// ── Rash bar pairing ─────────────────────────────────────────────
// Pairs each onset with the nearest subsequent resolution.
// Unpaired onsets extend to today (open bar).
// Unpaired resolutions are returned separately as orphan markers.
function buildRashBars(events, today) {
  const todayStr = format(today, 'yyyy-MM-dd');

  const onsets = [...events.filter(e => e.typeId === 'onset')]
    .sort((a, b) => a.date.localeCompare(b.date));
  const resolutions = [...events.filter(e => e.typeId === 'resolution')]
    .sort((a, b) => a.date.localeCompare(b.date));

  const usedResIds = new Set();
  const bars = onsets.map(onset => {
    const res = resolutions.find(r => r.date >= onset.date && !usedResIds.has(r.id));
    if (res) usedResIds.add(res.id);
    return {
      startDate: onset.date,
      endDate:   res ? res.date : todayStr,
      open:      !res,
      onsetEv:      onset,
      resolutionEv: res ?? null,
    };
  });

  const orphanResolutions = resolutions.filter(r => !usedResIds.has(r.id));
  return { bars, orphanResolutions };
}

// ── Main component ────────────────────────────────────────────────
export default function Timeline({
  drugs,
  zoom,
  categorized,
  onSegmentClick,
  eventRows,
  onAddEvent,
  onEditEvent,
}) {
  const containerRef   = useRef(null);
  const [containerWidth, setContainerWidth] = useState(800);
  const today          = startOfDay(new Date());
  const [tooltip, setTooltip] = useState(null);

  // Measure container width
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setContainerWidth(e.contentRect.width));
    ro.observe(el);
    setContainerWidth(el.clientWidth);
    return () => ro.disconnect();
  }, []);

  const { rangeStart, rangeEnd } = useMemo(
    () => getTimelineRange(zoom, drugs, eventRows),
    [zoom, drugs, eventRows],
  );

  const ppd = useMemo(
    () => getPPD(zoom, rangeStart, rangeEnd, containerWidth),
    [zoom, rangeStart, rangeEnd, containerWidth],
  );

  const totalDays  = Math.max(differenceInDays(rangeEnd, rangeStart), 1);
  const totalWidth = Math.max(totalDays * ppd, containerWidth);
  const todayX     = differenceInDays(today, rangeStart) * ppd;

  const drugRows = useMemo(() => buildDrugRows(drugs, categorized), [drugs, categorized]);
  const ticks    = useMemo(
    () => buildHeaderTicks(zoom, rangeStart, rangeEnd, ppd),
    [zoom, rangeStart, rangeEnd, ppd],
  );

  // Clinical events section heights
  const hasCE       = eventRows.length > 0;
  const ceSectionH  = hasCE ? CE_SECTION_H + eventRows.length * CE_ROW_H + 1 : 0;

  // Drug rows total height
  const drugRowsH = drugRows.reduce(
    (h, r) => h + (r.type === 'category' ? CAT_ROW_HEIGHT : ROW_HEIGHT),
    0,
  );
  const totalHeight = ceSectionH + drugRowsH;

  // Scroll so today sits at the right edge of the visible area
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.scrollLeft = Math.max(0, todayX - containerWidth + 24);
  }, [zoom, ppd]); // eslint-disable-line

  const getX = useCallback(
    (dateStr) => differenceInDays(parseISO(dateStr), rangeStart) * ppd,
    [rangeStart, ppd],
  );

  if (drugs.length === 0 && eventRows.every(r => r.events.length === 0)) {
    return (
      <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">
        Add a drug in the sidebar to see the timeline.
      </div>
    );
  }

  return (
    <div id="print-area" className="flex flex-col flex-1 min-w-0 relative" style={{ colorScheme: 'light' }}>
      <div className="flex flex-1 min-h-0 overflow-hidden">

        {/* ── Sticky label column ── */}
        <div
          className="flex-shrink-0 bg-white border-r border-slate-200 z-20 flex flex-col"
          style={{ width: LABEL_W }}
        >
          {/* Header spacer */}
          <div style={{ height: HEADER_H }} className="border-b border-slate-200 flex-shrink-0" />

          {/* Clinical events labels */}
          {hasCE && (
            <>
              <div
                className="flex items-center px-3 bg-slate-50 border-b border-slate-200 flex-shrink-0"
                style={{ height: CE_SECTION_H }}
              >
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Clinical Events
                </span>
              </div>

              {eventRows.map(row => (
                <div
                  key={row.id}
                  className="flex items-center justify-between px-2 border-b border-slate-100 flex-shrink-0"
                  style={{ height: CE_ROW_H }}
                >
                  {/* Label + mini legend */}
                  <div className="flex items-center gap-1 min-w-0">
                    {row.eventTypes ? (
                      <div className="flex gap-0.5 flex-shrink-0">
                        {row.eventTypes.map(et => (
                          <MarkerShape key={et.id} shape={et.shape} color={et.color} size={9} />
                        ))}
                      </div>
                    ) : (
                      <MarkerShape shape={row.shape} color={row.color} size={10} />
                    )}
                    <span className="text-[11px] font-semibold text-slate-700 truncate" title={row.label}>
                      {row.label}
                    </span>
                  </div>

                  {/* Add buttons — one per event type or single fallback */}
                  <div className="flex gap-1 flex-shrink-0">
                    {row.eventTypes ? (
                      row.eventTypes.map(et => (
                        <button
                          key={et.id}
                          onClick={() => onAddEvent(row.id, et.id)}
                          title={`Add ${et.label}`}
                          className="text-[13px] leading-none hover:opacity-70 transition"
                          style={{ color: et.color }}
                        >
                          ＋
                        </button>
                      ))
                    ) : (
                      <button
                        onClick={() => onAddEvent(row.id)}
                        className="text-slate-300 hover:text-blue-500 transition text-[13px] leading-none"
                      >
                        ＋
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {/* Divider */}
              <div className="flex-shrink-0 h-px bg-slate-300" />
            </>
          )}

          {/* Drug name rows */}
          {drugRows.map((row, i) => {
            if (row.type === 'category') {
              return (
                <div
                  key={`cat-${row.label}`}
                  className="category-row px-3 flex-shrink-0"
                  style={{ height: CAT_ROW_HEIGHT }}
                >
                  <span
                    className="text-[10px] font-bold uppercase tracking-wider"
                    style={{ color: CATEGORY_COLORS[row.label] ?? '#475569' }}
                  >
                    {row.label}
                  </span>
                </div>
              );
            }
            const drug = row.drug;
            return (
              <div
                key={drug.id}
                className="flex items-center gap-2 px-3 border-b border-slate-100 flex-shrink-0"
                style={{ height: ROW_HEIGHT }}
              >
                <div
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ background: drug.color }}
                />
                <span className="text-xs font-semibold text-slate-700 truncate" title={drug.name}>
                  {drug.name}
                </span>
              </div>
            );
          })}
        </div>

        {/* ── Scrollable Gantt area ── */}
        <div
          ref={containerRef}
          className="flex-1 overflow-x-auto timeline-scroll timeline-container relative"
          style={{ overflowY: 'hidden' }}
        >
          <div
            className="relative timeline-inner"
            style={{ width: totalWidth, height: totalHeight + HEADER_H }}
          >
            {/* Date header */}
            <div
              className="sticky top-0 z-10 bg-white border-b border-slate-200"
              style={{ height: HEADER_H, width: totalWidth }}
            >
              {ticks.map((tick, i) => (
                <div
                  key={i}
                  className="absolute top-0 bottom-0"
                  style={{ left: tick.x }}
                >
                  {tick.major && (
                    <span className="absolute top-2 left-1 text-[10px] font-semibold text-slate-500 whitespace-nowrap select-none">
                      {tick.label}
                    </span>
                  )}
                  <div
                    className={`absolute bottom-0 ${tick.major ? 'h-3 bg-slate-300' : 'h-2 bg-slate-200'}`}
                    style={{ width: 1 }}
                  />
                </div>
              ))}

              {/* Today label on axis — red, right-aligned to the today line */}
              <div
                className="absolute top-0 bottom-0"
                style={{ left: todayX }}
              >
                <span
                  className="absolute top-2 text-[10px] font-semibold whitespace-nowrap select-none"
                  style={{ color: '#ef4444', right: 2 }}
                >
                  {format(today, 'd MMM')}
                </span>
                <div className="absolute bottom-0 h-3" style={{ width: 1, background: '#ef4444' }} />
              </div>
            </div>

            {/* Rows container */}
            <div style={{ position: 'absolute', top: HEADER_H, left: 0, width: totalWidth }}>

              {/* ── Clinical events rows ── */}
              {hasCE && (
                <>
                  {/* CE section header row */}
                  <div
                    className="bg-slate-50 border-b border-slate-200"
                    style={{ height: CE_SECTION_H, width: totalWidth }}
                  />

                  {/* Per-event-type rows — rendered as paired onset→resolution bars */}
                  {eventRows.map(row => {
                    const onsetType = row.eventTypes?.find(t => t.id === 'onset') ?? { shape: 'triangle-down', color: '#ef4444' };
                    const resType   = row.eventTypes?.find(t => t.id === 'resolution') ?? { shape: 'triangle-up', color: '#16a34a' };
                    const { bars, orphanResolutions } = buildRashBars(row.events, today);

                    const barH      = 18;
                    const barTop    = (CE_ROW_H - barH) / 2;
                    const markerTop = (CE_ROW_H - 14) / 2;
                    const fmtD      = d => { try { return format(parseISO(d), 'd MMM yyyy'); } catch { return d; } };

                    return (
                      <div
                        key={row.id}
                        className="relative border-b border-slate-100"
                        style={{ height: CE_ROW_H, width: totalWidth }}
                      >
                        {/* ── Paired bars ── */}
                        {bars.map((bar, i) => {
                          const x    = differenceInDays(parseISO(bar.startDate), rangeStart) * ppd;
                          const xEnd = differenceInDays(parseISO(bar.endDate), rangeStart) * ppd + (bar.open ? 0 : ppd);
                          const w    = Math.max(xEnd - x, 8);
                          const days = differenceInDays(parseISO(bar.endDate), parseISO(bar.startDate));

                          const tooltipLines = [
                            'Rash episode',
                            `Onset: ${fmtD(bar.startDate)}`,
                            bar.open
                              ? 'Resolution: ongoing'
                              : `Resolution: ${fmtD(bar.endDate)}`,
                            `Duration: ${days} day${days !== 1 ? 's' : ''}${bar.open ? '+' : ''}`,
                            bar.onsetEv.note     ? `Note (onset): ${bar.onsetEv.note}` : null,
                            bar.resolutionEv?.note ? `Note (res.): ${bar.resolutionEv.note}` : null,
                          ];

                          return (
                            <React.Fragment key={i}>
                              {/* Filled bar */}
                              <div
                                className="absolute"
                                style={{
                                  left:                     x,
                                  width:                    w,
                                  top:                      barTop,
                                  height:                   barH,
                                  background:               '#fca5a5',
                                  backgroundColor:          '#fca5a5',
                                  border:                   '1.5px solid #ef4444',
                                  borderRightStyle:         bar.open ? 'dashed' : 'solid',
                                  borderRadius:             3,
                                  zIndex:                   3,
                                  cursor:                   'default',
                                  WebkitPrintColorAdjust:   'exact',
                                  printColorAdjust:         'exact',
                                }}
                                onMouseMove={e => setTooltip({
                                  x: e.clientX, y: e.clientY,
                                  lines: tooltipLines.filter(Boolean),
                                })}
                                onMouseLeave={() => setTooltip(null)}
                              />

                              {/* Onset marker ▼ — clickable */}
                              <button
                                className="absolute hover:scale-125 transition-transform focus:outline-none"
                                style={{ left: x - 7, top: markerTop, width: 14, height: 14, zIndex: 6 }}
                                onClick={() => onEditEvent(row.id, bar.onsetEv.id)}
                                title={`Edit onset: ${fmtD(bar.startDate)}`}
                                onMouseEnter={() => setTooltip(null)}
                              >
                                <MarkerShape shape={onsetType.shape} color={onsetType.color} size={14} />
                              </button>

                              {/* Resolution marker ▲ — clickable */}
                              {!bar.open && bar.resolutionEv && (
                                <button
                                  className="absolute hover:scale-125 transition-transform focus:outline-none"
                                  style={{ left: xEnd - 7, top: markerTop, width: 14, height: 14, zIndex: 6 }}
                                  onClick={() => onEditEvent(row.id, bar.resolutionEv.id)}
                                  title={`Edit resolution: ${fmtD(bar.endDate)}`}
                                  onMouseEnter={() => setTooltip(null)}
                                >
                                  <MarkerShape shape={resType.shape} color={resType.color} size={14} />
                                </button>
                              )}
                            </React.Fragment>
                          );
                        })}

                        {/* ── Orphan resolution markers (no matching onset) ── */}
                        {orphanResolutions.map(ev => {
                          const evX = differenceInDays(parseISO(ev.date), rangeStart) * ppd;
                          return (
                            <button
                              key={ev.id}
                              className="absolute hover:scale-125 transition-transform focus:outline-none"
                              style={{ left: evX - 7, top: markerTop, width: 14, height: 14, zIndex: 6 }}
                              onClick={() => onEditEvent(row.id, ev.id)}
                              onMouseMove={e => setTooltip({
                                x: e.clientX, y: e.clientY,
                                lines: ['Resolution', fmtD(ev.date), ev.note || null].filter(Boolean),
                              })}
                              onMouseLeave={() => setTooltip(null)}
                            >
                              <MarkerShape shape={resType.shape} color={resType.color} size={14} />
                            </button>
                          );
                        })}
                      </div>
                    );
                  })}

                  {/* Divider */}
                  <div className="bg-slate-300" style={{ height: 1, width: totalWidth }} />
                </>
              )}

              {/* ── Drug rows ── */}
              {drugRows.map((row, i) => {
                if (row.type === 'category') {
                  return (
                    <div
                      key={`cat-bg-${row.label}`}
                      className="category-row"
                      style={{ height: CAT_ROW_HEIGHT, width: totalWidth }}
                    />
                  );
                }
                return (
                  <DrugRow
                    key={row.drug.id}
                    drug={row.drug}
                    getX={getX}
                    ppd={ppd}
                    today={today}
                    totalWidth={totalWidth}
                    onSegmentClick={onSegmentClick}
                    onTooltip={setTooltip}
                  />
                );
              })}
            </div>

            {/* Today marker */}
            {todayX >= 0 && todayX <= totalWidth && (
              <div className="today-line" style={{ left: todayX, top: HEADER_H }} />
            )}
          </div>
        </div>
      </div>

      {/* Tooltip — fixed to viewport */}
      {tooltip && (
        <div
          className="seg-tooltip fixed"
          style={{ top: tooltip.y + 16, left: tooltip.x + 16, zIndex: 9999 }}
        >
          {tooltip.lines
            ? tooltip.lines.filter(Boolean).map((l, i) => (
                <div key={i} className={i > 0 ? 'text-slate-300' : 'font-semibold'}>{l}</div>
              ))
            : (
              <>
                <div className="font-semibold">{tooltip.name}</div>
                <div>{tooltip.dose} · {tooltip.route}</div>
                <div className="text-slate-300">{tooltip.start} → {tooltip.end}</div>
                {tooltip.planned && <div className="text-yellow-300 text-xs">Planned (future)</div>}
              </>
            )
          }
        </div>
      )}
    </div>
  );
}

// ── Drug row with segment bars and date labels ────────────────────
function DrugRow({ drug, getX, ppd, today, totalWidth, onSegmentClick, onTooltip }) {
  const fmt = d => { try { return format(parseISO(d), 'd MMM'); } catch { return d; } };
  const fmtLong = d => { try { return format(parseISO(d), 'd MMM yyyy'); } catch { return d; } };

  return (
    <div
      className="relative border-b border-slate-100"
      style={{ height: ROW_HEIGHT, width: totalWidth }}
    >
      {drug.segments.map(seg => {
        const x    = getX(seg.startDate);
        const xEnd = getX(seg.endDate) + ppd; // include end day
        const w    = xEnd - x;
        if (w <= 0) return null;

        const isPlanned    = isAfter(parseISO(seg.startDate), today);
        const barWidth     = Math.max(w, 4);
        // Wide enough to show the date label inside the colored bar
        const dateInside   = barWidth >= 85;
        // Wide enough to show dose inside (only when date isn't taking that space)
        const showDose     = !dateInside && barWidth > 55;

        const dateLabel = `${fmt(seg.startDate)} – ${fmt(seg.endDate)}`;

        return (
          <React.Fragment key={seg.id}>
            {/* Bar */}
            <div
              className={`seg-bar ${isPlanned ? 'planned' : ''}`}
              style={{
                left: x,
                width: barWidth,
                background: drug.color,
                backgroundColor: drug.color,
                borderColor: drug.color,
                top: 7,
                height: 24,
                justifyContent: dateInside ? 'center' : 'flex-start',
              }}
              onClick={() => onSegmentClick(drug.id, seg.id)}
              onMouseMove={e => onTooltip({
                x: e.clientX,
                y: e.clientY,
                name: drug.name,
                dose: seg.dose,
                route: seg.route,
                start: fmtLong(seg.startDate),
                end: fmtLong(seg.endDate),
                planned: isPlanned,
              })}
              onMouseLeave={() => onTooltip(null)}
            >
              {/* Date label inside bar (wide bars) */}
              {dateInside && (
                <span className="truncate text-[10px] font-semibold text-center w-full">
                  {dateLabel}
                </span>
              )}
              {/* Dose label inside bar (medium bars where date doesn't fit inside) */}
              {showDose && (
                <span className="truncate text-[10px] font-semibold">{seg.dose}</span>
              )}
            </div>

            {/* Date label outside/below bar for narrow bars — always visible, never clipped */}
            {!dateInside && (
              <div
                className="absolute pointer-events-none whitespace-nowrap"
                style={{
                  left: x,
                  top: 33,
                  fontSize: 11,
                  fontWeight: 500,
                  color: '#475569',
                }}
              >
                {dateLabel}
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

// ── Event marker SVG shapes ───────────────────────────────────────
function MarkerShape({ shape, color, size }) {
  const h = size, w = size;
  if (shape === 'triangle-down') {
    return (
      <svg width={w} height={h} viewBox="0 0 14 14" style={{ display: 'block' }}>
        <polygon points="7,14 0,0 14,0" fill={color} />
      </svg>
    );
  }
  if (shape === 'triangle-up') {
    return (
      <svg width={w} height={h} viewBox="0 0 14 14" style={{ display: 'block' }}>
        <polygon points="7,0 14,14 0,14" fill={color} />
      </svg>
    );
  }
  return (
    <svg width={w} height={h} viewBox="0 0 14 14" style={{ display: 'block' }}>
      <circle cx="7" cy="7" r="7" fill={color} />
    </svg>
  );
}
