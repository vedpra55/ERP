import { PaymentDetails } from "@@types/system";
import Table, { TableColumn } from "@components/ui/Table/Table";
import { FC } from "react";

interface Props {
  payments: PaymentDetails[];
}

const PaymentDetailsTable: FC<Props> = ({ payments }) => {
  const paymentColumn: TableColumn[] = [
    {
      header: "Payment No",
      accessor: "payment_no",
      colSpan: "col-span-2",
    },
    {
      header: "Date",
      accessor: "payment_dt",
      colSpan: "col-span-2",
      isDate: true,
    },
    {
      header: "Amount",
      accessor: "amount",
      colSpan: "col-span-2",
    },
    {
      header: "Remark",
      accessor: "remarks",
      colSpan: "col-span-2",
    },
  ];

  return (
    <div className="mb-10 border p-5 rounded-lg">
      <p className="font-medium mb-2">Previous Payments</p>
      <Table noMargin height="h-auto" columns={paymentColumn} data={payments} />
    </div>
  );
};

export default PaymentDetailsTable;
