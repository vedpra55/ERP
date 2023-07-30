import useApiServices from "@api/query";
import Table, { TableColumn } from "@components/ui/Table/Table";
import { useAuthContext } from "@context/AuthContext";
import { toast } from "react-hot-toast";

const PurchaseDocument = ({}) => {
  const { useFetchPurchaseOrders } = useApiServices();
  const { data: purchaseOrders } = useFetchPurchaseOrders();

  const { user } = useAuthContext();

  if (!purchaseOrders) return;

  const handleDownloadDocument = async (index: number) => {
    const orderNo = purchaseOrders[index].order_no;

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
      header: "Location Code",
      accessor: "location_code",
      colSpan: "col-span-1",
    },
    {
      header: "Supplier Code",
      accessor: "supplier_code",
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
      <Table
        width="w-[120rem]"
        columns={purchaseOrderCoulumn}
        data={purchaseOrders}
      />
    </div>
  );
};

export default PurchaseDocument;
