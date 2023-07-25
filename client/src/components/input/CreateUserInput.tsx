import { CreateUserFormValues } from "@components/system/createUser";
import { FC } from "react";
import { UseFormRegister } from "react-hook-form";

interface Props {
  placeholder: string;
  name: string;
  register: UseFormRegister<CreateUserFormValues>;
  errorMsg?: string;
}

const CreateUserInput: FC<Props> = ({
  placeholder,
  register,
  errorMsg,
  name,
}) => {
  return (
    <div className="col-span-4 flex flex-col gap-y-2">
      {errorMsg && <p className=" text-[14px] text-red-400">{errorMsg}</p>}
      <label className="text-[14px] ">{placeholder}</label>
      <input className="myInput" {...register(name)} />
    </div>
  );
};

export default CreateUserInput;
