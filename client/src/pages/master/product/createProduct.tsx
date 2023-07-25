import AppButton from "@components/ui/AppButton";
import BackButton from "@components/ui/BackButton";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import useCreateMution from "@api/mutation";
import ProductForm, { productFormValues } from "@components/form/ProductForm";
import useApiServices from "@api/query";
import SelectSuppliers from "@components/form/SelectSuppliers";
import { Supplier } from "@@types/system";
import { toast } from "react-hot-toast";

const CreateCategoryPage = () => {
  const submitButtonRef = useRef<HTMLButtonElement>(null);
  const { createProductMutation } = useCreateMution();
  const { useFetchCategories, useFetchSuppliers } = useApiServices();
  const { data: categories } = useFetchCategories();
  const { data: suppliers } = useFetchSuppliers();
  const navigate = useNavigate();

  const [selectedSuppliers, setSelectedSuppliers] = useState<Supplier[]>([]);

  if (!categories || !suppliers) return;

  const onSubmit = async (data: productFormValues) => {
    if (selectedSuppliers.length === 0) {
      toast.error("Please Select Suppliers");
      return;
    }

    const item = {
      ...data,
      selectedSuppliers,
    };
    await createProductMutation.mutateAsync(item);
    navigate("/app/master/products");
  };

  return (
    <div>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-x-2">
          <BackButton />
          <h2 className="text-[14px] font-medium tracking-wider">
            Create Location
          </h2>
        </div>
        <AppButton
          isLoading={createProductMutation.isLoading}
          handleOnClick={() => {
            submitButtonRef?.current?.click();
          }}
          title="Submit"
        />
      </div>
      <ProductForm
        handleSubmitForm={onSubmit}
        categories={categories}
        submitButtonRef={submitButtonRef}
      />
      {suppliers && (
        <SelectSuppliers
          selectedSuppliers={selectedSuppliers}
          setSelectedSuppliers={setSelectedSuppliers}
          suppliers={suppliers}
        />
      )}
    </div>
  );
};

export default CreateCategoryPage;
