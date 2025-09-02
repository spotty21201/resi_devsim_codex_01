import React from 'react';

type Props = {
  k: number;
  rowWidthM: number;
  mix: { name: string; mix: number }[];
};

export const AssumptionsPanel: React.FC<Props> = ({ k, rowWidthM, mix }) => {
  return (
    <section style={{ border: '1px solid #000', padding: 16, borderRadius: 8 }}>
      <h3 style={{ margin: 0, marginBottom: 8 }}>
        <span style={{ background: '#f3f4f6', padding: '2px 6px', borderRadius: 4 }}>Assumptions</span>
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        <div><strong>ROW Width:</strong> {rowWidthM.toFixed(2)} m</div>
        <div><strong>Road Coefficient k:</strong> {k.toFixed(2)} (0.85–1.25 typical)</div>
      </div>
      <div style={{ marginTop: 8 }}>
        <strong>Normalized Mix:</strong>
        <ul style={{ margin: '4px 0 0 16px' }}>
          {mix.map(m => (
            <li key={m.name}>{m.name}: {(m.mix * 100).toFixed(1)}%</li>
          ))}
        </ul>
      </div>
    </section>
  );
};
