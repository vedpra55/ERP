import useApiServices from "@api/query";
import Table, { TableColumn } from "@components/ui/Table/Table";
import { Link } from "react-router-dom";

const MainPage = () => {
  const { useFetchStockTransfers } = useApiServices();
  const { data } = useFetchStockTransfers();

  if (!data) return;

  const transferColumn: TableColumn[] = [
    {
      header: "Transfer No",
      accessor: "transfer_no",
      colSpan: "col-span-2",
    },
    {
      header: "From Location",
      accessor: "from_location",
      colSpan: "col-span-2",
    },
    {
      header: "To Location",
      accessor: "to_location",
      colSpan: "col-span-2",
    },
    {
      header: "Acknowledge Date",
      accessor: "acknowledge_dt",
      colSpan: "col-span-2",
      isDate: true,
    },
    {
      header: "Remarks",
      accessor: "remarks",
      colSpan: "col-span-2",
      isBool: true,
    },
    {
      header: "Action",
      accessor: "action",
      field: "transfer_no",
      field2: "from_location",
      field3: "to_location",
      colSpan: "col-span-1",
    },
  ];

  return (
    <div>
      <Link className="myButton px-3 py-2 text-xs" to={"create"}>
        Create Stock Transfer
      </Link>

      <Table columns={transferColumn} data={data} />
    </div>
  );
};

export default MainPage;
