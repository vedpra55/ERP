import { StockTransferWithDetails } from "@@types/system";
import ItemColumn from "@components/editPurchaseOrder/ItemColumn";
import AppButton from "@components/ui/AppButton";
import { FC } from "react";
import TransferDetailsTable from "./TransferDetailsTable";
import useCreateMution from "@api/mutation";

interface Props {
  data: StockTransferWithDetails;
  toLocation: string;
  fromLocation: string;
}

const DisplayTransferData: FC<Props> = ({ data, toLocation, fromLocation }) => {
  const transferDate = new Date(data.transfer.transfer_dt);
  const acknowledgeDate = new Date(data.transfer?.acknowledge_dt);

  const { acknowledgeStockTransferMutation } = useCreateMution();

  const handleAcknowledge = async () => {
    const item = {
      fromLocation: fromLocation,
      toLocation: toLocation,
      transferNo: data.transfer.transfer_no,
    };
    await acknowledgeStockTransferMutation.mutateAsync(item);
  };

  return (
    <div className="grid grid-cols-12 gap-x-5 mt-10">
      <div className="col-span-8 flex flex-col gap-y-1">
        <ItemColumn title="Transfer No" value={data.transfer.transfer_no} />
        <ItemColumn title="From Location" value={data.transfer.from_location} />
        <ItemColumn title="To Location" value={data.transfer.to_location} />
        <ItemColumn title="Remarks" value={data.transfer.remarks} />

        {data.transfer.acknowledge_dt && (
          <div className="flex gap-x-10 ">
            <p className="w-80 ">Acknowledge Date:</p>
            <p className="w-full">{`${acknowledgeDate.getDate()} / ${
              acknowledgeDate.getMonth() + 1
            } / ${acknowledgeDate.getFullYear()}`}</p>
          </div>
        )}
      </div>
      <div className="col-span-4 font-medium h-32 border rounded-md p-5">
        <div className="flex gap-x-10 mb-5">
          <p className="w-80 ">Tranfer Date:</p>
          <p className="w-full">{`${transferDate.getDate()} / ${
            transferDate.getMonth() + 1
          } / ${transferDate.getFullYear()}`}</p>
        </div>
        {!data.transfer.acknowledge_dt ? (
          <AppButton
            isLoading={acknowledgeStockTransferMutation.isLoading}
            handleOnClick={handleAcknowledge}
            title="Acknowledge"
          />
        ) : (
          <div className="border rounded-md w-36 text-center px-4 py-2">
            Acknowledged
          </div>
        )}
      </div>
      <TransferDetailsTable data={data.details} />
    </div>
  );
};

export default DisplayTransferData;
