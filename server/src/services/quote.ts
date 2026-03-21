type EastmoneyBody = {
  rc?: number;
  data?: {
    f58?: string;
    f43?: number;
  };
};

type QuoteResult = {
  name: string;
  rawPrice: number;
};

export async function fetchEastmoneyQuoteBySecid(secid: string, priceDivisor: number): Promise<QuoteResult> {
  const url = new URL('https://push2.eastmoney.com/api/qt/stock/get');
  url.searchParams.set('secid', secid);
  url.searchParams.set('fields', 'f58,f43');

  const response = await fetch(url, { method: 'GET' });
  if (!response.ok) {
    throw new Error(`eastmoney request failed: ${response.status}`);
  }

  const body = (await response.json()) as EastmoneyBody;
  if (body.rc !== 0 || !body.data?.f58 || body.data.f43 === undefined || body.data.f43 === null) {
    throw new Error(`eastmoney no quote: ${secid}`);
  }

  const divisor = Number(priceDivisor) || 1000;
  return {
    name: body.data.f58,
    rawPrice: Number(body.data.f43) / divisor
  };
}

export async function fetchOffFundQuoteByCode(code: string): Promise<{ name: string; rawPrice: number; currency: 'CNY' }> {
  const response = await fetch(`https://fundgz.1234567.com.cn/js/${code}.js`, { method: 'GET' });
  if (!response.ok) {
    throw new Error(`off-fund request failed: ${response.status}`);
  }

  const text = await response.text();
  const match = text.match(/jsonpgz\((.*)\);?/);
  if (!match?.[1]) {
    throw new Error('off-fund parse failed');
  }

  const obj = JSON.parse(match[1]) as { name?: string; gsz?: string; dwjz?: string };
  const price = Number(obj.gsz || obj.dwjz || 0);
  if (!obj.name || !price) {
    throw new Error('off-fund invalid data');
  }

  return {
    name: obj.name,
    rawPrice: price,
    currency: 'CNY'
  };
}
