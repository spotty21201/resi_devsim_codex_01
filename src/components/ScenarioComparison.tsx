"use client";
import React, { useEffect, useMemo, useState } from 'react';
import { loadScenarios } from '../lib/persistence/local';
import { exportComparisonToPdf } from '../lib/export/pdf';
import { exportComparisonToXlsx } from '../lib/export/xlsx';

type Item = ReturnType<typeof loadScenarios>[number];

export const ScenarioComparison: React.FC = () => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);
  const [all, setAll] = useState<Item[]>([]);
  useEffect(() => {
    setAll(loadScenarios());
    setMounted(true);
  }, []);
  const selected: Item[] = useMemo(
    () => all.filter(s => selectedIds.includes(s.id)).slice(0, 3),
    [all, selectedIds]
  );

  const toggle = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : (prev.length < 3 ? [...prev, id] : prev));
  };

  const totals = (s: Item) => {
    const totalUnits = (s.output?.units ?? []).reduce((a: number, u: any) => a + (u.count || 0), 0);
    return { totalUnits };
  };

  const fmt = (key: string, v: any): string => {
    const num = typeof v === 'string' ? Number(v) : (v as number);
    if (Number.isNaN(num)) return String(v);
    switch (key) {
      case 'gross':
      case 'lots':
      case 'roads':
      case 'open':
        return `${Math.round(num).toLocaleString()} m²`;
      case 'net':
      case 'roadpct':
        return `${Number(num).toFixed(2)}%`;
      case 'units':
        return `${Math.round(num).toLocaleString()}`;
      default:
        return String(num);
    }
  };

  return (
    <section style={{ border: '1px solid #000', padding: 16, borderRadius: 8 }}>
      <h3 style={{ marginTop: 0 }}><span style={{ background: '#f3f4f6', padding: '2px 6px', borderRadius: 4 }}>Scenario Comparison</span></h3>
      {all.length === 0 && <div style={{ color: '#6b7280' }}>No saved scenarios yet.</div>}
      {mounted && all.length > 0 && (
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 12 }}>
          {all.map(s => (
            <label key={s.id} style={{ border: '1px solid #e5e7eb', padding: '6px 8px', borderRadius: 6 }}>
              <input type="checkbox" checked={selectedIds.includes(s.id)} onChange={() => toggle(s.id)} /> {s.name}
            </label>
          ))}
          <div style={{ color: '#6b7280' }}>(Select up to 3)</div>
          {selected.length > 0 && (
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
              <button onClick={async () => {
                const items = selected.map(s => ({
                  name: s.name,
                  gross: s.output?.areas?.grossM2 || 0,
                  lots: s.output?.areas?.lotsM2 || 0,
                  roads: s.output?.areas?.roadsM2 || 0,
                  buffers: s.output?.areas?.buffersM2 || 0,
                  amenities: s.output?.areas?.amenitiesM2 || 0,
                  netPct: s.output?.efficiency?.netLotToGrossPct || 0,
                  roadPct: s.output?.efficiency?.roadPct || 0,
                  units: (s.output?.units || []).reduce((a: number, u: any) => a + (u.count || 0), 0)
                }));
                const blob = exportComparisonToXlsx(items);
                const url = URL.createObjectURL(new Blob([blob], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }));
                const a = document.createElement('a'); a.href = url; a.download = 'comparison.xlsx'; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
              }}>Export XLSX</button>
              <button onClick={async () => {
                const items = selected.map(s => ({
                  name: s.name,
                  gross: s.output?.areas?.grossM2 || 0,
                  lots: s.output?.areas?.lotsM2 || 0,
                  roads: s.output?.areas?.roadsM2 || 0,
                  buffers: s.output?.areas?.buffersM2 || 0,
                  amenities: s.output?.areas?.amenitiesM2 || 0,
                  netPct: s.output?.efficiency?.netLotToGrossPct || 0,
                  roadPct: s.output?.efficiency?.roadPct || 0,
                  units: (s.output?.units || []).reduce((a: number, u: any) => a + (u.count || 0), 0)
                }));
                const bytes = await exportComparisonToPdf(items, { logoUrl: '/kolabs-logo-white.png' });
                const url = URL.createObjectURL(new Blob([bytes], { type: 'application/pdf' }));
                const a = document.createElement('a'); a.href = url; a.download = 'comparison.pdf'; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
              }}>Export PDF</button>
            </div>
          )}
        </div>
      )}
      {mounted && selected.length > 0 && (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Metric</th>
                {selected.map(s => (
                  <th key={s.id} style={{ textAlign: 'center', borderBottom: '1px solid #e5e7eb' }}>{s.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { key: 'gross', label: 'Gross (m²)', val: (s: Item) => Math.round(s.output?.areas?.grossM2 || 0) },
                { key: 'lots', label: 'Sellable Lots (m²)', val: (s: Item) => Math.round(s.output?.areas?.lotsM2 || 0) },
                { key: 'roads', label: 'Roads (m²)', val: (s: Item) => Math.round(s.output?.areas?.roadsM2 || 0) },
                { key: 'open', label: 'Open Space + Amenities (m²)', val: (s: Item) => Math.round((s.output?.areas?.buffersM2 || 0) + (s.output?.areas?.amenitiesM2 || 0)) },
                { key: 'net', label: 'Sellable Area (%)', val: (s: Item) => (s.output?.efficiency?.netLotToGrossPct || 0) },
                { key: 'roadpct', label: 'Roads (%)', val: (s: Item) => (s.output?.efficiency?.roadPct || 0) },
                { key: 'units', label: 'Total Units', val: (s: Item) => totals(s).totalUnits }
              ].map(row => (
                <tr key={row.key}>
                  <td style={{ borderRight: '1px solid #f3f4f6', background: '#fafafa' }}>{row.label}</td>
                  {selected.map((s, i) => (
                    <td key={s.id} style={{ textAlign: 'center', borderLeft: '1px solid #f9fafb', background: i % 2 === 0 ? '#fff' : '#fcfcfc' }}>{fmt(row.key, row.val(s))}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};
