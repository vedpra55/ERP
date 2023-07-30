import { PurchaseOrderDetails } from "@@types/system";
import { FC } from "react";
import { RxCross2 } from "react-icons/rx";

interface Props {
  item: PurchaseOrderDetails;
  qty: any;
  onChangeQty(val: string): void;
  costFc: any;
  index: number;
  onChangeCostFc(val: string): void;
  handleDelete(index: number): void;
  fullFillFlag: boolean;
}

const EditPurchaseOrderRow: FC<Props> = ({
  item,
  qty,
  onChangeQty,
  costFc,
  onChangeCostFc,
  handleDelete,
  index,
  fullFillFlag,
}) => {
  return (
    <div className="grid grid-cols-12 gap-x-2  py-3 px-10 text-[14px] font-medium rounded-md">
      <p className="col-span-1">{item.serial_no}</p>
      <p className="col-span-2">{item.department_code}</p>
      <p className="col-span-2">{item.product_code}</p>
      {fullFillFlag ? (
        <p className="col-span-2">{item.cost_fc}</p>
      ) : (
        <input
          type={"number"}
          onChange={(e) => onChangeCostFc(e.target.value)}
          value={costFc}
          className="col-span-2 w-28 outline-none px-2 py-1 rounded-md  border"
        />
      )}
      {fullFillFlag ? (
        <p className="col-span-2">{item.qty_ordered}</p>
      ) : (
        <input
          type={"number"}
          value={qty}
          onChange={(e) => onChangeQty(e.target.value)}
          className="col-span-2 w-28 outline-none px-2 py-1 rounded-md  border"
        />
      )}
      <p className="col-span-1">{parseFloat(costFc) * parseInt(qty)}</p>
      {!fullFillFlag && (
        <div
          onClick={() => handleDelete(index)}
          className="col-span-1 text-lg cursor-pointer"
        >
          <RxCross2 />
        </div>
      )}
    </div>
  );
};

export default EditPurchaseOrderRow;
