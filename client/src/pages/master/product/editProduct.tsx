import { Supplier } from "@@types/system";
import useCreateMution from "@api/mutation";
import useApiServices from "@api/query";
import ProductForm, { productFormValues } from "@components/form/ProductForm";
import SelectSuppliers from "@components/form/SelectSuppliers";
import AppButton from "@components/ui/AppButton";
import BackButton from "@components/ui/BackButton";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const EditProductPage = () => {
  const params = useParams();
  const { productCode, departmentCode } = params;
  const submitButtonRef = useRef<HTMLButtonElement>(null);
  const navigate = useNavigate();
  const { updateProductMutation } = useCreateMution();
  const { useFetchSingleProduct, useFetchSuppliers } = useApiServices();

  if (!productCode || !departmentCode) return;

  const { data } = useFetchSingleProduct(departmentCode, productCode);
  const { data: suppliers } = useFetchSuppliers();

  const [selectedSuppliers, setSelectedSuppliers] = useState<Supplier[]>([]);

  useEffect(() => {
    if (data?.suppliers) {
      setSelectedSuppliers(data.suppliers);
    }
  }, [data]);

  const onSubmit = async (values: productFormValues) => {
    const item = {
      ...values,
      departmentCode: departmentCode,
      selectedSuppliers,
      oldSuppliers: data?.suppliers,
    };

    console.log(item);

    await updateProductMutation.mutateAsync(item);
    navigate("/app/master/products");
  };

  if (!data || !suppliers) return;

  return (
    <div>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-x-2">
          <BackButton />
          <h2 className="text-[14px] font-medium tracking-wider">
            Edit Product
          </h2>
        </div>
        <AppButton
          isLoading={updateProductMutation.isLoading}
          handleOnClick={() => {
            submitButtonRef?.current?.click();
          }}
          title="Submit"
        />
      </div>
      <ProductForm
        defaultValues={data.product}
        submitButtonRef={submitButtonRef}
        handleSubmitForm={onSubmit}
      />
      <SelectSuppliers
        selectedSuppliers={selectedSuppliers}
        setSelectedSuppliers={setSelectedSuppliers}
      />
    </div>
  );
};

export default EditProductPage;
