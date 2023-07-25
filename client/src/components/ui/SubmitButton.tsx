import { FC } from "react";
import { PulseLoader } from "react-spinners";

interface Props {
  isLoading: boolean;
}

const SubmitButton: FC<Props> = ({ isLoading }) => {
  return (
    <button className="myButton" type="submit">
      {isLoading ? <PulseLoader size={14} color="white" /> : <p>Submit</p>}
    </button>
  );
};

export default SubmitButton;
