import ClosedStatus from "./ClosedStatus";
import { IoCloseSharp } from "react-icons/io5";
import { SelectTableColumn } from "./SelectTable";

interface Props {
  column: SelectTableColumn;
  item: any;
  handleSelect?(code: string): void;
  handleRemove?(code: string): void;
}

const Cell: React.FC<Props> = ({
  column,
  item,
  handleRemove,
  handleSelect,
}) => {
  if (column.accessor === "closed_flag") {
    return <ClosedStatus access={item[column.accessor]} />;
  }

  if (column.header === "Action") {
    return (
      <div
        onClick={() => {
          if (handleRemove) {
            handleRemove(item[column.accessor]);
          }
        }}
        className="text-xl"
      >
        <IoCloseSharp />
      </div>
    );
  }

  return (
    <p
      onClick={() => {
        if (column.id && handleSelect) {
          handleSelect(item[column.accessor]);
        }
      }}
    >
      {item[column.accessor]}
    </p>
  );
};

export default Cell;
