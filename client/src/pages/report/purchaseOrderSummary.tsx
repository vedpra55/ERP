import { Supplier } from "@@types/system";
import useApiServices from "@api/query";
import { DateInputNoraml } from "@components/input/DateInput";
import { SelecteInputNormal } from "@components/input/SelectInput";
import { useAuthContext } from "@context/AuthContext";
import { FC, useEffect, useState } from "react";
import { toast } from "react-hot-toast";

interface Props {}

type PODSummaryType = {
  supplierCode: string;
  poDate: Date;
  poToDate: Date;
  status: string;
};

const PurchaseOrderSummary: FC<Props> = ({}) => {
  const { useFetchSuppliers } = useApiServices();
  const { user } = useAuthContext();
  const { data: suppliers } = useFetchSuppliers();
  const [parameters, setParameters] = useState<PODSummaryType>({
    supplierCode: "",
    poDate: new Date(),
    poToDate: new Date(),
    status: "All",
  });

  const [selectedSupplier, setSelectedSupplier] = useState<Supplier>();

  const handleDownloadDocument = async () => {
    const API = `${import.meta.env.VITE_API_URI}/report/purchaseOrderSummary`;

    const data = {
      ...parameters,
    };

    let json = null;

    try {
      const response = await fetch(API, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/pdf", // Use Accept header for specifying response type
          Authorization: `Bearer ${user.access_token}`,
        },
      });

      if (!response.ok) {
        json = await response.json();
        toast.error(json?.error.message);
        throw new Error("Error: " + response.status);
      }

      const blob = await response.blob(); // Convert the response to a Blob object
      const url = URL.createObjectURL(blob); // Create a URL object from the Blob

      const link = document.createElement("a");
      link.href = url;
      link.download = `purchase_order_summary.pdf`;
      link.click();

      URL.revokeObjectURL(url);

      toast.success("Pdf Download Started");
    } catch (error) {}
  };

  function handleOnInputChange(e: any) {
    const { value, name } = e.target;

    const list = { ...parameters };

    if (name === "supplier") {
      list["supplierCode"] = value;
      setParameters(list);
    }

    if (name === "status") {
      list["status"] = value;
      setParameters(list);
    }

    if (name === "poDate") {
      list["poDate"] = value;
      setParameters(list);
    }

    if (name === "poToDate") {
      list["poToDate"] = value;
      setParameters(list);
    }
  }

  useEffect(() => {
    if (parameters.supplierCode && suppliers) {
      const item = suppliers.filter(
        (res) => res.supplier_code === parameters.supplierCode
      )[0];
      if (item) {
        setSelectedSupplier(item);
      }
    }
  }, [parameters]);

  if (!suppliers) return;

  return (
    <div>
      <h1 className="font-semibold text-2xl">Purchase Order Summary</h1>
      <div className="grid grid-cols-12 gap-5 mt-10 items-end">
        <SelecteInputNormal
          handleChange={handleOnInputChange}
          data={suppliers}
          accessor="supplier_code"
          extraValAccessor="supplier_name"
          name="supplier"
          label="Supplier Code"
        />
        <div className="col-span-4 border rounded-md px-5 py-2">
          <p>{selectedSupplier?.supplier_name}</p>
        </div>
        <DateInputNoraml
          handleChange={handleOnInputChange}
          name="poDate"
          placeholder="Po Date"
        />
        <DateInputNoraml
          handleChange={handleOnInputChange}
          name="poToDate"
          placeholder="Po To Date"
        />
        <StatusSelection handleOnInputChange={handleOnInputChange} />
      </div>
      <button onClick={handleDownloadDocument} className="myButton mt-5 w-28">
        Download
      </button>
    </div>
  );
};

export default PurchaseOrderSummary;

const StatusSelection: FC<{ handleOnInputChange: any }> = ({
  handleOnInputChange,
}) => {
  return (
    <div className="flex col-span-6 flex-col gap-y-1  w-80  ">
      <p className="text-[15px] tracking-wider">Status</p>
      <select
        className="border rounded-md py-2 px-5 outline-none"
        name="status"
        onChange={handleOnInputChange}
      >
        <option>All</option>
        <option>Started</option>
        <option>FullFilled</option>
        <option>Paid</option>
      </select>
    </div>
  );
};
