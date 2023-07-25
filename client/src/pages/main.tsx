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
      <div className=" h-screen md:w-[20%] lg:w-1/5 2xl:w-64 ">
        {company && subCompany && programs && (
          <SideBar
            company={company}
            subCompany={subCompany}
            programs={programs}
          />
        )}
      </div>
      <div className="bg-white flex-1 rounded-xl    p-10  h-auto ">
        <div className="md:w-[40rem] lg:w-[45rem] xl:w-[59rem] 2xl:w-[65rem] flex-shrink-0 ">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MainApp;
