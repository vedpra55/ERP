import { PaymentDetails, PurchaseOrder } from "@@types/system";
import { FC, useState } from "react";
import ItemColumn from "./ItemColumn";
import AddPayments from "./AddPayments";
import useCreateMution from "@api/mutation";
import AppButton from "@components/ui/AppButton";
import { toast } from "react-hot-toast";
import PaymentDetailsTable from "./PaymentDetailsTable";

interface Props {
  purchaseOrder: PurchaseOrder;
  paymentDetails: PaymentDetails[];
  subTotal: number;
}

export interface PaymentDetailsValue {
  srl: string;
  date: Date;
  amount: number;
  remarks: string;
}

const PurchasePayment: FC<Props> = ({
  paymentDetails,
  purchaseOrder,
  subTotal,
}) => {
  const total = parseInt(purchaseOrder.freight.toString()) + subTotal;
  const nonVendorCostValue = (purchaseOrder.non_vendor_cost / 100) * total;
  const orderDate = new Date(purchaseOrder.order_dt);
  const dueDate = new Date(purchaseOrder.eta);

  const { addPurchaseOrderPaymentMutation } = useCreateMution();

  const [paymentRowData, setPaymentRowData] = useState<PaymentDetailsValue[]>([
    {
      srl: "",
      date: new Date(),
      amount: 0,
      remarks: "",
    },
  ]);

  const [subAmount, setSubAmount] = useState(0);

  const handlePayment = async () => {
    const totalLefAmount = total - purchaseOrder.amount_paid;
    console.log(subAmount, totalLefAmount);
    if (subAmount > totalLefAmount) {
      toast.error("You are over paying please check the amount");
      return;
    }

    for (let i = 0; i > paymentRowData.length; i++) {
      const item = paymentRowData[i];
      if (
        item.amount == 0 ||
        item.remarks == "" ||
        item.srl == "" ||
        !item.date
      ) {
        toast.error("Please fill all fields of payment table");
        return;
      }
    }

    const item = {
      orderNo: purchaseOrder.order_no,
      payments: paymentRowData,
      subTotal: subTotal,
      totalOrderValue: total,
    };
    await addPurchaseOrderPaymentMutation.mutateAsync(item);

    setPaymentRowData([
      {
        srl: "",
        date: new Date(),
        amount: 0,
        remarks: "",
      },
    ]);
  };

  return (
    <div>
      <div className="grid grid-cols-12 mb-10">
        <div className="col-span-8 flex flex-col gap-y-2">
          <ItemColumn value={purchaseOrder.order_no} title="Order No" />
          <ItemColumn
            value={`${purchaseOrder.non_vendor_cost}%`}
            title="Non Vendor Cost"
          />
          <ItemColumn
            value={`${nonVendorCostValue}`}
            title="Non Vendor Cost Value"
          />
          <ItemColumn value={`${total}`} title="Total Order Value" />
          <ItemColumn value={purchaseOrder.freight} title="Freight" />
          <ItemColumn value={purchaseOrder.amount_paid} title="Amount Paid" />
        </div>
        <div className="col-span-4 p-5 border rounded-md h-40">
          <div className="flex font-medium text-lg items-center gap-x-10">
            <p className="w-28">Order Date</p>
            <p>
              {orderDate.getDate()} / {orderDate.getMonth()} /{" "}
              {orderDate.getFullYear()}
            </p>
          </div>
          <div className="flex mt-2 font-medium text-lg items-center gap-x-10">
            <p className="w-28">Due Date</p>
            <p>
              {dueDate.getDate()} / {dueDate.getMonth()} /{" "}
              {dueDate.getFullYear()}
            </p>
          </div>
          <div className="flex mt-4 font-medium text-lg items-center gap-x-10">
            {purchaseOrder.paid_flag ? (
              <p className="px-5 py-2 border rounded-md font-medium">Paid</p>
            ) : (
              <AppButton
                isLoading={addPurchaseOrderPaymentMutation.isLoading}
                handleOnClick={handlePayment}
                title="Pay"
              />
            )}
          </div>
        </div>
      </div>
      {paymentDetails.length ? (
        <PaymentDetailsTable payments={paymentDetails} />
      ) : (
        <p className="mb-10 font-semibold">No Previous Payments</p>
      )}
      {!purchaseOrder.paid_flag && (
        <AddPayments
          setSubAmount={setSubAmount}
          subAmount={subAmount}
          totalPaymetLength={paymentDetails.length}
          paymentDetails={paymentRowData}
          setPaymentDetails={setPaymentRowData}
        />
      )}
    </div>
  );
};

export default PurchasePayment;
