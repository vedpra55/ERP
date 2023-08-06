import { PurchaseOrder, PurchaseOrderDetails } from "@@types/system";
import { FC, useEffect, useState } from "react";
import ItemColumn from "./ItemColumn";
import useApiServices from "@api/query";
import DetailsColumn from "./detailsColumn";
import useCreateMution from "@api/mutation";
import AppButton from "@components/ui/AppButton";
import { toast } from "react-hot-toast";

interface Props {
  purchaseOrder: PurchaseOrder;
  purchaseOrderDetails: PurchaseOrderDetails[];
}

const PurchaseOrderTab: FC<Props> = ({
  purchaseOrder,
  purchaseOrderDetails,
}) => {
  const { useFetchSingleSupplier, useFetchSingleLocation } = useApiServices();
  const { data: supplier } = useFetchSingleSupplier(
    purchaseOrder.supplier_code
  );
  const { fullFillPurchaseOrderMutation, editPurchaseOrderMutation } =
    useCreateMution();

  const { data: location } = useFetchSingleLocation(
    purchaseOrder.location_code
  );

  const [costRate, setCostRate] = useState(
    purchaseOrder.cost_rate != "0" ? purchaseOrder.cost_rate.toString() : 0
  );

  const [nonVendorCost, setNonVendorCost] = useState(
    purchaseOrder.non_vendor_cost != 0
      ? purchaseOrder.non_vendor_cost.toString()
      : 0
  );

  const [freight, setFreight] = useState(
    purchaseOrder.freight != 0 ? purchaseOrder.freight.toString() : 0
  );

  useEffect(() => {
    setCostRate(
      purchaseOrder.cost_rate != "0" ? purchaseOrder.cost_rate.toString() : 0
    );
    setNonVendorCost(
      purchaseOrder.non_vendor_cost != 0
        ? purchaseOrder.non_vendor_cost.toString()
        : 0
    );
    setFreight(
      purchaseOrder.freight != 0 ? purchaseOrder.freight.toString() : 0
    );
  }, [purchaseOrder]);

  const [unitPrices, setUnitPrices] = useState<any[]>();
  const [quantites, setQuantites] = useState<any[]>();

  if (!supplier) return;

  const orderDate = new Date(purchaseOrder.order_dt);

  const handleFullFill = async () => {
    let subTotal = 0;

    for (let i = 0; i < purchaseOrderDetails.length; i++) {
      subTotal +=
        parseFloat(purchaseOrderDetails[i].cost_fc.toString()) *
        parseFloat(purchaseOrderDetails[i].qty_ordered.toString());
    }

    let total = 0;

    if (purchaseOrder.freight) {
      total = subTotal + parseFloat(purchaseOrder.freight.toString());
    } else {
      total = subTotal;
    }

    const item = {
      orderNo: purchaseOrder.order_no,
      orderDate: purchaseOrder.order_dt,
      locationCode: purchaseOrder.location_code,
      costRate: purchaseOrder.cost_rate,
      freight: purchaseOrder.freight,
      nonSupplierCost: purchaseOrder.non_vendor_cost,
      products: purchaseOrderDetails,
      subTotal: subTotal,
      total: total,
    };

    await fullFillPurchaseOrderMutation.mutateAsync(item);
  };

  const onSubmit = async () => {
    let products = [];

    if (!unitPrices || !quantites) return;

    for (let i = 0; i < unitPrices?.length; i++) {
      const unitPrice = unitPrices[i];
      const qty = quantites[i];

      if (!unitPrice || !qty) {
        toast.error("Please fill all fields");
        return;
      }

      const p = purchaseOrderDetails[i];

      let item = {
        ...p,
        cost_fc: parseFloat(unitPrice),
        qty_ordered: parseInt(qty),
      };

      products.push(item);
    }

    const newProducts = mergeArraysForDifferentOrderNo(
      purchaseOrderDetails,
      products
    );

    let total = 0;
    for (let i = 0; i < newProducts.length; i++) {
      total +=
        parseFloat(newProducts[i].qty_ordered) *
        parseFloat(newProducts[i].cost_fc);
    }

    const item = {
      products,
      costRate,
      nonVendorCost,
      freight,
      orderAmount: total + (freight ? parseFloat(freight.toString()) : 0),
      order_no: purchaseOrder.order_no,
    };

    await editPurchaseOrderMutation.mutateAsync(item);
  };

  function mergeArraysForDifferentOrderNo(arr1: any[], arr2: any[]) {
    const lookup: any = {};
    arr1.forEach((item) => {
      lookup[item.product_code] = item;
    });

    // Step 2: Iterate through the second array and merge the data into the first array if the order_no matches
    arr2.forEach((item) => {
      const productCode = item.product_code;
      if (lookup[productCode]) {
        // Merge the data from the second array (arr2) into the corresponding item in the first array (arr1)
        Object.assign(lookup[productCode], item);
      } else {
        // If the order_no is not present in arr1, add it as a new item
        arr1.push(item);
      }
    });

    // Step 3: Return the merged array
    return arr1;
  }

  return (
    <div>
      <div className="grid grid-cols-12 gap-x-3">
        <div className="col-span-4 flex flex-col gap-y-2">
          <ItemColumn value={purchaseOrder.order_no} title="Order No" />
          <ItemColumn
            value={purchaseOrder.supplier_code}
            title="Supplier Code"
          />
          <ItemColumn value={supplier.supplier_name} title="Supplier Name" />
          <ItemColumn value={supplier.mobile_no} title="Phone No" />
          <ItemColumn value={supplier.email} title="Email" />
          <ItemColumn value={supplier.address_1} title="Address" />
          <ItemColumn
            value={purchaseOrder.location_code}
            title="Location Code"
          />
          <ItemColumn
            value={location?.location_name || ""}
            title="Location Name"
          />
        </div>
        <div className="col-span-4 flex flex-col gap-y-2">
          <ItemColumn value={`${purchaseOrder.remarks}`} title="Remarks" />
          <ItemColumn
            value={purchaseOrder.supplier_invno}
            title="Supplier Invoice"
          />
          <ItemColumn value={purchaseOrder.currency} title="Currency" />

          {purchaseOrder.fulfilled_flag ? (
            <>
              <ItemColumn title="Cost Rate" value={purchaseOrder.cost_rate} />
              <ItemColumn title="Freight" value={purchaseOrder.freight} />
              <ItemColumn
                title="Non Vendor Cost "
                value={`${purchaseOrder.non_vendor_cost}%`}
              />
            </>
          ) : (
            <>
              <div className="flex gap-x-10 text-[14px] 2xl:text-base ">
                <p className="w-56 2xl:w-80 ">Cost Rate:</p>
                <input
                  type="number"
                  step="any"
                  value={costRate}
                  onChange={(e) => setCostRate(e.target.value)}
                  className=" w-full border rounded-md px-5 outline-none"
                />
              </div>

              <div className="flex gap-x-10 text-[14px] 2xl:text-base">
                <p className="w-56 2xl:w-80 ">Freight:</p>
                <input
                  type="number"
                  step="any"
                  value={freight}
                  onChange={(e) => setFreight(e.target.value)}
                  className="w-full border rounded-md px-5 outline-none"
                />
              </div>

              <div className="flex gap-x-10 text-[14px] 2xl:text-base">
                <p className="w-56 2xl:w-80 ">Non Vendor Cost:</p>
                <input
                  type="number"
                  step="any"
                  value={nonVendorCost}
                  onChange={(e) => setNonVendorCost(e.target.value)}
                  className="w-full border rounded-md px-5 outline-none"
                />
              </div>
            </>
          )}
        </div>
        <div className="col-span-4 px-5 py-5  border h-40 2xl:h-32 rounded-md">
          <div className="flex items-center 2xl:text-lg font-medium  gap-x-10">
            <p>Order Date:</p>
            <p>
              {orderDate.getDate()} / {orderDate.getMonth() + 1} /
              {orderDate.getFullYear()}
            </p>
          </div>
          <div className="flex items-center gap-x-10 mt-5">
            {purchaseOrder.fulfilled_flag ? (
              <p className=" font-medium text-green-700 border px-5 py-2 rounded-md">
                Full Filled
              </p>
            ) : (
              <AppButton
                handleOnClick={handleFullFill}
                isLoading={fullFillPurchaseOrderMutation.isLoading}
                title="Full Fill"
              />
            )}
            {!purchaseOrder.fulfilled_flag && (
              <AppButton
                handleOnClick={onSubmit}
                isLoading={editPurchaseOrderMutation.isLoading}
                title="Edit"
              />
            )}
          </div>
        </div>
      </div>
      <DetailsColumn
        setUnitPrices={setUnitPrices}
        setQuantites={setQuantites}
        quantites={quantites}
        unitPrices={unitPrices}
        locationCode={purchaseOrder.location_code}
        fullFillFlag={purchaseOrder.fulfilled_flag}
        purchaseOrderDetails={purchaseOrderDetails}
      />
    </div>
  );
};

export default PurchaseOrderTab;
