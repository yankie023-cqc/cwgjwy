type Props = {
  loading: boolean;
  onRefresh: () => void;
  onClear: () => void;
};

export default function ActionBar({ loading, onRefresh, onClear }: Props) {
  return (
    <section className="card action-card">
      <button className="btn btn-primary" type="button" onClick={onRefresh} disabled={loading}>
        {loading ? '正在更新...' : '刷新实时价格'}
      </button>
      <button className="btn btn-danger" type="button" onClick={onClear} disabled={loading}>
        清空全部持仓
      </button>
    </section>
  );
}
