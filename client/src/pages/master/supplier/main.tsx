import useApiServices from "@api/query";
import Pagination from "@components/ui/Pagination";
import Table, { TableColumn } from "@components/ui/Table/Table";
import { useState } from "react";
import { Link } from "react-router-dom";

const Main = () => {
  const { useFetchSuppliers } = useApiServices();
  const [searchText, setSeachText] = useState("");
  const [value, setValue] = useState("");
  const [pageNo, setPageNo] = useState(1);
  const { data } = useFetchSuppliers(value, null, pageNo);

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
    { header: "Country", accessor: "country", colSpan: "col-span-1" },
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
    <div className="screenWidth">
      <Link className="myButton px-3 py-2 text-xs" to={"create"}>
        Create Supplier
      </Link>

      <div>
        <div className="mt-10 flex gap-x-5 items-center">
          <input
            value={searchText}
            onChange={(e) => setSeachText(e.target.value.trim())}
            placeholder="Search Code, Name or Email"
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
      {data && (
        <Table
          noMargin
          width=" w-[120rem]"
          columns={supplierColumn}
          data={data?.supplier}
        />
      )}
      <Pagination
        setPageNo={setPageNo}
        totalItem={data?.totalCount.totalCount}
      />
    </div>
  );
};

export default Main;
