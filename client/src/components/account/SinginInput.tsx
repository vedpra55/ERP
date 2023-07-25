import { FC } from "react";

interface Props {
  placeholder: string;
  name: string;
  register: any;
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
