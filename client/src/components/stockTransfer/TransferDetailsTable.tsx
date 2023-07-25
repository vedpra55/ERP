import { StockTransferDetails } from "@@types/system";
import Table, { TableColumn } from "@components/ui/Table/Table";
import { FC } from "react";

interface Props {
  data: StockTransferDetails[];
}

const TransferDetailsTable: FC<Props> = ({ data }) => {
  data[0].qty_transferred;
  const purchaseOrderCoulumn: TableColumn[] = [
    {
      header: "Srl",
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
      header: "Quantity",
      accessor: "qty_transferred",
      colSpan: "col-span-2",
    },
  ];
  return (
    <div className="col-span-12">
      <Table height="h-auto" columns={purchaseOrderCoulumn} data={data} />
    </div>
  );
};

export default TransferDetailsTable;
