import { FC, useState } from "react";

interface Props {
  data: any[];
  accessor: string;
  register: any;
  label: string;
  name: string;
  errMsg?: string;
  extraValAccessor?: string;
  isShowSelect?: boolean;
}

interface Props2 {
  data: any[];
  accessor: string;
  handleChange(e: any): void;
  label: string;
  name: string;
  errMsg?: string;
  optionl?: string;
  extraValAccessor?: string;
}

const SelectInput: FC<Props> = ({
  data,
  accessor,
  extraValAccessor,
  name,
  label,
  register,
  errMsg,
  isShowSelect,
}) => {
  const [val, setVal] = useState("");

  return (
    <div className="col-span-4 flex flex-col gap-y-2">
      {errMsg && (
        <p className=" text-[14px] text-red-400 tracking-normal">{errMsg}</p>
      )}
      <label className="text-[14px] tracking-wider ">{label}</label>

      <select
        onChange={(e) => setVal(e.target.value)}
        name={name}
        className="border  rounded-md 2x:w-80 px-5 py-2 outline-none"
        {...register(name)}
      >
        {isShowSelect && <option>Select</option>}
        {data.map((item) =>
          extraValAccessor ? (
            <option value={item[accessor]} key={item[accessor]}>
              {item[accessor]} - {item[extraValAccessor]}
            </option>
          ) : (
            <option value={item[accessor]} key={item[accessor]}>
              {item[accessor]}
            </option>
          )
        )}
      </select>
      <p>{val}</p>
    </div>
  );
};

export const SelecteInputNormal: FC<Props2> = ({
  data,
  accessor,
  name,
  label,
  handleChange,
  errMsg,
  optionl,
  extraValAccessor,
}) => {
  return (
    <div className="col-span-4 flex flex-col gap-y-2">
      {errMsg && (
        <p className=" text-[14px] text-red-400 tracking-normal">{errMsg}</p>
      )}
      <label className="text-[14px] tracking-wider ">{label}</label>
      <select
        name={name}
        onChange={(e) => handleChange(e)}
        className="border  rounded-md 2x:w-80  px-5 py-2 outline-none"
      >
        <option>Select</option>
        {optionl && <option>{optionl}</option>}
        {data.map((item) =>
          extraValAccessor ? (
            <option value={item[accessor]} key={item[accessor]}>
              {item[accessor]} - {item[extraValAccessor]}
            </option>
          ) : (
            <option value={item[accessor]} key={item[accessor]}>
              {item[accessor]}
            </option>
          )
        )}
      </select>
    </div>
  );
};

export default SelectInput;
