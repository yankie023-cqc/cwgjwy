import type { AssetType } from '../types/holding';

export const STORAGE_KEY = 'portfolio_holdings_v4';
export const LEGACY_KEYS = ['portfolio_holdings_v3', 'portfolio_holdings_v2', 'portfolio_holdings_v1'];

export const ASSET_TYPES: Array<{ value: AssetType; label: string; placeholder: string }> = [
  { value: 'ON_FUND', label: '场内基金', placeholder: '请输入6位基金代码，例如 510300' },
  { value: 'OFF_FUND', label: '场外基金', placeholder: '请输入6位基金代码，例如 019827' },
  { value: 'A_STOCK', label: 'A股', placeholder: '请输入6位股票代码，例如 600519' },
  { value: 'HK_STOCK', label: '港股', placeholder: '请输入5位港股代码，例如 00700' },
  { value: 'US_STOCK', label: '美股', placeholder: '请输入美股代码，例如 AAPL' }
];

export const TYPE_LABEL_MAP: Record<AssetType, string> = {
  ON_FUND: '场内基金',
  OFF_FUND: '场外基金',
  A_STOCK: 'A股',
  HK_STOCK: '港股',
  US_STOCK: '美股'
};
