import { FC } from "react";

interface Props {
  access: boolean;
}

const AccessStatus: FC<Props> = ({ access }) => {
  return (
    <div
      className={`${
        access === true
          ? "bg-green-500 text-white text-[14px]"
          : "bg-red-600 text-white text-[14px]"
      } rounded-lg p-1 w-20 text-center `}
    >{`${access == true ? "Yes" : "No"}`}</div>
  );
};

export default AccessStatus;
