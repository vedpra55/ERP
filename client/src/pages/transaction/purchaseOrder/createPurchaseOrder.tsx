import useCreateMution from "@api/mutation";
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
import { useNavigate } from "react-router-dom";

const CreatePurchaseOrder = () => {
  const submitButtonRef = useRef<HTMLButtonElement>(null);
  const { createPurchaseOrderMutation } = useCreateMution();

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

  const [selectedSupplier, setSelectedSupplier] = useState<any>();
  const [selectedLocation, setSelectedLocation] = useState<any>();

  const [subTotal, setSubTotal] = useState(0);
  const freight = watch("freight");

  const navigate = useNavigate();

  const onSubmit = async (data: purchaseOrderFormValues) => {
    if (!selectedSupplier) {
      toast.error("Please select supplier code");
      return;
    }

    if (!selectedLocation) {
      toast.error("Please select location code");
      return;
    }

    if (ordersData.length === 0) {
      toast.error("Atleast 1 product record is required");
      return;
    }

    for (let i = 0; i < ordersData?.length; i++) {
      if (
        !ordersData[i].departmentCode ||
        !ordersData[i].description ||
        !ordersData[i].productCode ||
        !ordersData[i].qtyBackorder
      ) {
        return toast.error("Please fill all column fields");
      }
    }

    if (isDublicateItems(ordersData)) {
      toast.error("There is record with same product code please check");
      return;
    }

    let myFreight = 0;
    if (freight) {
      myFreight = parseFloat(freight.toString());
    }

    const total = parseFloat(subTotal.toString()) + myFreight;

    console.log(total, "total order value");

    let myNonVendorCost = 0;
    if (data.nonVendorCost) {
      myNonVendorCost = (data.nonVendorCost / 100) * total;
    }

    console.log(myNonVendorCost.toFixed(2), "non vendor cosot value");

    for (let i = 0; i < ordersData.length; i++) {
      const product = ordersData[i];

      const cost_fc = parseFloat(product.value.toString());

      const freightValue = (cost_fc / subTotal) * myFreight;

      const perItemFreight = freightValue / product.qtyBackorder;

      const nonVendorCostValue =
        (cost_fc / total) * parseFloat(myNonVendorCost.toFixed(2));

      const perItemNonVendorCostValue =
        nonVendorCostValue / product.qtyBackorder;

      const cost_fcPerItem =
        parseFloat(product.unitPrice.toString()) +
        parseFloat(perItemFreight.toString()) +
        parseFloat(perItemNonVendorCostValue.toString());

      console.log(cost_fcPerItem, "cost_fc per item");

      console.log(freightValue, "feight");
      console.log(nonVendorCostValue, "non vendor distrubuin value");
    }

    const items = {
      ...data,
      supplierCode: selectedSupplier.value,
      locationCode: selectedLocation.value,
      products: ordersData,
      paidAmount: 0,
      orderDate: new Date().toISOString(),
      dueDate: new Date(data.dueDate).toISOString(),
      total: freight ? parseFloat(freight.toString()) + subTotal : subTotal,
    };

    await createPurchaseOrderMutation.mutateAsync(items);

    if (createPurchaseOrderMutation.isError) return;
    navigate("/app/transaction/purchase-order-creation");
  };

  useEffect(() => {
    let val = 0;
    for (let i = 0; i < ordersData.length; i++) {
      val = val + ordersData[i].value;
    }
    setSubTotal(val);
  }, [ordersData]);

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
        supplierCode={selectedSupplier?.value}
        locationCode={selectedLocation?.value}
        setSupplierCode={setSelectedSupplier}
        setLocationCode={setSelectedLocation}
        register={register}
        reset={reset}
        watch={watch}
        errors={errors}
        handleSubmit={handleSubmit}
        handleSubmitForm={onSubmit}
        submitButtonRef={submitButtonRef}
      />
      <SelectOrderDetails
        totalOrderValue={subTotal}
        orderDetailsRow={ordersData}
        setOrderDetailsRow={setOrderData}
      />
    </div>
  );
};

export default CreatePurchaseOrder;
