import { ASSET_TYPES } from '../constants/assetTypes';

type Props = {
  formAssetTypeIndex: number;
  formCode: string;
  formQty: string;
  editIndex: number;
  onAssetTypeChange: (index: number) => void;
  onCodeChange: (value: string) => void;
  onQtyChange: (value: string) => void;
  onSubmit: () => void;
  onCancelEdit: () => void;
};

export default function HoldingForm(props: Props) {
  return (
    <section className="card">
      <h2 className="section-title">{props.editIndex >= 0 ? '修改持仓' : '添加持仓'}</h2>

      <div className="form-row">
        <label className="label" htmlFor="assetType">资产类型</label>
        <select
          id="assetType"
          className="input"
          value={props.formAssetTypeIndex}
          onChange={(e) => props.onAssetTypeChange(Number(e.target.value))}
        >
          {ASSET_TYPES.map((item, idx) => (
            <option key={item.value} value={idx}>{item.label}</option>
          ))}
        </select>
      </div>

      <div className="form-row">
        <label className="label" htmlFor="code">代码</label>
        <input
          id="code"
          className="input"
          value={props.formCode}
          placeholder={ASSET_TYPES[props.formAssetTypeIndex]?.placeholder}
          onChange={(e) => props.onCodeChange(e.target.value)}
        />
      </div>

      <div className="form-row">
        <label className="label" htmlFor="qty">数量</label>
        <input
          id="qty"
          className="input"
          value={props.formQty}
          inputMode="decimal"
          placeholder="请输入持有数量"
          onChange={(e) => props.onQtyChange(e.target.value)}
        />
      </div>

      <div className="button-row">
        <button className="btn btn-primary" onClick={props.onSubmit} type="button">
          {props.editIndex >= 0 ? '保存修改' : '添加持仓'}
        </button>
        {props.editIndex >= 0 && (
          <button className="btn btn-secondary" onClick={props.onCancelEdit} type="button">取消修改</button>
        )}
      </div>
    </section>
  );
}
