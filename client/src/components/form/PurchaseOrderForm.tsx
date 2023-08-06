import { Supplier } from "@@types/system";

import { FC, useEffect, useState } from "react";
import AppInput from "@components/input/AppInput";
import SelectInput from "@components/input/SelectInput";
import DateInput from "@components/input/DateInput";
import SelectSupplier from "@components/input/SelectSupplier";
import SelectLocation from "@components/input/SelectLocaton";
import { fetchSingleSupplier } from "@api/getCalls";
import { useAuthContext } from "@context/AuthContext";

export type purchaseOrderFormValues = {
  orderNo: string;
  dueDate: Date;
  currency: string;
  costRate: number;
  supplierInvo: string;
  remarks: string;
  freight?: number;
  nonVendorCost?: number;
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
  handleSubmitForm(data: purchaseOrderFormValues): void;
  submitButtonRef: React.RefObject<HTMLButtonElement>;
  register?: any;
  watch?: any;
  handleSubmit?: any;
  errors: any;
  reset?: any;
  locationCode?: any;
  setLocationCode?: any;
  supplierCode: any;
  setSupplierCode: any;
}

const PurchaseOrderForm: FC<Props> = ({
  handleSubmitForm,
  submitButtonRef,
  register,
  handleSubmit,
  errors,
  supplierCode,
  setSupplierCode,
  setLocationCode,
}) => {
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | any>();

  const supplierCodeVal = supplierCode;
  const { user } = useAuthContext();

  useEffect(() => {
    async function fethData() {
      const data = await fetchSingleSupplier(
        supplierCodeVal,
        user.access_token
      );

      if (data) {
        setSelectedSupplier(data);
      } else {
        setSelectedSupplier([]);
      }
    }

    fethData();
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

      <div className="col-span-4">
        <SelectSupplier
          label="Supplier Code"
          setSelectedVal={setSupplierCode}
        />
      </div>

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

      <div className="col-span-4">
        <SelectLocation
          label="Location Code"
          setSelectedVal={setLocationCode}
        />
      </div>

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
      <p className="text-[14px] tracking-wider font-medium">{title}</p>
      <div className=" bg-gray-50 rounded-md 2xl:w-80 py-2 px-5   truncate">
        {value}
      </div>
    </div>
  );
};
