import { Location } from "@@types/system";
import AppInput from "@components/input/AppInput";
import SelectInput from "@components/input/SelectInput";
import { yupResolver } from "@hookform/resolvers/yup";
import generateRandom5DigitNumber from "@utils/generateNo";
import { stockTransferSchema } from "@utils/validator";
import { FC, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export type StockTransferFormValues = {
  toLocation: string;
  fromLocation: string;
  remarks: string;
  status?: string;
};

interface Props {
  transfer: string;
  setTransfer: any;
  locations: Location[];
  handleSubmitForm(data: StockTransferFormValues): void;
  submitButtonRef: React.RefObject<HTMLButtonElement>;
  handleOnChangeFromLocation?(val: string): void;
}

const StockTransferForm: FC<Props> = ({
  locations,
  handleSubmitForm,
  submitButtonRef,
  transfer,
  setTransfer,
  handleOnChangeFromLocation,
}) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<StockTransferFormValues>({
    resolver: yupResolver(stockTransferSchema),
  });

  const [sameLocErrMsg, setErrMsg] = useState("");

  const toLocation = watch("toLocation");
  const fromLocation = watch("fromLocation");

  useEffect(() => {
    if (toLocation === fromLocation) {
      setErrMsg("To Location and From Location must be unique");
    } else {
      setErrMsg("");
    }

    const randomNo = generateRandom5DigitNumber();

    if (toLocation && fromLocation) {
      setTransfer(fromLocation + "-" + toLocation + "-" + randomNo);
    }

    if (fromLocation && handleOnChangeFromLocation) {
      handleOnChangeFromLocation(fromLocation);
    }
  }, [toLocation, fromLocation]);

  return (
    <form
      onSubmit={handleSubmit((data) => handleSubmitForm(data))}
      className="grid grid-cols-12 gap-5 items-end mt-5 border  rounded-md p-5"
    >
      <SelectInput
        closeCheck
        extraValAccessor="location_name"
        data={locations}
        accessor="location_code"
        name="fromLocation"
        label="From Location"
        register={register}
        errMsg={sameLocErrMsg}
      />
      <SelectInput
        closeCheck
        extraValAccessor="location_name"
        data={locations}
        accessor="location_code"
        name="toLocation"
        label="To Location"
        register={register}
        errMsg={sameLocErrMsg}
      />

      <div className="col-span-4 ">
        <p className="text-[14px] tracking-wider mb-1">Transfer No#</p>
        <p className="border px-5 py-2 rounded-md">{transfer}</p>
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
