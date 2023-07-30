import { FC, useEffect } from "react";
import AddPaymentRow from "./AddPaymentRow";
import { PaymentDetailsValue } from "./PurchasePaymentTab";

interface Props {
  totalPaymetLength: number;
  paymentDetails: PaymentDetailsValue[];
  setPaymentDetails: any;
  setSubAmount: any;
  subAmount: number;
}

interface PaymentDetailsValues {
  srl: string;
  date: Date;
  amount: number;
  remarks: string;
}

const AddPayments: FC<Props> = ({
  paymentDetails,
  setPaymentDetails,
  totalPaymetLength: totalPaymet,
  subAmount,
  setSubAmount,
}) => {
  useEffect(() => {
    let val = 0;
    for (let i = 0; i < paymentDetails.length; i++) {
      if (paymentDetails) {
        const amount = paymentDetails[i].amount;
        if (amount) {
          val += parseFloat(amount.toString());
        }
      }
    }
    setSubAmount(val);
  }, [paymentDetails]);

  useEffect(() => {
    const list = [...paymentDetails];
    list[0]["srl"] = (1 + totalPaymet).toString();
    setPaymentDetails(list);
  }, []);

  const handleInputChange = (e: any, index: number) => {
    const { value, name } = e.target;
    const list = [...paymentDetails];

    const list2 = [...paymentDetails];
    list2[index]["srl"] = (index + 1 + totalPaymet).toString();

    if (name === "date") {
      list[index]["date"] = new Date(value);
      setPaymentDetails(list);
    }

    if (name === "amount") {
      list[index]["amount"] = parseFloat(value);
      setPaymentDetails(list);
    }

    if (name === "remarks") {
      list[index]["remarks"] = value;
      setPaymentDetails(list);
    }
  };

  const handleAddRow = () => {
    const newPayment: PaymentDetailsValues = {
      srl: (paymentDetails.length + 1 + totalPaymet).toString(),
      amount: 0,
      remarks: "",
      date: new Date(),
    };

    const updatedOrders = [...paymentDetails, newPayment];
    setPaymentDetails(updatedOrders);
  };

  const handleRemoveRow = (index: number) => {
    const updatedOrders = paymentDetails
      .filter((_, i) => i !== index)
      .map((order, i) => ({
        ...order,
        srl: (i + 1 + totalPaymet).toString(),
      }));
    setPaymentDetails(updatedOrders);
  };

  return (
    <div className="border rounded-md p-5">
      <p className="mb-3 font-medium">New Payments</p>
      <Header />
      {paymentDetails.map((_, index) => (
        <AddPaymentRow
          values={paymentDetails}
          srl={paymentDetails[index]?.srl}
          handleInputChange={handleInputChange}
          removeRow={handleRemoveRow}
          key={index}
          index={index}
        />
      ))}
      <div className="flex justify-end mr-80">
        <p className="border py-1 px-2 rounded-md text-[14px] font-medium">
          Sub Total : {subAmount}
        </p>
      </div>
      <button onClick={handleAddRow} className="myButton w-28 py-2 text">
        Add +
      </button>
    </div>
  );
};

export default AddPayments;

const Header = () => {
  return (
    <div className="grid grid-cols-12 gap-x-2 bg-gray-100 py-3 px-10 text-[14px] font-medium rounded-md">
      <div className=" col-span-1 2xl:col-span-1">Srl</div>
      <div className=" col-span-3 2xl:col-span-2">Date</div>
      <div className="col-span-3 2xl:col-span-2">Amount</div>
      <div className="col-span-3 2xl:col-span-3">Remarks</div>
      <div className="col-span-2 2xl:col-span-2">Action</div>
    </div>
  );
};
