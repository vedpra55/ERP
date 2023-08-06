import { FC } from "react";

interface Props {
  date: Date;
}

const DateColumn: FC<Props> = ({ date }) => {
  const ds = new Date(date);

  return (
    <div>
      {date ? (
        <p className="text-[14px]">
          {ds.getDate()} / {ds.getMonth() + 1} / {ds.getFullYear()}
        </p>
      ) : (
        <p className="text-[14px] text-red-500">Not Acknowledge</p>
      )}
    </div>
  );
};

export default DateColumn;
