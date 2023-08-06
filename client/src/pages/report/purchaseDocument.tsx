import useApiServices from "@api/query";
import Pagination from "@components/ui/Pagination";
import Table, { TableColumn } from "@components/ui/Table/Table";
import { useAuthContext } from "@context/AuthContext";
import { useState } from "react";

import { toast } from "react-hot-toast";

const PurchaseDocument = ({}) => {
  const { useFetchPurchaseOrders } = useApiServices();
  const [searchText, setSeachText] = useState("");
  const [selectedFullFillType, setSelectedFullFillType] = useState("");
  const [selectedPaidType, setSelectedPaidType] = useState("");
  const [toDate, setToDate] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [pageNo, setPageNo] = useState(1);
  const [filterValues, setFilterValues] = useState({
    searchText: "",
    fullFillStatus: "",
    paidStatus: "",
    toDate: "",
    fromDate: "",
  });

  const { data: purchaseOrders } = useFetchPurchaseOrders(filterValues, pageNo);

  const { user } = useAuthContext();

  if (!purchaseOrders) return;

  const handleSearch = () => {
    setFilterValues({
      fromDate: fromDate && new Date(fromDate).toISOString(),
      toDate: toDate && new Date(toDate).toISOString(),
      fullFillStatus:
        selectedFullFillType === "Select" ? "" : selectedFullFillType,
      paidStatus: selectedPaidType === "Select" ? "" : selectedPaidType,
      searchText: searchText,
    });
    setPageNo(1);
  };

  const handleDownloadDocument = async (index: number) => {
    const orderNo = purchaseOrders.purchaseOrder[index].order_no;

    const API = `${
      import.meta.env.VITE_API_URI
    }/report/purchaseDocument?orderNo=${orderNo}`;

    try {
      const response = await fetch(API, {
        method: "GET",

        headers: {
          Accept: "application/pdf", // Use Accept header for specifying response type
          Authorization: `Bearer ${user.access_token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Error: " + response.status);
      }

      console.log(response);

      const blob = await response.blob(); // Convert the response to a Blob object
      const url = URL.createObjectURL(blob); // Create a URL object from the Blob

      const link = document.createElement("a");
      link.href = url;
      link.download = `purchase_order_${orderNo}.pdf`;
      link.click();

      URL.revokeObjectURL(url);

      toast.success("Pdf Download Started");
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const purchaseOrderCoulumn: TableColumn[] = [
    {
      header: "Order No",
      accessor: "order_no",
      colSpan: "col-span-1",
    },
    {
      header: "Location Name",
      accessor: "location",
      colSpan: "col-span-1",
    },
    {
      header: "Supplier Name",
      accessor: "supplier",
      colSpan: "col-span-1",
    },
    {
      header: "Order Amount",
      accessor: "order_amount",
      colSpan: "col-span-1",
    },
    {
      header: "Paid Amount",
      accessor: "amount_paid",
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
      accessor: "document",
      field: "order_no",
      colSpan: "col-span-1",
      handleClick: handleDownloadDocument,
    },
  ];

  return (
    <div className="screenWidth">
      <h1 className="font-semibold text-2xl">Purchase Order Document</h1>
      <div>
        <div className="mt-10 flex gap-x-5 items-end flex-wrap gap-y-5">
          <input
            value={searchText}
            onChange={(e) => setSeachText(e.target.value.trim())}
            placeholder="Search order#, supplier or location"
            className="myInput text-[14px]"
          />

          <div>
            <p className="text-[13px] mb-1 font-medium">Full Fill Status</p>
            <select
              value={selectedFullFillType}
              onChange={(e) => setSelectedFullFillType(e.target.value)}
              className="border rounded-md px-3 py-2 text-[14px] outline-none"
            >
              <option>Select</option>
              <option>FullFill</option>
              <option>Not FullFill</option>
            </select>
          </div>

          <div>
            <p className="text-[13px] mb-1 font-medium">Paid Status</p>
            <select
              value={selectedPaidType}
              onChange={(e) => setSelectedPaidType(e.target.value)}
              className="border rounded-md px-3 py-2 text-[14px] outline-none"
            >
              <option>Select</option>
              <option>Paid</option>
              <option>Not Paid</option>
            </select>
          </div>

          <div>
            <p className="text-[13px] mb-1 font-medium">From Date</p>
            <input
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              type="date"
              className="border rounded-md px-3 py-2 text-[14px] outline-none"
            />
          </div>

          <div>
            <p className="text-[13px] mb-1 font-medium">To Date</p>
            <input
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              type="date"
              className="border rounded-md px-3 py-2 text-[14px] outline-none"
            />
          </div>

          <button
            onClick={() => {
              handleSearch();
            }}
            className=" text-[14px] bg-gray-100 py-2 px-5 rounded-md hover:bg-gray-400"
          >
            Submit
          </button>
        </div>
        <button
          onClick={() => {
            setSeachText("");
            setSelectedFullFillType("");
            setSelectedPaidType("");
            setToDate("");
            setFromDate("");
            setFilterValues({
              fromDate: "",
              toDate: "",
              fullFillStatus: "",
              paidStatus: "",
              searchText: "",
            });
          }}
          className="text-gray-800 mt-2 px-5"
        >
          Reset
        </button>
      </div>
      <Table
        width="w-[120rem]"
        columns={purchaseOrderCoulumn}
        data={purchaseOrders.purchaseOrder}
      />
      <Pagination
        setPageNo={setPageNo}
        totalItem={purchaseOrders?.totalCount.totalCount}
      />
    </div>
  );
};

export default PurchaseDocument;
