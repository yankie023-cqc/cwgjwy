import type { ViewHolding } from '../types/holding';

type Props = {
  holdings: ViewHolding[];
  onEdit: (index: number) => void;
  onDelete: (index: number) => void;
};

export default function HoldingTable({ holdings, onEdit, onDelete }: Props) {
  return (
    <section className="card">
      <h2 className="section-title">资产列表</h2>

      {holdings.length === 0 ? (
        <div className="empty">暂无持仓，请先添加</div>
      ) : (
        <div className="table-scroll">
          <table className="table">
            <thead>
              <tr>
                <th>序号</th>
                <th>类型</th>
                <th>代码</th>
                <th>资产名称</th>
                <th>币种</th>
                <th>原始价格</th>
                <th>折算人民币价格</th>
                <th>持有数量</th>
                <th>原始市值</th>
                <th>折算人民币市值</th>
                <th>仓位占比</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {holdings.map((item, idx) => (
                <tr key={item.uniqueKey}>
                  <td>{idx + 1}</td>
                  <td>{item.assetTypeLabel}</td>
                  <td>{item.code}</td>
                  <td className="name-cell">{item.name}</td>
                  <td>{item.currencyText}</td>
                  <td>{item.rawPriceText}</td>
                  <td>{item.cnyPriceText}</td>
                  <td>{item.qtyText}</td>
                  <td>{item.rawMarketValueText}</td>
                  <td className="highlight">{item.cnyMarketValueText}</td>
                  <td className="ratio">{item.ratioText}%</td>
                  <td>
                    <div className="mini-actions">
                      <button className="mini mini-edit" type="button" onClick={() => onEdit(idx)}>
                        改
                      </button>
                      <button className="mini mini-del" type="button" onClick={() => onDelete(idx)}>
                        删
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
