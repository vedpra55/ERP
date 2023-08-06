import useApiServices from "@api/query";
import Pagination from "@components/ui/Pagination";
import Table, { TableColumn } from "@components/ui/Table/Table";
import { useState } from "react";
import { Link } from "react-router-dom";

const Main = () => {
  const { useFetchProducts } = useApiServices();
  const [searchText, setSeachText] = useState("");
  const [value, setValue] = useState("");
  const [pageNo, setPageNo] = useState(1);
  const { data } = useFetchProducts(value, "", null, pageNo);

  const productColumn: TableColumn[] = [
    {
      header: "Department Code",
      accessor: "department_name",
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
    <div className="screenWidth">
      <Link className="myButton px-3 py-2 text-xs" to={"create"}>
        Create Product
      </Link>

      <div>
        <div className="mt-10 flex gap-x-5 items-center">
          <input
            value={searchText}
            onChange={(e) => setSeachText(e.target.value.trim())}
            placeholder="Search department Code or Name"
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
          width="w-[120rem]"
          columns={productColumn}
          data={data.product}
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
