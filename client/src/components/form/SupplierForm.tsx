import { FC, useEffect } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { supplierSchema } from "@utils/validator";
import { Supplier } from "@@types/system";
import AppInput from "@components/input/AppInput";
import CheckboxInput from "@components/input/CheckboxInput";

interface Props {
  defaultValues?: Supplier;
  handleSubmitForm(data: supplierFormValue): void;
  submitButtonRef: React.RefObject<HTMLButtonElement>;
}

export type supplierFormValue = {
  supplierCode: string;
  supplierName: string;
  address1: string;
  address2: string;
  email: string;
  telephoneNo: string;
  mobileNo: string;
  country: string;
  fax: string;
  closedFlag?: boolean;
};

const SupplierForm: FC<Props> = ({
  defaultValues,
  handleSubmitForm,
  submitButtonRef,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<supplierFormValue>({
    resolver: yupResolver(supplierSchema),
  });

  useEffect(() => {
    if (defaultValues) {
      reset({
        ...defaultValues,
        supplierCode: defaultValues?.supplier_code,
        supplierName: defaultValues?.supplier_name,
        email: defaultValues?.email,
        address1: defaultValues?.address_1,
        address2: defaultValues?.address_2,
        fax: defaultValues?.fax,
        closedFlag: defaultValues?.closed_flag || undefined,
        country: defaultValues?.country,
        telephoneNo: defaultValues?.telephone_no.toString(),
        mobileNo: defaultValues?.mobile_no.toString(),
      });
    }
  }, [defaultValues]);

  return (
    <form
      onSubmit={handleSubmit((data) => handleSubmitForm(data))}
      className="grid grid-cols-12 gap-5 items-end mt-5"
    >
      {!defaultValues && (
        <AppInput
          name="supplierCode"
          placeholder="Supplier Code"
          register={register}
          errorMsg={errors.supplierCode?.message}
        />
      )}
      <AppInput
        name="supplierName"
        placeholder="Supplier Name"
        register={register}
        errorMsg={errors.supplierName?.message}
      />
      <AppInput
        name="email"
        placeholder="Email"
        register={register}
        errorMsg={errors.email?.message}
      />
      <AppInput
        name="address1"
        placeholder="Address 1"
        register={register}
        errorMsg={errors.address1?.message}
      />
      <AppInput
        name="address2"
        placeholder="Address 2"
        register={register}
        errorMsg={errors.address2?.message}
      />
      <AppInput
        name="country"
        placeholder="Country"
        register={register}
        errorMsg={errors.country?.message}
      />
      <AppInput
        name="telephoneNo"
        placeholder="Telephone No"
        register={register}
        errorMsg={errors.telephoneNo?.message}
      />
      <AppInput
        name="mobileNo"
        placeholder="Mobile No"
        register={register}
        errorMsg={errors.mobileNo?.message}
      />

      <AppInput
        name="fax"
        placeholder="Fax"
        register={register}
        errorMsg={errors.fax?.message}
      />
      <CheckboxInput
        register={register}
        placeholder="Closed Flag"
        name="closedFlag"
      />
      <button className="hidden" type="submit" ref={submitButtonRef}></button>
    </form>
  );
};

export default SupplierForm;
