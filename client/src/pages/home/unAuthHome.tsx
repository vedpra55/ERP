import { FC } from "react";
import { Link } from "react-router-dom";

interface Props {}

const UnAuthHome: FC<Props> = ({}) => {
  return (
    <div className="mt-20 flex flex-col gap-y-2 justify-center h-96 items-center">
      <h1 className="text-4xl font-semibold ">Welcome To ERP Management</h1>
      <div className="mt-10 flex gap-x-5 ">
        <button className="myButton w-36">
          <Link to="/account/create-account" className="">
            Create Account
          </Link>
        </button>
        <button className="myButton w-36">
          <Link to="/account/signin" className="">
            Login
          </Link>
        </button>
      </div>
    </div>
  );
};

export default UnAuthHome;
