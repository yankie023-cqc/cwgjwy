export type FxToCnyMap = {
  CNY: number;
  HKD: number;
  USD: number;
};

type FxResponse = {
  rates?: Record<string, number>;
};

const FALLBACK: FxToCnyMap = {
  CNY: 1,
  HKD: 0.9,
  USD: 7
};

export async function fetchFxToCnyMap(): Promise<FxToCnyMap> {
  try {
    const response = await fetch('https://open.er-api.com/v6/latest/CNY', { method: 'GET' });
    if (!response.ok) {
      return FALLBACK;
    }

    const data = (await response.json()) as FxResponse;
    const rates = data.rates || {};

    return {
      CNY: 1,
      HKD: rates.HKD ? Number(1 / Number(rates.HKD)) : FALLBACK.HKD,
      USD: rates.USD ? Number(1 / Number(rates.USD)) : FALLBACK.USD
    };
  } catch {
    return FALLBACK;
  }
}
