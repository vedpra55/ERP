import { FC, useEffect } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { categorySchema } from "@utils/validator";
import { Category } from "@@types/system";
import AppInput from "@components/input/AppInput";
import CheckboxInput from "@components/input/CheckboxInput";

interface Props {
  defaultValues?: Category;
  handleSubmitForm(data: departmentForm): void;
  submitButtonRef: React.RefObject<HTMLButtonElement>;
}

export type departmentForm = {
  departmentCode: string;
  departmentName: string;
  closedFlag?: boolean | false;
};

const CategoryForm: FC<Props> = ({
  defaultValues,
  handleSubmitForm,
  submitButtonRef,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<departmentForm>({
    resolver: yupResolver(categorySchema),
  });

  useEffect(() => {
    if (defaultValues) {
      reset({
        ...defaultValues,
        departmentCode: defaultValues.department_code,
        departmentName: defaultValues.department_name,
        closedFlag: defaultValues.closed_flag,
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
          name="departmentCode"
          placeholder="Category Code"
          register={register}
          errorMsg={errors.departmentCode?.message}
        />
      )}
      <AppInput
        name="departmentName"
        placeholder="Department Name"
        register={register}
        errorMsg={errors.departmentName?.message}
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

export default CategoryForm;
