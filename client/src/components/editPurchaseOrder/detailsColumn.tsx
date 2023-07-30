import { PurchaseOrderDetails } from "@@types/system";
import useCreateMution from "@api/mutation";
import { FC, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import EditPurchaseOrderRow from "./EditPurchaseOrderRow";

interface Props {
  fullFillFlag: boolean;
  locationCode: string;
  purchaseOrderDetails: PurchaseOrderDetails[];
  onChangeInput?(val: any): void;
  setQuantites: any;
  quantites: any;
  unitPrices: any;
  setUnitPrices: any;
  freight?: number;
}

const DetailsColumn: FC<Props> = ({
  purchaseOrderDetails,
  fullFillFlag,
  locationCode,
  setQuantites,
  setUnitPrices,
  quantites,
  unitPrices,
  freight,
}) => {
  const { deletePurchaseOrderProductMutation } = useCreateMution();

  const [subTotal, setSubTotal] = useState(0);

  const handleDelete = async (index: number) => {
    if (purchaseOrderDetails.length === 1) {
      toast.error("Atleast 1 product record is required");
      return;
    }

    const product = purchaseOrderDetails[index];
    const totalAmount = subTotal;

    const deleteProductAmount =
      parseFloat(product.cost_fc.toString()) *
      parseInt(product.qty_ordered.toString());

    const amount = totalAmount - parseFloat(deleteProductAmount.toString());

    const item = {
      srl: product.serial_no,
      orderNo: product.order_no,
      amount: amount,
      product,
      locationCode,
    };

    await deletePurchaseOrderProductMutation.mutateAsync(item);
  };

  useEffect(() => {
    const qty = purchaseOrderDetails.map((item) => {
      if (item?.qty_ordered) {
        return item.qty_ordered;
      }
    });

    const unitPrice = purchaseOrderDetails.map((item) => {
      if (item?.cost_fc) {
        return item.cost_fc;
      }
    });
    setQuantites(qty);
    setUnitPrices(unitPrice);
  }, [purchaseOrderDetails]);

  useEffect(() => {
    let sub = 0;

    if (!quantites && !unitPrices) return;

    for (let i = 0; i < quantites.length; i++) {
      const q = quantites[i];
      const u = unitPrices[i];
      if (q && u) {
        sub += q * u;
      }
    }

    if (freight) {
      setSubTotal(sub + freight);
    } else {
      setSubTotal(sub);
    }
  }, [unitPrices, quantites, freight]);

  return (
    <div className="border rounded-md p-5 mt-5">
      <Header />
      {purchaseOrderDetails.map((item, i) => {
        if (!quantites || !unitPrices) return;
        return (
          <EditPurchaseOrderRow
            index={i}
            fullFillFlag={fullFillFlag}
            handleDelete={handleDelete}
            onChangeCostFc={(val: string) => {
              let previosCost = [...unitPrices];
              previosCost[i] = val;
              setUnitPrices(previosCost);
            }}
            onChangeQty={(val: string) => {
              let previosCost = [...quantites];
              previosCost[i] = val;
              setQuantites(previosCost);
            }}
            costFc={unitPrices[i]}
            qty={quantites[i]}
            item={item}
            key={item.serial_no}
          />
        );
      })}
      {!fullFillFlag && (
        <div className="flex justify-end mr-10">
          <div className="flex gap-x-6">
            <p>Sub Total :</p>
            <p>{subTotal}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DetailsColumn;

function Header() {
  return (
    <div className="grid grid-cols-12 gap-x-2 bg-gray-100 py-3 px-10 text-[14px] font-medium rounded-md">
      <div className="col-span-1">Srl</div>
      <div className="col-span-2">Department</div>
      <div className="col-span-2">Product</div>
      <div className="col-span-2">Unit Price</div>
      <div className="col-span-2">Quantity</div>
      <div className="col-span-1">Value</div>
      <div className="col-span-1">Action</div>
    </div>
  );
}
