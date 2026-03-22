const API_BASE = (import.meta.env.VITE_API_BASE || '').replace(/\/$/, '');

function withBase(path: string): string {
  return `${API_BASE}${path}`;
}

type EastmoneyResponse = {
  ok: boolean;
  data?: { name: string; rawPrice: number };
  message?: string;
};

type OffFundResponse = {
  ok: boolean;
  data?: { name: string; rawPrice: number; currency: 'CNY' };
  message?: string;
};

type FxResponse = {
  ok: boolean;
  data?: { CNY: number; HKD: number; USD: number };
  message?: string;
};

export async function getEastmoneyQuote(secid: string, divisor: number): Promise<{ name: string; rawPrice: number }> {
  const query = new URLSearchParams({ secid, divisor: String(divisor) });
  const res = await fetch(`${withBase('/api/quote/eastmoney')}?${query.toString()}`);
  const body = (await res.json()) as EastmoneyResponse;
  if (!res.ok || !body.ok || !body.data) {
    throw new Error(body.message || 'Quote request failed');
  }
  return body.data;
}

export async function getOffFundQuote(code: string): Promise<{ name: string; rawPrice: number; currency: 'CNY' }> {
  const res = await fetch(withBase(`/api/quote/off-fund/${encodeURIComponent(code)}`));
  const body = (await res.json()) as OffFundResponse;
  if (!res.ok || !body.ok || !body.data) {
    throw new Error(body.message || 'Off-fund request failed');
  }
  return body.data;
}

export async function getFxToCnyMap(): Promise<{ CNY: number; HKD: number; USD: number }> {
  const res = await fetch(withBase('/api/fx/cny'));
  const body = (await res.json()) as FxResponse;
  if (!res.ok || !body.ok || !body.data) {
    return { CNY: 1, HKD: 0.9, USD: 7 };
  }
  return body.data;
}
