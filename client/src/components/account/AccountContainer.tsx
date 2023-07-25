import { FC, ReactNode } from "react";
import { Link } from "react-router-dom";

interface Props {
  children: ReactNode;
  title: string;
}

const AccountContainer: FC<Props> = ({ children, title }) => {
  return (
    <div className=" bg-white">
      <div className="grid grid-cols-12 px-5 gap-x-5 py-5 ">
        <div className="col-span-6">
          <Link to={"/"} className="flex gap-x-1 items-center">
            <img
              className="w-20"
              src="https://www.ascendstudio.co.uk/wp-content/uploads/2017/01/belerion-logo-design-ascend-a.jpg"
            />
          </Link>
          <div className="mt-20">
            <h1 className="text-center font-semibold text-3xl">{title}</h1>

            {children}
          </div>
        </div>
        <div className="col-span-6">
          <img
            src={
              "https://images.unsplash.com/photo-1664575599730-0814817939de?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
            }
            className="w-full h-[45rem]  rounded-lg   object-fill "
          />
        </div>
      </div>
    </div>
  );
};

export default AccountContainer;
