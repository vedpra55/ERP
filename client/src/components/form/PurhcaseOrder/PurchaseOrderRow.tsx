import { Category, Product } from "@@types/system";
import { FC, useEffect, useState } from "react";
import { OrderDetails } from "../PurchaseOrderForm";
import { IoCloseSharp } from "react-icons/io5";

interface Props {
  index: number;
  categories: Category[];
  products: Product[];
  handleInputChange(e: any, index: number): void;
  removeRow(index: number): void;
  orderDetails: OrderDetails[];
}

const PurchaseOrderRow: FC<Props> = ({
  orderDetails,
  categories,
  products,
  index,
  handleInputChange,
  removeRow,
}) => {
  const [filterProducts, setFilterProduct] = useState<Product[]>();

  useEffect(() => {
    const items = products.filter(
      (res) => res.department_code === orderDetails[index].departmentCode
    );
    setFilterProduct(items);
  }, [orderDetails]);

  return (
    <div className="grid   grid-cols-12 mb-5 gap-x-3 px-10 py-2 border-b">
      <div className="col-span-1">{index + 1}</div>
      <select
        name="departmentCode"
        onChange={(e) => handleInputChange(e, index)}
        className="col-span-2  outline-none border  rounded-md px-2 py-1 w-28"
      >
        <option>Select</option>
        {categories.map(
          (item, i) =>
            !item.closed_flag && (
              <option value={item.department_code} key={i}>
                {item.department_code}
              </option>
            )
        )}
      </select>
      <select
        name="productCode"
        onChange={(e) => handleInputChange(e, index)}
        className="col-span-2  outline-none border  rounded-md px-2 py-1 w-36"
      >
        <option>Select</option>
        {filterProducts?.map(
          (item, i) =>
            !item.closed_flag && <option key={i}>{item.product_code}</option>
        )}
      </select>
      <div className="col-span-2 text-[13px]">
        {orderDetails[index].description}
      </div>
      <input
        className="border col-span-1 rounded-md outline-none px-2"
        name="unitPrice"
        type="number"
        onChange={(e) => handleInputChange(e, index)}
      />
      <input
        className="border col-span-2 w-28 rounded-md outline-none px-2"
        name="qtyBackorder"
        type="number"
        onChange={(e) => handleInputChange(e, index)}
      />
      <div className="col-span-1">{orderDetails[index].value}</div>
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
