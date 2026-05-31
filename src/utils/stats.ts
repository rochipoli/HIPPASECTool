import { HIPAA_DATA } from '../data/hipaa';
import { type SpecResponse, getSpecResponse } from '../store/useHipaaStore';

export interface CategoryStats {
  counts: Record<string, number>;
  total: number;
  assessed: number;
  pct: number;
}

export interface OverallStats {
  counts: Record<string, number>;
  total: number;
  assessed: number;
  score: number;
}

export function getCategoryStats(
  responses: Record<string, SpecResponse>,
  categoryId: string
): CategoryStats {
  const cat = HIPAA_DATA.categories.find(c => c.id === categoryId)!;
  const specs = cat.standards.flatMap(s => s.specs);
  const counts: Record<string, number> = { compliant: 0, partial: 0, noncompliant: 0, na: 0, '': 0 };
  specs.forEach(sp => { counts[getSpecResponse(responses, sp.id).status]++; });
  const assessed = specs.length - counts[''];
  const pct = specs.length
    ? Math.round(((counts.compliant + counts.partial * 0.5) / specs.length) * 100)
    : 0;
  return { counts, total: specs.length, assessed, pct };
}

export function getOverallStats(responses: Record<string, SpecResponse>): OverallStats {
  const counts: Record<string, number> = { compliant: 0, partial: 0, noncompliant: 0, na: 0, '': 0 };
  HIPAA_DATA.allSpecs.forEach(sp => { counts[getSpecResponse(responses, sp.id).status]++; });
  const assessed = HIPAA_DATA.totalSpecs - counts[''];
  const score = HIPAA_DATA.totalSpecs
    ? Math.round(((counts.compliant + counts.partial * 0.5) / HIPAA_DATA.totalSpecs) * 100)
    : 0;
  return { counts, total: HIPAA_DATA.totalSpecs, assessed, score };
}

export function scoreToFillClass(pct: number): string {
  if (pct >= 80) return 'fill-compliant';
  if (pct >= 40) return 'fill-mixed';
  if (pct > 0)   return 'fill-low';
  return 'fill-empty';
}
