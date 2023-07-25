import useApiServices from "@api/query";
import PurchaseOrderTab from "@components/editPurchaseOrder/PurchaseOrderTab";
import PurchasePayment from "@components/editPurchaseOrder/PurchasePaymentTab";

import BackButton from "@components/ui/BackButton";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const EditPurchaseOrder = () => {
  const [selectedTab, setSelectedTab] = useState(0);

  const params = useParams();
  const { orderNo } = params;
  if (!orderNo) return;
  const [purchaseOrderSubTotal, setSubTotal] = useState(0);
  const { useFetchSinglePurchaseOrder } = useApiServices();

  const { data } = useFetchSinglePurchaseOrder(orderNo);

  useEffect(() => {
    if (data) {
      const totalCost = data.purchaseOrderDetails.reduce(
        (accumulator, current) =>
          accumulator + current.cost_local * current.qty_ordered,
        0
      );
      setSubTotal(totalCost);
    }
  }, [data]);

  if (!data) return;

  const tabs = [
    {
      component: (
        <PurchaseOrderTab
          purchaseOrder={data.purchaseOrder}
          purchaseOrderDetails={data?.purchaseOrderDetails}
        />
      ),
    },
    {
      component: (
        <PurchasePayment
          subTotal={purchaseOrderSubTotal}
          purchaseOrder={data.purchaseOrder}
          paymentDetails={data.paymentDetails}
        />
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-x-2">
          <BackButton />
          <h2 className="text-[14px] font-medium tracking-wider">
            Edit Purchase Order
          </h2>
        </div>
      </div>

      <div className="flex gap-x-5 items-center my-10">
        <div
          onClick={() => setSelectedTab(0)}
          className={`w-64 ${
            selectedTab === 0 ? "border-b-2 text-black" : "text-gray-700"
          } font-medium border-black py-2 cursor-pointer text-center`}
        >
          <p>Purchase Order</p>
        </div>
        <div
          onClick={() => setSelectedTab(1)}
          className={`w-64 ${
            selectedTab === 1 ? "border-b-2 text-black" : "text-gray-700"
          } font-medium  border-black py-2 cursor-pointer text-center`}
        >
          <p>Payment</p>
        </div>
      </div>

      {tabs[selectedTab].component}
    </div>
  );
};

export default EditPurchaseOrder;
