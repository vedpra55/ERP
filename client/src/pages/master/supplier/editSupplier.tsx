import useCreateMution from "@api/mutation";
import useApiServices from "@api/query";
import SupplierForm, { supplierFormValue } from "@components/form/SupplierForm";
import AppButton from "@components/ui/AppButton";
import BackButton from "@components/ui/BackButton";
import { useRef } from "react";
import { useParams } from "react-router-dom";

const EditSupplierPage = () => {
  const submitButtonRef = useRef<HTMLButtonElement>(null);
  const params = useParams();
  const { supplierCode } = params;

  if (!supplierCode) return;

  const { useFetchSingleSupplier } = useApiServices();
  const { updateSupplierMutation } = useCreateMution();

  const { data: supplier } = useFetchSingleSupplier(supplierCode);

  if (!supplier) return;

  const onSubmit = async (data: supplierFormValue) => {
    await updateSupplierMutation.mutateAsync(data);
  };

  return (
    <div>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-x-2">
          <BackButton />
          <h2 className="text-[14px] font-medium tracking-wider">
            Edit Supplier
          </h2>
        </div>
        <AppButton
          isLoading={updateSupplierMutation.isLoading}
          handleOnClick={() => {
            submitButtonRef.current?.click();
          }}
          title="Submit"
        />
      </div>
      <SupplierForm
        defaultValues={supplier}
        submitButtonRef={submitButtonRef}
        handleSubmitForm={onSubmit}
      />
    </div>
  );
};

export default EditSupplierPage;
