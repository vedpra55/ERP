import { IoIosArrowDown } from "react-icons/io";
import { Link, useLocation } from "react-router-dom";
import { FC, useState } from "react";
import { Program } from "@@types/system";

interface SideBarItemProps {
  title: string;
  section: string;
  data: Program[];
}

interface NavlinkProps {
  programName: string;
  section: string;
}

const SideBarItem: FC<SideBarItemProps> = ({ title, section, data }) => {
  const location = useLocation();
  const pathname = location.pathname;

  const [isOpen, setOpen] = useState(false);

  if (data?.length === 0) return;

  return (
    <div className="flex bg-gray-50 rounded-md  flex-col gap-y-1  items-center">
      <div
        onClick={() => setOpen(!isOpen)}
        className={` ${
          pathname.includes(section) ? "bg-gray-100 " : "bg-gray-50"
        } flex  items-center justify-between py-2 md:w-40 lg:w-48  px-5`}
      >
        <p className="font-medium">{title}</p>
        <IoIosArrowDown
          className={`${isOpen ? "rotate-180" : "rotate-0"} cursor-pointer`}
        />
      </div>
      {isOpen &&
        data?.map((item) => (
          <Navlink
            section={section}
            key={item.program_name}
            programName={item.program_name}
          />
        ))}
    </div>
  );
};

const Navlink: FC<NavlinkProps> = ({ programName, section }) => {
  const location = useLocation();

  const href = programName.toLowerCase().replace(/\s+/g, "-");

  return (
    <Link
      className={`md:text-[14px] lg:text-[15px] hover:bg-blue-600 hover:text-white w-40 lg:w-48 ${
        location.pathname.includes(`/${section}/${href}`)
          ? "bg-blue-600 rounded-md py-1 px-5  text-white"
          : "bg-gray-50  rounded-md py-1 px-5  "
      }`}
      key={programName}
      to={`/app/${section}/${href}`}
    >
      {programName}
    </Link>
  );
};

export default SideBarItem;
