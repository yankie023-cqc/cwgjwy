import type { AssetType } from '../types/holding';

export function normalizeCodeByType(assetType: AssetType, rawCode: string): string {
  let code = rawCode.trim().toUpperCase().replace(/\s+/g, '');

  if (assetType === 'HK_STOCK') {
    code = code.replace(/^HK\.?/, '');
    if (/^\d{1,5}$/.test(code)) {
      code = code.padStart(5, '0');
    }
    return code;
  }

  if (assetType === 'US_STOCK') {
    return code.replace(/^US\./, '');
  }

  return code;
}

export function validateCodeByType(assetType: AssetType, code: string): boolean {
  if (assetType === 'OFF_FUND') return /^\d{6}$/.test(code);
  if (assetType === 'ON_FUND') return /^\d{6}$/.test(code);
  if (assetType === 'A_STOCK') return /^\d{6}$/.test(code);
  if (assetType === 'HK_STOCK') return /^\d{5}$/.test(code);
  if (assetType === 'US_STOCK') return /^[A-Z][A-Z0-9.-]{0,9}$/.test(code);
  return false;
}

export function getCodeErrorTipByType(assetType: AssetType): string {
  if (assetType === 'OFF_FUND') return '场外基金代码必须为6位数字';
  if (assetType === 'ON_FUND') return '场内基金代码必须为6位数字';
  if (assetType === 'A_STOCK') return 'A股代码必须为6位数字';
  if (assetType === 'HK_STOCK') return '港股代码必须为5位数字';
  if (assetType === 'US_STOCK') return '美股代码格式不正确';
  return '代码格式不正确';
}

export function inferLegacyAssetType(code: string): AssetType {
  if (/^\d{5}$/.test(code)) return 'HK_STOCK';
  if (/^[A-Z][A-Z0-9.-]{0,9}$/.test(code)) return 'US_STOCK';
  if (/^\d{6}$/.test(code)) {
    if (code.charAt(0) === '5') return 'ON_FUND';
    return 'A_STOCK';
  }
  return 'A_STOCK';
}
