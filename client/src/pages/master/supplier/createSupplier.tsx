import useCreateMution from "@api/mutation";
import SupplierForm, { supplierFormValue } from "@components/form/SupplierForm";

import AppButton from "@components/ui/AppButton";
import BackButton from "@components/ui/BackButton";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";

const CreateSupplierPage = () => {
  const submitButtonRef = useRef<HTMLButtonElement>(null);
  const { createSupplierMutation } = useCreateMution();
  const navigate = useNavigate();

  const onSubmit = async (data: supplierFormValue) => {
    await createSupplierMutation.mutateAsync(data);
    navigate("/app/master/suppliers");
  };

  return (
    <div>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-x-2">
          <BackButton />
          <h2 className="text-[14px] font-medium tracking-wider">
            Create Supplier
          </h2>
        </div>
        <AppButton
          isLoading={createSupplierMutation.isLoading}
          handleOnClick={() => {
            submitButtonRef.current?.click();
          }}
          title="Submit"
        />
      </div>
      <SupplierForm
        submitButtonRef={submitButtonRef}
        handleSubmitForm={onSubmit}
      />
    </div>
  );
};

export default CreateSupplierPage;
