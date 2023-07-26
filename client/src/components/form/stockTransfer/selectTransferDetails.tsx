import { Category, Product } from "@@types/system";
import { FC } from "react";
import SelectTransferRow from "./selectTransferRow";
import { TransferDetails } from "@pages/transaction/stockTransfer/createTransfer";

interface Props {
  products: Product[];
  categories: Category[];
  transferDetailsRow: TransferDetails[];
  setTransferDetailsRow: any;
  fromLocation: string;
  setStoreQtyLess: any;
}

const SelectTransferDetails: FC<Props> = ({
  products,
  categories,
  transferDetailsRow,
  setTransferDetailsRow,
  fromLocation,
  setStoreQtyLess,
}) => {
  const handleInputChange = (e: any, index: number) => {
    const { value, name } = e.target;
    const list = [...transferDetailsRow];

    const list2 = [...transferDetailsRow];
    list2[index]["srl"] = index.toString();

    if (name === "departmentCode") {
      list[index]["departmentCode"] = value;
      list[index]["productCode"] = "";
      list[index]["description"] = "";
      setTransferDetailsRow(list);
    }

    if (name === "productCode") {
      list[index]["productCode"] = value;
      setTransferDetailsRow(list);

      const product = products.filter((res) => res.product_code === value)[0];
      const list2 = [...transferDetailsRow];
      list2[index]["description"] = product.product_description;
      setTransferDetailsRow(list2);
    }

    if (name === "quantity") {
      list[index]["quantity"] = parseInt(value);
      setTransferDetailsRow(list);
    }
  };

  const handleAddRow = () => {
    const newOrder: TransferDetails = {
      srl: (transferDetailsRow.length + 1).toString(),
      departmentCode: "",
      productCode: "",
      description: "",
      quantity: 0,
    };

    const updatedOrders = [...transferDetailsRow, newOrder];
    setTransferDetailsRow(updatedOrders);
  };

  const handleRemoveRow = (index: number) => {
    const updatedOrders = transferDetailsRow
      .filter((_, i) => i !== index)
      .map((order, i) => ({ ...order, srl: (i + 1).toString() }));
    setTransferDetailsRow(updatedOrders);
  };

  return (
    <div className="col-span-12 mt-5">
      <Header />
      {transferDetailsRow.map((_, index) => (
        <SelectTransferRow
          setStoreQtyLess={setStoreQtyLess}
          transferDetails={transferDetailsRow}
          products={products}
          categories={categories}
          index={index}
          handleInputChange={handleInputChange}
          removeRow={handleRemoveRow}
          key={index}
          fromLocation={fromLocation}
        />
      ))}

      <button
        onClick={handleAddRow}
        className="myButton mt-5 text-[12px] w-20 py-1"
      >
        Add +
      </button>
    </div>
  );
};

export default SelectTransferDetails;

function Header() {
  return (
    <div className="grid grid-cols-12 gap-x-2 bg-gray-100 py-3 px-10 text-[14px] font-medium rounded-md">
      <div className="col-span-1">Srl</div>
      <div className="col-span-2">Department</div>
      <div className="col-span-2">Product</div>
      <div className="col-span-2">Description</div>
      <div className="col-span-2">Quantity</div>
      <div className="col-span-2">Action</div>
    </div>
  );
}
