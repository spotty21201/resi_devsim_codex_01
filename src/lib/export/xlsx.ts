import type { CalculationResult } from '../calc/types';
import * as XLSX from 'xlsx';

export type XlsxBlob = Uint8Array;

export function exportScenarioToXlsx(result: CalculationResult): XlsxBlob {
  const wb = XLSX.utils.book_new();

  // Summary sheet with branding
  const summaryData: (string | number)[][] = [
    ['Residential Master Planning Simulator'],
    ['v0.9 by Kolabs.Design × HDA × AIM'],
    ['Predictive design and yield analysis for residential master planners.']
  ];
  const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(wb, wsSummary, 'Summary');

  // Units sheet
  const unitsData: (string | number)[][] = [
    ['Type', 'Width (m)', 'Depth (m)', 'Lot Area (m²)', 'Units']
  ];
  for (const u of result.units) {
    unitsData.push([u.name, u.widthM, u.depthM, u.lotAreaM2, u.count]);
  }
  const wsUnits = XLSX.utils.aoa_to_sheet(unitsData);
  XLSX.utils.book_append_sheet(wb, wsUnits, 'Units');

  // Areas sheet
  const a = result.areas;
  const areasData: (string | number)[][] = [
    ['Metric', 'm²'],
    ['Gross', a.grossM2],
    ['Sellable Lots', a.lotsM2],
    ['Roads', a.roadsM2],
    ['Open Space + Amenities', a.buffersM2 + a.amenitiesM2],
    ['Non-sellable Total', a.nonSellableM2]
  ];
  const wsAreas = XLSX.utils.aoa_to_sheet(areasData);
  XLSX.utils.book_append_sheet(wb, wsAreas, 'Areas');

  // Efficiency sheet
  const e = result.efficiency;
  const effData: (string | number)[][] = [
    ['Metric', '%'],
    ['Sellable Area', e.netLotToGrossPct],
    ['Roads', e.roadPct],
    ['Non-sellables', e.nonSellablePct]
  ];
  const wsEff = XLSX.utils.aoa_to_sheet(effData);
  XLSX.utils.book_append_sheet(wb, wsEff, 'Efficiency');

  // Assumptions sheet
  const ass = result.assumptions;
  const mix: (string | number)[][] = [['Type', 'Normalized %']];
  for (const m of ass.normalizedMix) {
    mix.push([m.name, m.mix * 100]);
  }
  const assData: (string | number)[][] = [
    ['Assumption', 'Value'],
    ['ROW Width (m)', ass.rowWidthM],
    ['Road Coefficient k', ass.roadCoeffK],
    ['Rounding Method', ass.roundingMethod],
    ['Non-sellable Order', ass.nonSellableOrdering.join(' → ')],
    [],
    ...mix
  ];
  const wsAss = XLSX.utils.aoa_to_sheet(assData);
  XLSX.utils.book_append_sheet(wb, wsAss, 'Assumptions');

  const out = XLSX.write(wb, { type: 'array', bookType: 'xlsx' });
  return new Uint8Array(out as ArrayBuffer);
}

export function exportComparisonToXlsx(items: { name: string; gross: number; lots: number; roads: number; buffers: number; amenities: number; netPct: number; roadPct: number; units: number }[]): XlsxBlob {
  const wb = XLSX.utils.book_new();
  const header = ['Metric', ...items.map(i => i.name)];
  const rows: (string | number)[][] = [
    ['Residential Master Planning Simulator — Comparison'],
    ['v0.9 by Kolabs.Design × HDA × AIM'],
    ['Predictive design and yield analysis for residential master planners.'],
    [],
    header,
    ['Gross (m²)', ...items.map(i => Math.round(i.gross))],
    ['Sellable Lots (m²)', ...items.map(i => Math.round(i.lots))],
    ['Roads (m²)', ...items.map(i => Math.round(i.roads))],
    ['Open Space + Amenities (m²)', ...items.map(i => Math.round(i.buffers + i.amenities))],
    ['Sellable Area (%)', ...items.map(i => Number(i.netPct.toFixed(2)))],
    ['Roads (%)', ...items.map(i => Number(i.roadPct.toFixed(2)))],
    ['Total Units', ...items.map(i => i.units)]
  ];
  const ws = XLSX.utils.aoa_to_sheet(rows);
  XLSX.utils.book_append_sheet(wb, ws, 'Comparison');
  const out = XLSX.write(wb, { type: 'array', bookType: 'xlsx' });
  return new Uint8Array(out as ArrayBuffer);
}
