import useApiServices from "@api/query";
import Table, { TableColumn } from "@components/ui/Table/Table";
import { Link } from "react-router-dom";

const Main = () => {
  const { useFetchLocations } = useApiServices();
  const { data } = useFetchLocations();

  if (!data) return;

  const locationColumn: TableColumn[] = [
    {
      header: "Location Code",
      accessor: "location_code",
      colSpan: "col-span-2",
    },
    {
      header: "Location Name",
      accessor: "location_name",
      colSpan: "col-span-2",
    },
    {
      header: "Short Name",
      accessor: "short_name",
      colSpan: "col-span-2",
    },
    {
      header: "Closed Flag",
      accessor: "closed_flag",
      colSpan: "col-span-2",
    },
    {
      header: "Action",
      accessor: "action",
      field: "location_code",
      colSpan: "col-span-2",
    },
  ];

  return (
    <div>
      <Link className="myButton px-3 py-2 text-xs" to={"create"}>
        Create Location
      </Link>

      <Table columns={locationColumn} data={data} />
    </div>
  );
};

export default Main;
