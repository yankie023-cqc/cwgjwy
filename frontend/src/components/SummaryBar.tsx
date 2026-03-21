type Props = {
  totalCnyAssetText: string;
  lastUpdateTime: string;
};

export default function SummaryBar({ totalCnyAssetText, lastUpdateTime }: Props) {
  return (
    <section className="card summary">
      <div className="total-line">
        <span>人民币总资产合计：</span>
        <strong>{totalCnyAssetText} 元</strong>
      </div>
      <div className="update-line">更新时间：{lastUpdateTime}</div>
      <div className="update-line">支持范围：A股、港股、美股、场内基金、场外基金</div>
    </section>
  );
}
