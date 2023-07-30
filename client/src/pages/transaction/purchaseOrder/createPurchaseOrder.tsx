import useCreateMution from "@api/mutation";
import useApiServices from "@api/query";
import PurchaseOrderForm, {
  OrderDetails,
  purchaseOrderFormValues,
} from "@components/form/PurchaseOrderForm";
import SelectOrderDetails from "@components/form/PurhcaseOrder/SelectOrderDetails";

import AppButton from "@components/ui/AppButton";
import BackButton from "@components/ui/BackButton";
import { yupResolver } from "@hookform/resolvers/yup";
import { isDublicateItems } from "@utils/helper";
import { purchaseOrderSchema } from "@utils/validator";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

const CreatePurchaseOrder = () => {
  const submitButtonRef = useRef<HTMLButtonElement>(null);
  const { createPurchaseOrderMutation } = useCreateMution();
  const { useFetchLocations, useFetchSuppliers } = useApiServices();

  const { data: suppliers } = useFetchSuppliers();
  const { data: locations } = useFetchLocations();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<purchaseOrderFormValues>({
    resolver: yupResolver(purchaseOrderSchema),
  });

  const [ordersData, setOrderData] = useState<OrderDetails[]>([
    {
      srl: "",
      departmentCode: "",
      productCode: "",
      description: "",
      unitPrice: 0,
      qtyBackorder: 0,
      value: 0,
    },
  ]);

  const [subTotal, setSubTotal] = useState(0);
  const freight = watch("freight");

  const onSubmit = async (data: purchaseOrderFormValues) => {
    if (ordersData.length === 0) {
      toast.error("Please Fill Products Column");
      return;
    }

    for (let i = 0; i < ordersData?.length; i++) {
      if (
        !ordersData[i].departmentCode ||
        !ordersData[i].description ||
        !ordersData[i].productCode ||
        !ordersData[i].qtyBackorder
      ) {
        return toast.error("Please Enter Products Row");
      }
    }

    if (isDublicateItems(ordersData)) {
      toast.error("There is record with same product code please check");
      return;
    }

    const items = {
      ...data,
      products: ordersData,
      paidAmount: 0,
      orderDate: new Date().toISOString(),
      dueDate: new Date(data.dueDate).toISOString(),
      total: freight ? parseInt(freight.toString()) + subTotal : subTotal,
    };

    await createPurchaseOrderMutation.mutateAsync(items);
  };

  useEffect(() => {
    let val = 0;
    for (let i = 0; i < ordersData.length; i++) {
      val = val + ordersData[i].value;
    }
    setSubTotal(val);
  }, [ordersData]);

  if (!suppliers || !locations) return;

  return (
    <div>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-x-2">
          <BackButton />
          <h2 className="text-[14px] font-medium tracking-wider">
            Create Purchase Order
          </h2>
        </div>
        <AppButton
          isLoading={createPurchaseOrderMutation.isLoading}
          handleOnClick={() => {
            submitButtonRef?.current?.click();
          }}
          title="Submit"
        />
      </div>
      <PurchaseOrderForm
        register={register}
        reset={reset}
        watch={watch}
        errors={errors}
        handleSubmit={handleSubmit}
        handleSubmitForm={onSubmit}
        submitButtonRef={submitButtonRef}
        suppliers={suppliers}
        locations={locations}
      />
      <SelectOrderDetails
        totalOrderValue={
          subTotal + (freight ? parseFloat(freight.toString()) : 0)
        }
        orderDetailsRow={ordersData}
        setOrderDetailsRow={setOrderData}
      />
    </div>
  );
};

export default CreatePurchaseOrder;
