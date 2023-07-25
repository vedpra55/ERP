import { FC } from "react";

interface Props {
  title: string;
  value: string | number;
}

const ItemColumn: FC<Props> = ({ title, value }) => {
  return (
    <div className="flex gap-x-10 ">
      <p className="2xl:w-80 ">{title}:</p>
      <p className="w-full">{value}</p>
    </div>
  );
};

export default ItemColumn;
