import { FC } from "react";
import { OrderDetails } from "../PurchaseOrderForm";
import AppButton from "@components/ui/AppButton";
import PurchaseOrderRow from "./PurchaseOrderRow";
import { fetchSingleProduct } from "@api/getCalls";
import { useAuthContext } from "@context/AuthContext";

interface Props {
  orderDetailsRow: OrderDetails[];
  setOrderDetailsRow: any;
  totalOrderValue: number;
}

const SelectOrderDetails: FC<Props> = ({
  orderDetailsRow,
  setOrderDetailsRow,
  totalOrderValue,
}) => {
  const { user } = useAuthContext();

  const handleInputChange = (e: any, index: number) => {
    const { value, name } = e.target;
    const list = [...orderDetailsRow];

    const list2 = [...orderDetailsRow];
    list2[index]["srl"] = index.toString();

    if (name === "departmentCode") {
      list[index]["departmentCode"] = value;
      list[index]["productCode"] = "";
      list[index]["description"] = "";
      setOrderDetailsRow(list);
    }

    if (name === "productCode") {
      list[index]["productCode"] = value;
      setOrderDetailsRow(list);

      let productDescription = "";

      fetchSingleProduct(
        value,
        orderDetailsRow[index].departmentCode,
        user.access_token
      )
        .then((res) => {
          if (res?.product) {
            productDescription = res?.product.product_description;
          }

          const list2 = [...orderDetailsRow];
          list2[index]["description"] = productDescription;
          setOrderDetailsRow(list2);
        })
        .catch((err) => {
          console.log(err);

          const list2 = [...orderDetailsRow];
          list2[index]["description"] = "";
          setOrderDetailsRow(list2);
        });
    }

    if (name === "unitPrice") {
      list[index]["unitPrice"] = parseFloat(value);
      setOrderDetailsRow(list);

      const list2 = [...orderDetailsRow];
      list2[index]["value"] =
        parseInt(value) * orderDetailsRow[index].qtyBackorder;
      setOrderDetailsRow(list2);
    }

    if (name === "qtyBackorder") {
      list[index]["qtyBackorder"] = parseInt(value);
      setOrderDetailsRow(list);

      const list2 = [...orderDetailsRow];
      list2[index]["value"] =
        parseInt(value) * orderDetailsRow[index].unitPrice;
      setOrderDetailsRow(list2);
    }
  };

  const handleAddRow = () => {
    const newOrder: OrderDetails = {
      srl: (orderDetailsRow.length + 1).toString(),
      departmentCode: "",
      productCode: "",
      description: "",
      qtyBackorder: 0,
      unitPrice: 0,
      value: 0,
    };

    const updatedOrders = [...orderDetailsRow, newOrder];
    setOrderDetailsRow(updatedOrders);
  };

  const handleRemoveRow = (index: number) => {
    const updatedOrders = orderDetailsRow
      .filter((_, i) => i !== index)
      .map((order, i) => ({ ...order, serialNo: i + 1 }));
    setOrderDetailsRow(updatedOrders);
  };

  return (
    <div className="col-span-12 mt-5 border rounded-md p-5">
      <Header />
      {orderDetailsRow.map((_, index) => (
        <PurchaseOrderRow
          key={index}
          orderDetails={orderDetailsRow}
          index={index}
          handleInputChange={handleInputChange}
          removeRow={handleRemoveRow}
        />
      ))}
      <div className="flex justify-end mr-40">
        <p className="border py-1 px-2 rounded-md text-[14px] font-medium">
          Sub Total : {totalOrderValue}
        </p>
      </div>
      <AppButton handleOnClick={handleAddRow} title="Add +" />
    </div>
  );
};

export default SelectOrderDetails;

function Header() {
  return (
    <div className="grid grid-cols-12 gap-x-2 bg-gray-100 py-3 px-10 text-[14px] font-medium rounded-md">
      <div className="col-span-1">Srl</div>
      <div className="col-span-2">Department</div>
      <div className="col-span-2">Product</div>
      <div className="col-span-2">Description</div>
      <div className="col-span-2">Unit Price</div>
      <div className="col-span-1">Quantity</div>
      <div className="col-span-1">Value</div>
      <div className="col-span-1">Action</div>
    </div>
  );
}
