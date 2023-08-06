import useCreateMution from "@api/mutation";
import CategoryForm, { departmentForm } from "@components/form/CategoryForm";
import AppButton from "@components/ui/AppButton";
import BackButton from "@components/ui/BackButton";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";

const CreateCategoryPage = () => {
  const submitButtonRef = useRef<HTMLButtonElement>(null);
  const { createCategoryMutation } = useCreateMution();
  const navigate = useNavigate();

  const onSubmit = async (data: departmentForm) => {
    await createCategoryMutation.mutateAsync(data);
    if (createCategoryMutation.isError) return;
    navigate("/app/master/categories");
  };

  return (
    <div>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-x-2">
          <BackButton />
          <h2 className="text-[14px] font-medium tracking-wider">
            Create Category
          </h2>
        </div>
        <AppButton
          isLoading={createCategoryMutation.isLoading}
          handleOnClick={() => {
            submitButtonRef?.current?.click();
          }}
          title="Submit"
        />
      </div>
      <CategoryForm
        submitButtonRef={submitButtonRef}
        handleSubmitForm={onSubmit}
      />
    </div>
  );
};

export default CreateCategoryPage;
