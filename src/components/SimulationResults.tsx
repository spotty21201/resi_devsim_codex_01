import React from 'react';
import type { CalculationResult } from '../lib/calc/types';

export const SimulationResults: React.FC<{ result: CalculationResult }> = ({ result }) => {
  const { units, areas, efficiency, warnings } = result;
  return (
    <section style={{ border: '1px solid #000', padding: 16, borderRadius: 8 }}>
      <h3 style={{ marginTop: 0 }}>
        <span style={{ background: '#f3f4f6', padding: '2px 6px', borderRadius: 4 }}>Simulation Results</span>
      </h3>
      {warnings.length > 0 && (
        <div style={{ background: '#fff7ed', border: '1px solid #fdba74', padding: 8, borderRadius: 6, marginBottom: 12 }}>
          <strong>Warnings:</strong>
          <ul style={{ margin: '4px 0 0 16px' }}>
            {warnings.map((w, i) => <li key={i}>{w}</li>)}
          </ul>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div>
          <h4><span style={{ background: '#f3f4f6', padding: '2px 6px', borderRadius: 4 }}>Units</span></h4>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', borderBottom: '1px solid #e5e7eb', borderRight: '1px solid #f3f4f6' }}>Type</th>
                <th style={{ textAlign: 'right', borderBottom: '1px solid #e5e7eb', borderRight: '1px solid #f3f4f6' }}>WxD (m)</th>
                <th style={{ textAlign: 'right', borderBottom: '1px solid #e5e7eb', borderRight: '1px solid #f3f4f6' }}>Area (m²)</th>
                <th style={{ textAlign: 'right', borderBottom: '1px solid #e5e7eb' }}>Units</th>
              </tr>
            </thead>
            <tbody>
              {units.map(u => (
                <tr key={u.id}>
                  <td style={{ borderRight: '1px solid #f3f4f6' }}>{u.name}</td>
                  <td style={{ textAlign: 'right', borderRight: '1px solid #f3f4f6' }}>{u.widthM.toFixed(1)}×{u.depthM.toFixed(1)}</td>
                  <td style={{ textAlign: 'right', borderRight: '1px solid #f3f4f6' }}>{u.lotAreaM2.toFixed(1)}</td>
                  <td style={{ textAlign: 'right' }}>{u.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div>
          <h4><span style={{ background: '#f3f4f6', padding: '2px 6px', borderRadius: 4 }}>Areas</span></h4>
          <ul style={{ margin: 0, paddingLeft: 16 }}>
            <li>Gross: {areas.grossM2.toLocaleString()} m²</li>
            <li>Sellable Lots: {areas.lotsM2.toLocaleString()} m²</li>
            <li>Roads: {areas.roadsM2.toLocaleString()} m²</li>
            <li>Open Space + Amenities: {(areas.buffersM2 + areas.amenitiesM2).toLocaleString()} m²</li>
            <li>Non-sellable Total: {areas.nonSellableM2.toLocaleString()} m²</li>
          </ul>

          <h4 style={{ marginTop: 12 }}><span style={{ background: '#f3f4f6', padding: '2px 6px', borderRadius: 4 }}>Efficiency</span></h4>
          <ul style={{ margin: 0, paddingLeft: 16 }}>
            <li>Sellable Area: {efficiency.netLotToGrossPct.toFixed(2)}%</li>
            <li>Roads: {efficiency.roadPct.toFixed(2)}%</li>
            <li>Non-sellables: {efficiency.nonSellablePct.toFixed(2)}%</li>
          </ul>
        </div>
      </div>
    </section>
  );
};
