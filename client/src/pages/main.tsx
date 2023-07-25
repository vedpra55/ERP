import SideBar from "@components/ui/Sidebar";
import useApiServices from "@api/query";
import { Outlet } from "react-router-dom";

const MainApp = () => {
  const { useFetchCompany, useFetchSubCompany, useFetchProgram } =
    useApiServices();

  const { data: company } = useFetchCompany();
  const { data: subCompany } = useFetchSubCompany();
  const { data: programs } = useFetchProgram();

  return (
    <div className="flex my-5 px-5 gap-x-1 2xl:gap-x-5">
      <div className=" h-screen md:w-[20%] w-56 lg:w-64 ">
        {company && subCompany && programs && (
          <SideBar
            company={company}
            subCompany={subCompany}
            programs={programs}
          />
        )}
      </div>
      <div className="bg-white flex-1 rounded-xl    p-10  h-auto ">
        <div className="md:w-[37rem] lg:w-[42rem] xl:w-[55rem] 2xl:w-[70rem] flex-shrink-0 ">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MainApp;
