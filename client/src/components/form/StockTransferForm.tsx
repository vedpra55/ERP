import AppInput from "@components/input/AppInput";

import SelectLocation from "@components/input/SelectLocaton";
import { yupResolver } from "@hookform/resolvers/yup";

import { stockTransferSchema } from "@utils/validator";
import { FC, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";

export type StockTransferFormValues = {
  remarks: string;
  status?: string;
};

interface Props {
  transfer: string;
  setTransfer: any;
  setToLocation?: any;
  setFromLocation?: any;
  handleSubmitForm(data: StockTransferFormValues): void;
  submitButtonRef: React.RefObject<HTMLButtonElement>;
  handleOnChangeFromLocation?(val: string): void;
  toLocation: string;
  fromLocation: string;
}

const StockTransferForm: FC<Props> = ({
  handleSubmitForm,
  submitButtonRef,
  transfer,
  setTransfer,
  setToLocation,
  setFromLocation,
  toLocation,
  fromLocation,
}) => {
  const {
    register,
    handleSubmit,

    formState: { errors },
  } = useForm<StockTransferFormValues>({
    resolver: yupResolver(stockTransferSchema),
  });

  const [sameLocErrMsg, setErrMsg] = useState("");

  useEffect(() => {
    if (!toLocation) {
      setErrMsg("");
      return;
    }

    if (toLocation === fromLocation) {
      setErrMsg("To Location and From Location must be unique");
      console.log("okkkk");
    } else {
      setErrMsg("");
    }

    const randomNo: string = uuidv4();

    if (toLocation && fromLocation) {
      setTransfer(
        fromLocation + "-" + toLocation + "-" + randomNo.substring(3, 8)
      );
    }
  }, [toLocation, fromLocation]);

  return (
    <form
      onSubmit={handleSubmit((data) => handleSubmitForm(data))}
      className="grid grid-cols-12 gap-5 items-end mt-5 border  rounded-md p-5"
    >
      <div className="col-span-4">
        <p className="text-red-500 text-[14px] font-medium">{sameLocErrMsg}</p>
        <SelectLocation
          label="From Location"
          setSelectedVal={setFromLocation}
        />
      </div>
      <div className="col-span-4">
        <p className="text-red-500 text-[14px] font-medium">{sameLocErrMsg}</p>
        <SelectLocation label="To Location" setSelectedVal={setToLocation} />
      </div>

      <div className="col-span-4 ">
        <p className="text-[14px] tracking-wider mb-1 font-medium">
          Transfer No#
        </p>
        <p className="border px-5 py-2 truncate rounded-md">{transfer}</p>
      </div>

      <AppInput
        name="remarks"
        placeholder="Remarks"
        register={register}
        errorMsg={errors.remarks?.message}
      />
      <button type="submit" ref={submitButtonRef} className="hidden"></button>
    </form>
  );
};

export default StockTransferForm;
