import useApiServices from "@api/query";
import Pagination from "@components/ui/Pagination";
import Table, { TableColumn } from "@components/ui/Table/Table";
import { useState } from "react";
import { Link } from "react-router-dom";

const MainPage = () => {
  const { useFetchStockTransfers } = useApiServices();
  const [searchText, setSeachText] = useState("");
  const [value, setValue] = useState("");

  const [pageNo, setPageNo] = useState(0);

  const { data } = useFetchStockTransfers(value, pageNo);

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
      field2: "from_location_code",
      field3: "to_location_code",
      colSpan: "col-span-1",
    },
  ];

  return (
    <div>
      <Link className="myButton px-3 py-2 text-xs" to={"create"}>
        Create Stock Transfer
      </Link>

      <div>
        <div className="mt-10 flex gap-x-5 items-center">
          <input
            value={searchText}
            onChange={(e) => setSeachText(e.target.value.trim())}
            placeholder="Search locations or transfer#"
            className="myInput text-[14px]"
          />
          <button
            onClick={() => {
              setPageNo(1);
              setValue(searchText);
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

      {data && <Table columns={transferColumn} data={data.stockTransfer} />}

      <Pagination
        setPageNo={setPageNo}
        totalItem={data?.totalCount.totalCount}
      />
    </div>
  );
};

export default MainPage;
