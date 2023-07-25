import { FC } from "react";
import TableHeader from "./TableHeader";

import Cell from "./SelecteTableCell";

export interface SelectTableColumn {
  header: string;
  accessor: string;
  colSpan?: string;
  field?: string;
  field2?: string;
  id?: boolean;
}

export interface Props {
  data: any[];
  columns: SelectTableColumn[];
  width?: string;
  from?: string;
  handleSelect?(code?: string): void;
  handleRemove?(code?: string): void;
  selectedItems: any[];
  isSelectedItem(item: any, accessor: string): boolean;
}

const SelectTable: FC<Props> = ({
  data,
  columns,
  width,
  handleSelect,
  isSelectedItem,
  handleRemove,
  from,
}) => {
  const select = (item: any) => {
    if (columns[0].id && handleSelect) {
      handleSelect(item[columns[0].accessor]);
    }
  };

  return (
    <div className=" overflow-y-scroll mt-5 mb-10">
      <TableHeader columns={columns} width={width} />
      {data.map((item, index) => {
        const isSelected = isSelectedItem(item, columns[0].accessor);

        if (isSelected && from === "main")
          return (
            <div className="tableRow">
              <p className="col-span-12 text-[14px]"> This item is selected</p>
            </div>
          );
        return (
          <div
            onClick={() => select(item)}
            key={index}
            className={`tableRow ${
              isSelected && "bg-gray-100"
            } cursor-pointer hover:bg-gray-100  ${width} `}
          >
            {columns.map((column) => {
              return (
                <div key={column.accessor} className={`${column.colSpan}`}>
                  <Cell
                    item={item}
                    column={column}
                    handleSelect={handleSelect}
                    handleRemove={handleRemove}
                  />
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default SelectTable;
