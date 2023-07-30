import AccessStatus from "./AccessStatus";
import ActonColumn from "./ActionColumn";

import ClosedStatus from "./ClosedStatus";
import DateColumn from "./DateColumn";
import { TableColumn } from "./Table";

interface Props {
  column: TableColumn;
  item: any;
  index: number;
}

const TableCell: React.FC<Props> = ({ column, item, index }) => {
  if (column.accessor === "access") {
    return <AccessStatus access={item[column.accessor]} />;
  }

  if (column.accessor === "closed_flag") {
    return <ClosedStatus access={item[column.accessor]} />;
  }

  if (column.accessor === "fulfilled_flag") {
    return (
      <div
        className={`${
          item[column.accessor] == true
            ? "bg-green-500 text-white text-[14px]"
            : "bg-red-600 text-white text-[14px]"
        } rounded-lg p-1 w-28 text-center `}
      >{`${
        item[column.accessor] == true ? "Full Filled" : "Not Full Filled"
      }`}</div>
    );
  }

  if (column.accessor === "paid_flag") {
    return (
      <div
        className={`${
          item[column.accessor] == true
            ? "bg-green-500 text-white text-[14px]"
            : "bg-red-600 text-white text-[14px]"
        } rounded-lg p-1 w-20 text-center `}
      >{`${item[column.accessor] == true ? "Paid" : "Not Paid"}`}</div>
    );
  }

  if (column.accessor === "sub_company_id" && column.handleClick) {
    return (
      <ActonColumn
        field={item[column?.field || "sub_company_id"]}
        col={`${column.colSpan}`}
        handleClick={column.handleClick}
      />
    );
  }

  if (column.accessor === "role_name" && column.handleClick) {
    return (
      <ActonColumn
        index={index}
        field={item[column?.field || "sub_company_id"]}
        col={`${column.colSpan}`}
        handleClickWithVal={column.handleClick}
      />
    );
  }

  if (column.accessor === "user_name" && column.handleClick) {
    return (
      <ActonColumn
        index={index}
        field={item[column?.field || "user_name"]}
        col={`${column.colSpan}`}
        handleClickWithVal={column.handleClick}
      />
    );
  }

  if (column.accessor === "document" && column.handleClick) {
    return (
      <ActonColumn
        isDownloadIcon={true}
        index={index}
        col={`${column.colSpan}`}
        handleClickWithVal={column.handleClick}
      />
    );
  }

  if (column.accessor === "serial_no" && column.handleClick) {
    return (
      <ActonColumn
        isDeleteIcon
        index={index}
        col={`${column.colSpan}`}
        handleClickWithVal={column.handleClick}
      />
    );
  }

  if (column.accessor === "action" && !column.handleClick) {
    let link = `edit/${item[column?.field || ""]}`;

    if (column.field2) {
      link = `edit/${item[column?.field || ""]}/${item[column?.field2]}`;
    }

    if (column.field2 && column.field3) {
      link = `edit/${item[column?.field || ""]}/${item[column?.field2]}/${
        item[column.field3]
      }`;
    }

    return (
      <ActonColumn
        field={item[column?.field || ""]}
        col={`${column.colSpan}`}
        link={link}
      />
    );
  }

  if (
    column.accessor === "value" &&
    column.field2 &&
    column.field &&
    column.isEdit == false
  ) {
    return (
      <p>{parseInt(item[column.field]) * parseInt(item[column.field2])}</p>
    );
  }

  if (column.isDate) {
    return <DateColumn date={item[column.accessor]} />;
  }

  return <p>{item[column.accessor]}</p>;
};

export default TableCell;
