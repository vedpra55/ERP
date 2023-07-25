import useCreateMution from "@api/mutation";
import useApiServices from "@api/query";
import StockTransferForm, {
  StockTransferFormValues,
} from "@components/form/StockTransferForm";
import SelectTransferDetails from "@components/form/stockTransfer/selectTransferDetails";
import AppButton from "@components/ui/AppButton";
import BackButton from "@components/ui/BackButton";

import { FC, useRef, useState } from "react";
import { toast } from "react-hot-toast";

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
  const { useFetchLocations, useFetchProducts, useFetchCategories } =
    useApiServices();
  const { createStockTransferMutation } = useCreateMution();
  const { data: locations } = useFetchLocations();
  const { data: products } = useFetchProducts();
  const { data: categories } = useFetchCategories();
  const [transferNo, setTransferNo] = useState<string>("");

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

  const [fromLocation, setFromLocation] = useState("");

  if (!locations || !products || !categories) return;

  const onSubmit = async (data: StockTransferFormValues) => {
    if (data.fromLocation === data.toLocation) {
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

    const item = {
      ...data,
      products: transferDetailsRow,
    };
    await createStockTransferMutation.mutateAsync(item);
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
        handleOnChangeFromLocation={(val) => setFromLocation(val)}
        transfer={transferNo}
        setTransfer={setTransferNo}
        handleSubmitForm={onSubmit}
        submitButtonRef={submitButtonRef}
        locations={locations}
      />
      <SelectTransferDetails
        setTransferDetailsRow={setTransferDetailsRow}
        transferDetailsRow={transferDetailsRow}
        products={products}
        categories={categories}
        fromLocation={fromLocation}
      />
    </div>
  );
};

export default CreateTransferPage;
