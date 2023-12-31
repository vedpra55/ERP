import { Product } from "@@types/system";
import { FC, useEffect } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import AppInput from "@components/input/AppInput";
import CheckboxInput from "@components/input/CheckboxInput";
import { productSchema } from "@utils/validator";
import SelectDepartment from "@components/input/SelectDepartment";

interface Props {
  categories?: any;
  defaultValues?: Product;
  handleSubmitForm(data: productFormValues): void;
  submitButtonRef: React.RefObject<HTMLButtonElement>;
  setSelectedDepartmentCode?: any;
}

export type productFormValues = {
  productCode: string;
  productDescription: string;
  qtyInStock?: number;
  sellingPrice?: number;
  qtyBackOrder?: number;
  qtyPurchase?: number;
  costPrice?: number;
  closedFlag?: boolean;
};

const ProductForm: FC<Props> = ({
  defaultValues,
  handleSubmitForm,
  submitButtonRef,
  setSelectedDepartmentCode,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<productFormValues>({
    resolver: yupResolver(productSchema),
  });

  useEffect(() => {
    if (defaultValues) {
      reset({
        productCode: defaultValues.product_code,
        productDescription: defaultValues.product_description,
        costPrice: defaultValues.cost_price,
        sellingPrice: defaultValues.selling_price,
        qtyBackOrder: defaultValues.qty_backorder,
        qtyInStock: defaultValues.qty_instock,
        qtyPurchase: defaultValues.qty_purchase,
        closedFlag: defaultValues.closed_flag,
      });
    }
  }, [defaultValues]);

  return (
    <form
      onSubmit={handleSubmit((data) => handleSubmitForm(data))}
      className="grid grid-cols-12 gap-5 items-end mt-5 border rounded-md  p-5"
    >
      {!defaultValues && (
        <>
          <div className="col-span-4">
            <SelectDepartment
              setSelectedDepartmentCode={setSelectedDepartmentCode}
            />
          </div>

          <AppInput
            name="productCode"
            placeholder="Product Name"
            register={register}
            errorMsg={errors.productCode?.message}
          />
        </>
      )}
      <AppInput
        name="productDescription"
        placeholder="Product Description"
        register={register}
        errorMsg={errors.productDescription?.message}
      />
      {!defaultValues && (
        <>
          <AppInput
            name="qtyInStock"
            placeholder="Qty In Stock"
            register={register}
            errorMsg={errors.qtyInStock?.message}
          />
          <AppInput
            name="costPrice"
            placeholder="Cost Price"
            register={register}
            errorMsg={errors.qtyInStock?.message}
          />
        </>
      )}
      <AppInput
        name="sellingPrice"
        placeholder="Selling Price"
        register={register}
        errorMsg={errors.sellingPrice?.message}
      />
      <CheckboxInput
        register={register}
        placeholder="Closed Flag"
        name="closedFlag"
      />

      <button type="submit" className="hidden" ref={submitButtonRef}></button>
    </form>
  );
};

export default ProductForm;
