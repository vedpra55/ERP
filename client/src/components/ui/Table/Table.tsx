import { FC } from "react";
import TableCell from "./TableCell";
import TableHeader from "./TableHeader";

export interface TableColumn {
  header: string;
  accessor: string;
  colSpan?: string;
  isDate?: boolean;
  isBool?: boolean;
  field?: string;
  field2?: string;
  field3?: string;
  handleClick?(index?: number): void;
  isDownloadIcon?: boolean;
  isEdit?: boolean;
}

export interface TableProps {
  data: any[];
  columns: TableColumn[];
  width?: string;
  from?: string;
  height?: string;
  noMargin?: boolean;
  onChangeInput?(val: any): void;
}

const Table: FC<TableProps> = ({
  data,
  height,
  columns,
  width,
  from,
  noMargin,
}) => {
  return (
    <>
      <div
        className={`${height ? height : "h-[30rem]"}  overflow-y-scroll ${
          !noMargin && "mt-10"
        }`}
      >
        <TableHeader columns={columns} width={width} />
        {data.map((item, index) => (
          <div
            key={index}
            className={`tableRow overflow-x-auto  ${
              from === "select" && "cursor-pointer hover:bg-gray-50"
            }  ${width} `}
          >
            {columns.map((column, ii) => {
              return (
                <div key={ii} className={`  ${column.colSpan}`}>
                  <TableCell index={index} column={column} item={item} />
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </>
  );
};

export default Table;
