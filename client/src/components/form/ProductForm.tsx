import { Product } from "@@types/system";
import { FC, useEffect } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import AppInput from "@components/input/AppInput";
import CheckboxInput from "@components/input/CheckboxInput";
import { productSchema } from "@utils/validator";
import SelectInput from "@components/input/SelectInput";

interface Props {
  categories?: any;
  defaultValues?: Product;
  handleSubmitForm(data: productFormValues): void;
  submitButtonRef: React.RefObject<HTMLButtonElement>;
}

export type productFormValues = {
  departmentCode: string;
  productCode: string;
  productDescription: string;
  qtyInStock?: number;
  qtyPurchase?: number;
  qtyBackOrder?: number;
  costPrice?: number;
  closedFlag?: boolean;
  sellingPrice?: number;
};

const ProductForm: FC<Props> = ({
  defaultValues,
  handleSubmitForm,
  submitButtonRef,
  categories,
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
        departmentCode: defaultValues.department_code,
        costPrice: defaultValues.cost_price,
        sellingPrice: defaultValues.selling_price,
        qtyBackOrder: defaultValues.qty_backorder,
        qtyInStock: defaultValues.qty_instock,
        qtyPurchase: defaultValues.qty_purchase,
        closedFlag: defaultValues.closed_flag,
      });
    }
  }, [defaultValues]);

  const filterCategories = categories.map((item: any) => {
    if (!item.closed_flag) return item;
  });

  return (
    <form
      onSubmit={handleSubmit((data) => handleSubmitForm(data))}
      className="grid grid-cols-12 gap-5 items-end mt-5"
    >
      {!defaultValues && (
        <>
          {filterCategories[0] != undefined ? (
            <SelectInput
              accessor="department_code"
              name="departmentCode"
              label="Department Code"
              extraValAccessor="department_name"
              register={register}
              data={filterCategories}
            />
          ) : (
            <div className="col-span-4 border py-2 px-5 rounded-md tracking-wider">
              No Department code found
            </div>
          )}
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
            name="qtyPurchase"
            placeholder="Qty Purchase"
            register={register}
            errorMsg={errors.qtyPurchase?.message}
          />
          <AppInput
            name="qtyBackOrder"
            placeholder="Qty Backorder"
            register={register}
            errorMsg={errors.qtyBackOrder?.message}
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
