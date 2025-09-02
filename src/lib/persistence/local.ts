export type PersistableScenario = {
  id: string;
  name: string; // e.g., Master Plan Scheme 1
  createdAt: string; // ISO timestamp
  input: any; // SiteInput (kept loose to avoid import cycles in non-app code)
  output: any; // CalculationResult
};

const KEY = 'resiplot_scenarios_v1';

export function loadScenarios(): PersistableScenario[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

export function saveScenario(list: PersistableScenario[]) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(KEY, JSON.stringify(list));
}

export function nextScenarioName(existing: PersistableScenario[]): string {
  const base = 'Master Plan Scheme';
  let i = 1;
  const names = new Set(existing.map(s => s.name));
  while (names.has(`${base} ${i}`)) i++;
  return `${base} ${i}`;
}

