const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000';

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
  const url = new URL(`${API_BASE}/api/quote/eastmoney`);
  url.searchParams.set('secid', secid);
  url.searchParams.set('divisor', String(divisor));

  const res = await fetch(url);
  const body = (await res.json()) as EastmoneyResponse;
  if (!res.ok || !body.ok || !body.data) {
    throw new Error(body.message || '行情请求失败');
  }
  return body.data;
}

export async function getOffFundQuote(code: string): Promise<{ name: string; rawPrice: number; currency: 'CNY' }> {
  const res = await fetch(`${API_BASE}/api/quote/off-fund/${code}`);
  const body = (await res.json()) as OffFundResponse;
  if (!res.ok || !body.ok || !body.data) {
    throw new Error(body.message || '场外基金请求失败');
  }
  return body.data;
}

export async function getFxToCnyMap(): Promise<{ CNY: number; HKD: number; USD: number }> {
  const res = await fetch(`${API_BASE}/api/fx/cny`);
  const body = (await res.json()) as FxResponse;
  if (!res.ok || !body.ok || !body.data) {
    return { CNY: 1, HKD: 0.9, USD: 7 };
  }
  return body.data;
}
