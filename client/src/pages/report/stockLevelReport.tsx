import StockLevelReportForm from "@components/form/StockLevelReportForm";
import { useAuthContext } from "@context/AuthContext";
import { FC, useState } from "react";
import { toast } from "react-hot-toast";

interface Props {}

export type StockLevelReportParameter = {
  departmentCode: any;
  locationCode: string;
  closed: string;
  status: {
    type: string;
    value: number;
  };
};

const StockLevelReport: FC<Props> = ({}) => {
  const { user } = useAuthContext();
  const [isLoading, setLoading] = useState(false);
  const [parameters, setParameters] = useState<StockLevelReportParameter>({
    departmentCode: [],
    locationCode: "All",
    closed: "Yes",
    status: {
      type: "Greater Than",
      value: 0,
    },
  });

  const handleDownload = async () => {
    const API = `${import.meta.env.VITE_API_URI}/report/stockLevelReport`;

    setLoading(true);

    const item = {
      ...parameters,
    };

    let json = null;

    try {
      const response = await fetch(API, {
        method: "POST",
        body: JSON.stringify(item),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/pdf", // Use Accept header for specifying response type
          Authorization: `Bearer ${user.access_token}`,
        },
      });

      if (!response.ok) {
        json = await response.json();
        toast.error(json?.error.message);
      }

      const blob = await response.blob(); // Convert the response to a Blob object
      const url = URL.createObjectURL(blob); // Create a URL object from the Blob

      const link = document.createElement("a");
      link.href = url;
      link.download = `stock_level_report.pdf`;
      link.click();

      URL.revokeObjectURL(url);

      toast.success("Pdf Download Started");
    } catch (err: any) {
      console.log(err);
    }

    setLoading(false);
  };

  return (
    <div>
      <h1 className="font-semibold text-2xl">Stock Level Report</h1>
      <StockLevelReportForm
        isLoading={isLoading}
        handleDownload={handleDownload}
        parameters={parameters}
        setParameters={setParameters}
      />
    </div>
  );
};

export default StockLevelReport;
