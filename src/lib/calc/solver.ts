import { Assumptions, CalculationResult, NonSellablesInput, ProductTypeInput, SiteInput, UnitsByType } from './types';

const MIN_ROW_WIDTH = 4; // meters
const DEFAULT_ROAD_COEFF = 1.0; // k default

export function haToM2(ha: number): number { return ha * 10000; }

function clampRowWidth(rowWidthM: number, warnings: string[]): number {
  if (rowWidthM < MIN_ROW_WIDTH) {
    warnings.push(`ROW width ${rowWidthM}m below minimum ${MIN_ROW_WIDTH}m. Using ${MIN_ROW_WIDTH}m.`);
    return MIN_ROW_WIDTH;
  }
  return rowWidthM;
}

function normalizeMix(products: ProductTypeInput[], warnings: string[]): { id: string; name: string; widthM: number; depthM: number; lotAreaM2: number; mix: number }[] {
  const totals = products.reduce((acc, p) => acc + (isFinite(p.mixPct) ? Math.max(0, p.mixPct) : 0), 0);
  if (totals <= 0) {
    warnings.push('Product mix sum is zero or invalid; distributing evenly.');
    const even = 1 / Math.max(1, products.length);
    return products.map(p => ({ id: p.id, name: p.name, widthM: p.widthM, depthM: p.depthM, lotAreaM2: p.widthM * p.depthM, mix: even }));
  }
  if (Math.abs(totals - 100) > 0.01) {
    warnings.push(`Product mix does not sum to 100% (got ${totals.toFixed(2)}%). Auto-normalizing.`);
  }
  return products.map(p => ({ id: p.id, name: p.name, widthM: p.widthM, depthM: p.depthM, lotAreaM2: p.widthM * p.depthM, mix: Math.max(0, p.mixPct) / totals }));
}

function sumOtherNonSellablesM2(n: NonSellablesInput | undefined): number {
  if (!n) return 0;
  return (n.buffersM2 ?? 0) + (n.amenitiesM2 ?? 0) + (n.easementsM2 ?? 0);
}

function distributeUnitsLargestRemainder(N: number, normalized: ReturnType<typeof normalizeMix>): { counts: Record<string, number>; roundingNote: string } {
  const ideal = normalized.map(p => ({ id: p.id, val: N * p.mix }));
  const base = ideal.map(x => Math.floor(x.val));
  let assigned = base.reduce((a, b) => a + b, 0);
  const remainders = ideal.map((x, i) => ({ id: x.id, rem: x.val - base[i] }));
  remainders.sort((a, b) => b.rem - a.rem);
  let idx = 0;
  while (assigned < N) {
    base[ideal.findIndex(x => x.id === remainders[idx % remainders.length].id)]++;
    assigned++;
    idx++;
  }
  const counts: Record<string, number> = {};
  normalized.forEach((p, i) => { counts[p.id] = base[i]; });
  return { counts, roundingNote: 'largest-remainder' };
}

function buildUnits(counts: Record<string, number>, normalized: ReturnType<typeof normalizeMix>): UnitsByType[] {
  return normalized.map(p => ({
    id: p.id,
    name: p.name,
    widthM: p.widthM,
    depthM: p.depthM,
    lotAreaM2: p.lotAreaM2,
    count: counts[p.id] ?? 0
  }));
}

function computeFrontage(units: UnitsByType[]): number {
  return units.reduce((acc, u) => acc + u.count * u.widthM, 0);
}

function computeLotsArea(units: UnitsByType[]): number {
  return units.reduce((acc, u) => acc + u.count * u.lotAreaM2, 0);
}

export function solveScenario(input: SiteInput): CalculationResult {
  const warnings: string[] = [];
  const grossM2 = haToM2(input.grossAreaHa);

  const rowWidthM = clampRowWidth(input.rowWidthM, warnings);
  const roadCoeffK = (input.roadCoeffK ?? DEFAULT_ROAD_COEFF);
  if (roadCoeffK < 0.5 || roadCoeffK > 2.0) {
    warnings.push(`Road coefficient k=${roadCoeffK} is unusual. Typical range 0.85–1.25.`);
  }

  const normalized = normalizeMix(input.products, warnings);
  const avgLotArea = normalized.reduce((acc, p) => acc + p.lotAreaM2 * p.mix, 0);
  const avgWidth = normalized.reduce((acc, p) => acc + p.widthM * p.mix, 0);
  const otherNonSellables = sumOtherNonSellablesM2(input.nonSellables);

  if (otherNonSellables >= grossM2) {
    warnings.push('Non-sellable fixed areas exceed or equal gross area. No units can fit.');
    const assumptions: Assumptions = {
      roadCoeffK,
      rowWidthM,
      normalizedMix: normalized.map(p => ({ id: p.id, name: p.name, mix: p.mix })),
      roundingMethod: 'largest-remainder',
      nonSellableOrdering: ['roads', 'buffers', 'amenities', 'easements']
    };
    return {
      units: normalized.map(p => ({ id: p.id, name: p.name, widthM: p.widthM, depthM: p.depthM, lotAreaM2: p.lotAreaM2, count: 0 })),
      areas: {
        grossM2,
        lotsM2: 0,
        roadsM2: 0,
        buffersM2: input.nonSellables?.buffersM2 ?? 0,
        amenitiesM2: input.nonSellables?.amenitiesM2 ?? 0,
        easementsM2: input.nonSellables?.easementsM2 ?? 0,
        nonSellableM2: otherNonSellables
      },
      efficiency: {
        netLotToGrossPct: 0,
        roadPct: 0,
        nonSellablePct: (otherNonSellables / grossM2) * 100
      },
      warnings,
      assumptions
    };
  }

  // Solve for N using averages (continuous), then adjust to integer distribution
  const perUnitAreaCost = avgLotArea + avgWidth * rowWidthM * roadCoeffK;
  let N = Math.floor((grossM2 - otherNonSellables) / Math.max(1e-9, perUnitAreaCost));
  if (N < 0) N = 0;

  // Distribute N by largest remainder
  let { counts, roundingNote } = distributeUnitsLargestRemainder(N, normalized);
  let units = buildUnits(counts, normalized);
  let frontage = computeFrontage(units);
  let roadsM2 = frontage * rowWidthM * roadCoeffK;
  let lotsM2 = computeLotsArea(units);
  const fixedBuffers = input.nonSellables?.buffersM2 ?? 0;
  const fixedAmenities = input.nonSellables?.amenitiesM2 ?? 0;
  const fixedEasements = input.nonSellables?.easementsM2 ?? 0;

  let used = lotsM2 + roadsM2 + fixedBuffers + fixedAmenities + fixedEasements;

  // If we overflow, decrement N until it fits; else try increasing if slack allows
  let guard = 0;
  while (used > grossM2 && N > 0 && guard < 1000) {
    N -= 1;
    ({ counts, roundingNote } = distributeUnitsLargestRemainder(N, normalized));
    units = buildUnits(counts, normalized);
    frontage = computeFrontage(units);
    roadsM2 = frontage * rowWidthM * roadCoeffK;
    lotsM2 = computeLotsArea(units);
    used = lotsM2 + roadsM2 + fixedBuffers + fixedAmenities + fixedEasements;
    guard++;
  }
  // Attempt to add units if there is clear slack for at least one average unit
  guard = 0;
  while (used + perUnitAreaCost <= grossM2 && guard < 100) {
    N += 1;
    ({ counts, roundingNote } = distributeUnitsLargestRemainder(N, normalized));
    units = buildUnits(counts, normalized);
    frontage = computeFrontage(units);
    roadsM2 = frontage * rowWidthM * roadCoeffK;
    lotsM2 = computeLotsArea(units);
    used = lotsM2 + roadsM2 + fixedBuffers + fixedAmenities + fixedEasements;
    guard++;
  }

  const nonSellableM2 = roadsM2 + fixedBuffers + fixedAmenities + fixedEasements;

  const assumptions: Assumptions = {
    roadCoeffK,
    rowWidthM,
    normalizedMix: normalized.map(p => ({ id: p.id, name: p.name, mix: p.mix })),
    roundingMethod: roundingNote === 'largest-remainder' ? 'largest-remainder' : 'nearest',
    nonSellableOrdering: ['roads', 'buffers', 'amenities', 'easements']
  };

  const result: CalculationResult = {
    units,
    areas: {
      grossM2,
      lotsM2,
      roadsM2,
      buffersM2: fixedBuffers,
      amenitiesM2: fixedAmenities,
      easementsM2: fixedEasements,
      nonSellableM2
    },
    efficiency: {
      netLotToGrossPct: (lotsM2 / grossM2) * 100,
      roadPct: (roadsM2 / grossM2) * 100,
      nonSellablePct: (nonSellableM2 / grossM2) * 100
    },
    warnings,
    assumptions
  };

  return result;
}

