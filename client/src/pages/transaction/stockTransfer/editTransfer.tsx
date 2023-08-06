import useApiServices from "@api/query";
import DisplayTransferData from "@components/stockTransfer/DisplayTransferData";
import BackButton from "@components/ui/BackButton";
import { FC } from "react";
import { useParams } from "react-router-dom";

interface Props {}

const EditTransferPage: FC<Props> = ({}) => {
  const params = useParams();

  const { toLocation, fromLocation, transferNo } = params;

  const { useFetchSingleStockTransfer } = useApiServices();

  if (!toLocation || !fromLocation || !transferNo) return;
  const { data } = useFetchSingleStockTransfer(
    transferNo,
    toLocation,
    fromLocation
  );

  if (!data) {
    return;
  }

  return (
    <div>
      <div className="flex items-center gap-x-2">
        <BackButton />
        <h2 className="text-[14px] font-medium tracking-wider">
          Acknowledge Transfer
        </h2>
      </div>
      <DisplayTransferData
        toLocation={toLocation}
        fromLocation={fromLocation}
        data={data}
      />
    </div>
  );
};

export default EditTransferPage;
