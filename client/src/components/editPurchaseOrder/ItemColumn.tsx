import { FC } from "react";

interface Props {
  title: string;
  value: string | number;
}

const ItemColumn: FC<Props> = ({ title, value }) => {
  return (
    <div className="flex gap-x-10  text-[14px] 2xl:text-base">
      <p className="w-56  2xl:w-80 ">{title}:</p>
      <p className="w-full truncate">{value}</p>
    </div>
  );
};

export default ItemColumn;
