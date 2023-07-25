import useApiServices from "@api/query";
import Table, { TableColumn } from "@components/ui/Table/Table";
import { Link } from "react-router-dom";

const Main = () => {
  const { useFetchSuppliers } = useApiServices();
  const { data } = useFetchSuppliers();

  if (!data) {
    return;
  }

  const supplierColumn: TableColumn[] = [
    {
      header: "supplier Code",
      accessor: "supplier_code",
      colSpan: "col-span-1",
    },
    {
      header: "Supplier Name",
      accessor: "supplier_name",
      colSpan: "col-span-1",
    },
    { header: "Email", accessor: "email", colSpan: "col-span-1" },
    { header: "Address 1", accessor: "address_1", colSpan: "col-span-1" },
    { header: "Address 2", accessor: "address_2", colSpan: "col-span-1" },
    { header: "Telephone No", accessor: "telephone_no", colSpan: "col-span-1" },
    { header: "Mobile No", accessor: "mobile_no", colSpan: "col-span-1" },
    { header: "Fax", accessor: "fax", colSpan: "col-span-1" },
    { header: "Closed Flag", accessor: "closed_flag", colSpan: "col-span-1" },
    {
      header: "Action",
      accessor: "action",
      field: "supplier_code",
      colSpan: "col-span-1",
    },
  ];

  return (
    <div className=" ">
      <Link className="myButton px-3 py-2 text-xs" to={"create"}>
        Create Supplier
      </Link>
      <Table width=" w-[120rem]" columns={supplierColumn} data={data} />
    </div>
  );
};

export default Main;
