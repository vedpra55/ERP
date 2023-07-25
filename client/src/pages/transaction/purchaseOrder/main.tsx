import useApiServices from "@api/query";
import Table, { TableColumn } from "@components/ui/Table/Table";
import { Link } from "react-router-dom";

const Main = ({}) => {
  const { useFetchPurchaseOrders } = useApiServices();
  const { data: purchaseOrders } = useFetchPurchaseOrders();

  if (!purchaseOrders) return;

  const purchaseOrderCoulumn: TableColumn[] = [
    {
      header: "Order No",
      accessor: "order_no",
      colSpan: "col-span-1",
    },
    {
      header: "Location Code",
      accessor: "location_code",
      colSpan: "col-span-1",
    },
    {
      header: "Supplier Code",
      accessor: "supplier_code",
      colSpan: "col-span-1",
    },
    {
      header: "Full Filled Flag",
      accessor: "fulfilled_flag",
      colSpan: "col-span-1",
      isBool: true,
    },
    {
      header: "Paid Flag",
      accessor: "paid_flag",
      colSpan: "col-span-1",
      isBool: true,
    },
    {
      header: "Order Date",
      accessor: "order_dt",
      colSpan: "col-span-1",
      isDate: true,
    },
    {
      header: "Action",
      accessor: "action",
      field: "order_no",
      colSpan: "col-span-1",
    },
  ];

  return (
    <div>
      <Link className="myButton px-3 py-2 text-xs" to={"create"}>
        Create Purchase Order
      </Link>
      <Table
        width="w-[120rem]"
        columns={purchaseOrderCoulumn}
        data={purchaseOrders}
      />
    </div>
  );
};

export default Main;
