import { LEGACY_KEYS, STORAGE_KEY, TYPE_LABEL_MAP } from '../constants/assetTypes';
import type { Holding } from '../types/holding';
import { inferLegacyAssetType } from './code';

export function loadFromStorage(): Holding[] {
  let list: unknown = safeParse(localStorage.getItem(STORAGE_KEY));

  if (!Array.isArray(list)) {
    for (const legacyKey of LEGACY_KEYS) {
      const legacy = safeParse(localStorage.getItem(legacyKey));
      if (Array.isArray(legacy)) {
        list = legacy;
        break;
      }
    }
  }

  if (!Array.isArray(list)) return [];

  return list
    .map((item) => {
      const row = (item || {}) as Record<string, unknown>;
      const code = String(row.code || '').toUpperCase();
      let assetType = String(row.assetType || '') as Holding['assetType'];

      if (!TYPE_LABEL_MAP[assetType]) {
        assetType = inferLegacyAssetType(code);
      }

      return {
        assetType,
        code,
        qty: Number(row.qty) || 0,
        name: String(row.name || ''),
        currency: (row.currency === 'HKD' || row.currency === 'USD' ? row.currency : 'CNY') as Holding['currency'],
        rawPrice: Number(row.rawPrice || row.price || 0),
        cnyPrice: Number(row.cnyPrice || row.price || 0),
        rawMarketValue: Number(row.rawMarketValue || 0),
        cnyMarketValue: Number(row.cnyMarketValue || 0),
        ratio: Number(row.ratio || 0)
      } satisfies Holding;
    })
    .filter((item) => item.code && item.qty > 0);
}

export function saveToStorage(list: Holding[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

function safeParse(raw: string | null): unknown {
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}
