import { FC } from "react";
import { Link } from "react-router-dom";

interface Props {
  companyName: string;
  subCompanyName: string;
}

const SidebarHeader: FC<Props> = ({ companyName, subCompanyName }) => {
  return (
    <div className="mb-5">
      <Link to={"/"}>
        <img
          className="w-20 mb-5"
          src="https://www.ascendstudio.co.uk/wp-content/uploads/2017/01/belerion-logo-design-ascend-a.jpg"
        />
      </Link>
      <h1 className="text-xl font-semibold mb-3">Company - {companyName}</h1>
      <h1 className="">Sub Company - {subCompanyName}</h1>
    </div>
  );
};

export default SidebarHeader;
