import { Supplier, Location } from "@@types/system";

import { FC, useEffect, useState } from "react";
import AppInput from "@components/input/AppInput";
import SelectInput from "@components/input/SelectInput";
import DateInput from "@components/input/DateInput";

export type purchaseOrderFormValues = {
  orderNo: string;
  locationCode: string;
  dueDate: Date;
  supplierCode: string;
  currency: string;
  costRate: number;
  supplierInvo: string;
  remarks: string;
  freight?: number;
  nonVendorCost: number;
};

export type OrderDetails = {
  srl: string;
  departmentCode: string;
  productCode: string;
  description: string;
  unitPrice: number;
  qtyBackorder: number;
  value: number;
};

interface Props {
  suppliers: Supplier[];
  locations: Location[];
  handleSubmitForm(data: purchaseOrderFormValues): void;
  submitButtonRef: React.RefObject<HTMLButtonElement>;
  register?: any;
  watch?: any;
  handleSubmit?: any;
  errors: any;
  reset?: any;
}

const PurchaseOrderForm: FC<Props> = ({
  suppliers,
  locations,
  handleSubmitForm,
  submitButtonRef,
  register,
  watch,
  handleSubmit,
  errors,
}) => {
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier>();

  const supplierCode = watch("supplierCode");
  useEffect(() => {}, []);

  useEffect(() => {
    if (supplierCode) {
      const item = suppliers.filter(
        (res) => res.supplier_code === supplierCode
      )[0];

      setSelectedSupplier(item);
    }
  }, [supplierCode]);

  return (
    <form
      onSubmit={handleSubmit((data: purchaseOrderFormValues) =>
        handleSubmitForm(data)
      )}
      className="grid grid-cols-12 gap-5 items-end mt-5 rounded-md p-5 border"
    >
      <AppInput
        name="orderNo"
        placeholder="Order Name"
        register={register}
        errorMsg={errors.orderNo?.message}
      />

      <SelectInput
        isShowSelect
        accessor="supplier_code"
        data={suppliers}
        label="Supplier Code"
        extraValAccessor="supplier_name"
        name="supplierCode"
        register={register}
        closeCheck
      />

      <SelectedValue
        value={selectedSupplier?.supplier_code}
        title="Supplier Code"
      />
      <SelectedValue
        value={selectedSupplier?.supplier_name}
        title="Supplier Name"
      />
      <SelectedValue value={selectedSupplier?.telephone_no} title="Phone No" />
      <SelectedValue value={selectedSupplier?.email} title="Email" />
      <SelectedValue value={selectedSupplier?.address_1} title="Address" />

      <SelectInput
        accessor="location_code"
        data={locations}
        extraValAccessor="location_name"
        label="Location Code"
        name="locationCode"
        register={register}
        closeCheck
      />

      <AppInput
        name="remarks"
        placeholder="Remarks"
        register={register}
        errorMsg={errors.remarks?.message}
      />

      <AppInput
        name="supplierInvo"
        placeholder="Supplier Invo"
        register={register}
        errorMsg={errors.supplierInvo?.message}
      />

      <SelectInput
        accessor="name"
        data={[{ name: "USD" }, { name: "INR" }]}
        label="Currency"
        name="currency"
        register={register}
      />

      <AppInput
        name="costRate"
        type="number"
        placeholder="Cost Rate"
        register={register}
        errorMsg={errors.costRate?.message}
      />

      <AppInput
        type="number"
        name="freight"
        placeholder="Freight"
        register={register}
        errorMsg={errors.freight?.message}
      />

      <AppInput
        type="number"
        name="nonVendorCost"
        placeholder="Non Vendor Cost %"
        register={register}
        errorMsg={errors.nonVendorCost?.message}
      />

      <DateInput
        errorMsg={errors.dueDate?.message}
        register={register}
        placeholder="Due Date"
        name="dueDate"
      />

      <button type="submit" className="hidden" ref={submitButtonRef}></button>
    </form>
  );
};

export default PurchaseOrderForm;

const SelectedValue: FC<{ value?: string | number; title: string }> = ({
  value,
  title,
}) => {
  return (
    <div className="col-span-4 flex gap-y-1 flex-col">
      <p className="text-[14px] tracking-wider">{title}</p>
      <div className=" bg-gray-50 rounded-md 2xl:w-80 py-2 px-5">{value}</div>
    </div>
  );
};
