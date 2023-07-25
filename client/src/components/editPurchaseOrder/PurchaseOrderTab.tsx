import { PurchaseOrder, PurchaseOrderDetails } from "@@types/system";
import { FC } from "react";
import ItemColumn from "./ItemColumn";
import useApiServices from "@api/query";
import DetailsColumn from "./detailsColumn";
import useCreateMution from "@api/mutation";
import AppButton from "@components/ui/AppButton";

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
  const { fullFillPurchaseOrderMutation } = useCreateMution();

  const { data: location } = useFetchSingleLocation(
    purchaseOrder.location_code
  );

  if (!supplier) return;

  const orderDate = new Date(purchaseOrder.order_dt);

  const handleFullFill = async () => {
    let subTotal = 0;

    for (let i = 0; i < purchaseOrderDetails.length; i++) {
      subTotal +=
        parseFloat(purchaseOrderDetails[i].cost_local.toString()) *
        parseFloat(purchaseOrderDetails[i].qty_ordered.toString());
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
      total: subTotal + parseFloat(purchaseOrder.freight.toString()),
    };

    await fullFillPurchaseOrderMutation.mutateAsync(item);
  };

  return (
    <div>
      <div className="grid grid-cols-12">
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
          <ItemColumn value={purchaseOrder.cost_rate} title="Cost Rate" />
          <ItemColumn value={purchaseOrder.freight} title="Freight" />
          <ItemColumn
            value={`${purchaseOrder.non_vendor_cost}%`}
            title="Non Vendor Cost"
          />
        </div>
        <div className="col-span-4 px-5 py-5  border h-32 rounded-md">
          <div className="flex items-center text-lg font-medium  gap-x-10">
            <p>Order Date:</p>
            <p>
              {orderDate.getDate()} / {orderDate.getMonth()} /
              {orderDate.getFullYear()}
            </p>
          </div>
          <div className="flex items-center gap-x-10">
            {purchaseOrder.fulfilled_flag ? (
              <p className="mt-5 font-medium text-green-700 border px-5 py-2 rounded-md">
                Full Filled
              </p>
            ) : (
              <AppButton
                handleOnClick={handleFullFill}
                isLoading={fullFillPurchaseOrderMutation.isLoading}
                title="Full Fill"
              />
            )}
          </div>
        </div>
      </div>
      <DetailsColumn purchaseOrderDetails={purchaseOrderDetails} />
    </div>
  );
};

export default PurchaseOrderTab;
