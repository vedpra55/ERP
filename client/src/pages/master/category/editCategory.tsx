import useCreateMution from "@api/mutation";
import useApiServices from "@api/query";
import CategoryForm, { departmentForm } from "@components/form/CategoryForm";
import AppButton from "@components/ui/AppButton";
import BackButton from "@components/ui/BackButton";
import { useRef } from "react";
import { useParams } from "react-router-dom";

const EditCategoryPage = () => {
  const params = useParams();
  const { departmentCode } = params;
  const submitButtonRef = useRef<HTMLButtonElement>(null);

  if (!departmentCode) return <p>Category code not found</p>;

  const { useFetchSingleCategory } = useApiServices();
  const { data } = useFetchSingleCategory(departmentCode);

  const { updateCategoryMutation } = useCreateMution();

  const onSubmit = async (values: departmentForm) => {
    await updateCategoryMutation.mutateAsync(values);
  };

  if (!data) return;

  return (
    <div>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-x-2">
          <BackButton />
          <h2 className="text-[14px] font-medium tracking-wider">
            Edit Category
          </h2>
        </div>
        <AppButton
          isLoading={updateCategoryMutation.isLoading}
          handleOnClick={() => {
            submitButtonRef?.current?.click();
          }}
          title="Submit"
        />
      </div>
      <CategoryForm
        defaultValues={data}
        submitButtonRef={submitButtonRef}
        handleSubmitForm={onSubmit}
      />
    </div>
  );
};

export default EditCategoryPage;
