import { FC } from "react";

interface Props {
  date: Date;
}

const DateColumn: FC<Props> = ({ date }) => {
  const ds = new Date(date);

  return (
    <div>
      <p className="text-[14px]">
        {ds.getDate()} / {ds.getMonth()} / {ds.getFullYear()}
      </p>
    </div>
  );
};

export default DateColumn;
