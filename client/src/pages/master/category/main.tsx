import useApiServices from "@api/query";
import Table, { TableColumn } from "@components/ui/Table/Table";
import { useState } from "react";
import { Link } from "react-router-dom";

import Pagination from "@components/ui/Pagination";

const Main = () => {
  const { useFetchCategories } = useApiServices();
  const [searchText, setSeachText] = useState("");

  const [pageNo, setPageNo] = useState(1);
  const [value, setValue] = useState("");

  const { data } = useFetchCategories(value, null, pageNo);

  const categoryColumn: TableColumn[] = [
    {
      header: "Department Code",
      accessor: "department_code",
      colSpan: "2xl:col-span-2 md:col-span-3",
    },
    {
      header: "Department Name",
      accessor: "department_name",
      colSpan: "2xl:col-span-2 md:col-span-3",
    },
    {
      header: "Closed Flag",
      accessor: "closed_flag",
      colSpan: "2xl:col-span-2 md:col-span-3",
    },
    {
      header: "Action",
      accessor: "action",
      field: "department_code",
      colSpan: "2xl:col-span-2 md:col-span-3",
    },
  ];

  return (
    <div className=" ">
      <Link className="myButton px-3 py-2 text-xs" to={"create"}>
        Create Category
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
      {data && <Table noMargin columns={categoryColumn} data={data.category} />}
      <Pagination
        totalItem={data?.totalCount.totalCount}
        setPageNo={setPageNo}
      />
    </div>
  );
};

export default Main;
