import { FC } from "react";

interface Props {
  placeholder: string;
  name: string;
  register?: any;
  errorMsg?: string;
}

const DateInput: FC<Props> = ({ placeholder, register, name, errorMsg }) => {
  return (
    <div className="col-span-4 flex flex-col gap-y-1">
      {errorMsg && (
        <p className=" text-[14px] text-red-400 tracking-normal">{errorMsg}</p>
      )}
      <label className="text-[14px]  tracking-wider">{placeholder} :</label>
      <div>
        <input
          name={name}
          type="date"
          className="2xl:w-80 border rounded-md px-5 py-2 outline-none"
          {...register(name)}
        />
      </div>
    </div>
  );
};

interface Props2 {
  placeholder: string;
  name: string;
  handleChange: (e: any) => void;
  errorMsg?: string;
}

export const DateInputNoraml: FC<Props2> = ({
  placeholder,
  handleChange,
  name,
  errorMsg,
}) => {
  return (
    <div className="col-span-4 flex flex-col gap-y-1">
      {errorMsg && (
        <p className=" text-[14px] text-red-400 tracking-normal">{errorMsg}</p>
      )}
      <label className="text-[14px]  tracking-wider">{placeholder} :</label>
      <div>
        <input
          name={name}
          type="date"
          className="2xl:w-80 border rounded-md px-5 py-2 outline-none"
          onChange={(e) => handleChange(e)}
        />
      </div>
    </div>
  );
};

export default DateInput;
