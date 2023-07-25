import { FC } from "react";
import { UseFormRegister } from "react-hook-form";

type FormValues = {
  username: string;
  email: string;
  password: string;
};

interface Props {
  placeholder: string;
  name: string;
  register: UseFormRegister<FormValues>;
  errorMsg?: string;
}

const SigninInput: FC<Props> = ({ placeholder, register, errorMsg, name }) => {
  return (
    <div className="flex flex-col gap-y-2">
      <label className="text-[14px] ">{placeholder}</label>
      <input className="myInput" {...register(name)} />
      {errorMsg && <p className=" text-[14px] text-red-400">{errorMsg}</p>}
    </div>
  );
};

export default SigninInput;
