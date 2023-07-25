import { FC } from "react";

interface Props {
  placeholder: string;
  name: string;
  register?: any;
}

const CheckboxInput: FC<Props> = ({ placeholder, register, name }) => {
  return (
    <div className="col-span-4 flex border px-5 py-2 rounded-md justify-between w-80">
      <label className="text-[14px]  tracking-wider">{placeholder} :</label>
      <div>
        <input type="checkbox" className="w-4 h-4" {...register(name)} />
      </div>
    </div>
  );
};

export default CheckboxInput;
