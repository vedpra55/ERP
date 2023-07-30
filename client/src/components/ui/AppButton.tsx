import { FC } from "react";
import PulseLoader from "react-spinners/PulseLoader";

interface Props {
  title: string;
  handleOnClick(): void;
  isLoading?: boolean;
  width?: string;
  color?: string;
}

const AppButton: FC<Props> = ({
  title,
  handleOnClick,
  isLoading,
  width,
  color,
}) => {
  return (
    <button
      onClick={handleOnClick}
      className={`myButton ${color ? color : ""} ${
        width ? width : "w-28"
      } h-10 py-0`}
    >
      {isLoading ? <PulseLoader size={14} color="white" /> : <p>{title}</p>}
    </button>
  );
};

export default AppButton;
