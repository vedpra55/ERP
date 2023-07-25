import { FC } from "react";
import { TableColumn } from "./Table";

const TableHeader: FC<{ columns: TableColumn[]; width?: string }> = ({
  columns,
  width,
}) => {
  return (
    <div
      className={`${
        width || "w-full"
      }  grid grid-cols-12 bg-gray-50 px-10 py-3`}
    >
      {columns.map((item) => (
        <div
          className={`${item.colSpan} text-[15px] font-medium`}
          key={item.header}
        >
          {item.header}
        </div>
      ))}
    </div>
  );
};

export default TableHeader;
