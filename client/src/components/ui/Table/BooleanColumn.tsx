import { FC } from "react";

interface Props {
  value: boolean;
  mainText: string;
  subText: string;
}

const BooleanColumn: FC<Props> = ({ value, mainText, subText }) => {
  return (
    <div
      className={`${
        value != true
          ? "bg-green-500 text-white text-[14px]"
          : "bg-red-600 text-white text-[14px]"
      } rounded-lg p-1 w-20 text-center `}
    >{`${value == true ? <p>{subText}</p> : { mainText }}`}</div>
  );
};

export default BooleanColumn;
