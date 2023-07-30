import { FC } from "react";
import { IoCloseSharp } from "react-icons/io5";

interface Props {
  handleInputChange(e: any, index: number): void;
  removeRow(index: number): void;
  index: number;
  srl?: string;
  values: any[];
}

const AddPaymentRow: FC<Props> = ({
  handleInputChange,
  removeRow,
  index,
  srl,
  values,
}) => {
  return (
    <div className="grid text-[14px] 2xl:text-base grid-cols-12 items-center mb-5 gap-x-3 px-10 py-2 border-b">
      <div className="col-span-1">{srl || ""}</div>
      <input
        name="date"
        onChange={(e) => handleInputChange(e, index)}
        className="col-span-3 2xl:col-span-2 border px-2 py-2 w-36 rounded-md outline-none"
        type="date"
      />
      <input
        name="amount"
        value={values[index].amount}
        onChange={(e) => handleInputChange(e, index)}
        className="col-span-3 2xl:col-span-2  border px-2 py-2 w-28 rounded-md outline-none"
        type="number"
      />
      <textarea
        name="remarks"
        onChange={(e) => handleInputChange(e, index)}
        className="col-span-3   2xl:w-56 border px-2 py-2  rounded-md outline-none"
        rows={1}
      />
      <div
        onClick={() => removeRow(index)}
        className="col-span-2 text-lg cursor-pointer"
      >
        <IoCloseSharp />
      </div>
    </div>
  );
};

export default AddPaymentRow;
