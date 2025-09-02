"use client";
import React, { useEffect, useMemo, useState } from 'react';
import { InputPanel } from '../components/InputPanel';
import { SimulationResults } from '../components/SimulationResults';
import { AssumptionsPanel } from '../components/AssumptionsPanel';
import { solveScenario } from '../lib/calc/solver';
import type { SiteInput } from '../lib/calc/types';
import { loadScenarios, nextScenarioName, saveScenario } from '../lib/persistence/local';
import type { PersistableScenario } from '../lib/persistence/local';
import { exportScenarioToXlsx, exportComparisonToXlsx } from '../lib/export/xlsx';
import { exportScenarioToPdf, exportComparisonToPdf } from '../lib/export/pdf';
import { ScenarioComparison } from '../components/ScenarioComparison';

export default function Page() {
  const [input, setInput] = useState<SiteInput | null>(null);
  const result = useMemo(() => input ? solveScenario(input) : null, [input]);
  const [savedCount, setSavedCount] = useState<number>(0);
  const [scenarioName, setScenarioName] = useState<string>('');
  const [selectorTick, setSelectorTick] = useState<number>(0);
  const [savedList, setSavedList] = useState<PersistableScenario[]>([]);

  useEffect(() => {
    setSavedList(loadScenarios());
  }, []);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16 }}>
      <InputPanel onAnalyze={(i) => {
        setInput(i);
        if (!scenarioName) {
          const existing = loadScenarios();
          setScenarioName(nextScenarioName(existing));
        }
      }} />
      {result && (
        <>
          <SimulationResults result={result} />
          <AssumptionsPanel
            k={result.assumptions.roadCoeffK}
            rowWidthM={result.assumptions.rowWidthM}
            mix={result.assumptions.normalizedMix.map(m => ({ name: m.name, mix: m.mix }))}
          />
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ color: '#6b7280' }}>Scenario name</span>
              <input value={scenarioName} onChange={e => setScenarioName(e.target.value)} placeholder="Master Plan Scheme N" />
            </label>
            <button onClick={() => {
              const existing = loadScenarios();
              const name = scenarioName || nextScenarioName(existing);
              existing.push({ id: crypto.randomUUID(), name, createdAt: new Date().toISOString(), input, output: result });
              saveScenario(existing);
              setSavedCount(existing.length);
              setSavedList(existing);
              // quick visual confirmation
              alert('Scenario saved locally.');
            }}>Save Scenario</button>
            <div style={{ color: '#6b7280' }}>Saved: {savedCount || savedList.length}</div>
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ color: '#6b7280' }}>Load scenario</span>
              <select onChange={e => {
                const id = e.target.value;
                const found = savedList.find(s => s.id === id);
                if (found) {
                  setInput(found.input);
                  setScenarioName(found.name);
                  setSelectorTick(t => t + 1);
                }
              }} key={selectorTick}>
                <option value="">Select…</option>
                {savedList.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
            <button onClick={() => {
              const x = exportScenarioToXlsx(result);
              const blob = new Blob([x], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'scenario.xlsx';
              document.body.appendChild(a);
              a.click();
              a.remove();
              URL.revokeObjectURL(url);
            }}>Export XLSX</button>
            <button onClick={async () => {
              const p = await exportScenarioToPdf(result, { logoUrl: '/kolabs-logo-white.png' });
              const blob = new Blob([p], { type: 'application/pdf' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'scenario.pdf';
              document.body.appendChild(a);
              a.click();
              a.remove();
              URL.revokeObjectURL(url);
            }}>Export PDF</button>
          </div>
        </>
      )}
      <ScenarioComparison />
    </div>
  );
}
