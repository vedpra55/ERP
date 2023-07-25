import useApiServices from "@api/query";
import Table, { TableColumn } from "@components/ui/Table/Table";
import { Link } from "react-router-dom";

const Main = () => {
  const { useFetchCategories } = useApiServices();

  const { data } = useFetchCategories();

  if (!data) return;

  const categoryColumn: TableColumn[] = [
    {
      header: "Department Code",
      accessor: "department_code",
      colSpan: "col-span-2",
    },
    {
      header: "Department Name",
      accessor: "department_name",
      colSpan: "col-span-2",
    },
    { header: "Closed Flag", accessor: "closed_flag", colSpan: "col-span-2" },
    {
      header: "Action",
      accessor: "action",
      field: "department_code",
      colSpan: "col-span-2",
    },
  ];

  return (
    <div className="">
      <Link className="myButton px-3 py-2 text-xs" to={"create"}>
        Create Category
      </Link>
      <Table columns={categoryColumn} data={data} />
    </div>
  );
};

export default Main;
