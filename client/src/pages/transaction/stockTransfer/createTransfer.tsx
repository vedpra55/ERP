import useCreateMution from "@api/mutation";

import StockTransferForm, {
  StockTransferFormValues,
} from "@components/form/StockTransferForm";
import SelectTransferDetails from "@components/form/stockTransfer/selectTransferDetails";
import AppButton from "@components/ui/AppButton";
import BackButton from "@components/ui/BackButton";

import { FC, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

interface Props {}

export type TransferDetails = {
  srl: string;
  departmentCode: string;
  productCode: string;
  description: string;
  quantity: number;
};

const CreateTransferPage: FC<Props> = ({}) => {
  const submitButtonRef = useRef<HTMLButtonElement>(null);

  const { createStockTransferMutation } = useCreateMution();

  const [transferNo, setTransferNo] = useState<string>("");
  const [isStoreQtyLess, setStoreQtyLess] = useState(false);

  const [toLocation, setToLocation] = useState<any>();
  const [fromLocation, setFromLocation] = useState<any>();

  const navigate = useNavigate();

  const [transferDetailsRow, setTransferDetailsRow] = useState<
    TransferDetails[]
  >([
    {
      srl: "",
      departmentCode: "",
      productCode: "",
      quantity: 0,
      description: "",
    },
  ]);

  const onSubmit = async (data: StockTransferFormValues) => {
    if (fromLocation.value === toLocation.value) {
      toast.error("Both locations are same");
      return;
    }

    if (transferDetailsRow.length === 0) {
      toast.error("Please Fill Products Column");
      return;
    }

    for (let i = 0; i < transferDetailsRow?.length; i++) {
      if (
        !transferDetailsRow[i].departmentCode ||
        !transferDetailsRow[i].productCode ||
        !transferDetailsRow[i].quantity ||
        !transferDetailsRow[i].description
      ) {
        return toast.error("Please Enter Products Row");
      }
    }

    if (isStoreQtyLess) {
      return toast.error("Please check qty it is more then store qty");
    }

    const item = {
      ...data,
      fromLocation: fromLocation.value,
      toLocation: toLocation.value,
      products: transferDetailsRow,
      transferNo: transferNo,
    };

    await createStockTransferMutation.mutateAsync(item);

    if (createStockTransferMutation.isError) return;

    navigate("/app/transaction/transfer-creation");

    setTransferDetailsRow([
      {
        srl: "",
        departmentCode: "",
        productCode: "",
        quantity: 0,
        description: "",
      },
    ]);
  };

  return (
    <div>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-x-2">
          <BackButton />
          <h2 className="text-[14px] font-medium tracking-wider">
            Create Stock Transfer
          </h2>
        </div>
        <AppButton
          isLoading={createStockTransferMutation.isLoading}
          handleOnClick={() => {
            submitButtonRef?.current?.click();
          }}
          title="Submit"
        />
      </div>
      <StockTransferForm
        fromLocation={fromLocation?.value}
        toLocation={toLocation?.value}
        setFromLocation={setFromLocation}
        setToLocation={setToLocation}
        handleOnChangeFromLocation={(val) => setFromLocation(val)}
        transfer={transferNo}
        setTransfer={setTransferNo}
        handleSubmitForm={onSubmit}
        submitButtonRef={submitButtonRef}
      />
      <SelectTransferDetails
        setStoreQtyLess={setStoreQtyLess}
        setTransferDetailsRow={setTransferDetailsRow}
        transferDetailsRow={transferDetailsRow}
        fromLocation={fromLocation?.value}
      />
    </div>
  );
};

export default CreateTransferPage;
