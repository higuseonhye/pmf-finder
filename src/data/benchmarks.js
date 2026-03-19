// Industry benchmark data (approximate ranges from PMF research)
// Sources: Sean Ellis, First Round Review, Y Combinator benchmarks

export const BENCHMARKS = {
  default: {
    problemRate: { min: 50, avg: 65, good: 80 },
    willingnessRate: { min: 30, avg: 45, good: 60 },
    responseRate: { min: 5, avg: 15, good: 25 },
    seVeryDisappointed: { min: 30, avg: 40, good: 50 },
  },
  saas: {
    problemRate: { min: 55, avg: 70, good: 85 },
    willingnessRate: { min: 35, avg: 50, good: 65 },
    responseRate: { min: 8, avg: 18, good: 30 },
    seVeryDisappointed: { min: 35, avg: 42, good: 55 },
  },
  b2b: {
    problemRate: { min: 50, avg: 62, good: 78 },
    willingnessRate: { min: 28, avg: 42, good: 58 },
    responseRate: { min: 4, avg: 12, good: 22 },
    seVeryDisappointed: { min: 28, avg: 38, good: 48 },
  },
  consumer: {
    problemRate: { min: 45, avg: 58, good: 75 },
    willingnessRate: { min: 25, avg: 38, good: 52 },
    responseRate: { min: 2, avg: 8, good: 15 },
    seVeryDisappointed: { min: 25, avg: 35, good: 45 },
  },
  healthcare: {
    problemRate: { min: 60, avg: 75, good: 88 },
    willingnessRate: { min: 40, avg: 55, good: 70 },
    responseRate: { min: 6, avg: 14, good: 22 },
    seVeryDisappointed: { min: 35, avg: 45, good: 58 },
  },
  fintech: {
    problemRate: { min: 55, avg: 68, good: 82 },
    willingnessRate: { min: 38, avg: 52, good: 68 },
    responseRate: { min: 5, avg: 12, good: 20 },
    seVeryDisappointed: { min: 32, avg: 40, good: 52 },
  },
};

export function getBenchmark(industry = '') {
  const key = (industry || '').toLowerCase();
  if (key.includes('saas') || key.includes('software')) return BENCHMARKS.saas;
  if (key.includes('b2b') || key.includes('enterprise')) return BENCHMARKS.b2b;
  if (key.includes('consumer') || key.includes('b2c')) return BENCHMARKS.consumer;
  if (key.includes('health') || key.includes('medical')) return BENCHMARKS.healthcare;
  if (key.includes('fin') || key.includes('pay') || key.includes('bank')) return BENCHMARKS.fintech;
  return BENCHMARKS.default;
}

export function compareToBenchmark(value, benchmark, key) {
  const b = benchmark[key] || BENCHMARKS.default[key];
  if (!b || value === null || value === undefined) return null;
  if (value >= b.good) return { status: 'above', label: 'Above benchmark', color: 'green' };
  if (value >= b.avg) return { status: 'average', label: 'At benchmark', color: 'amber' };
  if (value >= b.min) return { status: 'below', label: 'Below benchmark', color: 'amber' };
  return { status: 'low', label: 'Needs improvement', color: 'red' };
}
