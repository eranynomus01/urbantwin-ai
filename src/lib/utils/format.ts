/**
 * Deterministic number formatter that guarantees identical string output
 * across Server-Side Rendering (e.g. Vercel Linux container) and Client-Side Hydration
 * (regardless of whether the browser locale is en-US, en-IN, or any other).
 */
export function formatNumber(value: number | string | undefined | null): string {
  if (value === null || value === undefined || value === '') return '0';
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return String(value);
  const parts = num.toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
}
