import useApiServices from "@api/query";
import Table, { TableColumn } from "@components/ui/Table/Table";
import { Link } from "react-router-dom";

const Main = () => {
  const { useFetchProducts } = useApiServices();
  const { data } = useFetchProducts();

  if (!data) return;

  const productColumn: TableColumn[] = [
    {
      header: "Department Code",
      accessor: "department_code",
      colSpan: "col-span-1",
    },
    {
      header: "Product Code",
      accessor: "product_code",
      colSpan: "col-span-1",
    },
    {
      header: "Product Description",
      accessor: "product_description",
      colSpan: "col-span-2",
    },
    {
      header: "Closed Flag",
      accessor: "closed_flag",
      colSpan: "col-span-1",
    },
    {
      header: "Qty In Stock",
      accessor: "qty_instock",
      colSpan: "col-span-1",
    },
    {
      header: "Qty Purchase",
      accessor: "qty_purchase",
      colSpan: "col-span-1",
    },
    {
      header: "Qty Backorder",
      accessor: "qty_backorder",
      colSpan: "col-span-1",
    },
    {
      header: "Cost Price",
      accessor: "cost_price",
      colSpan: "col-span-1",
    },
    {
      header: "Selling Price",
      accessor: "selling_price",
      colSpan: "col-span-1",
    },
    {
      header: "Action",
      accessor: "action",
      field: "product_code",
      field2: "department_code",
      colSpan: "col-span-1",
    },
  ];

  return (
    <div>
      <Link className="myButton px-3 py-2 text-xs" to={"create"}>
        Create Product
      </Link>

      <Table width="w-[120rem]" columns={productColumn} data={data} />
    </div>
  );
};

export default Main;
