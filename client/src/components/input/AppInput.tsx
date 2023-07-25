import { FC } from "react";

interface Props {
  placeholder: string;
  name: string;
  register?: any;
  errorMsg?: string;
  type?: string;
}

const AppInput: FC<Props> = ({
  placeholder,
  register,
  errorMsg,
  name,
  type,
}) => {
  return (
    <div className="col-span-4 flex flex-col gap-y-2">
      {errorMsg && (
        <p className=" text-[14px] text-red-400 tracking-normal">{errorMsg}</p>
      )}
      <label className="text-[14px] tracking-wider ">{placeholder}</label>
      <input type={type || "text"} className="myInput" {...register(name)} />
    </div>
  );
};

export default AppInput;
