import type { CalculationResult } from '../calc/types';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

export type PdfBlob = Uint8Array;

export async function exportScenarioToPdf(result: CalculationResult, options?: { logoUrl?: string }): Promise<PdfBlob> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]); // A4 portrait
  const { width } = page.getSize();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  let y = 812;
  const left = 40;

  // Branding header: Title + version (no black band)
  const title = 'Residential Master Planning Simulator';
  const version = 'v0.9 by Kolabs.Design × HDA × AIM';
  const subtitle = 'Predictive design and yield analysis for residential master planners.';
  const titleSize = 16;
  const versionSize = 10;
  page.drawText(title, { x: left, y, size: titleSize, font: fontBold, color: rgb(0.294, 0.333, 0.388) });
  const titleWidth = fontBold.widthOfTextAtSize(title, titleSize);
  page.drawText(version, { x: left + titleWidth + 12, y: y - 2, size: versionSize, font, color: rgb(0.418, 0.447, 0.502) });
  y -= 16;
  page.drawText(subtitle, { x: left, y, size: 10, font, color: rgb(0.418, 0.447, 0.502) });
  y -= 30; // extra gap before content

  // Areas summary
  page.drawText('Areas (m²):', { x: left, y, size: 12, font: fontBold });
  y -= 16;
  const a = result.areas;
  const areaLines = [
    `Gross: ${Math.round(a.grossM2).toLocaleString()} m²`,
    `Sellable Lots: ${Math.round(a.lotsM2).toLocaleString()} m²`,
    `Roads: ${Math.round(a.roadsM2).toLocaleString()} m²`,
    `Open Space + Amenities: ${(Math.round(a.buffersM2 + a.amenitiesM2)).toLocaleString()} m²`,
    `Non-sellable Total: ${Math.round(a.nonSellableM2).toLocaleString()} m²`
  ];
  for (const line of areaLines) {
    page.drawText(line, { x: left + 8, y, size: 11, font });
    y -= 14;
  }
  y -= 8;

  // Efficiency
  page.drawText('Efficiency (% of Gross):', { x: left, y, size: 12, font: fontBold });
  y -= 16;
  const e = result.efficiency;
  const effLines = [
    `Sellable Area: ${e.netLotToGrossPct.toFixed(2)}%`,
    `Roads: ${e.roadPct.toFixed(2)}%`,
    `Non-sellables: ${e.nonSellablePct.toFixed(2)}%`
  ];
  for (const line of effLines) {
    page.drawText(line, { x: left + 8, y, size: 11, font });
    y -= 14;
  }
  y -= 8;

  // Units table (simple text)
  page.drawText('Units:', { x: left, y, size: 12, font: fontBold });
  y -= 16;
  page.drawText('Type            WxD (m)     Area (m²)   Units', { x: left + 8, y, size: 10, font: fontBold });
  y -= 14;
  for (const u of result.units) {
    const row = `${u.name.padEnd(15)} ${u.widthM.toFixed(1)}x${u.depthM.toFixed(1)}     ${u.lotAreaM2.toFixed(1).padStart(7)}   ${String(u.count).padStart(5)}`;
    page.drawText(row, { x: left + 8, y, size: 10, font });
    y -= 12;
    if (y < 70) break; // keep single-page simple
  }
  y -= 10;

  // Assumptions
  const ass = result.assumptions;
  page.drawText('Assumptions:', { x: left, y, size: 12, font: fontBold });
  y -= 16;
  const assLines = [
    `ROW Width: ${ass.rowWidthM.toFixed(2)} m`,
    `Road Coefficient k: ${ass.roadCoeffK.toFixed(2)} (0.85–1.25 typical)`,
    `Rounding: ${ass.roundingMethod}`
  ];
  for (const line of assLines) {
    page.drawText(line, { x: left + 8, y, size: 11, font });
    y -= 14;
  }

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}

// Comparison export (simple 3-column summary)
export async function exportComparisonToPdf(items: { name: string; gross: number; lots: number; roads: number; buffers: number; amenities: number; netPct: number; roadPct: number; units: number }[], options?: { logoUrl?: string }): Promise<PdfBlob> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([842, 595]); // A4 landscape
  const { width } = page.getSize();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  let y = 560;
  const left = 40;

  // Branding header (no band): title + version
  const title = 'Residential Master Planning Simulator — Comparison';
  const version = 'v0.9 by Kolabs.Design × HDA × AIM';
  const subtitle = 'Predictive design and yield analysis for residential master planners.';
  const titleSize = 14;
  const versionSize = 10;
  page.drawText(title, { x: left, y, size: titleSize, font: fontBold, color: rgb(0.294, 0.333, 0.388) });
  const titleWidth = fontBold.widthOfTextAtSize(title, titleSize);
  page.drawText(version, { x: left + titleWidth + 12, y: y - 2, size: versionSize, font, color: rgb(0.418, 0.447, 0.502) });
  y -= 14;
  page.drawText(subtitle, { x: left, y, size: 10, font, color: rgb(0.418, 0.447, 0.502) });
  y -= 26; // extra gap before table

  const headers = ['Metric', ...items.map(i => i.name)];
  const rows = [
    ['Gross (m²)', ...items.map(i => `${Math.round(i.gross).toLocaleString()} m²`)],
    ['Sellable Lots (m²)', ...items.map(i => `${Math.round(i.lots).toLocaleString()} m²`)],
    ['Roads (m²)', ...items.map(i => `${Math.round(i.roads).toLocaleString()} m²`)],
    ['Open Space + Amenities (m²)', ...items.map(i => `${Math.round(i.buffers + i.amenities).toLocaleString()} m²`)],
    ['Sellable Area (%)', ...items.map(i => `${Number(i.netPct).toFixed(2)}%`)],
    ['Roads (%)', ...items.map(i => `${Number(i.roadPct).toFixed(2)}%`)],
    ['Total Units', ...items.map(i => `${Math.round(i.units).toLocaleString()}`)]
  ];

  // Column positions and widths for centered numbers
  const colWidth = 220;
  const colX = [left, left + colWidth, left + colWidth * 2, left + colWidth * 3];
  const colCenters = colX.map((x, i) => i === 0 ? x : x + colWidth / 2);

  headers.forEach((h, i) => {
    if (i === 0) {
      page.drawText(h, { x: colX[0], y, size: 11, font: fontBold });
    } else {
      const txw = fontBold.widthOfTextAtSize(h, 11);
      page.drawText(h, { x: colCenters[i] - txw / 2, y, size: 11, font: fontBold });
    }
  });
  y -= 14;
  rows.forEach(r => {
    r.forEach((cell, i) => {
      const text = String(cell);
      if (i === 0) {
        page.drawText(text, { x: colX[0], y, size: 10, font });
      } else {
        const txw = font.widthOfTextAtSize(text, 10);
        page.drawText(text, { x: colCenters[i] - txw / 2, y, size: 10, font });
      }
    });
    y -= 12;
  });

  const bytes = await pdfDoc.save();
  return bytes;
}
