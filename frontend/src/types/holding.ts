export type AssetType = 'ON_FUND' | 'OFF_FUND' | 'A_STOCK' | 'HK_STOCK' | 'US_STOCK';

export type Holding = {
  assetType: AssetType;
  code: string;
  qty: number;
  name: string;
  currency: 'CNY' | 'HKD' | 'USD';
  rawPrice: number;
  cnyPrice: number;
  rawMarketValue: number;
  cnyMarketValue: number;
  ratio: number;
};

export type ViewHolding = Holding & {
  assetTypeLabel: string;
  currencyText: string;
  rawPriceText: string;
  cnyPriceText: string;
  qtyText: string;
  rawMarketValueText: string;
  cnyMarketValueText: string;
  ratioText: string;
  uniqueKey: string;
};
