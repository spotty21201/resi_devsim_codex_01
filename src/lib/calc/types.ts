export type ProductTypeInput = {
  id: string;
  name: string;
  widthM: number; // frontage
  depthM: number;
  mixPct: number; // target percent (0-100)
};

export type NonSellablesInput = {
  buffersM2?: number;
  amenitiesM2?: number;
  easementsM2?: number;
};

export type SiteInput = {
  grossAreaHa: number; // user inputs in hectares
  rowWidthM: number; // >= 4
  roadCoeffK?: number; // default 1.0, advanced tuning
  products: ProductTypeInput[];
  nonSellables?: NonSellablesInput;
};

export type UnitsByType = {
  id: string;
  name: string;
  widthM: number;
  depthM: number;
  lotAreaM2: number;
  count: number;
};

export type Areas = {
  grossM2: number;
  lotsM2: number;
  roadsM2: number;
  buffersM2: number;
  amenitiesM2: number;
  easementsM2: number;
  nonSellableM2: number; // roads + buffers + amenities + easements
};

export type Efficiency = {
  netLotToGrossPct: number; // lotsM2 / grossM2 * 100
  roadPct: number; // roadsM2 / grossM2 * 100
  nonSellablePct: number; // nonSellableM2 / grossM2 * 100
};

export type Assumptions = {
  roadCoeffK: number;
  rowWidthM: number;
  normalizedMix: { id: string; name: string; mix: number }[]; // fractions that sum to 1
  roundingMethod: 'nearest' | 'largest-remainder';
  nonSellableOrdering: ['roads', 'buffers', 'amenities', 'easements'];
};

export type Warning = string;

export type CalculationResult = {
  units: UnitsByType[];
  areas: Areas;
  efficiency: Efficiency;
  warnings: Warning[];
  assumptions: Assumptions;
};

