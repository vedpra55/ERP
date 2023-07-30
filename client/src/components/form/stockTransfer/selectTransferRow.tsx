import { Category, Product } from "@@types/system";
import { fetchProductQtyFromStore } from "@api/getCalls";
import { useAuthContext } from "@context/AuthContext";
import { TransferDetails } from "@pages/transaction/stockTransfer/createTransfer";
import { FC, useEffect, useState } from "react";

import { IoCloseSharp } from "react-icons/io5";

interface Props {
  index: number;
  categories: Category[];
  products: Product[];
  handleInputChange(e: any, index: number): void;
  removeRow(index: number): void;
  transferDetails: TransferDetails[];
  fromLocation?: string;
  setStoreQtyLess: any;
}

const SelectTransferRow: FC<Props> = ({
  transferDetails,
  categories,
  products,
  index,
  handleInputChange,
  removeRow,
  fromLocation,
  setStoreQtyLess,
}) => {
  const [filterProducts, setFilterProduct] = useState<Product[]>();

  const [errorMsg, setErrorMsg] = useState("");
  const { user } = useAuthContext();

  useEffect(() => {
    const items = products.filter(
      (res) => res.department_code === transferDetails[index].departmentCode
    );
    setFilterProduct(items);
  }, [transferDetails]);

  useEffect(() => {
    if (transferDetails[index].quantity) {
      handleCheckStoreQty();
    }
  }, [transferDetails]);

  const handleCheckStoreQty = async () => {
    if (
      transferDetails[index].departmentCode &&
      transferDetails[index].productCode &&
      transferDetails[index].quantity &&
      fromLocation
    ) {
      const storeQty = await fetchProductQtyFromStore(
        fromLocation,
        transferDetails[index].departmentCode,
        transferDetails[index].productCode,
        user.access_token
      );

      if (storeQty) {
        if (storeQty.qty_instock < transferDetails[index].quantity) {
          setErrorMsg(
            `Store qty is ${storeQty.qty_instock}. Please enter the qty in this range`
          );
          setStoreQtyLess(true);
        } else {
          setErrorMsg("");
          setStoreQtyLess(false);
        }
      }
    }
  };

  return (
    <div className="grid  items-start  grid-cols-12 gap-x-3 px-10 py-2 border-b">
      <div className="col-span-1">{index + 1}</div>
      <select
        name="departmentCode"
        onChange={(e) => handleInputChange(e, index)}
        className="col-span-2  outline-none border text-[14px]  rounded-md px-2 py-1 w-28"
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
        className="col-span-2  outline-none border text-[14px]   rounded-md px-2 py-1 md:w-28 2xl:w-36"
      >
        <option>Select</option>
        {filterProducts?.map(
          (item, i) =>
            !item.closed_flag && <option key={i}>{item.product_code}</option>
        )}
      </select>
      <div className="col-span-2 text-[13px]">
        {transferDetails[index].description}
      </div>
      <div className=" col-span-2 w-full gap-y-1 flex flex-col ">
        {errorMsg && <p className="text-xs text-red-500">{errorMsg}</p>}
        <input
          className="border   w-28 py-1 rounded-md outline-none px-2"
          name="quantity"
          type="number"
          onChange={(e) => handleInputChange(e, index)}
        />
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

export default SelectTransferRow;
