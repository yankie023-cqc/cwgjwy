import { useCallback, useEffect, useMemo, useState } from 'react';
import ActionBar from './components/ActionBar';
import HoldingForm from './components/HoldingForm';
import HoldingTable from './components/HoldingTable';
import SummaryBar from './components/SummaryBar';
import Toast from './components/Toast';
import { ASSET_TYPES } from './constants/assetTypes';
import { getEastmoneyQuote, getFxToCnyMap, getOffFundQuote } from './services/api';
import type { AssetType, Holding } from './types/holding';
import { recalculate, formatNow } from './utils/calc';
import { getCodeErrorTipByType, normalizeCodeByType, validateCodeByType } from './utils/code';
import { loadFromStorage, saveToStorage } from './utils/storage';

type QuoteResult = {
  name: string;
  rawPrice: number;
  currency: Holding['currency'];
};

function createHolding(assetType: AssetType, code: string, qty: number): Holding {
  return {
    assetType,
    code,
    qty,
    name: '',
    currency: 'CNY',
    rawPrice: 0,
    cnyPrice: 0,
    rawMarketValue: 0,
    cnyMarketValue: 0,
    ratio: 0
  };
}

export default function App() {
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [formAssetTypeIndex, setFormAssetTypeIndex] = useState(0);
  const [formCode, setFormCode] = useState('');
  const [formQty, setFormQty] = useState('');
  const [editIndex, setEditIndex] = useState(-1);
  const [lastUpdateTime, setLastUpdateTime] = useState('--');
  const [totalCnyAssetText, setTotalCnyAssetText] = useState('0.00');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState('');

  const recalcAndSet = useCallback((list: Holding[]) => {
    const { sortedList, totalCnyAssetText: total } = recalculate(list);
    setHoldings(sortedList);
    setTotalCnyAssetText(total);
  }, []);

  const viewHoldings = useMemo(() => recalculate(holdings).viewList, [holdings]);

  const showToast = useCallback((message: string) => {
    setToast(message);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(''), 2200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    const list = loadFromStorage();
    recalcAndSet(list);
    setLastUpdateTime(formatNow());
    refreshQuotes(false, list);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getCurrentFormAssetType = (): AssetType => {
    return ASSET_TYPES[formAssetTypeIndex]?.value || 'ON_FUND';
  };

  const trySecids = async (
    secids: string[],
    currency: Holding['currency'],
    priceDivisor: number
  ): Promise<QuoteResult> => {
    for (const secid of secids) {
      try {
        const quote = await getEastmoneyQuote(secid, priceDivisor);
        return { name: quote.name, rawPrice: quote.rawPrice, currency };
      } catch {
        // continue trying next secid
      }
    }
    throw new Error('未获取到行情数据');
  };

  const fetchAssetQuote = async (assetType: AssetType, code: string): Promise<QuoteResult> => {
    if (assetType === 'OFF_FUND') {
      return getOffFundQuote(code);
    }

    if (assetType === 'ON_FUND') {
      const first = code.charAt(0);
      const secids = first === '5' || first === '6' || first === '9' ? [`1.${code}`, `0.${code}`] : [`0.${code}`, `1.${code}`];
      return trySecids(secids, 'CNY', 1000);
    }

    if (assetType === 'A_STOCK') {
      const first = code.charAt(0);
      const secids =
        first === '6' || first === '9' || first === '5'
          ? [`1.${code}`, `0.${code}`]
          : [`0.${code}`, `1.${code}`];
      return trySecids(secids, 'CNY', 100);
    }

    if (assetType === 'HK_STOCK') {
      return trySecids([`116.${code}`], 'HKD', 1000);
    }

    if (assetType === 'US_STOCK') {
      return trySecids([`105.${code}`, `107.${code}`, `106.${code}`], 'USD', 1000);
    }

    throw new Error('不支持的资产类型');
  };

  const refreshQuotes = useCallback(
    async (withToast: boolean, sourceList?: Holding[]) => {
      if (loading) return;

      const current = sourceList ?? holdings;
      const list = current.map((item) => ({ ...item }));

      if (list.length === 0) {
        setLastUpdateTime(formatNow());
        setTotalCnyAssetText('0.00');
        return;
      }

      setLoading(true);
      try {
        const fxMap = await getFxToCnyMap();
        let successCount = 0;

        for (const row of list) {
          try {
            const quote = await fetchAssetQuote(row.assetType, row.code);
            const fx = Number(fxMap[quote.currency] || 1);
            const rawPrice = Number(quote.rawPrice || 0);
            const qty = Number(row.qty || 0);

            row.name = quote.name;
            row.currency = quote.currency;
            row.rawPrice = rawPrice;
            row.cnyPrice = Number((rawPrice * fx).toFixed(6));
            row.rawMarketValue = Number((rawPrice * qty).toFixed(2));
            row.cnyMarketValue = Number((row.cnyPrice * qty).toFixed(2));
            successCount += 1;
          } catch {
            row.name = row.name || '名称获取失败，请检查类型是否正确';
            row.currency = row.currency || (row.assetType === 'HK_STOCK' ? 'HKD' : row.assetType === 'US_STOCK' ? 'USD' : 'CNY');
            row.rawPrice = Number(row.rawPrice || 0);
            row.cnyPrice = Number(row.cnyPrice || 0);
            row.rawMarketValue = Number((row.rawPrice * row.qty).toFixed(2));
            row.cnyMarketValue = Number((row.cnyPrice * row.qty).toFixed(2));
          }
        }

        recalcAndSet(list);
        saveToStorage(recalculate(list).sortedList);
        setLastUpdateTime(formatNow());
        if (withToast) {
          showToast(`更新完成 ${successCount}/${list.length}`);
        }
      } finally {
        setLoading(false);
      }
    },
    [holdings, loading, recalcAndSet, showToast]
  );

  const addOrUpdateHolding = async () => {
    const assetType = getCurrentFormAssetType();
    const code = normalizeCodeByType(assetType, formCode);
    const qty = Number(formQty);

    if (!code) {
      showToast('请输入代码');
      return;
    }

    if (!validateCodeByType(assetType, code)) {
      showToast(getCodeErrorTipByType(assetType));
      return;
    }

    if (!qty || qty <= 0) {
      showToast('数量必须大于0');
      return;
    }

    const list = [...holdings];

    if (editIndex >= 0) {
      list[editIndex] = createHolding(assetType, code, qty);
      showToast('修改成功');
    } else {
      const found = list.findIndex((item) => item.assetType === assetType && item.code === code);
      if (found >= 0) {
        list[found].qty = Number(list[found].qty) + qty;
        showToast('已合并到原持仓');
      } else {
        list.push(createHolding(assetType, code, qty));
        showToast('添加成功');
      }
    }

    setFormCode('');
    setFormQty('');
    setFormAssetTypeIndex(0);
    setEditIndex(-1);
    recalcAndSet(list);
    saveToStorage(recalculate(list).sortedList);
    await refreshQuotes(false, list);
  };

  const startEdit = (index: number) => {
    const item = holdings[index];
    if (!item) return;
    const typeIdx = ASSET_TYPES.findIndex((x) => x.value === item.assetType);

    setEditIndex(index);
    setFormAssetTypeIndex(typeIdx >= 0 ? typeIdx : 0);
    setFormCode(item.code);
    setFormQty(String(item.qty));
  };

  const cancelEdit = () => {
    setEditIndex(-1);
    setFormAssetTypeIndex(0);
    setFormCode('');
    setFormQty('');
  };

  const deleteHolding = (index: number) => {
    if (!window.confirm('确定删除这条持仓记录吗？')) return;

    const list = [...holdings];
    list.splice(index, 1);
    recalcAndSet(list);
    saveToStorage(recalculate(list).sortedList);
    cancelEdit();
    setLastUpdateTime(formatNow());
    showToast('已删除');
  };

  const clearAllHoldings = () => {
    if (holdings.length === 0) {
      showToast('当前没有持仓');
      return;
    }
    if (!window.confirm('此操作会删除全部持仓，是否继续？')) return;

    const list: Holding[] = [];
    recalcAndSet(list);
    saveToStorage(recalculate(list).sortedList);
    cancelEdit();
    setLastUpdateTime(formatNow());
    showToast('已清空');
  };

  return (
    <main className="container">
      <section className="card title-card">
        <h1 className="app-title">一站式证券资产仓位管家（Web）</h1>
      </section>

      <HoldingForm
        formAssetTypeIndex={formAssetTypeIndex}
        formCode={formCode}
        formQty={formQty}
        editIndex={editIndex}
        onAssetTypeChange={(idx) => {
          setFormAssetTypeIndex(idx);
          setFormCode('');
        }}
        onCodeChange={(value) => {
          const t = ASSET_TYPES[formAssetTypeIndex]?.value;
          setFormCode(t === 'US_STOCK' ? value.toUpperCase().trim() : value.trim());
        }}
        onQtyChange={(value) => setFormQty(value.trim())}
        onSubmit={addOrUpdateHolding}
        onCancelEdit={cancelEdit}
      />

      <ActionBar loading={loading} onRefresh={() => refreshQuotes(true)} onClear={clearAllHoldings} />
      <HoldingTable holdings={viewHoldings} onEdit={startEdit} onDelete={deleteHolding} />
      <SummaryBar totalCnyAssetText={totalCnyAssetText} lastUpdateTime={lastUpdateTime} />
      <Toast message={toast} />
    </main>
  );
}
