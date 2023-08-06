import useApiServices from "@api/query";
import { DateInputNoraml } from "@components/input/DateInput";
import SelectSupplier from "@components/input/SelectSupplier";
import AppButton from "@components/ui/AppButton";
import { useAuthContext } from "@context/AuthContext";
import { FC, useState } from "react";
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

  const [isLoading, setLoading] = useState(false);

  const handleDownloadDocument = async () => {
    const API = `${import.meta.env.VITE_API_URI}/report/purchaseOrderSummary`;

    setLoading(true);

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

    setLoading(false);
  };

  function handleOnInputChange(e: any) {
    const { value, name } = e.target;

    const list = { ...parameters };

    if (name === "supplierCode") {
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

  if (!suppliers) return;

  return (
    <div>
      <h1 className="font-semibold text-2xl">Purchase Order Summary</h1>
      <div className="grid grid-cols-12 mb-5 gap-5 mt-10 items-end">
        <div className="col-span-4">
          <SelectSupplier
            handleInputChange={handleOnInputChange}
            label="Supplier Code"
          />
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
      <AppButton
        isLoading={isLoading}
        title="Download"
        handleOnClick={handleDownloadDocument}
      />
    </div>
  );
};

export default PurchaseOrderSummary;

const StatusSelection: FC<{ handleOnInputChange: any }> = ({
  handleOnInputChange,
}) => {
  return (
    <div className="flex col-span-6 flex-col gap-y-1  w-80  ">
      <p className="text-[15px] tracking-wider font-medium">Status</p>
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
