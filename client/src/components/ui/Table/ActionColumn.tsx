import { FC } from "react";
import { Link } from "react-router-dom";
import { BiEdit } from "react-icons/bi";
import { GrDocumentDownload } from "react-icons/gr";
import { RxCross2 } from "react-icons/rx";

interface Props {
  link?: string;
  col: string;
  field?: string;
  index?: number;
  handleClick?(): void;
  handleClickWithVal?(index: number): void;
  isDownloadIcon?: boolean;
  isDeleteIcon?: boolean;
}

const ActonColumn: FC<Props> = ({
  link,
  col,
  handleClick,
  index,
  handleClickWithVal,
  isDownloadIcon,
  isDeleteIcon,
}) => {
  let Icon = <BiEdit />;

  if (isDownloadIcon) {
    Icon = <GrDocumentDownload />;
  }
  if (isDeleteIcon) {
    Icon = <RxCross2 />;
  }

  return (
    <div className={` ${col}  flex items-center gap-x-2 `}>
      {link ? (
        <Link to={link} className="text-xl">
          <BiEdit />
        </Link>
      ) : index != null ? (
        handleClickWithVal && (
          <button onClick={() => handleClickWithVal(index)} className="text-xl">
            {Icon}
          </button>
        )
      ) : (
        <button onClick={handleClick} className="text-xl">
          <BiEdit />
        </button>
      )}
    </div>
  );
};

export default ActonColumn;
