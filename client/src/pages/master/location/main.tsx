import useApiServices from "@api/query";
import Pagination from "@components/ui/Pagination";
import Table, { TableColumn } from "@components/ui/Table/Table";
import { useState } from "react";
import { Link } from "react-router-dom";

const Main = () => {
  const { useFetchLocations } = useApiServices();
  const [searchText, setSeachText] = useState("");
  const [value, setValue] = useState("");
  const [pageNo, setPageNo] = useState(1);
  const { data } = useFetchLocations(value, null, pageNo);

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

      <div>
        <div className="mt-10 flex gap-x-5 items-center">
          <input
            value={searchText}
            onChange={(e) => setSeachText(e.target.value.trim())}
            placeholder="Search Code or Name"
            className="myInput text-[14px]"
          />
          <button
            onClick={() => {
              setValue(searchText);
              setPageNo(1);
            }}
            className=" text-[14px] bg-gray-100 py-2 px-2 rounded-md hover:bg-gray-400"
          >
            Submit
          </button>
        </div>
        <button
          onClick={() => {
            setValue("");
            setSeachText("");
          }}
          className="text-gray-800 mt-2 px-5"
        >
          Reset
        </button>
      </div>

      <div className="mt-5 mb-5">Total : {data?.totalCount.totalCount}</div>
      {data && <Table noMargin columns={locationColumn} data={data.location} />}
      <Pagination
        setPageNo={setPageNo}
        totalItem={data?.totalCount.totalCount}
      />
    </div>
  );
};

export default Main;
