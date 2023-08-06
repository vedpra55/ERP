import AppButton from "@components/ui/AppButton";
import BackButton from "@components/ui/BackButton";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import useCreateMution from "@api/mutation";
import ProductForm, { productFormValues } from "@components/form/ProductForm";

import SelectSuppliers from "@components/form/SelectSuppliers";
import { Supplier } from "@@types/system";
import { toast } from "react-hot-toast";

const CreateCategoryPage = () => {
  const submitButtonRef = useRef<HTMLButtonElement>(null);
  const { createProductMutation } = useCreateMution();

  const navigate = useNavigate();
  const [selectedDepartmentCode, setSelectedDepartmentCode] =
    useState<any>(null);
  const [selectedSuppliers, setSelectedSuppliers] = useState<Supplier[]>([]);

  const onSubmit = async (data: productFormValues) => {
    if (selectedSuppliers.length === 0) {
      toast.error("Please Select Suppliers");
      return;
    }

    if (!selectedDepartmentCode?.value) {
      toast.error("Please select department code");
      return;
    }

    const item = {
      ...data,
      departmentCode: selectedDepartmentCode.value,
      selectedSuppliers,
    };

    await createProductMutation.mutateAsync(item);
    if (createProductMutation.isError) return;
    navigate("/app/master/products");
  };

  return (
    <div>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-x-2">
          <BackButton />
          <h2 className="text-[14px] font-medium tracking-wider">
            Create Product
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
        setSelectedDepartmentCode={setSelectedDepartmentCode}
        handleSubmitForm={onSubmit}
        submitButtonRef={submitButtonRef}
      />

      <SelectSuppliers
        selectedSuppliers={selectedSuppliers}
        setSelectedSuppliers={setSelectedSuppliers}
      />
    </div>
  );
};

export default CreateCategoryPage;
