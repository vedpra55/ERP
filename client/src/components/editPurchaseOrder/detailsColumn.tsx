import { PurchaseOrderDetails } from "@@types/system";
import Table, { TableColumn } from "@components/ui/Table/Table";
import { FC } from "react";

interface Props {
  purchaseOrderDetails: PurchaseOrderDetails[];
}

const DetailsColumn: FC<Props> = ({ purchaseOrderDetails }) => {
  const poDetailsColumn: TableColumn[] = [
    {
      header: "Serial No",
      accessor: "serial_no",
      colSpan: "col-span-2",
    },
    {
      header: "Department Code",
      accessor: "department_code",
      colSpan: "col-span-2",
    },
    {
      header: "Product Code",
      accessor: "product_code",
      colSpan: "col-span-2",
    },
    {
      header: "Qty",
      accessor: "qty_ordered",
      colSpan: "col-span-2",
    },
    {
      header: "Unit Price",
      accessor: "cost_fc",
      colSpan: "col-span-2",
    },
    {
      header: "Value",
      accessor: "value",
      field: "qty_ordered",
      field2: "cost_fc",
      colSpan: "col-span-2",
    },
  ];

  return (
    <div>
      <Table
        height="h-auto"
        columns={poDetailsColumn}
        data={purchaseOrderDetails}
      />
    </div>
  );
};

export default DetailsColumn;
