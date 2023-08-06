import { FC } from "react";
import { OrderDetails } from "../PurchaseOrderForm";
import { IoCloseSharp } from "react-icons/io5";

import SelectDepartment from "@components/input/SelectDepartment";
import SelectProductByDep from "@components/input/SelectProductByDep";

interface Props {
  index: number;
  handleInputChange(e: any, index: number): void;
  removeRow(index: number): void;
  orderDetails: OrderDetails[];
}

const PurchaseOrderRow: FC<Props> = ({
  orderDetails,
  index,
  handleInputChange,
  removeRow,
}) => {
  return (
    <div className="grid   grid-cols-12 mb-5 gap-x-3 px-10 py-2 border-b">
      <div className="col-span-1">{index + 1}</div>

      <div className="col-span-2">
        <SelectDepartment
          index={index}
          w={"w-full"}
          handleInputChange={handleInputChange}
        />
      </div>

      <div className="col-span-2">
        <SelectProductByDep
          index={index}
          selectedValue={{
            value: `${orderDetails[index].productCode}`,
            label: `${orderDetails[index].productCode}-${orderDetails[index].description}`,
          }}
          departmentCode={orderDetails[index].departmentCode}
          w={"w-full"}
          handleInputChange={handleInputChange}
        />
      </div>

      <div className="col-span-2 text-[13px]">
        {orderDetails[index].description}
      </div>
      <input
        className="border col-span-2 text-[14px] rounded-md outline-none px-2"
        name="unitPrice"
        type="number"
        onChange={(e) => handleInputChange(e, index)}
      />
      <input
        className="border col-span-1 text-[14px] rounded-md outline-none px-2"
        name="qtyBackorder"
        type="number"
        onChange={(e) => handleInputChange(e, index)}
      />
      <div className="col-span-1 truncate text-[14px]">
        {orderDetails[index].value}
      </div>
      <div
        className="col-span-1 text-xl cursor-pointer"
        onClick={() => removeRow(index)}
      >
        <IoCloseSharp />
      </div>
    </div>
  );
};

export default PurchaseOrderRow;
