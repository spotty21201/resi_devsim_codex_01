"use client";
import React, { useState } from 'react';
import type { ProductTypeInput, SiteInput } from '../lib/calc/types';

type Props = {
  initial?: SiteInput;
  onAnalyze: (input: SiteInput) => void;
};

export const InputPanel: React.FC<Props> = ({ initial, onAnalyze }) => {
  const [grossAreaHa, setGrossAreaHa] = useState<number>(initial?.grossAreaHa ?? 3.0);
  const [rowWidthM, setRowWidthM] = useState<number>(initial?.rowWidthM ?? 8);
  const [roadCoeffK, setRoadCoeffK] = useState<number>(initial?.roadCoeffK ?? 1.0);
  const [products, setProducts] = useState<ProductTypeInput[]>(initial?.products ?? [
    { id: 'p1', name: 'Type A', widthM: 6, depthM: 15, mixPct: 50 },
    { id: 'p2', name: 'Type B', widthM: 7, depthM: 15, mixPct: 50 }
  ]);
  const [openAmenM2, setOpenAmenM2] = useState<number>((initial?.nonSellables?.buffersM2 ?? 0) + (initial?.nonSellables?.amenitiesM2 ?? 0));
  // Easements removed per redlines; treated as 0 in MVP
  const [keepMix100, setKeepMix100] = useState<boolean>(true);

  const updateProduct = (idx: number, patch: Partial<ProductTypeInput>) => {
    setProducts(prev => prev.map((p, i) => i === idx ? { ...p, ...patch } : p));
  };

  const updateProductMix = (idx: number, newMix: number) => {
    setProducts(prev => {
      const next = prev.map(p => ({ ...p }));
      const clamped = isFinite(newMix) ? Math.max(0, newMix) : 0;
      if (!keepMix100) {
        next[idx].mixPct = clamped;
        return next;
      }
      const othersIdx = next.map((_, i) => i).filter(i => i !== idx);
      const oldOthersTotal = othersIdx.reduce((a, i) => a + Math.max(0, next[i].mixPct), 0);
      next[idx].mixPct = clamped;
      const remainder = Math.max(0, 100 - clamped);
      if (othersIdx.length === 0) return next;
      if (oldOthersTotal <= 0) {
        const even = remainder / othersIdx.length;
        for (const i of othersIdx) next[i].mixPct = even;
        return next;
      }
      for (const i of othersIdx) {
        const share = Math.max(0, next[i].mixPct) / oldOthersTotal;
        next[i].mixPct = remainder * share;
      }
      return next;
    });
  };

  const moveProduct = (idx: number, dir: -1 | 1) => {
    setProducts(prev => {
      const next = prev.slice();
      const target = idx + dir;
      if (target < 0 || target >= next.length) return prev;
      const tmp = next[idx];
      next[idx] = next[target];
      next[target] = tmp;
      return next;
    });
  };

  const addProduct = () => {
    const id = `p${products.length + 1}`;
    setProducts(prev => [...prev, { id, name: `Type ${String.fromCharCode(64 + prev.length + 1)}`, widthM: 6, depthM: 15, mixPct: 0 }]);
  };

  const removeProduct = (idx: number) => {
    setProducts(prev => prev.filter((_, i) => i !== idx));
  };

  const totalMix = products.reduce((a, b) => a + (Number.isFinite(b.mixPct) ? Math.max(0, b.mixPct) : 0), 0);

  return (
    <section style={{ border: '1px solid #000', padding: 16, borderRadius: 8 }}>
      <h3 style={{ marginTop: 0 }}>
        <span style={{ background: '#f3f4f6', padding: '2px 6px', borderRadius: 4 }}>Land & Product Type Input</span>
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        <label>
          <div>Gross Area (Ha)</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <input type="number" step="0.1" value={grossAreaHa} onChange={e => setGrossAreaHa(parseFloat(e.target.value))} />
            <span style={{ color: '#6b7280' }}>ha</span>
          </div>
        </label>
        <label>
          <div>ROW Width (m, min 4)</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <input type="number" step="0.5" value={rowWidthM} onChange={e => setRowWidthM(parseFloat(e.target.value))} />
            <span style={{ color: '#6b7280' }}>m</span>
          </div>
        </label>
        <label>
          <div>Road Coefficient k (use 1 if unsure)</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
            <input type="number" step="0.05" value={roadCoeffK} onChange={e => setRoadCoeffK(parseFloat(e.target.value))} />
            <div style={{ display: 'flex', gap: 6 }}>
              {[0.9, 1.0, 1.1, 1.2].map(v => (
                <button type="button" key={v} onClick={() => setRoadCoeffK(v)} style={{ padding: '2px 6px', border: '1px solid #e5e7eb', background: '#f9fafb' }}>{v.toFixed(1)}</button>
              ))}
            </div>
          </div>
        </label>
      </div>

      <h4 style={{ marginTop: 16 }}>
        <span style={{ background: '#f3f4f6', padding: '2px 6px', borderRadius: 4 }}>Product Types</span>
      </h4>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
        <div style={{ fontSize: 12, color: totalMix === 100 ? '#16a34a' : '#b91c1c' }}>Mix total: {totalMix.toFixed(1)}%</div>
        <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <input type="checkbox" checked={keepMix100} onChange={e => setKeepMix100(e.target.checked)} />
          <span style={{ fontSize: 12 }}>Keep mix at 100%</span>
        </label>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left', borderBottom: '1px solid #e5e7eb', paddingBottom: 6 }}>Product Type</th>
            <th style={{ textAlign: 'right', borderBottom: '1px solid #e5e7eb', paddingBottom: 6, width: 120 }}>Lot Width (m)</th>
            <th style={{ textAlign: 'right', borderBottom: '1px solid #e5e7eb', paddingBottom: 6, width: 120 }}>Lot Depth (m)</th>
            <th style={{ textAlign: 'right', borderBottom: '1px solid #e5e7eb', paddingBottom: 6, width: 120 }}>Lot Area (m²)</th>
            <th style={{ textAlign: 'right', borderBottom: '1px solid #e5e7eb', paddingBottom: 6, width: 140 }}>Lot Count %</th>
            <th style={{ borderBottom: '1px solid #e5e7eb' }}></th>
          </tr>
        </thead>
        <tbody>
          {products.map((p, idx) => (
            <tr key={p.id}>
              <td style={{ paddingTop: 6 }}>
                <input value={p.name} onChange={e => updateProduct(idx, { name: e.target.value })} />
              </td>
              <td style={{ textAlign: 'right' }}>
                <input style={{ textAlign: 'right', width: 90 }} type="number" step="0.1" value={p.widthM} onChange={e => updateProduct(idx, { widthM: parseFloat(e.target.value) })} />
              </td>
              <td style={{ textAlign: 'right' }}>
                <input style={{ textAlign: 'right', width: 90 }} type="number" step="0.1" value={p.depthM} onChange={e => updateProduct(idx, { depthM: parseFloat(e.target.value) })} />
              </td>
              <td style={{ textAlign: 'right' }}>
                <span style={{ border: '1px solid #000', padding: '2px 6px', display: 'inline-block', minWidth: 70 }}>{(p.widthM * p.depthM).toFixed(1)}</span>
              </td>
              <td style={{ textAlign: 'right' }}>
                <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 6 }}>
                  <input style={{ textAlign: 'right', width: 90 }} type="number" step="0.1" value={p.mixPct} onChange={e => updateProductMix(idx, parseFloat(e.target.value))} />
                  <span style={{ color: '#6b7280' }}>%</span>
                </div>
              </td>
              <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                <button onClick={() => moveProduct(idx, -1)} title="Move up">↑</button>
                <button onClick={() => moveProduct(idx, 1)} title="Move down" style={{ marginLeft: 6 }}>↓</button>
                <button onClick={() => removeProduct(idx)} style={{ marginLeft: 6 }}>Remove</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ marginTop: 8 }}>
        <button onClick={addProduct}>Add Product</button>
      </div>

      <h4 style={{ marginTop: 16 }}>
        <span style={{ background: '#f3f4f6', padding: '2px 6px', borderRadius: 4 }}>Non-Sellable Areas (m²)</span>
      </h4>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12 }}>
        <label>
          <div>Open Space and Amenities (other non sellable)</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <input type="number" step="10" value={openAmenM2} onChange={e => setOpenAmenM2(parseFloat(e.target.value))} />
            <span style={{ color: '#6b7280' }}>m²</span>
          </div>
        </label>
      </div>

      <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
        <button
          onClick={() => onAnalyze({
            grossAreaHa,
            rowWidthM,
            roadCoeffK,
            products,
            nonSellables: { buffersM2: openAmenM2, amenitiesM2: 0 }
          })}
        >Analyze Land Use Efficiency</button>
      </div>
    </section>
  );
};
