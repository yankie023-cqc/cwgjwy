import { TYPE_LABEL_MAP } from '../constants/assetTypes';
import type { Holding, ViewHolding } from '../types/holding';

export function formatNow(): string {
  const d = new Date();
  const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

export function currencyLabel(code: Holding['currency']): string {
  if (code === 'HKD') return '港币';
  if (code === 'USD') return '美元';
  return '人民币';
}

export function recalculate(list: Holding[]): { sortedList: Holding[]; viewList: ViewHolding[]; totalCnyAssetText: string } {
  const sortedList = [...list].sort((a, b) => {
    const mktDiff = Number(b.cnyMarketValue || 0) - Number(a.cnyMarketValue || 0);
    if (mktDiff !== 0) return mktDiff;
    return String(a.code || '').localeCompare(String(b.code || ''));
  });

  const totalCny = sortedList.reduce((sum, row) => sum + Number(row.cnyMarketValue || 0), 0);

  const viewList = sortedList.map((row) => {
    const ratio = totalCny > 0 ? Number(((row.cnyMarketValue / totalCny) * 100).toFixed(2)) : 0;
    return {
      ...row,
      ratio,
      assetTypeLabel: TYPE_LABEL_MAP[row.assetType],
      currencyText: currencyLabel(row.currency),
      rawPriceText: Number(row.rawPrice || 0).toFixed(3),
      cnyPriceText: Number(row.cnyPrice || 0).toFixed(3),
      qtyText: String(row.qty || 0),
      rawMarketValueText: Number(row.rawMarketValue || 0).toFixed(2),
      cnyMarketValueText: Number(row.cnyMarketValue || 0).toFixed(2),
      ratioText: ratio.toFixed(2),
      uniqueKey: `${row.assetType}_${row.code}`
    } satisfies ViewHolding;
  });

  return {
    sortedList: viewList.map(({ assetTypeLabel, currencyText, rawPriceText, cnyPriceText, qtyText, rawMarketValueText, cnyMarketValueText, ratioText, uniqueKey, ...rest }) => rest),
    viewList,
    totalCnyAssetText: totalCny.toFixed(2)
  };
}
